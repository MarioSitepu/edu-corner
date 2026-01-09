"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF5F5]">
      {/* Header */}
      <header className="px-6 py-5">
        <div className="flex items-center gap-2.5">
          {/* Graduation Cap Icon - Pink */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#FF69B4]"
          >
            <path
              d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-xl font-semibold text-[#2D2D2D]">KKN T Margo Lestari</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-16 max-w-7xl">
        {/* Dashboard Tag - Light Green Rectangle */}
        <div className="flex justify-center mb-5">
          <div className="bg-[#B8E6B8] px-4 py-1.5 rounded-md">
            <span className="text-xs font-semibold text-[#2D2D2D] tracking-wide">DASHBOARD CITA-CITA SISWA</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-7">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] mb-4 leading-tight px-4">
            Di mana{" "}
            <span className="relative inline-block">
              mimpi
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-[#FFB6C1] opacity-80 -z-10"></span>
            </span>{" "}
            dimulai.
          </h2>
          <p className="text-base md:text-lg text-[#4A4A4A] max-w-3xl mx-auto leading-relaxed mt-4 px-4">
            Arsipkan kenangan, bangun motivasi, dan kejar cita-citamu dengan cara yang menyenangkan bersama kami.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-10 px-4">
          {/* Pink Button - Mulai Kuis */}
          <Link href="/kuis" className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2.5 text-base transition-all shadow-md hover:shadow-lg min-w-[220px] justify-center">
            <svg
              width="20"
              height="20"
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
          <button className="bg-[#B8E6B8] hover:bg-[#A8D8A8] text-[#2D2D2D] font-semibold px-8 py-4 rounded-lg flex items-center gap-2.5 text-base transition-all shadow-md hover:shadow-lg min-w-[220px] justify-center">
            <svg
              width="20"
              height="20"
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
        <div className="relative mb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Left Card - Target Jadi Dokter */}
              <div className="relative lg:mt-12">
                <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-[220px] mx-auto lg:mx-0">
                  <div className="flex items-center gap-3">
                    {/* Pink Rocket Icon */}
                    <div className="bg-[#FFB6C1] p-2.5 rounded-lg shrink-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#FF69B4]"
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
                    <div>
                      <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wide mb-0.5">TARGET</p>
                      <p className="text-sm font-bold text-[#2D2D2D]">Jadi Dokter</p>
                    </div>
                  </div>
                </div>
                {/* Yellow Star Icon Below Left Card */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 lg:left-8">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-400"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Center Placeholder Block */}
              <div className="relative flex flex-col items-center order-first lg:order-0">
                {/* Semangat Tag Above - Speech Bubble Style */}
                <div className="bg-[#B8E6B8] px-3.5 py-1.5 rounded-full mb-2.5 relative">
                  <span className="text-xs font-semibold text-[#2D2D2D]">Semangat!</span>
                </div>
                {/* Large White Block */}
                <div className="bg-white rounded-xl shadow-md w-full max-w-md h-72 flex items-center justify-center">
                  <div className="text-gray-200 text-center">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto opacity-30"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Card - Achievement Juara Kelas */}
              <div className="relative lg:mt-12">
                <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-[220px] mx-auto lg:ml-auto lg:mr-0">
                  <div className="flex items-center gap-3">
                    {/* Light Green Trophy Icon */}
                    <div className="bg-[#B8E6B8] p-2.5 rounded-lg shrink-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#4CAF50]"
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
                    <div>
                      <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wide mb-0.5">PENCAPAIAN</p>
                      <p className="text-sm font-bold text-[#2D2D2D]">Juara Kelas</p>
                    </div>
                  </div>
                </div>
                {/* Light Green Book Icon Below Right Card */}
                <div className="absolute -bottom-5 right-1/2 transform translate-x-1/2 lg:right-8 lg:translate-x-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#B8E6B8]"
                  >
                    <path
                      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="currentColor"
                    />
                    <path
                      d="M9 7H15M9 10H15M9 13H12"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-[#6B6B6B]">
        <p className="text-xs">© 2024 KKN T Margo Lestari. Dashboard Cita-Cita Siswa.</p>
      </footer>
    </div>
  );
}
