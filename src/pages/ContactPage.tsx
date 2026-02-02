import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Contact } from "@/components/Contact";
import { useEffect } from "react";

const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Refine Plastic Surgery | Book Appointment in Tanzania</title>
        <meta name="description" content="Contact Refine Plastic & Aesthetic Surgery Centre in Tanzania. Book your consultation for facial procedures, body contouring, breast surgery, and hair transplants. Call (+255) 793 145 167." />
        <meta name="keywords" content="contact plastic surgery Tanzania, book appointment, cosmetic surgery consultation, contact Refine surgery" />
        <link rel="canonical" href="https://refineplasticsurgerytz.com/contact" />
        <meta property="og:title" content="Contact Refine Plastic Surgery | Book Appointment in Tanzania" />
        <meta property="og:description" content="Book your consultation with Refine Plastic Surgery Centre in Tanzania. Expert cosmetic procedures for face, body, and hair." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://refineplasticsurgerytz.com/contact" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Refine Plastic Surgery | Book Appointment in Tanzania" />
        <meta name="twitter:description" content="Book your consultation with Refine Plastic Surgery Centre in Tanzania. Expert cosmetic procedures for face, body, and hair." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="pt-28 md:pt-32 lg:pt-36 pb-0">
          <div className="container mb-12 md:mb-16">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 md:mb-12"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </motion.div>
          </div>
          <Contact />
        </main>
        <WhatsAppButton />
      </div>
    </>
  );
};

export default ContactPage;
