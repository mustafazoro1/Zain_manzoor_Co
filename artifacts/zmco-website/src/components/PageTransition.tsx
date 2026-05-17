import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: isMobile ? 0.2 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[100dvh] pt-[88px] flex flex-col"
    >
      {children}
    </motion.div>
  );
}
