import { motion } from "framer-motion";
import aboutImage from "../assets/REFINE/about-35.jpeg";
import { Button } from "@/components/ui/button";

const stats = [
  { number: "3", suffix: "K+", label: "Happy Clients" },
  { number: "5", suffix: "K+", label: "Procedures" },
  { number: "99", suffix: "%", label: "Satisfaction Rate" },
];

export const About = () => {
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
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
              <img
                src="/src/assets/REFINE/about-35.jpeg"
                alt="Dr. Andrew Onyino"
                className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-navy/80 to-transparent" />
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-4 left-4 right-4 md:left-auto md:-right-8 md:bottom-8 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-medium">
              <div className="flex gap-4 md:gap-8 justify-center md:justify-start">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                      {stat.number}
                      <span className="text-accent">{stat.suffix}</span>
                    </div>
                    <p className="font-body text-[10px] md:text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-5 md:space-y-6 mt-8 lg:mt-0"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight">
              Welcome to Refine Plastic Surgery, your trusted destination for{" "}
              <span className="text-primary">cosmetic excellence</span> and personalized care.
            </h2>
            
            <p className="font-body text-muted-foreground leading-relaxed">
              At Refine, transformation meets precision. Our clinic is led by a 
              Board-Certified Plastic Surgeon with over 15 years of dedicated experience 
              in providing exemplary healthcare services to our valued clients.
            </p>
            
            <p className="font-body text-muted-foreground leading-relaxed">
              Choosing the right plastic surgeon is crucial in achieving the best results 
              for your body goals. At Refine, we offer you the assurance of safety in the 
              hands of a well-trained and experienced plastic surgeon.
            </p>
            
            <p className="font-body text-muted-foreground leading-relaxed">
              Founded by renowned plastic surgeon <span className="text-foreground font-semibold">Dr. Andrew Onyino</span> & <span className="text-foreground font-semibold">Dr. Donald Madekwe</span>, a reconstruction and plastic surgeon, 
              our practice is dedicated to delivering exceptional results and empowering 
              our patients to look and feel their best, inside and out.
            </p>

            <Button 
              onClick={handleBookClick}
              className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 mt-4 font-body"
            >
              Book an Appointment
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};