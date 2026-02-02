import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { appointmentFormSchema, type AppointmentFormData } from "@/lib/validations";

interface SubmissionError {
  type: "network" | "validation" | "server" | "rate_limit" | "unknown";
  message: string;
  retryable: boolean;
}

function getErrorDetails(error: any): SubmissionError {
  if (!error) {
    return {
      type: "unknown",
      message: "An unexpected error occurred",
      retryable: true,
    };
  }

  const errorMessage = String(error?.message || error);
  const errorStr = errorMessage.toLowerCase();

  // Network errors
  if (errorStr.includes("fetch") || errorStr.includes("network") || errorStr.includes("timeout")) {
    return {
      type: "network",
      message: "Network connection failed. Please check your internet and try again.",
      retryable: true,
    };
  }

  // Rate limiting
  if (errorStr.includes("429") || errorStr.includes("rate")) {
    return {
      type: "rate_limit",
      message: "Too many requests. Please wait a few minutes before trying again.",
      retryable: true,
    };
  }

  // Validation errors
  if (errorStr.includes("validation") || errorStr.includes("invalid")) {
    return {
      type: "validation",
      message: "Please check your information and try again.",
      retryable: false,
    };
  }

  // Server errors
  if (errorStr.includes("500") || errorStr.includes("server")) {
    return {
      type: "server",
      message: "Our server is experiencing issues. Please try again later or call us.",
      retryable: true,
    };
  }

  return {
    type: "unknown",
    message: "Failed to send your request. Please try again or contact us directly.",
    retryable: true,
  };
}

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    procedure: "",
    date: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // Check for pre-selected procedure from URL or location state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const procedureParam = urlParams.get('procedure');
    
    if (procedureParam) {
      setFormData(prev => ({
        ...prev,
        procedure: decodeURIComponent(procedureParam)
      }));
    }
    
    // Also check if there's a location state (from navigation)
    if (window.history.state?.procedure) {
      setFormData(prev => ({
        ...prev,
        procedure: window.history.state.procedure
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof AppointmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setErrors({});

    // Validate form data
    const result = appointmentFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AppointmentFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof AppointmentFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all user inputs to prevent XSS attacks
      const sanitizedData = {
        name: DOMPurify.sanitize(formData.name.trim()),
        email: DOMPurify.sanitize(formData.email.trim().toLowerCase()),
        phone: DOMPurify.sanitize(formData.phone.trim()),
        procedure: formData.procedure ? DOMPurify.sanitize(formData.procedure) : "",
        date: formData.date,
        message: formData.message ? DOMPurify.sanitize(formData.message.trim()) : "",
      };

      const { data, error } = await supabase.functions.invoke("send-appointment-email", {
        body: sanitizedData,
      });

      if (error) {
        const errorDetails = getErrorDetails(error);
        throw new Error(`${errorDetails.type}|${errorDetails.message}`);
      }

      // Success
      setSubmitAttempts(0);
      toast({
        title: "Success!",
        description: "We've received your appointment request. We'll contact you within 24 hours to confirm.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        procedure: "",
        date: "",
        message: "",
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      const [errorType, errorMessage] = err.message.split("|");

      // Parse error details
      const errorDetails = getErrorDetails(err);

      // Determine toast title based on error type
      let title = "Request Failed";
      if (errorDetails.type === "network") {
        title = "Connection Issue";
      } else if (errorDetails.type === "rate_limit") {
        title = "Too Many Requests";
      } else if (errorDetails.type === "server") {
        title = "Server Error";
      }

      // Log for monitoring
      if (typeof window !== "undefined" && (window as any).Sentry) {
        (window as any).Sentry.captureException(err);
      }

      toast({
        title,
        description: errorMessage || errorDetails.message,
        variant: "destructive",
      });

      // Increment submit attempts to show retry hint after multiple failures
      setSubmitAttempts((prev) => prev + 1);
      
      if (submitAttempts >= 2) {
        toast({
          title: "Alternative Contact Method",
          description: "Call us directly at (+255) 793 145 167 for immediate assistance.",
          variant: "destructive",
        });
      }

      // Log error for debugging
      console.error("Error sending appointment request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const procedureCategories = [
    {
      category: "Breast Procedures",
      procedures: [
        "Breast Reduction",
        "Breast Augmentation (Implants)",
        "Breast Augmentation (Fat Transfer)",
        "Mastopexy (Breast Lift)",
        "Nipple Revision",
        "Breast Reconstruction",
        "Breast Asymmetry Correction"
      ]
    },
    {
      category: "Body Contouring",
      procedures: [
        "360° Liposuction",
        "Abdominoplasty (Tummy Tuck)",
        "Lipoabdominoplasty",
        "Brazilian Butt Lift (BBL)",
        "Body Lift",
        "Thigh Lift",
        "Arm Lift (Brachioplasty)",
        "General Liposuction"
      ]
    },
    {
      category: "Facial Procedures",
      procedures: [
        "Rhinoplasty",
        "Face Lift",
        "Mini Face Lift",
        "Brow Lift",
        "Eyelid Surgery",
        "Lip Procedures"
      ]
    },
    {
      category: "Gynecomastia",
      procedures: [
        "Gynecomastia Treatment (Lipo + Excision)",
        "Gynecomastia Treatment (Lipo Only)",
        "Gynecomastia Treatment (Excision Only)"
      ]
    },
    {
      category: "Hair & Skin",
      procedures: [
        "Hair Transplant",
        "Beard Hair Transplant",
        "Laser Hair Removal",
        "PRP Stem Cell Treatment",
        "Nanofat Facial Rejuvenation",
        "Morpheus 8 Treatment"
      ]
    },
    {
      category: "Intimate Procedures",
      procedures: [
        "Penile Enlargement",
        "Penile PRP Treatment",
        "Vaginoplasty"
      ]
    },
    {
      category: "Other Procedures",
      procedures: [
        "Other/Consultation Only"
      ]
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <div>
              <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
                Get in Touch
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight">
                Schedule Your <span className="text-primary">Consultation</span> Today
              </h2>
              <p className="font-body text-muted-foreground mt-4 leading-relaxed">
                Take the first step towards your transformation. Our team is ready to
                guide you through your aesthetic journey with personalized care and expertise.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-foreground">Call Us</h4>
                  <p className="font-body text-muted-foreground">(+255) 793 145 167</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-foreground">Email Us</h4>
                  <p className="font-body text-muted-foreground break-all">info@refineplasticsurgerytz.com</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-foreground">Visit Us</h4>
                  <p className="font-body text-muted-foreground">Dar es Salaam, Tanzania</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-foreground">Working Hours</h4>
                  <p className="font-body text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="font-body text-muted-foreground">Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Appointment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl p-6 md:p-8 lg:p-10 shadow-medium"
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-medium text-foreground">
                    Book Appointment
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Fill out the form below
                  </p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`bg-secondary border-0 h-12 font-body ${errors.name ? 'ring-2 ring-destructive' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1 font-body">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`bg-secondary border-0 h-12 font-body ${errors.email ? 'ring-2 ring-destructive' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+255 xxx xxx xxx"
                      className={`bg-secondary border-0 h-12 font-body ${errors.phone ? 'ring-2 ring-destructive' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1 font-body">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-2 block">
                      Preferred Date
                    </label>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-secondary border-0 h-12 font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm text-foreground mb-2 block">
                    Procedure of Interest *
                  </label>
                  <select
                    name="procedure"
                    value={formData.procedure}
                    onChange={handleChange}
                    required
                    className={`w-full h-12 px-3 rounded-md bg-secondary border-0 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.procedure ? 'ring-2 ring-destructive' : ''}`}
                  >
                    <option value="">Select a procedure</option>
                    {procedureCategories.map((category) => (
                      <optgroup key={category.category} label={category.category}>
                        {category.procedures.map((proc) => (
                          <option key={proc} value={proc}>
                            {proc}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.procedure && (
                    <p className="text-destructive text-xs mt-1 font-body">{errors.procedure}</p>
                  )}
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    Can't find your procedure? Select "Other/Consultation Only" and specify in the message field.
                  </p>
                </div>

                <div>
                  <label className="font-body text-sm text-foreground mb-2 block">
                    Additional Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your goals or any questions you have..."
                    rows={4}
                    className={`bg-secondary border-0 font-body resize-none ${errors.message ? 'ring-2 ring-destructive' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs mt-1 font-body">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-pink-light text-primary-foreground rounded-full py-6 text-base font-body group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Request Appointment
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="font-body text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
