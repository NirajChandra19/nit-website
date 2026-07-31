"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, Target, Award, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="w-full relative z-10 overflow-hidden bg-transparent dark:bg-transparent transition-colors duration-300 pb-24">
      
      {/* Lightweight CSS-animated Background Orbs (No Framer Motion overhead) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 dark:bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: "5s" }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 mt-20">
        
        {/* 1. Header/Hero Section */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="text-center relative z-10"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 border border-blue-200 dark:border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Welcome to the Future of Tech
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
            Empowering the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-300 inline-block mt-2">
              Innovators of Tomorrow
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            At Nainital Institute of Technology, we blend rigorous academic fundamentals with cutting-edge, practical innovation.
          </motion.p>
        </motion.section>

        {/* 2. About the Institute & Mission */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch"
        >
          {/* Institute Card */}
          <motion.div variants={fadeIn} className="group h-full">
            <div className="relative h-full bg-white dark:bg-[#121D3A]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/5 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Institute</h2>
                </div>
                
                <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-light">
                  <p>
                    Established with a vision to revolutionize technical education, our institute has been at the forefront of academic excellence. We focus on providing hands-on learning experiences and equipping students with the practical skills needed to thrive.
                  </p>
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <FlaskConical className="w-6 h-6 text-indigo-500 dark:text-indigo-400 shrink-0 mt-1" />
                    <p className="text-base font-normal">
                      Our state-of-the-art labs and modern infrastructure provide the perfect environment for students to experiment, build, and bring their ideas to life.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div variants={fadeIn} className="group h-full">
            <div className="relative h-full bg-white dark:bg-[#121D3A]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/5 rounded-2xl text-cyan-600 dark:text-cyan-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                </div>

                <ul className="space-y-4 md:space-y-6">
                  {[
                    { icon: Award, text: "To deliver high-quality technical education that meets global standards and industry requirements." },
                    { icon: FlaskConical, text: "To foster a robust research culture that addresses real-world challenges through innovation." },
                    { icon: ShieldCheck, text: "To nurture ethical professionals and responsible leaders who contribute positively to society." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start group/item p-3 -m-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-300">
                      <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-white/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-5 shadow-sm">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-lg pt-1 font-light group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* 3. Founder's Message */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeIn}
          className="relative rounded-[3rem] overflow-hidden shadow-2xl group"
        >
          {/* Static Gradient Background (Lightweight) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-950"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-cyan-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 px-8 py-20 md:py-24 md:px-20 text-center max-w-5xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-blue-200 uppercase mb-8">From the Founder's Desk</h2>
            
            <div className="relative mb-12">
              <span className="absolute -top-10 -left-8 text-8xl text-white/10 font-serif leading-none select-none">"</span>
              <blockquote className="text-3xl md:text-4xl italic font-light leading-snug text-white/95 relative z-10">
                Education is not simply about acquiring facts, but about training the mind to think critically and innovatively. We strive to create an ecosystem where ideas flourish and potential is fully realized.
              </blockquote>
              <span className="absolute -bottom-20 -right-4 text-8xl text-white/10 font-serif leading-none select-none">"</span>
            </div>
            
            <div className="inline-flex items-center gap-5 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-xl">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/40 shadow-inner">
                <img 
                  src="https://ui-avatars.com/api/?name=Founder&background=0D8ABC&color=fff&size=128" 
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl text-white leading-tight">Founder, NIT</p>
                <p className="text-blue-200 text-sm font-medium">Visionary & Educator</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4. Faculty Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
        >
          <div className="text-center mb-20">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Esteemed Faculty</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Learn from industry experts and passionate educators committed to your success.
            </motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Dr. A. Sharma", role: "Head of Department", dept: "Computer Science", gradient: "from-blue-500 to-cyan-500", image: "https://ui-avatars.com/api/?name=A+Sharma&background=random&size=200" },
              { name: "Prof. R. Verma", role: "Professor", dept: "Electronics & Comm.", gradient: "from-indigo-500 to-purple-500", image: "https://ui-avatars.com/api/?name=R+Verma&background=random&size=200" },
              { name: "Dr. S. Gupta", role: "Assistant Professor", dept: "Mathematics", gradient: "from-cyan-500 to-emerald-500", image: "https://ui-avatars.com/api/?name=S+Gupta&background=random&size=200" }
            ].map((faculty, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn}
                className="group relative cursor-pointer"
              >
                {/* Glow Effect on Hover (CSS based, lightweight) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/5 dark:to-white/5 rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="bg-white dark:bg-[#121D3A]/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-500 relative overflow-hidden">
                  
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="relative h-full w-full bg-gray-100 dark:bg-gray-800 rounded-full border-4 border-white dark:border-[#0A142F] overflow-hidden shadow-md group-hover:border-transparent transition-colors duration-500">
                      <img 
                        src={faculty.image} 
                        alt={faculty.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-500 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300">
                      {faculty.name}
                    </h3>
                    <div className="flex flex-col items-center gap-2">
                      <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm font-semibold rounded-full transition-colors duration-300">
                        {faculty.role}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {faculty.dept}
                      </span>
                    </div>
                  </div>

                  {/* "Access" interactive element */}
                  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-blue-500">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}