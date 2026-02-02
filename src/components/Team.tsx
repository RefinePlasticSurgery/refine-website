import { motion } from "framer-motion";

const team = [
  {
    name: "Dr. Donald Madekwe",
    role: "Plastic Reconstructive and Aesthetic Surgeon",
    image: "https://refineplasticsurgerytz.com/wp-content/uploads/2026/01/dr-donald-612x612-1.jpg",
  },
  {
    name: "Dr. Andrew Onyino",
    role: "Plastic Surgeon",
    image: "https://refineplasticsurgerytz.com/wp-content/uploads/2024/08/dr-were.jpg",
  },
];

export const Team = () => {
  return (
    <section id="team" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
            Our Specialists
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
            Meet Our Team of Cosmetic &<br />
            <span className="text-primary">Plastic Surgery Specialists</span>
          </h2>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="font-body text-sm md:text-base text-muted-foreground mt-1">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
