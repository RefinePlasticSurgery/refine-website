import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
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
    <section className="relative min-h-screen bg-hero-gradient pt-28 md:pt-32 lg:pt-36 overflow-hidden">
      <div className="container relative z-10 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-foreground">
              Your Confidence with{" "}
              <span className="text-gradient-pink">Cosmetic</span>{" "}
              Expertise
            </h1>
            
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              We specialize in addressing diverse concerns, including breast augmentation, 
              liposuction, rhinoplasty, and more, providing personalized care for each 
              client's unique journey.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <Button 
                onClick={handleBookClick}
                className="bg-navy hover:bg-navy-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-body group"
              >
                Schedule Now
                <span className="ml-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>

            {/* Client avatars */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-pink-light border-2 border-card"
                  />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground">
                We've performed cosmetic surgery for over{" "}
                <span className="text-foreground font-semibold">3k+ clients</span>. 
                We look forward to welcoming you.
              </p>
            </div>
          </motion.div>

          {/* Right content - Images */}
          <div className="relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Main image container */}
              <div className="relative">
                <img
                  src="https://new.refineplasticsurgery.co.ke/wp-content/uploads/2024/04/banner-1.png"
                  alt="Cosmetic surgery consultation"
                  className="w-full max-w-sm md:max-w-md mx-auto"
                />
              </div>
            </motion.div>

            {/* Side image with accent */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-0 right-0 w-36 md:w-48 lg:w-64 rounded-2xl overflow-hidden hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent-gradient opacity-80" />
                <img
                  src="https://new.refineplasticsurgery.co.ke/wp-content/uploads/2025/07/banner-side.jpg"
                  alt="Happy client"
                  className="w-full h-48 md:h-56 lg:h-64 object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 hexagon-pattern" />
              </div>
              
              {/* Rating card */}
              <div className="absolute bottom-0 left-0 right-0 bg-accent p-3 md:p-4 text-accent-foreground">
                <p className="text-xs md:text-sm font-body font-medium">4.7 Average Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[10px] md:text-xs font-body mt-1 opacity-80">Review 4.7/5.0</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};