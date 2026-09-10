import { motion } from "framer-motion";

const countries = [
  { name: "USA", count: 5, flag: "https://flagcdn.com/w80/us.png" },
  { name: "United Kingdom", count: 2, flag: "https://flagcdn.com/w80/gb.png" },
  { name: "Canada", count: 2, flag: "https://flagcdn.com/w80/ca.png" },
  { name: "Ethiopia", count: 4, flag: "https://flagcdn.com/w80/et.png" },
  { name: "Uganda", count: 3, flag: "https://flagcdn.com/w80/ug.png" },
  { name: "Rwanda", count: 4, flag: "https://flagcdn.com/w80/rw.png" },
  { name: "Tanzania", count: 20, flag: "https://flagcdn.com/w80/tz.png" },
  { name: "Kenya", count: 15, flag: "https://flagcdn.com/w80/ke.png" },
  { name: "DRC Congo", count: 5, flag: "https://flagcdn.com/w80/cd.png" },
  { name: "Netherlands", count: 4, flag: "https://flagcdn.com/w80/nl.png" },
  { name: "South Sudan", count: 7, flag: "https://flagcdn.com/w80/ss.png" },
];

export const Countries = () => {
  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mb-6 md:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-center text-foreground"
        >
          Patients by Country: <span className="text-primary">Global Trust</span>
        </motion.h2>
      </div>

      {/* Scrolling countries */}
      <div className="relative">
        <div className="flex gap-4 md:gap-6 animate-scroll">
          {[...countries, ...countries].map((country, index) => (
            <motion.div
              key={`${country.name}-${index}`}
              className="flex-shrink-0 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft min-w-[140px] md:min-w-[180px] text-center"
            >
              <img 
                src={country.flag} 
                alt={`${country.name} flag`} 
                className="w-12 h-8 md:w-16 md:h-10 object-cover mx-auto mb-2 md:mb-3 rounded shadow-sm"
              />
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{country.count}</p>
              <p className="font-body text-xs md:text-sm text-muted-foreground mt-1">{country.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
