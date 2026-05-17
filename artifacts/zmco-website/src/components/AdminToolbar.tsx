import { useAdmin } from '@/context/AdminContext';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, Eye, RotateCcw, LogOut } from 'lucide-react';

export default function AdminToolbar() {
  const { isAdmin, isEditMode, toggleEditMode, logout } = useAdmin();

  if (!isAdmin) return null;

  const handleReset = () => {
    if (confirm('Reset all content changes? This will restore the original site text.')) {
      localStorage.removeItem('zmco_content');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-1 bg-card border border-border rounded-full shadow-2xl shadow-black/20 px-2 py-2"
    >
      <Link
        href="/admin"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground hover:bg-accent transition-all"
      >
        <Shield size={16} className="text-primary" />
        Admin
      </Link>

      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
          isEditMode
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'text-foreground hover:bg-accent'
        }`}
      >
        <Eye size={16} />
        {isEditMode ? 'Editing' : 'Preview'}
      </button>

      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground hover:bg-accent transition-all"
      >
        <RotateCcw size={16} />
        Reset
      </button>

      <button
        onClick={logout}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
      >
        <LogOut size={16} />
        Logout
      </button>
    </motion.div>
  );
}
