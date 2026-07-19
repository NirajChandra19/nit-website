'use client';

import { motion } from 'framer-motion';
import { Code2, Megaphone, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Website & Web App Development',
    description: 'We build high-performance, responsive websites and custom web applications tailored to your business needs using modern technologies.',
    icon: <Code2 className="w-8 h-8 text-blue-500 dark:text-blue-400"/>,
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
  },
  {
    title: 'Digital Marketing & SEO',
    description: 'Boost your online presence with data-driven digital marketing strategies, SEO optimization, and targeted social media campaigns.',
    icon: <Megaphone className="w-8 h-8 text-purple-500 dark:text-purple-400"/>,
    gradient: 'from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20',
  },
  {
    title: 'Custom Digital Solutions',
    description: 'From UI/UX design to complete digital transformations, we provide end-to-end solutions to help your business scale efficiently.',
    icon: <Smartphone className="w-8 h-8 text-indigo-500 dark:text-indigo-400"/>,
    gradient: 'from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent relative overflow-x-hidden pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white transition-colors"
          >
            Elevate Your Business with <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
              Premium Digital Services
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-600 dark:text-gray-400 text-lg transition-colors"
          >
            Beyond our educational platform, we partner with clients to deliver stunning websites, robust applications, and impactful marketing campaigns.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] dark:backdrop-blur-md p-8 shadow-sm hover:shadow-md dark:shadow-none dark:hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
              
              <div className="mb-6 inline-flex p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          {/* CTA Section Rebuilt for Light/Dark mode */}
          <div className="inline-flex flex-col items-center p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.05] w-full max-w-3xl mx-auto dark:backdrop-blur-md shadow-xl dark:shadow-none transition-colors duration-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Ready to start your next project?</h2>
            <p className="text-slate-600 dark:text-gray-300 mb-8 transition-colors">Let's discuss how our technical expertise can help your business achieve its goals.</p>
            <Link className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/25" href="/support">
              Discuss Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
