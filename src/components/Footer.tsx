"use client";

import Link from "next/link";
import { playfair } from "../app/fonts"; 
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiLinkedin, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#020617]/70 backdrop-blur-md border-t border-white/10 text-gray-300 pt-16 pb-8 mt-auto relative z-10 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between glass border-white/5 p-8 sm:p-10 rounded-3xl mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="mb-8 lg:mb-0 max-w-lg relative z-10 text-center lg:text-left">
            <h3 className={`${playfair.className} text-3xl font-bold text-white mb-3`}>Join our Newsletter</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Get the latest internship updates, tech tutorials, and exclusive resources weekly directly to your inbox.</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 relative z-10">
            <input 
              type="email" 
              placeholder="Enter your email" 
              suppressHydrationWarning={true}
              className="bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/10 w-full lg:w-72 transition-all placeholder:text-gray-500"
            />
            <button suppressHydrationWarning={true} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5">
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
              <li><Link href="/dashboard" className="hover:text-blue-400 transition">Skill Course Dashboard</Link></li>
              <li><Link href="/skill_courses" className="hover:text-blue-400 transition">Skill Courses</Link></li>
              <li><Link href="/verification" className="hover:text-blue-400 transition">Skill Certificate Verification</Link></li>
              <li><Link href="/internships" className="hover:text-blue-400 transition">Internship Registration</Link></li>
              <li><Link href="/verification" className="hover:text-blue-400 transition">Internship Certificate Verification</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`${playfair.className} text-xl text-white mb-6 tracking-wide`}>Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link href="/support" className="hover:text-blue-400 transition">Support Hub</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition">Cookies Policy</Link></li>
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
          <p suppressHydrationWarning>© {new Date().getFullYear()} Nainital Institute of Technology. All rights reserved.</p>
          
          <div className="flex space-x-4 my-4 md:my-0">
            <a href="#" aria-label="LinkedIn" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiLinkedin size={16} /></a>
            <a href="#" aria-label="Instagram" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiInstagram size={16} /></a>
            <a href="#" aria-label="YouTube" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiYoutube size={16} /></a>
            <a href="#" aria-label="Twitter" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition"><FiTwitter size={16} /></a>
          </div>

          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/privacy" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}