import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProcedureBySlug, procedures } from "@/lib/procedures-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const ProcedureDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const procedure = getProcedureBySlug(slug || "");

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-24">
          <div className="container text-center">
            <h1 className="font-display text-4xl text-foreground mb-4">Procedure Not Found</h1>
            <p className="text-muted-foreground mb-8">The procedure you're looking for doesn't exist.</p>
            <Link to="/">
              <Button className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full">
                Return Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-24">
          <div className="container">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-24">
        <div className="container">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 md:mb-12"
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

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 md:space-y-10"
            >
              <p className="font-body text-sm text-primary uppercase tracking-wider">
                Procedures
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">
                {procedure.name}
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                {procedure.fullDescription}
              </p>

              {/* Features */}
              <div className="space-y-3 pt-4">
                <h3 className="font-display text-xl font-medium text-foreground">
                  What We Offer
                </h3>
                <ul className="space-y-3">
                  {procedure.features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 font-body text-foreground"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-4">
                <h3 className="font-display text-xl font-medium text-foreground">
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {procedure.benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3 font-body text-muted-foreground"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  onClick={() => {
                    // Navigate to contact section with procedure pre-selected
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                      // Set procedure in form after a small delay to ensure DOM is ready
                      setTimeout(() => {
                        const procedureSelect = document.querySelector('select[name="procedure"') as HTMLSelectElement;
                        if (procedureSelect) {
                          procedureSelect.value = procedure.name;
                          procedureSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                      }, 500);
                    } else {
                      // If no contact section on page, navigate to contact page with procedure parameter
                      navigate(`/contact?procedure=${encodeURIComponent(procedure.name)}`);
                    }
                  }}
                  className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full px-8 py-6 gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book {procedure.name} Consultation
                </Button>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src={procedure.image}
                alt={procedure.name}
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-3xl shadow-medium"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent rounded-3xl" />
            </motion.div>
          </div>

          {/* Other Procedures */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-16 border-t border-border"
          >
            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-8">
              Explore Other Procedures
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {procedures
                .filter((p) => p.slug !== slug)
                .map((proc) => (
                  <Link
                    key={proc.slug}
                    to={`/procedures/${proc.slug}`}
                    className="group"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img
                        src={proc.image}
                        alt={proc.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-navy/50 group-hover:bg-primary/50 transition-colors" />
                      <p className="absolute bottom-4 left-4 font-body text-sm text-white font-medium">
                        {proc.name}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default ProcedureDetail;
