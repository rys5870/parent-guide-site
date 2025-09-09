"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

interface Testimonial {
  _id: string;
  type?: "text" | "image";
  quote?: string;
  image?: string;
  name: string;
  details?: string;
  show: boolean;
}

export default function ParentTestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    axios
      .get<Testimonial[]>("/api/testimonial")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error("שגיאה בשליפת תגובות:", err));
  }, []);

  return (
    <div className="relative py-16 bg-[#f9f9f9] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f9c5d1" />
              <stop offset="100%" stopColor="#ffd3a9" />
            </linearGradient>
          </defs>
          <path
            fill="url(#myGradient)"
            d="M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,160C672,181,768,235,864,240C960,245,1056,203,1152,176C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          תגובות שמחממות את הלב♥️
        </h3>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={testimonials.length > 2}
        >
          {Array.isArray(testimonials) &&
            testimonials.map((t) => (
              <SwiperSlide key={t._id}>
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12 max-w-xl mx-auto flex flex-col items-center">
                  {t.image && (
                    <div className="mb-4 rounded-lg shadow-md max-h-80 w-full relative">
                      <Image
                        src={t.image}
                        alt={`מכתב מ${t.name}`}
                        layout="responsive"
                        width={800}
                        height={600}
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {t.quote && (
                    <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-4">
                      “{t.quote}”
                    </p>
                  )}
                  <div className="text-gray-800 font-bold text-lg">{t.name}</div>
                  {t.details && (
                    <div className="text-sm text-gray-500 mt-1">{t.details}</div>
                  )}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}