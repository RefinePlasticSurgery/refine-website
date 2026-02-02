import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

import facialImage from "@/assets/REFINE/facial.jpeg";
import bodyContouringImage from "@/assets/REFINE/body-contouring.jpeg";
import hairImage from "@/assets/REFINE/hair.webp";

const blogPosts = [
  {
    title: "Advanced 3D Imaging Technology in Plastic Surgery",
    excerpt: "How cutting-edge 3D imaging is revolutionizing surgical planning and patient outcomes at Refine Surgery.",
    image: facialImage,
    date: "February 3, 2026",
    category: "Technology",
  },
  {
    title: "Post-Surgical Care: Your Complete Recovery Guide",
    excerpt: "Essential tips and guidelines for optimal healing and results after your cosmetic procedure.",
    image: bodyContouringImage,
    date: "January 28, 2026",
    category: "Patient Care",
  },
  {
    title: "Winter Skincare Routine for Post-Surgery Patients",
    excerpt: "Specialized skincare advice for maintaining results during the colder months in Tanzania.",
    image: hairImage,
    date: "January 22, 2026",
    category: "Skincare",
  },
  {
    title: "Minimally Invasive Procedures: What's New in 2026",
    excerpt: "Latest advances in non-surgical aesthetic treatments and what they mean for your beauty goals.",
    image: bodyContouringImage,
    date: "January 15, 2026",
    category: "Innovations",
  },
  {
    title: "Preparing for Your Consultation: What to Expect",
    excerpt: "A complete guide to help you prepare for your initial consultation and make the most of your visit.",
    image: facialImage,
    date: "January 8, 2026",
    category: "Patient Guide",
  },
  {
    title: "Celebrating 5 Years of Excellence in Aesthetic Surgery",
    excerpt: "Milestone achievements and our commitment to delivering world-class cosmetic procedures in Tanzania.",
    image: hairImage,
    date: "December 20, 2025",
    category: "Company News",
  },
];

const NewsPage = () => {
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
              News & Updates
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              Latest from<br />
              <span className="text-primary">Refine Surgery</span>
            </h1>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-soft group cursor-pointer"
                onClick={() => console.log(`Clicked on: ${post.title}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-body">
                    {post.category}
                  </span>
                </div>
                <div className="p-8">
                  <p className="font-body text-sm text-muted-foreground mb-2">{post.date}</p>
                  <h3 className="font-display text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-muted-foreground mb-4">{post.excerpt}</p>
                  <Button variant="ghost" className="gap-2 p-0 text-primary hover:text-primary/80">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default NewsPage;
