"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { playfair } from "../app/fonts"; 
import { motion, useInView, animate } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward, FiStar, FiAlertCircle } from "react-icons/fi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- BACKEND-READY MOCK DATA ---
// When your backend is ready, simply replace this array with a state variable 
// populated by your API (e.g., const [testimonials, setTestimonials] = useState([]))
const TESTIMONIALS = [
  {
    id: 1,
    name: "Aisha Sharma",
    role: "Full-Stack Developer Intern",
    text: "The hands-on projects at NIT completely changed my trajectory. I was able to build a real-world portfolio that got me hired instantly!"
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Python Backend Intern",
    text: "I loved the mentorship provided. The Python programming module was incredibly detailed and easy to follow. Highly recommended for beginners."
  },
  {
    id: 3,
    name: "Sneha Gupta",
    role: "UI/UX Design Intern",
    text: "Transitioning from a non-tech background was daunting, but the design track gave me the exact confidence and practical skills I needed to succeed."
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Data Science Intern",
    text: "The certification holds actual weight. I attached it to my LinkedIn profile and immediately saw a massive increase in recruiter outreach."
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Frontend Web Intern",
    text: "Building live industry projects instead of just watching theoretical tutorials is what makes NIT's internships stand out from the rest."
  }
];

// --- ISOLATED SCRAMBLE COMPONENT (Prevents whole-page re-renders) ---
const SCRAMBLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const ScrambleTitle = ({ phrases }: { phrases: string[] }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [phrases.length]);

  useEffect(() => {
    let iteration = 0;
    const targetText = phrases[phraseIndex];
    
    const scrambleInterval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            if (targetText[index] === " ") return " "; 
            return SCRAMBLE_LETTERS[Math.floor(Math.random() * SCRAMBLE_LETTERS.length)]; 
          })
          .join("")
      );
      
      if (iteration >= targetText.length) clearInterval(scrambleInterval);
      iteration += 1 / 2; 
    }, 30);

    return () => clearInterval(scrambleInterval);
  }, [phraseIndex, phrases]);

  return <>{displayText}</>;
};

