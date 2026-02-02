import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Lyliane Mwenge",
    text: "I was sick and I am one of the beneficiaries of the services of this clinic. I admit that it is one of the best in terms of quality of service with a very professional team offering the best results.",
    rating: 5,
  },
  {
    name: "Rukia Charles",
    text: "I am very happy to have the procedure done at Refine Plastic Surgery Center because I have no regrets about spending my money because the results have been so good 🙏",
    rating: 5,
  },
  {
    name: "Caroline Wambui",
    text: "I went to Dr. Were for lipo/bbl. He is very professional and passionate with his work. I love every part of my body now. Dr. Were is indeed the best plastic surgeon in Tanzania!!!",
    rating: 5,
  },
  {
    name: "Samson Muya",
    text: "I'm so happy since I started my treatment 3 months ago. I've hopes with my hand after an accident. Ready to start work.",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
            Words of satisfaction:<br />
            <span className="text-gradient-accent">Life-Changing</span>{" "}
            <span className="text-primary">Amazing</span>{" "}
            <span className="text-gradient-pink">Passionate</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4">
            Experiences shared by Our Esteemed Patients
          </p>
        </motion.div>

        {/* Google Rating */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-card px-4 sm:px-6 py-4 rounded-2xl shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-display text-primary text-xl font-bold">G</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-body font-semibold text-foreground text-sm md:text-base">
                Refine Plastic & Aesthetic Surgery Centre
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-display text-xl md:text-2xl font-bold text-foreground">4.8</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-muted-foreground font-body">Based on 16 reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-medium"
          >
            <div className="flex mb-4">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-gold text-gold" />
              ))}
            </div>
            <p className="font-body text-base md:text-lg lg:text-xl text-foreground leading-relaxed mb-6">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-pink-light" />
              <div>
                <p className="font-display text-base md:text-lg font-medium text-foreground">
                  {testimonials[current].name}
                </p>
                <p className="font-body text-sm text-muted-foreground">Verified Patient</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-6 md:mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center shadow-soft"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? "w-6 md:w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center shadow-soft"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};