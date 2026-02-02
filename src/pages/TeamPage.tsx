import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const team = [
  {
    name: "Dr. Donald Madekwe",
    role: "Plastic Reconstructive and Aesthetic Surgeon",
    image: "https://refineplasticsurgerytz.com/wp-content/uploads/2026/01/dr-donald-612x612-1.jpg",
    bio: "Dr. Donald Madekwe is a highly skilled plastic reconstructive and aesthetic surgeon with extensive experience in transformative procedures.",
  },
  {
    name: "Dr. Andrew Onyino",
    role: "Plastic Surgeon",
    image: "https://refineplasticsurgerytz.com/wp-content/uploads/2024/08/dr-were.jpg",
    bio: "Dr. Andrew Onyino brings years of expertise in plastic surgery, specializing in both reconstructive and cosmetic procedures.",
  },
];

const TeamPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16">
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
            className="text-center mb-16"
          >
            <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
              Our Specialists
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              Meet Our Team of<br />
              <span className="text-primary">Expert Surgeons</span>
            </h1>
          </motion.div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-3xl overflow-hidden shadow-medium"
              >
                <div className="relative h-80">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-medium text-foreground">
                    {member.name}
                  </h3>
                  <p className="font-body text-primary mt-1">{member.role}</p>
                  <p className="font-body text-muted-foreground mt-4">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link to="/#contact">
              <Button className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full px-8 py-6">
                Book a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TeamPage;
