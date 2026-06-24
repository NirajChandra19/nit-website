"use client";

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { playfair } from '../app/fonts';
import { FiAward } from 'react-icons/fi';

export interface CertificateTemplateProps {
  studentName: string;
  programName: string;
  issueDate: string;
  certificateId: string;
  registrationId?: string;
  programType: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(({
  studentName, programName, issueDate, certificateId, registrationId, programType
}, ref) => {
  return (
    <div ref={ref} id="certificate-download-target" className="w-full aspect-[1.414/1] relative bg-[#FFFCF8] p-2 sm:p-3 md:p-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-sm transform transition-transform duration-500 group-hover:rotate-0">
      <div className="border-[2px] sm:border-[3px] border-[#0F172A] p-4 sm:p-6 md:p-10 relative h-full flex flex-col bg-white overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
          <FiAward className="w-64 h-64 sm:w-96 sm:h-96" />
        </div>

        <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
              <Image 
                src="/images/logo.webp"
                alt="NIT Logo" 
                fill
                sizes="(max-width: 640px) 40px, 56px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm sm:text-lg leading-none tracking-wide">CODE <span className="text-[#1E56A0]">NIT</span></h3>
              <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">Your Dream, Our Passion</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-gray-200 p-1 shadow-sm relative flex justify-center items-center">
              <Image
                src="/images/Fake_Barcode.webp"
                alt="Verification QR Code"
                width={56}
                height={56}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="text-right mt-1.5">
              {registrationId && <p className="text-[7px] sm:text-[9px] font-bold text-gray-800 tracking-wider">REG: {registrationId}</p>}
              <p className="text-[7px] sm:text-[9px] font-bold text-gray-800 tracking-wider">ID: {certificateId}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-6 relative z-10">
          <h1 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl text-[#0F172A] font-bold uppercase tracking-widest mb-1 sm:mb-2`}>
            Certificate
          </h1>
          <h2 className="text-[10px] sm:text-sm md:text-base text-gray-500 font-medium tracking-[0.2em] uppercase">
            Of Completion
          </h2>
        </div>

        <div className="text-center mb-8 sm:mb-10 relative z-10 flex-grow">
          <p className="text-[8px] sm:text-[11px] text-gray-500 font-semibold uppercase tracking-widest mb-3 sm:mb-4">
            This Certificate Is Proudly Presented To
          </p>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl text-[#0F172A] italic font-bold border-b-2 border-gray-300 inline-block px-6 sm:px-12 pb-1 sm:pb-2 mb-3 sm:mb-4`}>
            {studentName}
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed max-w-[280px] sm:max-w-lg mx-auto mt-2 sm:mt-4 font-medium">
            Was an active Participant at the NIT Virtual {programType === 'internship' ? 'Internship' : 'Skill Course'} Program in <strong className="text-[#0F172A] font-bold">{programName}</strong>. We highly appreciate your efforts taken and wish you all the best for the future.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto pt-2 relative z-10">
          <div className="text-center w-20 sm:w-32">
            <div className="font-serif italic text-xl sm:text-3xl text-gray-800 -mb-1 opacity-90">
              A. Kumar
            </div>
            <div className="border-t border-gray-400 pt-1.5">
              <p className="text-[6px] sm:text-[9px] font-bold text-gray-700 uppercase tracking-wider">CEO & Founder</p>
            </div>
          </div>

          <div className="text-center w-20 sm:w-32 mb-1">
            <p className="font-bold text-gray-900 text-[10px] sm:text-xs mb-1.5">{issueDate}</p>
            <div className="border-t border-gray-400 pt-1.5">
              <p className="text-[6px] sm:text-[9px] font-bold text-gray-700 uppercase tracking-wider">Date of Issue</p>
            </div>
          </div>

          <div className="w-14 sm:w-20 text-center flex flex-col items-center justify-center opacity-90">
            <Image
              src="/images/govt_sign.webp"
              alt="Official Government Seal"
              width={50}
              height={50}
              className="object-contain mb-1 w-8 h-8 sm:w-[50px] sm:h-[50px]"
              priority
            />
            <p className="text-[5px] sm:text-[7px] font-bold uppercase tracking-widest text-gray-800 leading-tight">Govt. Approved</p>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';
