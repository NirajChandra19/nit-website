'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Code2, Megaphone, MapPin, Mail, Send, 
  User, MessageSquare, ChevronDown, CheckCircle2,
  ShieldCheck, Star, Quote, Database, PenTool, Layout, ArrowRight, Phone
} from 'lucide-react';

// --- DATA CONSTANTS ---

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '40+', label: 'Clients Served' },
  { value: '99%', label: 'Client Retention' },
  { value: '24/7', label: 'Support Available' }
];

const services = [
  {
    title: 'Website Development',
    subtitle: 'Scalable & High-Performance',
    description: 'We engineer high-performance web applications built with clean architecture, robust backend routing, and secure databases. From intuitive frontends to complex APIs, we deliver solutions that scale with your business.',
    icon: <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />,
    features: ['React & Next.js Frontends', 'Django & Node.js Backends', 'Secure Database Architecture', 'API Integration & Routing'],
    bgGradient: 'from-blue-50/60 via-white to-blue-50/30 dark:from-blue-950/30 dark:via-[#0a0a0c] dark:to-[#0a0a0c]',
    accent: 'text-blue-600 dark:text-blue-500'
  },
  {
    title: 'UI UX Designing',
    subtitle: 'Intuitive & Engaging Experiences',
    description: 'Thoughtful product design that captures attention, deepens engagement, and builds lasting brand loyalty. We bridge the gap between human behavior and digital interaction to create seamless, beautiful interfaces.',
    icon: <PenTool className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />,
    features: ['User Research & Strategy', 'Wireframing & Prototyping', 'Design Systems', 'Interactive Micro-animations'],
    bgGradient: 'from-purple-50/60 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-[#0a0a0c] dark:to-[#0a0a0c]',
    accent: 'text-purple-600 dark:text-purple-500'
  },
  {
    title: 'Digital Marketing & SEO',
    subtitle: 'Data-Driven Growth',
    description: 'Data-driven marketing strategies designed to increase visibility, drive targeted traffic, and convert visitors into loyal customers. We optimize your digital presence to dominate search engines and maximize ROI.',
    icon: <Megaphone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />,
    features: ['Technical SEO Optimization', 'Performance Marketing', 'Conversion Rate Analytics', 'Content & Brand Strategy'],
    bgGradient: 'from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-[#0a0a0c] dark:to-[#0a0a0c]',
    accent: 'text-emerald-600 dark:text-emerald-500'
  }
];

const guarantees = [
  { title: 'Secure & Scalable', desc: 'Enterprise-grade security protocols and architecture built to handle growth.', icon: <ShieldCheck className="text-indigo-500 w-6 h-6" /> },
  { title: 'Transparent Communication', desc: 'Weekly sprint updates, clear timelines, and direct access to the team.', icon: <MessageSquare className="text-indigo-500 w-6 h-6" /> },
  { title: 'Data-Driven Results', desc: 'Every decision is backed by analytics, ensuring maximum ROI for your project.', icon: <Layout className="text-indigo-500 w-6 h-6" /> }
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Director of Operations, TechFlow",
    text: "The team didn't just build us a web app; they completely overhauled our backend infrastructure. Their expertise made our complex data routing seamless. Highly recommended.",
    rating: 5
  },
  {
    name: "Marcus Chen",
    role: "Founder, Elevate E-Commerce",
    text: "Integrating the new interfaces and automating our customer journey with their design team saved us countless hours. They are true professionals who understand business needs.",
    rating: 5
  }
];

const faqs = [
  { q: "How long does a typical custom development project take?", a: "Standard websites take 3-4 weeks. Complex custom applications typically take 2-3 months." },
  { q: "Do you sign NDAs to protect my business idea?", a: "Yes, absolutely. We prioritize your intellectual property and are happy to sign a Non-Disclosure Agreement before discussing any specifics." },
  { q: "What happens after the project is launched?", a: "We don't just hand over the code and disappear. We offer 30 days of free post-launch support and scalable maintenance packages." }
];

// --- MAIN COMPONENT ---

