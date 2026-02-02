import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import logo from "@/assets/logo.png";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { 
    name: "Procedures", 
    href: "/#procedures",
    submenu: [
      { name: "Facial Procedures", slug: "facial-procedures" },
      { name: "Body Contouring", slug: "body-contouring" },
      { name: "Breast Surgery", slug: "breast-surgery" },
      { name: "Skin & Hair", slug: "skin-and-hair" },
      { name: "Hair Transplants", slug: "hair-transplants" },
    ]
  },
  { name: "Team", href: "/team" },
  { name: "Gallery", href: "/gallery" },
  { name: "News", href: "/news" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToSection } = useScrollToSection();
  
  // Use the header height hook
  useHeaderHeight();
  
  // Handle scrolling when component mounts if there's a hash in the URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && location.pathname === "/") {
      // Remove the '#' and scroll to the element
      const elementId = hash.substring(1);
      // Delay slightly to ensure page is rendered
      setTimeout(() => scrollToSection(elementId, 100), 100);
    }
  }, [location.pathname, scrollToSection]);

  // Memoized navigation handler to avoid unnecessary re-renders
  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false);
    
    // Check if it's an anchor link on home page
    if (href.startsWith("/#")) {
      const anchor = href.split('#')[1]; // Extract anchor part after #
      if (location.pathname === "/") {
        // Already on home page, just scroll to section
        scrollToSection(anchor, 100);
        return;
      } else {
        // Navigate to home page with anchor
        // The useScrollToSection hook will handle scrolling when page loads
        navigate(href);
        return;
      }
    }
    
    // Regular navigation
    navigate(href);
  }, [location.pathname, navigate, scrollToSection]);

  // Debounced scroll handler for better performance
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 50);
      }, 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background shadow-soft" : "bg-background"
      }`}
    >
      {/* Top bar */}
      <div className="border-b border-border/50">
        <div className="container flex items-center justify-between py-2 text-sm">
          <p className="hidden md:block text-muted-foreground font-body">
            We understand that each patient is unique{" "}
            <Link to="/about" className="text-foreground font-medium hover:text-primary transition-colors">
              Learn More →
            </Link>
          </p>
          <div className="flex items-center gap-4 md:gap-6 text-muted-foreground font-body">
            <a href="tel:+255793145167" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">(+255) 793 145 167</span>
            </a>
            <Link to="/contact" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Our Location</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container flex items-center justify-between py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Refine Plastic & Aesthetic Surgery Centre" className="h-20 md:h-24 lg:h-28 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <div 
              key={item.name}
              className="relative"
              onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-1 font-body text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
                {item.submenu && <ChevronDown className="w-4 h-4" />}
              </button>
              
              {item.submenu && (
                <AnimatePresence>
                  {activeSubmenu === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-medium border border-border p-2"
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.slug}
                          to={`/procedures/${subitem.slug}`}
                          onClick={() => setActiveSubmenu(null)}
                          className="block px-4 py-2 text-sm font-body text-foreground hover:bg-secondary rounded-md transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            onClick={() => handleNavClick("/contact")}
            className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full px-4 md:px-6 py-2 md:py-2.5 hidden sm:flex gap-2 text-sm"
          >
            <span className="hidden md:inline">Appointment</span>
            <span className="md:hidden">Book</span>
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center">
              →
            </span>
          </Button>
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="font-body text-foreground hover:text-primary hover:bg-secondary px-4 py-3 rounded-lg transition-colors text-left"
                >
                  {item.name}
                </button>
              ))}
              <Button 
                onClick={() => handleNavClick("/contact")}
                className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full mt-4"
              >
                Book Appointment
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
