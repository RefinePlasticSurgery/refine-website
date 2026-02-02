import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const galleryImages = [
  new URL("../assets/REFINE/skin-tag-removal.jpeg", import.meta.url).href,
  new URL("../assets/REFINE/lipoabdominoplasty-2.jpeg", import.meta.url).href,
  new URL("../assets/REFINE/breast-reduction-2.jpeg", import.meta.url).href,
  new URL("../assets/REFINE/breast-reduction.jpeg", import.meta.url).href,
  new URL("../assets/REFINE/Mommy-Makeover.jpeg", import.meta.url).href,
  new URL("../assets/REFINE/Breast-Implants.jpeg", import.meta.url).href,
];

export const Gallery = () => {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12"
        >
          <div>
            <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
              Photo Gallery
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              Explore Our Extensive Photo Gallery<br className="hidden lg:block" />
              <span className="text-primary">Before-and-After</span> Transformations
            </h2>
          </div>
          <Button className="bg-navy hover:bg-navy-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 font-body w-fit">
            View All From Gallery
          </Button>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer ${
                index === 0 || index === 5 ? "row-span-2" : ""
              }`}
            >
              <img
                src={image}
                alt={`Before and after transformation ${index + 1}`}
                className="w-full h-full object-cover min-h-[150px] md:min-h-[200px] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl">
                  +
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};