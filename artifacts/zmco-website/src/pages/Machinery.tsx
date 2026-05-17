import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Wrench, ZoomIn, Plus, Trash2, Edit2, Check, Upload, Loader2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { EditableText, useAdmin } from "@/context/AdminContext";
import heroMachineryBg from "@/assets/hero-machinery.png";
import bgSafetyPattern from "@/assets/bg_safety_pattern.png";

// ─── Types ───────────────────────────────────────────────────────────────────
export type MachineryItem = {
  id: string;
  name: string;
  description: string;
  images: string[];
};

const DEFAULT_MACHINERY: MachineryItem[] = [
  {
    id: "dump-trucks",
    name: "Dump Trucks",
    description:
      "Our fleet of heavy-duty dump trucks handles large-scale earth movement and material transport across construction sites. These vehicles are essential for moving sand, gravel, demolition debris, and other bulk materials efficiently over long and short hauls.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    ],
  },
  {
    id: "water-tanker",
    name: "Water Tanker",
    description:
      "We maintain a reliable fleet of water tankers to support our construction projects. These specialized vehicles are readily available and play a crucial role in water supply and distribution on job sites, dust suppression, and concrete curing operations.",
    images: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
      "https://images.unsplash.com/photo-1624374053855-39a5a1a41403?w=800&q=80",
    ],
  },
  {
    id: "trolley",
    name: "Trolley",
    description:
      "Heavy-duty trolleys used for transporting oversized loads, structural steel, and large equipment components across construction zones and to remote project sites with precision and safety.",
    images: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    ],
  },
  {
    id: "sheep-foot-roller",
    name: "Sheep Foot Roller",
    description:
      "The sheep foot roller is used for compacting cohesive soils such as clay and silt. It is ideal for embankment and dam construction, road sub-grade compaction, and landfill operations — ensuring the required density for structural stability.",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    ],
  },
  {
    id: "sand-screener",
    name: "Sand Screener",
    description:
      "Our sand screening machines separate and grade aggregates with high efficiency. Used extensively in road construction, concrete production, and landscaping projects to ensure uniform particle sizes and quality material output.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
  },
  {
    id: "mobile-crane",
    name: "Mobile Crane",
    description:
      "Our mobile cranes provide essential lifting capability on construction sites. With high load capacities and excellent mobility, they are used for lifting structural steel, precast elements, heavy machinery, and materials to elevated work zones.",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    id: "mounted-concrete-boom",
    name: "Mounted Concrete Boom",
    description:
      "Truck-mounted concrete boom pumps allow precise placement of concrete at height and distance. Ideal for high-rise construction, bridges, and large slab pours where direct chute access is not feasible.",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    ],
  },
  {
    id: "cement-bulker",
    name: "Cement Bulker",
    description:
      "Bulk cement tankers for transporting dry cement powder from storage silos to batching plants or directly to site. They ensure efficient, weather-protected delivery and significantly reduce material waste compared to bagged cement.",
    images: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    ],
  },
  {
    id: "asphalt-paver",
    name: "Asphalt Paver Machine",
    description:
      "Our asphalt pavers deliver smooth, consistent bituminous surface layers for roads, highways, and airstrips. Fitted with automatic screed controls for precise thickness and slope, these machines ensure high-quality pavement performance.",
    images: [
      "https://images.unsplash.com/photo-1624374053855-39a5a1a41403?w=800&q=80",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
    ],
  },
  {
    id: "air-compressor",
    name: "Air Compressor",
    description:
      "Industrial air compressors power pneumatic tools such as jackhammers, spray guns, and rock drills across all our construction sites. Available in multiple capacities to support demanding work environments.",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    ],
  },
  {
    id: "paver-rollers",
    name: "Paver Rollers",
    description:
      "Vibratory paver rollers are used to compact freshly laid asphalt layers, achieving the required density and smooth finish. Our fleet includes tandem rollers and pneumatic-tired rollers for various road construction applications.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    ],
  },
  {
    id: "transit-concrete-mixers",
    name: "Transit Concrete Mixers",
    description:
      "Our transit mixers transport ready-mix concrete from batching plants to construction sites while keeping the mix in continuous agitation. They ensure fresh, homogeneous concrete delivery for all structural requirements.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    ],
  },
];

