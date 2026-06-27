"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { playfair } from "@/app/fonts"; 

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

export function StatsSection() {
  return (
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
  );
}
