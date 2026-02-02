import { Phone, MapPin, Mail, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary via-pink-light to-magenta relative">
      {/* Brand color accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-light to-primary"></div>
      <div className="text-primary-foreground">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 md:mb-6">
              <img src={logo} alt="Refine Plastic & Aesthetic Surgery Centre" className="h-24 md:h-28 lg:h-32 w-auto brightness-0 invert" />
            </div>
            <p className="font-body text-sm text-primary-foreground leading-relaxed">
              Your trusted destination for cosmetic excellence and personalized care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base md:text-lg font-medium mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3 font-body text-sm text-primary-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/procedures/facial-procedures" className="hover:text-primary transition-colors">Procedures</Link></li>
              <li><Link to="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Procedures */}
          <div>
            <h4 className="font-display text-base md:text-lg font-medium mb-4 md:mb-6">Procedures</h4>
            <ul className="space-y-2 md:space-y-3 font-body text-sm text-primary-foreground">
              <li><Link to="/procedures/facial-procedures" className="hover:text-primary transition-colors">Facial Procedures</Link></li>
              <li><Link to="/procedures/body-contouring" className="hover:text-primary transition-colors">Body Contouring</Link></li>
              <li><Link to="/procedures/breast-surgery" className="hover:text-primary transition-colors">Breast Surgery</Link></li>
              <li><Link to="/procedures/skin-and-hair" className="hover:text-primary transition-colors">Skin & Hair</Link></li>
              <li><Link to="/procedures/hair-transplants" className="hover:text-primary transition-colors">Hair Transplants</Link></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display text-base md:text-lg font-medium mb-4 md:mb-6">Working Hours</h4>
            <ul className="space-y-2 md:space-y-3 font-body text-sm text-primary-foreground">
              <li className="font-medium">Mon - Friday</li>
              <li>8:00 AM - 5:00 PM</li>
              <li className="font-medium mt-3">Saturday</li>
              <li>8:00 AM - 2:00 PM</li>
              <li className="font-medium mt-3">Sundays & Public Holidays</li>
              <li>Closed</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-base md:text-lg font-medium mb-4 md:mb-6">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4 font-body text-sm text-primary-foreground">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-foreground flex-shrink-0" />
                <span>(+255) 793 145 167</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-foreground flex-shrink-0" />
                <span className="break-all">info@refineplasticsurgerytz.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-foreground mt-0.5 flex-shrink-0" />
                <span>Tanzania</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-4 md:mt-6">
              <a
                href="https://www.facebook.com/refineplasticsurgerytz"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors border border-white/20"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/refineplasticsurgerytz"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors border border-white/20"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors border border-white/20"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors border border-white/20"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/30 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm md:text-base text-primary-foreground/90 text-center md:text-left font-medium tracking-wide">
            © 2026 Refine Plastic & Aesthetic Surgery Centre Tanzania. All rights reserved.
          </p>
          <div className="flex gap-6 md:gap-8 font-body text-sm md:text-base text-primary-foreground/90 font-medium">
            <Link to="/privacy-policy" className="hover:text-primary hover:underline transition-all duration-200 underline-offset-2">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary hover:underline transition-all duration-200 underline-offset-2">Terms of Service</Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};
