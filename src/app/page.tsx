"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import logoWebp from "./logo.webp";

export default function Home() {
  const videoRef = useRef<HTMLDivElement>(null);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3]">
      {/* Header - Nav dengan backdrop blur */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-custom border-b border-[#FCE7F3] px-4 sm:px-8 md:px-16 lg:px-[112px] py-4 md:py-5 animate-slide-in-left">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo WebP */}
          <div className="p-2 sm:p-2.5 rounded-lg" style={{ boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.1)' }}>
            <Image
              src={logoWebp}
              alt="Logo Edu-Corner"
              width={40}
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              priority
            />
          </div>
          <h1 
            className="text-base sm:text-lg md:text-[19.7px] font-bold text-[#FF4D6D] leading-[1.42] tracking-[-0.02em]" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            KKN T Margo Lestari
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 pt-6 sm:pt-8 md:pt-10 max-w-[896px]">
        {/* Dashboard Tag - Green dengan background dan border */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 animate-fade-in">
          <div 
            className="px-2.5 sm:px-3 py-1 rounded-full"
            style={{
              background: 'rgba(167, 209, 41, 0.1)',
              border: '1px solid rgba(167, 209, 41, 0.2)'
            }}
          >
            <span 
              className="text-[10px] sm:text-[11px] md:text-[11.8px] font-bold text-[#A7D129] uppercase tracking-wide" 
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.36em' }}
            >
              Dashboard Cita-Cita Siswa
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-5 sm:mb-6 md:mb-7 animate-slide-in-right">
          <h2 
            className="font-bold text-[#111827] mb-3 sm:mb-4 leading-[1.01] px-2 sm:px-4"
            style={{
              fontSize: 'clamp(32px, 8vw, 59.4px)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-2.5%',
              lineHeight: '1.01em'
            }}
          >
            Di mana{" "}
            <span className="relative inline-block">
              mimpi
              <span className="absolute bottom-0 left-0 right-0 h-2 sm:h-2.5 md:h-3 bg-[#FFB6C1] opacity-80 -z-10"></span>
            </span>{" "}
            dimulai.
          </h2>
          <p 
            className="text-[#6B7280] max-w-full sm:max-w-[600px] md:max-w-[672px] mx-auto leading-[1.53] mt-3 sm:mt-4 px-2 sm:px-4 text-sm sm:text-[13.1px]"
            style={{
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.53em'
            }}
          >
            Arsipkan kenangan, bangun motivasi, dan kejar cita-citamu dengan cara yang menyenangkan bersama kami.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 sm:mb-14 md:mb-16 mt-6 sm:mt-8 md:mt-10 px-2 sm:px-4 animate-fade-in">
          {/* Pink Button - Mulai Kuis */}
          <Link 
            href="/kuis" 
            className="bg-[#FF4D6D] text-white font-bold px-6 sm:px-8 py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto sm:min-w-[280px] md:min-w-[328px] transition-all transform hover:scale-105 active:scale-100"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 2.5vw, 11.4px)',
              lineHeight: '1.4em',
              boxShadow: '0px 4px 6px -4px rgba(236, 72, 153, 0.3), 0px 10px 15px -3px rgba(236, 72, 153, 0.3)'
            }}
          >
            <svg
              width="18"
              height="18"
              className="sm:w-5 sm:h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5V19L19 12L8 5Z"
                fill="currentColor"
              />
            </svg>
            Mulai Kuis
          </Link>

          {/* Light Green Button - Tonton Video Edukasi */}
          <button 
            onClick={scrollToVideo}
            className="bg-[#DCFCE7] text-[#374151] font-bold px-6 sm:px-8 py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto sm:min-w-[280px] md:min-w-[328px] transition-all transform hover:scale-105 active:scale-100 border-2 cursor-pointer"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 2.5vw, 11.4px)',
              lineHeight: '1.4em',
              borderColor: 'rgba(167, 209, 41, 0.2)',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
            }}
          >
            <svg
              width="18"
              height="18"
              className="sm:w-5 sm:h-5 text-[#374151]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5V19L19 12L8 5Z"
                fill="currentColor"
              />
            </svg>
            Tonton Video Edukasi
          </button>
        </div>

        {/* Cards Section - Scattered Layout */}
        <div className="relative mb-12 sm:mb-16 md:mb-20 px-2 sm:px-4">
          <div className="max-w-[896px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
              {/* Left Card - Target Jadi Dokter */}
              <div className="relative md:mt-12 lg:mt-24 animate-slide-in-left">
                <div className="flex flex-col items-center md:items-start relative">
                  <div 
                    className="bg-white rounded-2xl p-3 sm:p-4 w-full max-w-[200px] sm:max-w-[220px] border relative z-10"
                    style={{
                      borderColor: '#FFF0F3',
                      boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* Pink Rocket Icon */}
                      <div className="bg-[#FCE7F3] p-1.5 sm:p-2 rounded-lg shrink-0">
                        <svg
                          width="18"
                          height="18"
                          className="sm:w-5 sm:h-5 text-[#FF4D6D]"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 16.5C4.5 16.5 6 18 8 18C9.5 18 10.5 16.5 10.5 16.5M4.5 16.5C4.5 16.5 3 15 3 13C3 11 4.5 9.5 4.5 9.5M4.5 16.5L3 18M10.5 16.5C10.5 16.5 12 18 14 18C16 18 17.5 16.5 17.5 16.5M10.5 16.5L12 18M17.5 16.5C17.5 16.5 19 15 19 13C19 11 17.5 9.5 17.5 9.5M17.5 16.5L19 18M12 2L12 9.5M12 2L9 4.5M12 2L15 4.5M12 9.5L9 7M12 9.5L15 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 2L12 9.5M12 2L9 4.5M12 2L15 4.5M12 9.5L9 7M12 9.5L15 7"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-[10px] sm:text-[11px] md:text-[11.8px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-0.5"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          TARGET
                        </p>
                        <p 
                          className="text-xs sm:text-sm font-bold text-[#1F2937] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Jadi Dokter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Video Block */}
              <div ref={videoRef} className="relative flex flex-col items-center order-first md:order-0 animate-scale-in w-full px-2 sm:px-0">
                {/* YouTube Video Embed dengan styling lebih baik */}
                <div 
                  className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] xl:max-w-[900px] border-4 border-white rounded-3xl overflow-hidden bg-black"
                  style={{
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    borderRadius: '24px'
                  }}
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src="https://www.youtube.com/embed/WPPPFqsECz0?rel=0&modestbranding=1&showinfo=0"
                      title="Video Edukasi"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Right Card - Achievement Juara Kelas */}
              <div className="relative md:mt-12 lg:mt-24 animate-slide-in-right">
                <div className="flex flex-col items-center md:items-end relative">
                  <div 
                    className="bg-white rounded-2xl p-3 sm:p-4 w-full max-w-[200px] sm:max-w-[220px] border relative z-10"
                    style={{
                      borderColor: '#FFF0F3',
                      boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* Light Green Trophy Icon */}
                      <div className="bg-[#DCFCE7] p-1.5 sm:p-2 rounded-lg shrink-0">
                        <svg
                          width="18"
                          height="18"
                          className="sm:w-5 sm:h-5 text-[#A7D129]"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V9Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                          <path
                            d="M7 9L7 7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 18V22M9 22H15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 12V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-[10px] sm:text-[11px] md:text-[11.8px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-0.5"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          PENCAPAIAN
                        </p>
                        <p 
                          className="text-xs sm:text-sm font-bold text-[#1F2937] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Juara Kelas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="text-center py-6 sm:py-8 border-t px-4"
        style={{
          borderColor: '#F3F4F6',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <p 
          className="text-xs sm:text-[12px] md:text-[13.1px] text-[#666666]" 
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          © 2024 KKN T Margo Lestari. Dashboard Cita-Cita Siswa.
        </p>
      </footer>
    </div>
  );
}
