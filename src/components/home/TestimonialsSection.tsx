import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              Testimonials
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              What our clients say about us
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-slate-300 hover:border-[#E5B842] hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer text-slate-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-slate-300 hover:border-[#E5B842] hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer text-slate-600"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon */}
                <div className="text-amber-400 mb-3">
                  <Quote className="w-8 h-8 opacity-75" />
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author & Rating */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar_url}
                    alt={item.client_name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/40"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.client_name}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {item.client_role}
                    </div>
                  </div>
                </div>

                {/* 5 Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
