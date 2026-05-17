import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, RotateCcw, LogOut, ChevronDown } from 'lucide-react';

export default function AdminToolbar() {
  const { isAdmin, isEditMode, toggleEditMode, logout } = useAdmin();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAdmin) return null;

  const handleReset = () => {
    if (confirm('Reset all content changes? This will restore the original site text.')) {
      localStorage.removeItem('zmco_content');
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isCollapsed ? (
        <motion.button
          key="collapsed-toolbar"
          initial={{ y: 50, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 50, scale: 0.8, opacity: 0 }}
          onClick={() => setIsCollapsed(false)}
          className="fixed bottom-6 left-6 z-[9999] flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground border border-primary/20 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
          title="Open Admin Toolbar"
        >
          <Shield size={20} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
        </motion.button>
      ) : (
        <motion.div
          key="expanded-toolbar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 bg-card/95 backdrop-blur-md border border-border/80 rounded-full shadow-2xl shadow-black/35 px-3 py-2"
        >
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex items-center justify-center p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all mr-1"
            title="Minimize Toolbar"
          >
            <ChevronDown size={16} />
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-accent transition-all"
          >
            <Shield size={14} className="text-primary" />
            Admin
          </Link>

          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              isEditMode
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            <Eye size={14} />
            {isEditMode ? 'Editing' : 'Preview'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-accent transition-all"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
