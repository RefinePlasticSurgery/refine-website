import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const blogPosts = [
  {
    title: "Understanding Rhinoplasty: What to Expect",
    excerpt: "A comprehensive guide to nose reshaping surgery and recovery process.",
    image: "https://new.refineplasticsurgery.co.ke/wp-content/uploads/2025/07/facial.jpg",
    date: "January 15, 2025",
    category: "Facial Procedures",
  },
  {
    title: "The Rise of Non-Surgical Body Contouring",
    excerpt: "Explore the latest non-invasive options for achieving your ideal body shape.",
    image: "https://new.refineplasticsurgery.co.ke/wp-content/uploads/2025/07/body-contouring.jpg",
    date: "January 10, 2025",
    category: "Body Contouring",
  },
  {
    title: "Hair Transplant Techniques Compared",
    excerpt: "FUE vs FUT: Which hair restoration method is right for you?",
    image: "https://refineplasticsurgerytz.com/wp-content/uploads/2025/08/hair.webp",
    date: "January 5, 2025",
    category: "Hair Restoration",
  },
];

const NewsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
                className="bg-card rounded-2xl overflow-hidden shadow-soft group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default NewsPage;
