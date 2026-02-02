import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import bannerImage from "@/assets/REFINE/banner-1.png";
import bannerSideImage from "@/assets/REFINE/banner-side.jpeg";

export const Hero = () => {
  const { scrollToSection } = useScrollToSection();
  
  const handleBookClick = () => {
    scrollToSection('contact', 100);
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
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              <span className="font-bold">Your Confidence</span> with{" "}
              <span className="text-gradient-pink font-bold">Cosmetic</span>{" "}
              <span className="font-bold">Expertise</span>
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

          {/* Right content - Images and Rating */}
          <div className="relative mt-8 lg:mt-0">
            <div className="space-y-6">
              {/* Images container */}
              <div className="flex gap-4 md:gap-6 items-start justify-center lg:justify-end">
                {/* Main image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex-1 max-w-xs rounded-2xl md:rounded-3xl overflow-hidden shadow-large"
                >
                  <img
                    src={bannerImage}
                    alt="Cosmetic surgery consultation"
                    className="w-full h-auto"
                  />
                </motion.div>

                {/* Side image */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="hidden md:block max-w-xs pt-8"
                >
                  <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-large h-64 md:h-80 lg:h-96">
                    <img
                      src={bannerSideImage}
                      alt="Happy client"
                      className="w-full h-full object-cover relative z-10"
                    />
                    <div className="absolute inset-0 bg-accent-gradient opacity-20 z-20 pointer-events-none" />
                    <div className="absolute inset-0 hexagon-pattern opacity-10 z-20 pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              {/* Rating card - Separate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="bg-card border border-border rounded-xl md:rounded-2xl p-5 md:p-6 shadow-medium max-w-xs w-full">
                  <p className="text-sm md:text-base font-body font-semibold text-foreground">4.7 Average Rating</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(4.7/5.0)</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 leading-relaxed">
                    Trusted by thousands of clients for exceptional results and personalized care.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};