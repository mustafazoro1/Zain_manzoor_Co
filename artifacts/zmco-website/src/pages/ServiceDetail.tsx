import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, BarChart3, Loader2, ExternalLink } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import heroServiceDetailBg from "@/assets/hero-servicedetail.png";
import { useState, useEffect } from "react";

type Project = { id: string; title: string; location: string; category: string; status: string; year: string; image: string; description: string; employer?: string; contractValue?: string; executedValue?: string; awarded?: string; completed?: string; scope?: string; gallery?: string[]; serviceIds?: string[]; };
type Service = { id: string; title: string; description: string; longDescription: string; icon: string; capabilities: string[]; benefits: string[]; process: any[]; };

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.id;
  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/services/${serviceId}`).then(res => res.ok ? res.json() : null),
      fetch('/api/projects').then(res => res.json())
    ])
      .then(([serviceData, projectsData]) => {
        setService(serviceData);
        setProjects(projectsData);
        setLoading(false);
      })
      .catch(console.error);
  }, [serviceId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </PageTransition>
    );
  }

  if (!service) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl font-display mb-4">Service Not Found</h1>
          <Link href="/services" className="text-primary hover:underline">
            Return to Services
          </Link>
        </div>
      </PageTransition>
    );
  }

  const serviceProjects = projects.filter(p => p.serviceIds?.includes(serviceId || ''));
  const stats = {
    completed: serviceProjects.filter(p => p.status === 'completed').length,
    inProgress: serviceProjects.filter(p => p.status === 'in-progress').length,
    upcoming: serviceProjects.filter(p => p.status === 'upcoming').length,
    total: serviceProjects.length
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 bg-background overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroServiceDetailBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-sm font-bold uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <ArrowLeft size={16} />
                Back to Services
              </Link>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-8xl font-display mb-8 leading-tight text-foreground"
            >
              {service.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl"
            >
              {service.longDescription}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Capabilities & Benefits */}
            <div className="space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-[2px] bg-primary rounded-full" />
                    <h3 className="text-2xl font-display uppercase tracking-widest text-foreground">Expertise & Scope</h3>
                  </div>
                <ul className="grid grid-cols-1 gap-4">
                  {service.capabilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-border hover:border-primary/40 transition-all group">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <CheckCircle2 size={18} className="text-primary" />
                      </div>
                      <span className="leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-[2px] bg-primary rounded-full" />
                    <h3 className="text-2xl font-display uppercase tracking-widest text-foreground">Why Choose ZMCO</h3>
                  </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="bg-card border border-border p-8 rounded-3xl hover:bg-secondary/40 transition-all shadow-xl shadow-black/10">
                      <span className="text-primary font-black text-xs block mb-4 uppercase tracking-[0.2em]">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-sm leading-relaxed text-muted-foreground font-medium">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card p-8 md:p-16 rounded-[40px] border border-border h-fit shadow-2xl backdrop-blur-sm"
            >
              <h3 className="text-3xl font-display mb-12 text-foreground border-b border-border pb-6">Delivery Framework</h3>
              <div className="space-y-12 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-transparent" />
                
                {service.process.map((step, i) => (
                  <div key={i} className="relative z-10 flex gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-secondary border-2 border-primary/50 flex items-center justify-center text-primary font-black text-xl shrink-0 shadow-lg shadow-primary/10">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-display mb-3 text-foreground">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Project Statistics Chart Section */}
      <section className="py-32 bg-background border-y border-border relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <BarChart3 className="text-primary" size={32} />
              <h3 className="text-3xl font-display uppercase tracking-wider">Project Success Tracking</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
                label="Completed" 
                count={stats.completed} 
                total={stats.total} 
                color="bg-green-500" 
              />
              <StatCard 
                label="In Progress" 
                count={stats.inProgress} 
                total={stats.total} 
                color="bg-primary" 
              />
              <StatCard 
                label="Upcoming" 
                count={stats.upcoming} 
                total={stats.total} 
                color="bg-amber-500" 
              />
            </div>

            <div className="mt-16 p-8 bg-card border border-border rounded-3xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h4 className="text-xl font-display mb-2">Overall Service Volume</h4>
                  <p className="text-muted-foreground text-sm">Based on {stats.total} total lifecycle projects</p>
                </div>
                <span className="text-4xl font-display text-primary">{stats.total}</span>
              </div>
              
              <div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(stats.completed / stats.total) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-green-500" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full bg-primary" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(stats.upcoming / stats.total) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full bg-amber-500" 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {serviceProjects.length > 0 && (
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-primary" />
                  <h3 className="text-3xl font-display uppercase tracking-widest">Projects using this service</h3>
                </div>
                <p className="text-muted-foreground max-w-2xl">Explore our portfolio of completed and ongoing projects where we've delivered this service.</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.1) }}
                >
                  <Link href={`/projects?id=${project.id}`}>
                    <div className="group h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-card flex flex-col cursor-pointer">
                      {/* Project Image */}
                      <div className="relative h-48 overflow-hidden bg-black/20">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            project.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400'
                              : project.status === 'in-progress'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {project.status === 'in-progress' ? 'Active' : project.status === 'completed' ? 'Done' : 'Upcoming'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{project.category}</p>
                        <h4 className="text-lg font-display mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                          {project.location}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">{project.year}</span>
                          <ExternalLink size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary/10 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display mb-6">Need this service?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Contact us today to discuss your project requirements and see how our expertise can add value.</p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all">
            Get in Touch
          </Link>
        </div>
      </section>

    </PageTransition>
  );
}

function StatCard({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color}/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
      
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-4">{label}</span>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-display">{count}</span>
        <span className="text-muted-foreground text-sm">Projects</span>
      </div>
      
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}