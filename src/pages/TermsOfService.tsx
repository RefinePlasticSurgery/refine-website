import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="pt-28 md:pt-32 pb-20 md:pb-24 flex-grow">
        <div className="container max-w-3xl px-4 md:px-6">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 md:mb-10"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground pl-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm md:prose-base lg:prose-lg max-w-none"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6 md:mb-8 mt-0">
              Terms of Service
            </h1>
            <div className="text-muted-foreground font-body leading-relaxed space-y-6 md:space-y-8">
              <p className="text-base md:text-lg">
                Welcome to Refine Plastic & Aesthetic Surgery Centre. By accessing and using our services, 
                you agree to be bound by these Terms of Service.
              </p>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">Services</h2>
                <p className="text-base md:text-lg">
                  We provide plastic and aesthetic surgery services. All procedures are performed by 
                  qualified medical professionals in accordance with applicable medical standards and regulations.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">Appointments</h2>
                <p className="text-base md:text-lg">
                  Appointment requests are subject to availability. We will confirm your appointment 
                  within 24 hours of your request. Cancellations should be made at least 24 hours in advance.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">Contact</h2>
                <p className="text-base md:text-lg">
                  For questions regarding these terms, please contact us at 
                  <a href="mailto:info@refineplasticsurgerytz.com" className="text-primary hover:underline ml-1">info@refineplasticsurgerytz.com</a> or call <a href="tel:+255793145167" className="text-primary hover:underline">(+255) 793 145 167</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default TermsOfService;
