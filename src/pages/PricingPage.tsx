import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { 
  pricingData, 
  pricingCategories, 
  getPricingByCategory, 
  formatPrice
} from "@/lib/pricing-data";
import { useEffect } from "react";

const PricingPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(pricingCategories[0]);
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentCategoryItems = getPricingByCategory(selectedCategory);

  return (
    <>
      <Helmet>
        <title>Plastic Surgery Pricing Tanzania | Cosmetic Procedure Costs</title>
        <meta name="description" content="Complete pricing guide for plastic surgery procedures in Tanzania. Breast augmentation, liposuction, rhinoplasty, and more. Transparent costs in TZS." />
        <meta name="keywords" content="plastic surgery prices Tanzania, cosmetic surgery costs, breast augmentation price, liposuction cost Tanzania, rhinoplasty price" />
        <link rel="canonical" href="https://refineplasticsurgerytz.com/pricing" />
        <meta property="og:title" content="Plastic Surgery Pricing Tanzania | Cosmetic Procedure Costs" />
        <meta property="og:description" content="Complete pricing guide for plastic surgery procedures in Tanzania. Transparent costs in TZS." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://refineplasticsurgerytz.com/pricing" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Plastic Surgery Pricing Tanzania | Cosmetic Procedure Costs" />
        <meta name="twitter:description" content="Complete pricing guide for plastic surgery procedures in Tanzania." />
      </Helmet>

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
              className="text-center mb-12 md:mb-16"
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Transparent Pricing
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
                Our <span className="text-primary">Procedure</span> Pricing
              </h1>
              <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive pricing for all our cosmetic and plastic surgery procedures. 
                All prices include pre-operative consultation, surgical procedure, and post-operative care.
              </p>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Prices are in Tanzanian Shillings (TZS) and include all surgical procedures, pre-operative consultation, and post-operative care.</p>
                <p className="mt-2">Prices subject to change based on individual needs and requirements.</p>
              </div>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
            >
              {pricingCategories.map((category) => (
                <Button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedProcedure(null);
                  }}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </motion.div>

            {/* Pricing Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{selectedCategory}</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentCategoryItems.length} procedures
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-4 px-4 font-body text-muted-foreground">Procedure</th>
                          <th className="text-right py-4 px-4 font-body text-muted-foreground">Price (TZS)</th>
                          <th className="text-center py-4 px-4 font-body text-muted-foreground">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCategoryItems.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="font-body font-medium text-foreground">{item.name}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="font-body font-semibold text-foreground">
                                {formatPrice(item.price)}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProcedure(item.id)}
                                className="gap-2 text-primary hover:text-primary/80"
                              >
                                <Info className="w-4 h-4" />
                                <span className="hidden sm:inline">Details</span>
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Information Modal */}
            {selectedProcedure && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedProcedure(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const procedure = pricingData.find(p => p.id === selectedProcedure);
                    if (!procedure) return null;

                    return (
                      <div className="p-6 md:p-8">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="font-display text-2xl font-medium text-foreground">
                            {procedure.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProcedure(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-2">
                            Pricing
                          </h4>
                          <div className="bg-secondary rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-foreground">
                                {formatPrice(procedure.price)}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Tanzanian Shillings (TZS)
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Procedure Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-body">Duration:</span>
                                <span className="font-body font-medium text-foreground">
                                  {procedure.duration || '1-3 hours'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-body">Category:</span>
                                <span className="font-body text-muted-foreground">
                                  {procedure.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {procedure.description && (
                          <div className="mb-6">
                            <h4 className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Description
                            </h4>
                            <p className="font-body text-foreground leading-relaxed">
                              {procedure.description}
                            </p>
                          </div>
                        )}

                        {procedure.includes && (
                          <div className="mb-6">
                            <h4 className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-3">
                              What's Included
                            </h4>
                            <ul className="space-y-2">
                              {procedure.includes.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                  <span className="font-body text-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                          <Button 
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setSelectedProcedure(null);
                              // Scroll to contact section
                              setTimeout(() => {
                                const contactElement = document.getElementById('contact');
                                if (contactElement) {
                                  const headerOffset = 100;
                                  const elementPosition = contactElement.getBoundingClientRect().top;
                                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                }
                              }, 300);
                            }}
                          >
                            Book Consultation
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedProcedure(null)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-secondary rounded-2xl p-8 md:p-12"
            >
              <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-4">
                Ready to Begin Your Journey?
              </h3>
              <p className="font-body text-muted-foreground mb-6 max-w-2xl mx-auto">
                Schedule a consultation with our expert surgeons to discuss your goals, 
                understand the procedures, and receive a personalized treatment plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#contact">
                  <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-base">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="px-8 py-6 text-base">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <WhatsAppButton />
      </div>
    </>
  );
};

export default PricingPage;