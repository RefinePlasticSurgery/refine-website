import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import breastAugImage from "@/assets/REFINE/Breast-Augmentation-1.jpeg";
import tummyTuckImage from "@/assets/REFINE/power-of-tummy-tuck.jpeg";
import fillersImage from "@/assets/REFINE/fillers.jpeg";

const posts = [
  {
    title: "Advanced 3D Imaging Technology in Plastic Surgery",
    image: breastAugImage,
    date: "03 Feb, 2026",
    author: "Refine Plastic Surgery",
  },
  {
    title: "Post-Surgical Care: Your Complete Recovery Guide",
    image: tummyTuckImage,
    date: "28 Jan, 2026",
    author: "Refine Plastic Surgery",
  },
  {
    title: "Winter Skincare Routine for Post-Surgery Patients",
    image: fillersImage,
    date: "22 Jan, 2026",
    author: "Refine Plastic Surgery",
  },
];

export const Blog = () => {
  return (
    <section id="blog" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12"
        >
          <div>
            <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
              Latest News
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              The Beauty Blog: Insights and Tips<br className="hidden lg:block" />
              for Your <span className="text-primary">Aesthetic Journey</span>
            </h2>
          </div>
          <Link to="/news">
            <Button className="bg-navy hover:bg-navy-light text-primary-foreground rounded-full px-6 md:px-8 py-5 md:py-6 font-body w-fit">
              View All
            </Button>
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <Link key={post.title} to="/news" className="block">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-soft group cursor-pointer h-full"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-body mb-2 md:mb-3">
                    <span className="truncate">By {post.author}</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">{post.date}</span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};