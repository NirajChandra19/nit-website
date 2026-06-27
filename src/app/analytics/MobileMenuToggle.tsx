"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { playfair } from "../fonts";

export default function MobileMenuToggle() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="lg:hidden text-[#0F172A] dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex">
          <div className="w-72 h-full bg-white dark:bg-[#0B1221] flex flex-col shadow-2xl animate-[slide-in-left_0.4s_ease-out_forwards]">
            <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
              <span className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>
                CODE <span className="text-blue-500">NIT</span>
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors p-2">
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
}
