import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CertificateShowcase } from "@/components/home/CertificateShowcase";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";

import pool from '@/lib/db';

async function fetchTestimonials() {
  try {
    const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    return rows as any[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export default async function Home() {
  const testimonials = await fetchTestimonials();

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative z-10 overflow-hidden pb-2 transition-colors duration-300">
      <HeroSection />
      <StatsSection />
      <CertificateShowcase />
      <TestimonialCarousel initialTestimonials={testimonials} />
    </div>
  );
}