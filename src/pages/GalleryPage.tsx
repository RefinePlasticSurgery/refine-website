import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

import drHannahImage from "@/assets/REFINE/dr-andrew.jpeg";
import facialImage from "@/assets/REFINE/facial.jpeg";
import bodyContouringImage from "@/assets/REFINE/body-contouring.jpeg";
import breastImage from "@/assets/REFINE/breast.jpeg";
import hairImage from "@/assets/REFINE/hair.webp";
import hairWebpImage from "@/assets/REFINE/hair.webp";

const galleryImages = [
  drHannahImage,
  facialImage,
  bodyContouringImage,
  breastImage,
  hairImage,
  hairWebpImage,
];

const GalleryPage = () => {
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20 md:mb-24"
          >
            <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
              Gallery
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              Our Work &<br />
              <span className="text-primary">Transformations</span>
            </h1>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-2xl overflow-hidden group"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default GalleryPage;
