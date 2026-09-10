import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  // Get phone number from environment variable (fallback provided for development)
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+255793145167";
  const message = "Hello! I'm interested in learning more about your cosmetic surgery services.";
  
  // Remove all non-digit characters for WhatsApp API
  const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg transition-colors">
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          <div className="bg-card text-foreground text-sm font-body px-4 py-2 rounded-lg shadow-medium whitespace-nowrap">
            Need Help? <span className="font-semibold">Chat with us</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};