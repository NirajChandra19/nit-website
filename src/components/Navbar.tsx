"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { ChevronDown, Moon, Sun, Menu, X, ArrowRight, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(""); 
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout, user, isLoading } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (menuName: string) => {
    setMobileExpandedMenu(prev => prev === menuName ? "" : menuName);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FAFAFA]/70 dark:bg-[#050A18]/70 backdrop-blur-md border-b border-gray-200/50 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center space-x-2 shrink-0" onClick={closeMobileMenu}>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-1">
            <Image 
              src="/images/logo.webp" 
              alt="Nainital Institute of Technology Logo" 
              quality={85} 
              sizes="(max-width: 768px) 48px, 56px"
              className="object-contain"
              fill 
              priority
              unoptimized
            />
          </div>
          {/* Removed 'hidden sm:block' from the span below */}
          <span className="text-xl font-bold text-[#1E56A0] dark:text-blue-400 tracking-wide leading-none mt-1">
            NIT
          </span>
        </Link>

        {/* DESKTOP: CENTER PILL NAVIGATION */}
        <nav className="hidden lg:flex items-center bg-white dark:bg-[#111C3A] border border-gray-100 dark:border-gray-700 rounded-full px-8 py-2.5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] space-x-7 text-[15px] font-medium text-gray-600 dark:text-gray-300 transition-colors">
          <Link href="/" className="text-teal-600 dark:text-teal-400 font-semibold">Home</Link>
          
          {/* Internships Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Internships <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#111C3A] border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <Link href="/internships" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Apply Now</Link>
              <Link href="/verification" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Internship certificate verification</Link>
            </div>
          </div>

          {/* Skill Course Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Skill Course <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#111C3A] border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Dashboard</Link>
              <Link href="/skill_courses" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Browse Courses</Link>
              <Link href="/certificates" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">My Certificates</Link>
            </div>
          </div>

          <Link href="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Services</Link>

          {/* More Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition">
              More <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111C3A] border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <Link href="/scholarship-test" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors">Scholarship Test</Link>
              <Link href="/support" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Contact Support</Link>
              <Link href="/privacy" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </nav>

        {/* DESKTOP: RIGHT ACTION BUTTONS */}
        <div className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition w-5 h-5 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isLoading ? (
            <div className="flex items-center space-x-4 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="w-24 h-8 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-2 border-l border-gray-200 dark:border-gray-700">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {user?.name || "Niraj"}
                </span>
              </Link>
              <button 
                onClick={logout} 
                className="text-gray-400 hover:text-red-500 transition p-2"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-[15px] font-semibold text-[#0F172A] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                Login
              </Link>
              
              <Link href="/join" className="bg-[#0F172A] dark:bg-blue-600 text-white text-[15px] px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-blue-500 transition shadow-md flex items-center gap-2 tracking-wide">
                Join Now <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE: ACTIONS & HAMBURGER */}
        <div className="flex lg:hidden items-center space-x-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#0F172A] dark:text-white bg-[#0F172A] dark:bg-[#111C3A] p-2 rounded-lg"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

      </div>

      {/* MOBILE: SLIDE-DOWN MENU */}
      <div 
        className={`lg:hidden fixed top-[80px] sm:top-[88px] left-0 w-full h-[calc(100vh-80px)] sm:h-[calc(100vh-88px)] bg-white dark:bg-[#050A18] transform transition-transform duration-300 ease-in-out overflow-y-auto will-change-transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-6 h-full pb-32">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-xl font-bold text-[#0F172A] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4" onClick={closeMobileMenu}>
              Home
            </Link>

            {/* Mobile Internships Accordion */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <button 
                onClick={() => toggleMobileMenu('internships')}
                className="w-full flex items-center justify-between text-xl font-bold text-[#0F172A] dark:text-white"
              >
                Internships
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpandedMenu === 'internships' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedMenu === 'internships' && (
                <div className="flex flex-col mt-4 space-y-3 pl-4 text-gray-600 dark:text-gray-400 font-medium">
                  <Link href="/internships" onClick={closeMobileMenu}>Apply Now</Link>
                  <Link href="/verification" onClick={closeMobileMenu}>Internship certificate verification</Link>
                </div>
              )}
            </div>

            {/* Mobile Skill Course Accordion */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <button 
                onClick={() => toggleMobileMenu('skills')}
                className="w-full flex items-center justify-between text-xl font-bold text-[#0F172A] dark:text-white"
              >
                Skill Course
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpandedMenu === 'skills' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedMenu === 'skills' && (
                <div className="flex flex-col mt-4 space-y-3 pl-4 text-gray-600 dark:text-gray-400 font-medium">
                  <Link href="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
                  <Link href="/skill_courses" onClick={closeMobileMenu}>Browse Courses</Link>
                  <Link href="/certificates" onClick={closeMobileMenu}>My Certificates</Link>
                </div>
              )}
            </div>

            <Link href="/services" className="text-xl font-bold text-[#0F172A] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4" onClick={closeMobileMenu}>
              Services
            </Link>

            {/* Mobile More Accordion */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <button 
                onClick={() => toggleMobileMenu('more')}
                className="w-full flex items-center justify-between text-xl font-bold text-[#0F172A] dark:text-white"
              >
                More
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpandedMenu === 'more' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedMenu === 'more' && (
                <div className="flex flex-col mt-4 space-y-3 pl-4 text-gray-600 dark:text-gray-400 font-medium">
                  <Link href="/scholarship-test" onClick={closeMobileMenu}>Scholarship Test</Link>
                  <Link href="/support" onClick={closeMobileMenu}>Contact Support</Link>
                  <Link href="/privacy" onClick={closeMobileMenu}>Privacy Policy</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-4 pt-4 mt-auto">
            {isLoading ? (
              <>
                <div className="w-full h-14 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="w-full h-14 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              </>
            ) : isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="w-full bg-[#0F172A] dark:bg-blue-600 text-white font-bold py-4 rounded-xl text-center flex items-center justify-center transition-colors shadow-lg"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl text-center flex items-center justify-center transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="w-full bg-[#F3F4F6] dark:bg-gray-800 text-[#0F172A] dark:text-white font-bold py-4 rounded-xl text-center flex items-center justify-center transition-colors"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/join" 
                  className="w-full bg-[#0F172A] dark:bg-blue-600 text-white font-bold py-4 rounded-xl text-center flex items-center justify-center transition-colors shadow-lg"
                  onClick={closeMobileMenu}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}