import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Safety & Care", path: "/safety" },
  { name: "Contact", path: "/contact" },
];

import logoImage from "@/assets/logo.jpg";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-border/50 py-4 shadow-sm" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-50 flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 border-2 border-primary/20 group-hover:border-primary/50">
                <img src={logoImage} alt="Zain Manzoor & Co Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-display font-bold text-base leading-none tracking-tight uppercase">Zain Manzoor & Co</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5 hidden sm:block">Construction & Engineering</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary relative group py-2",
                    location === link.path ? "text-primary" : "text-foreground/80"
                  )}
                >
                  {link.name}
                  {location === link.path && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                href="/contact"
                className="ml-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-semibold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                Get a Quote
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden relative z-50 p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.path}
                    className={cn(
                      "text-3xl font-display uppercase tracking-widest transition-colors",
                      location === link.path ? "text-primary" : "text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              className="absolute bottom-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">Contact Us</p>
              <a href="tel:03152185221" className="block text-xl font-medium mb-1 hover:text-primary transition-colors">0315 2185221</a>
              <a href="mailto:zmco2025@gmail.com" className="block text-sm hover:text-primary transition-colors">zmco2025@gmail.com</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