// ─── Machinery storage helpers ────────────────────────────────────────────────
export const loadMachinery = (siteContent: Record<string, string>): MachineryItem[] => {
  const raw = siteContent["machinery_items"];
  if (!raw) return DEFAULT_MACHINERY;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_MACHINERY;
  } catch {
    return DEFAULT_MACHINERY;
  }
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button
            className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        src={images[idx]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-8 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-primary scale-125" : "bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Machine Detail Modal ─────────────────────────────────────────────────────
function MachineDetailModal({
  machine,
  onClose,
}: {
  machine: MachineryItem;
  onClose: () => void;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIdx === null) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, lightboxIdx]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="bg-card border border-border rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main image */}
          {machine.images.length > 0 && (
            <div className="relative h-72 bg-black overflow-hidden">
              <motion.img
                key={imgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={machine.images[imgIdx]}
                alt={machine.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
              >
                <X size={18} />
              </button>

              {/* Zoom icon */}
              <button
                onClick={() => setLightboxIdx(imgIdx)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-primary/80 flex items-center justify-center text-white transition-all"
              >
                <ZoomIn size={16} />
              </button>

              {/* Nav arrows for multiple images */}
              {machine.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + machine.images.length) % machine.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % machine.images.length)}
                    className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Wrench size={22} className="text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display text-foreground">{machine.name}</h2>
                <p className="text-xs uppercase tracking-widest text-primary font-bold mt-1">Plant & Machinery</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm mb-8">{machine.description}</p>

            {/* Thumbnail strip */}
            {machine.images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {machine.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <ImageLightbox
            images={machine.images}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Machinery() {
  const { siteContent, isEditMode, updateContent, uploadFile } = useAdmin();
  const [selected, setSelected] = useState<MachineryItem | null>(null);
  const [machinery, setMachinery] = useState<MachineryItem[]>([]);

  // Load machinery from siteContent or defaults
  useEffect(() => {
    setMachinery(loadMachinery(siteContent));
  }, [siteContent]);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden border-b border-border bg-background">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroMachineryBg})` }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 grayscale blur-sm"
            style={{ 
              backgroundImage: `url(${bgSafetyPattern})`,
              backgroundAttachment: 'fixed'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-[1]" />
        </div>
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[1]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
            <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="uppercase tracking-[0.3em] text-[10px] font-black text-primary">Our Fleet</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-display mb-10 leading-[0.9] text-foreground"
          >
            <EditableText id="machinery_hero_title_1" defaultText="Plant &" />{" "}
            <span className="text-primary">
              <EditableText id="machinery_hero_title_2" defaultText="Machinery" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl"
          >
            <EditableText
              id="machinery_hero_subtitle"
              defaultText="As a construction company, we recognize the importance of having the right equipment to successfully execute projects of varying complexities."
            />
          </motion.p>
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed text-center"
          >
            <EditableText
              id="machinery_intro_text"
              defaultText="Our company maintains a robust fleet of specialized equipment specifically designed for construction disciplines. Our skilled equipment operators and technicians undergo regular training to operate and maintain the equipment efficiently and safely. By investing in high-quality equipment and maintaining a well-rounded fleet, we are equipped to handle a wide range of construction projects with precision and expertise. Here's an overview of the equipment we utilize:"
            />
          </motion.p>
        </div>
      </section>

      {/* Machinery Grid */}
      <section className="py-20 md:py-24 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {machinery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                onClick={() => setSelected(item)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-400 hover:shadow-2xl hover:shadow-primary/10 bg-card"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-black/30">
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Wrench size={40} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2">
                      <ZoomIn size={14} /> View Details
                    </div>
                  </div>

                  {/* Image count badge */}
                  {item.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {item.images.length} photos
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="p-5 flex items-center justify-between">
                  <h3 className="font-display text-base uppercase tracking-wider text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/20">
                    <ChevronRight size={16} className="text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary/10 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display mb-6">
            <EditableText id="machinery_cta_title" defaultText="Need Heavy Equipment?" />
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            <EditableText
              id="machinery_cta_desc"
              defaultText="Contact us today to discuss your project requirements. Our machinery fleet is fully maintained and ready for deployment."
            />
          </p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Machine Detail Modal */}
      <AnimatePresence>
        {selected && (
          <MachineDetailModal machine={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