export default function ServicesPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interestedIn: "",
    projectDetails: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Map service keys to readable names
    const serviceMap: { [key: string]: string } = {
      "web-dev": "Website Development",
      "ui-ux": "UI/UX Designing",
      "marketing": "Digital Marketing & SEO",
      "custom": "Custom Solution",
    };
    const interestedInReadable = serviceMap[formData.interestedIn] || formData.interestedIn;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.projectDetails,
          interestedIn: interestedInReadable,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ fullName: "", email: "", phone: "", interestedIn: "", projectDetails: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  // References for the Desktop Horizontal Scroll Section
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end end"]
  });
  
  // Precise horizontal translate stopping exactly at end card
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10 overflow-x-clip pt-20 sm:pt-10 pb-16 transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[500px] opacity-20 pointer-events-none blur-[100px] sm:blur-[120px] bg-gradient-to-b from-indigo-500 via-blue-500 to-transparent -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />)}
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 ml-2">Trusted by 40+ Businesses</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-slate-900 dark:text-white tracking-tight leading-tight">
              Engineering Digital Excellence <br className="hidden sm:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
                From Strategy to Scale
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2">
              We are a team of dedicated professionals merging modern web development, intuitive design, and digital marketing to solve your toughest business challenges.
            </p>
          </motion.div>
        </div>

        {/* STATS STRIP */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-16 sm:mb-20 bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-sm"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* =========================================================
          SERVICES SECTION (RESPONSIVE: MOBILE STACK / DESKTOP HORIZONTAL)
          ========================================================= */}
      
      {/* 1. MOBILE VIEW (< md): Vertical Cards */}
      <div className="block md:hidden px-4 sm:px-6 mb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Our Core Services
          </h2>
        </div>
        <div className="space-y-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`w-full flex flex-col justify-between bg-gradient-to-br ${service.bgGradient} rounded-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm`}
            >
              <div>
                <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-3">
                  {service.subtitle}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-slate-200 dark:border-white/10">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 mr-2 shrink-0 ${service.accent}`} />
                    <span className="font-medium text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 4th Custom CTA Card on Mobile */}
          <div className="w-full flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1 tracking-tight">Have a Custom Project?</h3>
              <p className="text-xs font-semibold tracking-wider text-indigo-200 uppercase mb-3">Tailored Engineering</p>
              <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                Don't see your exact requirement? We specialize in bespoke end-to-end architecture, complex integrations, and custom software tailored to your business model.
              </p>
            </div>
            <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-medium text-indigo-200">Let's discuss your scope</span>
              <button 
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-md"
              >
                Start Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DESKTOP VIEW (>= md): Fixed Sticky Scroll Heading & Cards Layout */}
      <section ref={scrollTargetRef} className="hidden md:block h-[260vh] relative bg-transparent border-y border-slate-200/80 dark:border-white/10">
        
        <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col justify-between py-6 overflow-hidden">
          
          {/* Header Title - Fixed Z-index & Top Padding */}
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 shrink-0 relative z-10 pt-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Scroll to explore.
            </h2>
          </div>

          {/* Cards Track */}
          <div className="flex-1 flex items-center min-h-0 w-full my-auto">
            <motion.div style={{ x }} className="flex gap-8 px-6 lg:px-8 items-center w-max will-change-transform">
              
              {/* Service Cards */}
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className={`w-[45vw] lg:w-[36vw] shrink-0 h-[380px] lg:h-[420px] flex flex-col justify-between bg-gradient-to-br ${service.bgGradient} rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 lg:p-10 shadow-sm`}
                >
                  <div>
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mb-5">
                      {service.icon}
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                      {service.title}
                    </h3>
                    
                    <p className="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-3">
                      {service.subtitle}
                    </p>
                    
                    <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-200/80 dark:border-white/10">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 mr-2 shrink-0 ${service.accent}`} />
                        <span className="font-medium text-xs lg:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 4th Card: Custom CTA Card */}
              <div className="w-[45vw] lg:w-[36vw] shrink-0 h-[380px] lg:h-[420px] flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2rem] p-8 lg:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-5">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-1.5 tracking-tight">Have a Custom Project?</h3>
                  <p className="text-xs font-semibold tracking-widest text-indigo-200 uppercase mb-3">Tailored Engineering</p>
                  <p className="text-xs lg:text-sm text-indigo-100 leading-relaxed">
                    Don't see your exact requirement? We specialize in bespoke end-to-end architecture, complex integrations, and custom software tailored to your business model.
                  </p>
                </div>
                <div className="relative z-10 pt-5 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs lg:text-sm font-medium text-indigo-200">Let's discuss your scope</span>
                  <button 
                    onClick={scrollToContact}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold hover:bg-indigo-50 transition-all shadow-md text-xs lg:text-sm"
                  >
                    Start Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="shrink-0 w-64 h-1.5 mx-auto bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div 
              className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>

        </div>
      </section>
      {/* =========================================================
          END SERVICES SECTION
          ========================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-20 sm:mt-32">
        
        {/* TRUST SIGNALS: TECH & GUARANTEES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-24 sm:mb-32 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Why Partner With Us?</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
              For the past 4 years, we've built a reputation for delivering robust, scalable software and design. We don't just write code; we partner with you to engineer solutions that drive measurable business outcomes.
            </p>
            <div className="space-y-4 sm:space-y-6">
              {guarantees.map((item, i) => (
                <div key={i} className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-0.5">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Core Capabilities
            </h3>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 relative z-10">
              {['React', 'Next.js', 'Figma', 'UI/UX', 'SEO', 'Django', 'Node.js', 'PostgreSQL', 'Digital Marketing', 'Tailwind CSS'].map((tech, i) => (
                <span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-24 sm:mb-32">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Client Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((test, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl relative hover:shadow-xl transition-shadow"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100 dark:text-white/5" />
                <div className="flex gap-1 mb-4 sm:mb-6 relative z-10">
                  {[...Array(test.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-lg mb-6 italic relative z-10 leading-relaxed">"{test.text}"</p>
                <div className="relative z-10">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{test.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-500">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQS SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-24 sm:mb-32">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-8 sm:mb-10">Commonly Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-white/5 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.02] overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="flex justify-between items-center w-full p-4 sm:p-6 text-left"
                >
                  <span className="font-semibold text-xs sm:text-base text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CONTACT SECTION */}
        <motion.div 
          id="contact-section"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl dark:shadow-none mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-white/10 p-6 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Your Project</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-8 sm:mb-12">
                  Fill out the form with your project details. We'll review your requirements and schedule a free technical consultation within 24 hours.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /></div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm text-slate-200">Headquarters</p>
                      <p className="text-xs sm:text-sm text-slate-400">Haldwani, Uttarakhand<br />India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl"><Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /></div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm text-slate-200">Email Us</p>
                      <p className="text-xs sm:text-sm text-slate-400">contact@nainitalinstituteoftechnology.com</p>
                    </div>
                  </div>

                  {/* Phone Number (NEW) */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm text-slate-200">Call Us</p>
                      <p className="text-xs sm:text-sm text-slate-400">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="lg:col-span-3 p-6 sm:p-10 lg:p-12 bg-slate-50 dark:bg-slate-900">
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input 
                        type="text" required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input 
                        type="email" required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone Number & Interested In */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input 
                        type="tel" required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">Interested In</label>
                    <select 
                      defaultValue="" 
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Select a service</option>
                      <option value="web-dev" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Website Development</option>
                      <option value="ui-ux" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">UI/UX Designing</option>
                      <option value="marketing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Digital Marketing & SEO</option>
                      <option value="custom" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Custom Solution</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">Project Details</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <textarea 
                      required rows={4}
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={handleInputChange}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                      placeholder="Briefly describe your requirements, timeline, and business goals..."
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-white text-xs sm:text-sm font-semibold transition-all shadow-lg ${
                    status === "success" 
                      ? "bg-green-600 shadow-green-500/25" 
                      : status === "error"
                      ? "bg-red-600 shadow-red-500/25"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 disabled:opacity-75"
                  }`}
                >
                  {status === "loading" && "Sending..."}
                  {status === "success" && <><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Request Received!</>}
                  {status === "error" && "Error. Try Again."}
                  {status === "idle" && <>Request Consultation <Send className="w-4 h-4 sm:w-5 sm:h-5" /></>}
                </button>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Your data is protected by our strict privacy policy.
                </p>
              </form>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}