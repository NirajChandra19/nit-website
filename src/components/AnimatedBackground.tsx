'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FaPython, FaReact, FaDatabase, FaTerminal, FaCode, FaLaptopCode, FaServer, FaCloud } from 'react-icons/fa';

export default function AnimatedBackground() {
  const { scrollY } = useScroll();
  
  // Parallax scroll mapping
  const ySlow = useTransform(scrollY, [0, 1000], [0, -150]);
  const yMedium = useTransform(scrollY, [0, 1000], [0, -300]);
  const yFast = useTransform(scrollY, [0, 1000], [0, -500]);

  // --- MOUSE SPOTLIGHT LOGIC ---
  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);
  
  // Smooth out the mouse movement for a fluid, premium feel
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Optimize mouse tracking using requestAnimationFrame to prevent jank
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Check if device is mobile to disable heavy parallax effects
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pre-calculated particles to prevent Next.js hydration mismatch
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${(i * 7) % 100}%`,
    top: `${(i * 13) % 100}%`,
    duration: 10 + (i % 10),
    delay: i * 0.5,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-300">
      
      {/* 1. MODERN GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      {/* 2. GLOWING AMBIENT ORBS (Static) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px] mix-blend-screen"></div>

      {/* 3. INTERACTIVE MOUSE SPOTLIGHT */}
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-400/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"
        style={{ 
          x: smoothX, 
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />

      {/* 4. FLOATING DATA DUST (Particles) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* 5. CINEMATIC PARALLAX ICONS (With Depth of Field) */}
      {!isMobile && (
        <div className="relative w-full h-full opacity-50 dark:opacity-40 hidden md:block">
          
          {/* OUT OF FOCUS (Close to camera - heavily blurred, fast moving) */}
          <motion.div style={{ y: yFast }} className="absolute top-[10%] left-[5%] text-blue-400 blur-md opacity-30 scale-150">
            <motion.div animate={{ y: [0, 30, 0], rotate: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <FaReact size={120} />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: yFast }} className="absolute top-[80%] right-[5%] text-purple-400 blur-[6px] opacity-30 scale-125">
            <motion.div animate={{ y: [0, -40, 0], rotate: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
              <FaServer size={100} />
            </motion.div>
          </motion.div>

          {/* IN FOCUS (Mid-ground - sharp, medium movement) */}
          <motion.div style={{ y: yMedium }} className="absolute top-[25%] right-[15%] text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-full">
            <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <FaPython size={70} />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: yMedium }} className="absolute top-[65%] left-[18%] text-emerald-500 drop-shadow-lg">
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <FaDatabase size={65} />
            </motion.div>
          </motion.div>

          {/* FAR BACKGROUND (Small, slow moving, slightly opaque) */}
          <motion.div style={{ y: ySlow }} className="absolute top-[15%] right-[40%] text-slate-400 opacity-40 blur-[1px]">
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
              <FaTerminal size={45} />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: ySlow }} className="absolute top-[75%] left-[45%] text-amber-500 opacity-30 blur-[2px]">
            <motion.div animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <FaLaptopCode size={50} />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: ySlow }} className="absolute top-[40%] left-[8%] text-teal-400 opacity-20 blur-[2px]">
            <motion.div animate={{ y: [0, 25, 0], rotate: [0, 12, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
              <FaCloud size={80} />
            </motion.div>
          </motion.div>

        </div>
      )}
    </div>
  );
}