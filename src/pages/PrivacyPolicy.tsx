import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
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
              Privacy Policy
            </h1>
            <div className="text-muted-foreground font-body leading-relaxed space-y-6 md:space-y-8">
              <p className="text-base md:text-lg">
                At Refine Plastic & Aesthetic Surgery Centre, we are committed to protecting your privacy 
                and ensuring the security of your personal information.
              </p>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">Information We Collect</h2>
                <p className="text-base md:text-lg">
                  We collect information you provide directly to us, such as when you schedule an appointment, 
                  fill out a form, or contact us for more information about our services.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">How We Use Your Information</h2>
                <p className="text-base md:text-lg">
                  We use the information we collect to provide, maintain, and improve our services, 
                  to communicate with you about appointments and procedures, and to respond to your inquiries.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-8 md:mt-10">Contact Us</h2>
                <p className="text-base md:text-lg">
                  If you have any questions about this Privacy Policy, please contact us at 
                  <a href="mailto:info@refineplasticsurgerytz.com" className="text-primary hover:underline ml-1">info@refineplasticsurgerytz.com</a> or call <a href="tel:+255793145167" className="text-primary hover:underline">(+255) 793 145 167</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PrivacyPolicy;
