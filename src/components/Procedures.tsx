import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { procedures } from "@/lib/procedures-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const Procedures = () => {
  const [activeTab, setActiveTab] = useState("facial");
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const activeProc = procedures.find((p) => p.id === activeTab);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="procedures" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
            Our Procedures
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground px-4">
            Explore Our Comprehensive Range of<br className="hidden md:block" />
            <span className="text-primary">Surgical and Non-Surgical</span> Cosmetic Procedures
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
          {procedures.map((proc) => (
            <motion.button
              key={proc.id}
              onClick={() => setActiveTab(proc.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`font-body px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base transition-all duration-300 ${
                activeTab === proc.id
                  ? "bg-primary text-primary-foreground shadow-pink"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {proc.name}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-1"
          >
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              Tailored solutions for facial rejuvenation, body contouring, breast 
              enhancement, and more to enhance your natural beauty and confidence.
            </p>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="font-body text-foreground font-medium text-lg">
                {activeProc?.description}
              </p>
              
              {/* Features list */}
              <ul className="space-y-2">
                {activeProc?.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 font-body text-muted-foreground"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <Link to={`/procedures/${activeProc?.slug}`}>
              <Button 
                className="bg-navy hover:bg-navy-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 font-body group"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Carousel Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden bg-card shadow-lg">
              <Carousel 
                setApi={setApi}
                className="w-full"
                opts={{
                  align: "center",
                  loop: true,
                }}
              >
                <CarouselContent className="m-0">
                  {procedures.map((proc) => (
                    <CarouselItem key={proc.id} className="p-0 basis-full">
                      <div className="relative aspect-video md:aspect-[4/3] overflow-hidden">
                        <img
                          src={proc.image}
                          alt={proc.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <h3 className="font-display text-lg md:text-xl text-card font-medium">
                            {proc.name}
                          </h3>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Slide Counter */}
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-navy/70 backdrop-blur-sm px-3 py-1 md:px-4 md:py-1.5 rounded-full">
                <p className="font-body text-xs md:text-sm text-card font-medium">
                  {current + 1} / {procedures.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
