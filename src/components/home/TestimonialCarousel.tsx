"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FiStar } from "react-icons/fi";
import { Testimonial } from "@/types";
import 'swiper/css';
import 'swiper/css/pagination';

export function TestimonialCarousel({ initialTestimonials = [] }: { initialTestimonials?: Testimonial[] }) {

  return (
    <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full overflow-hidden">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-8 md:mb-10 transition-colors">What Our Interns Say</h3>
      
      {initialTestimonials.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 30 } }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12" 
        >
          {initialTestimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white dark:bg-[#111C3A] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-grab active:cursor-grabbing transition-colors duration-300 h-full flex flex-col">
                <div className="flex text-[#FBC02D] mb-4">
                  <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                </div>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 italic transition-colors flex-grow">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <h5 className="font-bold text-[#0F172A] dark:text-white transition-colors">{testimonial.name}</h5>
                  <span className="text-xs md:text-sm text-[#1E56A0] dark:text-blue-400 transition-colors">{testimonial.role}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center text-gray-500 py-10">Check back later for student experiences.</div>
      )}
    </section>
  );
}
