import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Procedures } from "@/components/Procedures";
import { Team } from "@/components/Team";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Countries } from "@/components/Countries";
import { CTA } from "@/components/CTA";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <About />
        <Procedures />
        <Team />
        <Gallery />
        <Testimonials />
        <Countries />
        <CTA />
        <Blog />
        <Contact />
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default Index;