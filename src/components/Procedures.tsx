import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { procedures } from "@/lib/procedures-data";

export const Procedures = () => {
  const [activeTab, setActiveTab] = useState("facial");
  const activeProc = procedures.find((p) => p.id === activeTab);

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
            
            <AnimatePresence mode="wait" key={activeTab}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
            </AnimatePresence>

            <Link to={`/procedures/${activeProc?.slug}`}>
              <Button 
                className="bg-navy hover:bg-navy-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 font-body group"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 order-1 lg:order-2">
            <AnimatePresence mode="wait" key={activeTab}>
              {procedures.slice(0, 4).map((proc, index) => (
                <motion.div
                  key={proc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group aspect-square ${
                    index === 0 ? "col-span-2" : ""
                  }`}
                  onClick={() => setActiveTab(proc.id)}
                >
                  <img
                    src={proc.image}
                    alt={proc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 transition-opacity duration-300 ${
                    activeTab === proc.id 
                      ? "bg-primary/40" 
                      : "bg-navy/40 group-hover:bg-navy/60"
                  }`} />
                  <p className="absolute bottom-3 md:bottom-4 left-3 md:left-4 font-body text-xs md:text-sm text-card font-medium">
                    {proc.name}
                  </p>
                  {activeTab === proc.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
