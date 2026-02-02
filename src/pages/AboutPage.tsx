import { motion } from "framer-motion";
import { ArrowLeft, Award, Users, Clock, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-24">
        <div className="container">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
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

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
              About Us
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-6">
              Excellence in Plastic &<br />
              <span className="text-primary">Aesthetic Surgery</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
              Refine Plastic & Aesthetic Surgery Centre is dedicated to helping you achieve your aesthetic goals 
              with personalized care and the highest standards of surgical excellence.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 md:mb-24"
          >
            {[
              { icon: Users, value: "3000+", label: "Happy Clients" },
              { icon: Award, value: "15+", label: "Years Experience" },
              { icon: Clock, value: "24/7", label: "Support" },
              { icon: Heart, value: "100%", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center p-6 bg-card rounded-2xl shadow-soft">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-4xl mx-auto"
          >
            <div className="space-y-8 md:space-y-10 text-muted-foreground font-body">
              <p>
                At Refine Plastic & Aesthetic Surgery Centre, we understand that each patient is unique. 
                Our team of board-certified surgeons combines artistic vision with technical precision 
                to deliver results that enhance your natural beauty.
              </p>
              <p>
                Founded on the principles of patient safety, ethical practice, and aesthetic excellence, 
                we have grown to become a leading plastic surgery destination in Tanzania, 
                serving patients from across East Africa and around the world.
              </p>
              <p>
                Our state-of-the-art facilities and commitment to using the latest surgical techniques 
                ensure that you receive the highest quality care throughout your transformation journey.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-24 md:mt-28"
          >
            <Link to="/#contact">
              <Button className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full px-8 py-6">
                Schedule a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default AboutPage;
