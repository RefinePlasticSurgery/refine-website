import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>Refine Plastic & Aesthetic Surgery Centre | Premium Cosmetic Procedures in Tanzania</title>
        <meta name="description" content="Discover premium cosmetic procedures at Refine Plastic & Aesthetic Surgery Centre in Tanzania. Expert surgeons specializing in facial procedures, body contouring, breast surgery, and hair transplants. Book your consultation today." />
        <meta name="keywords" content="plastic surgery Tanzania, cosmetic surgery, aesthetic surgery, facial procedures, body contouring, breast augmentation, rhinoplasty, liposuction, tummy tuck, hair transplant" />
        <link rel="canonical" href="https://refineplasticsurgerytz.com" />
        <meta property="og:title" content="Refine Plastic & Aesthetic Surgery Centre | Premium Cosmetic Procedures in Tanzania" />
        <meta property="og:description" content="Expert cosmetic procedures in Tanzania. Facial surgery, body contouring, breast surgery, and hair transplants by skilled surgeons." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://refineplasticsurgerytz.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refine Plastic & Aesthetic Surgery Centre | Premium Cosmetic Procedures in Tanzania" />
        <meta name="twitter:description" content="Expert cosmetic procedures in Tanzania. Facial surgery, body contouring, breast surgery, and hair transplants." />
      </Helmet>
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
    </>
  );
};

export default Index;