import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const handleBookClick = () => {
    const element = document.querySelector("#contact");
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-pink-gradient relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 hexagon-pattern opacity-10" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-primary-foreground mb-6 md:mb-8">
            Schedule Your Consultation Today!
          </h2>
          
          <Button 
            onClick={handleBookClick}
            className="bg-card hover:bg-secondary text-foreground rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-body group shadow-medium"
          >
            Book Appointment
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};