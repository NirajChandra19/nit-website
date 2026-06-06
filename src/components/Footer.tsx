"use client";

import Link from "next/link";
import { playfair } from "../app/fonts"; 
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiLinkedin, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function Footer() {
  // Prevent hydration mismatch by rendering the year only on the client side
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-[#0A142F] text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white/5 border border-white/10 p-8 rounded-2xl mb-16 shadow-lg backdrop-blur-sm">
          <div className="mb-6 lg:mb-0 max-w-lg">
            <h3 className={`${playfair.className} text-2xl text-white mb-2`}>Join our Newsletter</h3>
            <p className="text-sm text-gray-400">Get the latest internship updates, tech tutorials, and exclusive resources weekly directly to your inbox.</p>
          </div>
          <div className="flex w-full lg:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              suppressHydrationWarning={true}
              className="bg-[#050A18] border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-blue-500 w-full lg:w-72 transition"
            />
            <button suppressHydrationWarning={true} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Subscribe
            </button>
          </div>
        </div>

        {/* Middle Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Explore */}
          <div>
            <h4 className={`${playfair.className} text-xl text-white mb-6 tracking-wide`}>Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition">Skill Course Dashboard</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Skill Courses</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Skill Certificate Verification</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Internship Registration</Link></li>
              <li><Link href="/verification" className="hover:text-blue-400 transition">Internship Certificate Verification</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`${playfair.className} text-xl text-white mb-6 tracking-wide`}>Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Support Hub</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Cookies Policy</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`${playfair.className} text-xl text-white mb-6 tracking-wide`}>Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition">ATS Checker</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Interview Preparation</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Job Email Builder</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          {/* Contact Us */}
          <div>
            <h4 className={`${playfair.className} text-xl text-white mb-6 tracking-wide`}>Contact Us</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
                <span>Nainital Institute of Technology, Haldwani, Uttarakhand, India</span>
              </li>
              
              {/* Clickable Phone Number */}
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 w-5 h-5 shrink-0" />
                <a href="tel:+917830142333" className="hover:text-blue-400 transition-colors">
                  +91 7830142333
                </a>
              </li>
              
              {/* Clickable Email (mailto:) */}
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 w-5 h-5 shrink-0" />
                <a href="mailto:headofficenit@gmail.com" className="hover:text-blue-400 transition-colors">
                  headofficenit@gmail.com
                </a>
              </li>
              
              {/* Clickable Website link */}
              <li className="flex items-center gap-3">
                <FiGlobe className="text-blue-500 w-5 h-5 shrink-0" />
                <a href="https://www.nit.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  www.nit.edu.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 text-xs text-gray-500">
          <p>© {currentYear || "2026"} Nainital Institute of Technology. All rights reserved.</p>
          
          <div className="flex space-x-4 my-4 md:my-0">
            <a href="#" aria-label="LinkedIn" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiLinkedin size={16} /></a>
            <a href="#" aria-label="Instagram" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiInstagram size={16} /></a>
            <a href="#" aria-label="YouTube" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiYoutube size={16} /></a>
            <a href="#" aria-label="Twitter" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiTwitter size={16} /></a>
          </div>

          <div className="flex space-x-4">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}