// --- OPTIMIZED STAT CARD (Uses direct DOM manipulation, ZERO React re-renders) ---
const StatCard = ({ title, endValue, suffix = "", description, colorClass, delay }: any) => {
  const nodeRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(0, endValue, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.floor(value).toLocaleString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [endValue, suffix, isInView]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      className={`bg-white dark:bg-[#111C3A] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t-4 ${colorClass} flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 w-full overflow-hidden`}
    >
      <div className="flex items-center space-x-2 mb-4 md:mb-6">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Live Metrics</span>
      </div>
      <h3 ref={nodeRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-2 tracking-tight transition-colors">
        0{suffix}
      </h3>
      <h4 className="text-base md:text-lg font-bold text-[#1E56A0] dark:text-blue-400 mb-3 uppercase tracking-wide transition-colors">{title}</h4>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px] transition-colors">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const phrases = ["Real World Experience", "Live Industry Projects", "Advanced Skill Sets"];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#050A18] pt-2 pb-2 overflow-hidden transition-colors duration-300">
      
      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center px-4 pt-10 pb-16 md:pt-10">

        {/* Under Construction Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-1.5 rounded-full shadow-sm"
        >
          <FiAlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase truncate">
            Website is under construction
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center space-x-2 bg-white dark:bg-[#111C3A] border border-teal-100 dark:border-teal-900/50 px-4 py-1.5 rounded-full shadow-sm transition-colors max-w-full"
        >
          <FiAward className="w-4 h-4 text-teal-500 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase truncate">
            #1 Platform for Virtual Internships
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center w-full max-w-5xl mx-auto px-2"
        >
          <h1 className={`${playfair.className} text-4xl sm:text-5xl md:text-[84px] font-medium text-[#0A142F] dark:text-white tracking-tight leading-[1.1] transition-colors`}>
            Where Learning Meets
          </h1>

          <div className="relative w-full h-[80px] sm:h-[100px] md:h-[120px] flex items-center justify-center mt-2">
            <h1 className={`${playfair.className} absolute w-full text-4xl sm:text-5xl md:text-[84px] font-medium tracking-tight leading-[1.1]`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent block">
                <ScrambleTitle phrases={phrases} />
              </span>
            </h1>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 text-base sm:text-lg md:text-[21px] text-gray-500 dark:text-gray-400 w-full max-w-[800px] text-center leading-relaxed mb-8 sm:mb-10 transition-colors px-4"
        >
          Kickstart your career with our free virtual internship program. Gain hands-on experience, work on live projects, and get certified.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4"
        >
          <a href="/internships" className="w-full sm:w-auto bg-[#0A142F] dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-blue-500 transition shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg">
            Apply for Internship
            <FiArrowRight className="w-5 h-5 shrink-0" />
          </a>
          <a href="/verification" className="w-full sm:w-auto bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-[#0A142F] dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2 text-base sm:text-lg">
            Verify Certificate
            <FiCheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
          </a>
        </motion.div>
      </section>

      {/* ================= LIVE STATS SECTION ================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs font-bold text-[#1E56A0] dark:text-blue-400 tracking-widest uppercase mb-4 transition-colors">
            Real-Time Platform Growth
          </p>
          <h2 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white transition-colors`}>
            Trusted by <span className="text-[#1E56A0] dark:text-blue-400 underline decoration-4 decoration-[#FBC02D] underline-offset-8 transition-colors">Students Worldwide</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard delay={0.1} colorClass="border-blue-400" endValue={8000} title="Students Joined" description="From learners across diverse tech backgrounds" />
          <StatCard delay={0.2} colorClass="border-purple-400" endValue={7500} title="Certificates Issued" description="Issued after verified assignment completion" />
          <StatCard delay={0.3} colorClass="border-teal-400" endValue={699} title="Services" description="Tools, platforms, and active services combined" />
          <StatCard delay={0.4} colorClass="border-green-400" endValue={8} suffix="+" title="Countries" description="Global participation from learners worldwide" />
        </div>
      </section>

      {/* ================= CERTIFICATE SHOWCASE SECTION ================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full flex flex-col lg:flex-row items-center gap-12 md:gap-16">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left w-full"
        >
          <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 px-4 py-1.5 rounded-full mb-6">
            <FiAward className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase">
              Verified Credential
            </span>
          </div>
          <h2 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight transition-colors`}>
            Earn a Recognized <br className="hidden lg:block"/>
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent italic pr-1">
              Certificate of&nbsp;
            </span><br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent italic pr-1">
              Completion&nbsp;
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed transition-colors max-w-2xl mx-auto lg:mx-0">
            Showcase your achievement. Our certificates come with a unique verification ID that can be verified instantly on our platform. Add it to your LinkedIn profile and resume to stand out to top tech recruiters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/skill-courses" className="w-full sm:w-auto bg-[#0A142F] dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-blue-500 transition shadow-lg flex items-center justify-center gap-2">
              Start Your Journey <FiArrowRight className="shrink-0" />
            </a>
            <a href="/verification" className="w-full sm:w-auto bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-[#0A142F] dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2">
              Verify a Certificate <FiCheckCircle className="shrink-0" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-xl lg:max-w-2xl relative group mt-10 lg:mt-0"
        >
          <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-500/10 blur-2xl sm:blur-3xl rounded-[3rem] transform group-hover:scale-105 transition-transform duration-700"></div>
          
          <div className="relative bg-[#FFFCF8] p-2 sm:p-3 md:p-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-sm transform transition-transform duration-500 group-hover:rotate-0">
            <div className="border-[2px] sm:border-[3px] border-[#0F172A] p-4 sm:p-6 md:p-10 relative h-full flex flex-col bg-white overflow-hidden shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                <FiAward className="w-64 h-64 sm:w-96 sm:h-96" />
              </div>

              <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
                    <Image 
                      src="/images/logo.png"
                      alt="NIT Logo" 
                      fill
                      sizes="(max-width: 640px) 40px, 56px"
                      className="object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm sm:text-lg leading-none tracking-wide">CODE <span className="text-[#1E56A0]">NIT</span></h3>
                    <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">Your Dream, Our Passion</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-gray-200 p-1 shadow-sm relative flex justify-center items-center">
                    <Image 
                      src="/images/Fake_Barcode.jpg" 
                      alt="Verification QR Code" 
                      width={56} 
                      height={56} 
                      className="object-contain mix-blend-multiply w-full h-full" 
                    />
                  </div>
                  <p className="text-[7px] sm:text-[9px] font-bold mt-1.5 text-gray-800 tracking-wider">ID: NIT/26/8942A</p>
                </div>
              </div>

              <div className="text-center mb-4 sm:mb-6 relative z-10">
                <h1 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl text-[#0F172A] font-bold uppercase tracking-widest mb-1 sm:mb-2`}>
                  Certificate
                </h1>
                <h2 className="text-[10px] sm:text-sm md:text-base text-gray-500 font-medium tracking-[0.2em] uppercase">
                  Of Completion
                </h2>
              </div>

              <div className="text-center mb-8 sm:mb-10 relative z-10 flex-grow">
                <p className="text-[8px] sm:text-[11px] text-gray-500 font-semibold uppercase tracking-widest mb-3 sm:mb-4">
                  This Certificate Is Proudly Presented To
                </p>
                <h2 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl text-[#0F172A] italic font-bold border-b-2 border-gray-300 inline-block px-6 sm:px-12 pb-1 sm:pb-2 mb-3 sm:mb-4`}>
                  Niraj Chandra
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed max-w-[280px] sm:max-w-lg mx-auto mt-2 sm:mt-4 font-medium">
                  Was an active Participant at the NIT Virtual Internship Program in <strong className="text-[#0F172A] font-bold">Machine Learning & Data Science</strong>. We highly appreciate your efforts taken and wish you all the best for the future.
                </p>
              </div>

              <div className="flex justify-between items-end mt-auto pt-2 relative z-10">
                <div className="text-center w-20 sm:w-32">
                  <div className="font-serif italic text-xl sm:text-3xl text-gray-800 -mb-1 opacity-90">
                    A. Kumar
                  </div>
                  <div className="border-t border-gray-400 pt-1.5">
                    <p className="text-[6px] sm:text-[9px] font-bold text-gray-700 uppercase tracking-wider">CEO & Founder</p>
                  </div>
                </div>

                <div className="text-center w-20 sm:w-32 mb-1">
                  <p className="font-bold text-gray-900 text-[10px] sm:text-xs mb-1.5">05th June 2026</p>
                  <div className="border-t border-gray-400 pt-1.5">
                    <p className="text-[6px] sm:text-[9px] font-bold text-gray-700 uppercase tracking-wider">Date of Issue</p>
                  </div>
                </div>

                <div className="w-14 sm:w-20 text-center flex flex-col items-center justify-center opacity-90">
                  <Image 
                    src="/images/govt_sign.webp" 
                    alt="Official Government Seal" 
                    width={50} 
                    height={50} 
                    className="object-contain mix-blend-multiply mb-1 w-8 h-8 sm:w-[50px] sm:h-[50px]" 
                  />
                  <p className="text-[5px] sm:text-[7px] font-bold uppercase tracking-widest text-gray-800 leading-tight">Govt. Approved</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 bg-white border border-gray-100 shadow-xl rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 animate-bounce shadow-green-500/20 z-20">
               <div className="bg-green-100 p-1.5 sm:p-2 rounded-full"><FiCheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5"/></div>
               <div>
                 <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Status</p>
                 <p className="text-xs sm:text-sm text-gray-900 font-bold">Verified & Valid</p>
               </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ================= TESTIMONIAL SWIPER SLIDER ================= */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full overflow-hidden">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-8 md:mb-10 transition-colors">What Our Interns Say</h3>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 30 } }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12" 
        >
          {/* Mapping over the backend-ready TESTIMONIALS array */}
          {TESTIMONIALS.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white dark:bg-[#111C3A] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-grab active:cursor-grabbing transition-colors duration-300 h-full flex flex-col">
                <div className="flex text-[#FBC02D] mb-4">
                  <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                </div>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 italic transition-colors flex-grow">
                  "{testimonial.text}"
                </p>
                <div>
                  <h5 className="font-bold text-[#0F172A] dark:text-white transition-colors">{testimonial.name}</h5>
                  <span className="text-xs md:text-sm text-[#1E56A0] dark:text-blue-400 transition-colors">{testimonial.role}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

    </div>
  );
}