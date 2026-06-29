"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { playfair } from "../fonts";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from "react-icons/fi";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" }); // Clear form
        setTimeout(() => setStatus("idle"), 5000); // Reset button after 5 seconds
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <section className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${playfair.className} text-5xl md:text-6xl font-bold text-[#0F172A] dark:text-white mb-6`}
          >
            How can we <span className="text-blue-600 dark:text-blue-400 italic pr-2">help you?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Our team is here to support your learning journey. Reach out to us through any of the channels below.
          </motion.p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#111C3A] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <FiMail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Email Us</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Our friendly team is here to help.</p>
              <a href="mailto:contact@nainitalinstituteoftechnology.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline break-all">contact@nainitalinstituteoftechnology.com</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#111C3A] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Call Us</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Mon-Fri from 9am to 6pm.</p>
              <a href="tel:+917830142333" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">+91 7830142333</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-[#111C3A] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Visit Us</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Drop by our office for a coffee.</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Haldwani, Uttarakhand, India</p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-[#111C3A] p-8 md:p-12 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <h2 className={`${playfair.className} text-3xl font-bold text-[#0F172A] dark:text-white mb-8`}>Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Message</label>
                <textarea required rows={5} name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                  status === "success" 
                    ? "bg-green-500 text-white shadow-green-500/20" 
                    : status === "error"
                    ? "bg-red-500 text-white shadow-red-500/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 disabled:opacity-70"
                }`}
              >
                {status === "loading" && "Sending..."}
                {status === "success" && <><FiCheckCircle className="w-5 h-5" /> Message Sent!</>}
                {status === "error" && "Error Sending. Try Again."}
                {status === "idle" && <>Send Message <FiSend className="w-5 h-5" /></>}
              </button>
            </form>
          </motion.div>

        </div>

        {/* FAQs Brief Section (Unchanged) */}
        <section className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-full mb-8">
            <FiClock className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Response time: &lt; 24 hours</span>
          </div>
          <h2 className={`${playfair.className} text-3xl font-bold text-[#0F172A] dark:text-white mb-12`}>Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { q: "How do I get my certificate?", a: "Once you pass the assessment with the required score, your certificate will appear in the 'My Certificates' section." },
              { q: "Is the internship paid?", a: "We offer both free and premium internship programs. Check the program details for specific information." },
              { q: "Can I apply for multiple tracks?", a: "Yes! You can enroll in multiple skill courses and internship programs simultaneously." }
            ].map((faq, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-6 bg-white dark:bg-[#111C3A] rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-[#0F172A] dark:text-white mb-3">{faq.q}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}