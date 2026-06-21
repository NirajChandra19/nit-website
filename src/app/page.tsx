"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; // Imported Next.js Link
import { playfair } from "../app/fonts"; 
import { motion, useInView, animate } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward, FiStar, FiAlertCircle } from "react-icons/fi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { testimonialService } from "@/lib/services/api";
import { Testimonial } from "@/types";
import { CertificateTemplate } from "@/components/CertificateTemplate";

// 1. MOVED CONSTANTS OUTSIDE: Prevents unnecessary array recreation on every render
const SCRAMBLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const HERO_PHRASES = ["Real World Experience", "Live Industry Projects", "Advanced Skill Sets"];

// --- ISOLATED SCRAMBLE COMPONENT ---
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

// --- OPTIMIZED STAT CARD ---
interface StatCardProps {
  title: string;
  endValue: number;
  suffix?: string;
  description: string;
  colorClass: string;
  delay: number;
}

const StatCard = ({ title, endValue, suffix = "", description, colorClass, delay }: StatCardProps) => {
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
      className={`glass-card rounded-2xl p-6 md:p-8 border-t-4 ${colorClass} flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 w-full overflow-hidden`}
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // 2. Prevent Hydration Mismatches for Swiper
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // 3. Safe Data Fetching with Cleanup
  useEffect(() => {
    let isActive = true; // Prevents state updates if component unmounts
    
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialService.getAll();
        if (isActive) setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        if (isActive) setIsLoadingTestimonials(false);
      }
    };
    
    fetchTestimonials();
    
    return () => {
      isActive = false;
    };
  }, []);

  return (
    // pt-2
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#050A18] overflow-hidden pb-2 transition-colors duration-300">
      
      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center px-4 pt-10 pb-16 md:pt-10">
        
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

          <div className="relative w-full h-[90px] sm:h-[110px] md:h-[135px] flex items-center justify-center mt-2">
            <h1 className={`${playfair.className} absolute w-full text-4xl sm:text-5xl md:text-[84px] font-medium tracking-tight leading-[1.1] py-2`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent block pb-2">
                <ScrambleTitle phrases={HERO_PHRASES} />
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

        {/* 4. REPLACED <a> TAGS WITH <Link> */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4"
        >
          <Link href="/internships" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg">
            Apply for Internship
            <FiArrowRight className="w-5 h-5 shrink-0" />
          </Link>
          <Link href="/verification" className="w-full sm:w-auto glass-card text-[#0F172A] dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-base sm:text-lg">
            Verify Certificate
            <FiCheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
          </Link>
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
          <StatCard delay={0.4} colorClass="border-green-400" endValue={8} suffix="+" title="States" description="Connecting learners across diverse regions of India" />
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
            <Link href="/skill_courses" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Start Your Journey <FiArrowRight className="shrink-0" />
            </Link>
            <Link href="/verification" className="w-full sm:w-auto glass-card text-[#0F172A] dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Verify a Certificate <FiCheckCircle className="shrink-0" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-xl lg:max-w-2xl relative group mt-10 lg:mt-0 aspect-[1.414/1] flex items-center justify-center overflow-hidden rounded-[1rem]"
        >
          <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-500/10 blur-2xl sm:blur-3xl rounded-[3rem] transform group-hover:scale-105 transition-transform duration-700"></div>
          
          <div className="w-[1000px] flex-shrink-0 origin-center scale-[0.32] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.5] xl:scale-[0.6] relative z-10 flex items-center justify-center">
            <div className="w-full h-full relative">
              <CertificateTemplate 
                studentName="Niraj Chandra"
                registrationId="REG-2026-9716"
                programName="Machine Learning & Data Science"
                issueDate="05th June 2026"
                certificateId="NIT/26/8942A"
                programType="internship"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= TESTIMONIAL SWIPER SLIDER ================= */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full overflow-hidden">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-8 md:mb-10 transition-colors">What Our Interns Say</h3>
        
        {/* 5. ADDED LOADING SKELETON & MOUNT CHECK TO PREVENT HYDRATION ERRORS */}
        {!isMounted || isLoadingTestimonials ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-100 dark:bg-[#111C3A]/50 animate-pulse h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 30 } }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-12" 
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white dark:bg-[#111C3A] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-grab active:cursor-grabbing transition-colors duration-300 h-full flex flex-col">
                  <div className="flex text-[#FBC02D] mb-4">
                    <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 italic transition-colors flex-grow">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div>
                    <h5 className="font-bold text-[#0F172A] dark:text-white transition-colors">{testimonial.name}</h5>
                    <span className="text-xs md:text-sm text-[#1E56A0] dark:text-blue-400 transition-colors">{testimonial.role}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500 py-10">Check back later for student experiences.</div>
        )}
      </section>

    </div>
  );
}