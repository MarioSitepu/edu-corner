"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import logoWebp from "./logo.webp";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';
  
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EduCorner",
    "alternateName": ["EduCorner: SahabatMimpi", "SahabatMimpi", "edu corner", "educorner"],
    "url": baseUrl,
    "description": "EduCorner adalah platform interaktif terbaik untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. EduCorner menyediakan kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap.",
    "inLanguage": "id-ID",
    "keywords": "edu corner, educorner, edu corner indonesia, edu corner platform, edu corner cita-cita",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/kuis?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EduCorner",
    "alternateName": ["EduCorner: SahabatMimpi", "SahabatMimpi", "edu corner", "educorner"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.webp`,
      "width": 512,
      "height": 512
    },
    "image": `${baseUrl}/logo.webp`,
    "description": "Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap",
    "foundingOrganization": {
      "@type": "Organization",
      "name": "KKN T Margo Lestari"
    },
    "sameAs": [
      baseUrl
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "educorner.my.id@gmail.com",
      "availableLanguage": ["Indonesian"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    },
    "knowsAbout": [
      "Career Guidance",
      "Educational Assessment",
      "Student Counseling",
      "Career Exploration"
    ]
  };

  const educationalToolStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EduCorner: SahabatMimpi",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "Career Guidance Application",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "releaseNotes": "Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "url": baseUrl
    },
    "description": "Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis dan dashboard cita-cita. Gratis dan mudah digunakan untuk siswa SD, SMP, dan SMA di Indonesia.",
    "inLanguage": "id-ID",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Student"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Kuis Cita-Cita Interaktif",
      "Dashboard Cita-Cita Siswa",
      "Penjelasan Profesi Lengkap",
      "Riwayat Hasil Tes",
      "Rekomendasi Profesi Personal"
    ],
    "screenshot": `${baseUrl}/logo.webp`,
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": `${baseUrl}/kuis`
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": baseUrl
      }
    ]
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apa itu EduCorner: SahabatMimpi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduCorner: SahabatMimpi adalah platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap. Platform ini dibuat oleh KKN T Margo Lestari untuk membantu siswa SD, SMP, dan SMA di Indonesia."
        }
      },
      {
        "@type": "Question",
        "name": "Bagaimana cara menggunakan kuis cita-cita?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Untuk menggunakan kuis cita-cita, kunjungi halaman Kuis, masukkan nama dan kelas Anda, lalu jawab pertanyaan-pertanyaan yang diberikan. Setelah selesai, Anda akan mendapatkan rekomendasi profesi yang sesuai dengan kepribadian dan minat Anda."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah platform ini gratis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya, EduCorner: SahabatMimpi sepenuhnya gratis untuk digunakan oleh semua siswa di Indonesia. Tidak ada biaya tersembunyi atau langganan berbayar."
        }
      },
      {
        "@type": "Question",
        "name": "Untuk siapa platform ini ditujukan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Platform ini ditujukan untuk siswa SD, SMP, dan SMA di Indonesia yang ingin menemukan dan mengembangkan cita-cita mereka. Platform ini juga dapat digunakan oleh guru, orang tua, dan konselor untuk membantu siswa dalam proses pengembangan karir."
        }
      },
      {
        "@type": "Question",
        "name": "Bagaimana cara melihat riwayat hasil tes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anda dapat melihat riwayat hasil tes dengan mengunjungi halaman History. Di sana Anda akan menemukan semua hasil kuis yang telah Anda ikuti sebelumnya beserta penjelasan profesi yang telah Anda lihat."
        }
      }
    ]
  };

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cara Menggunakan Kuis Cita-Cita di EduCorner: SahabatMimpi",
    "description": "Panduan langkah demi langkah untuk menggunakan kuis cita-cita dan menemukan profesi yang sesuai dengan Anda",
    "image": `${baseUrl}/logo.webp`,
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "IDR",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Masukkan Data Diri",
        "text": "Buka halaman Kuis dan masukkan nama lengkap serta kelas Anda. Pastikan data yang dimasukkan akurat.",
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.webp`,
          "width": 1200,
          "height": 630
        },
        "url": `${baseUrl}/kuis`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Jawab Pertanyaan",
        "text": "Jawab semua pertanyaan kuis dengan jujur sesuai dengan kepribadian dan minat Anda. Tidak ada jawaban benar atau salah.",
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.webp`,
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Lihat Hasil",
        "text": "Setelah selesai, lihat hasil rekomendasi profesi yang sesuai dengan Anda. Hasil akan menampilkan profesi yang cocok dengan kepribadian dan minat Anda.",
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.webp`,
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Baca Penjelasan Profesi",
        "text": "Baca penjelasan lengkap tentang profesi yang direkomendasikan untuk memahami lebih dalam tentang karir tersebut.",
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.webp`,
          "width": 1200,
          "height": 630
        }
      }
    ]
  };

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Career Guidance Service",
    "name": "EduCorner - Platform Cita-Cita Siswa",
    "provider": {
      "@type": "Organization",
      "name": "EduCorner",
      "alternateName": "edu corner"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Layanan EduCorner",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kuis Cita-Cita",
            "description": "Kuis interaktif untuk menemukan profesi yang sesuai"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Dashboard Cita-Cita",
            "description": "Dashboard untuk melacak perkembangan cita-cita siswa"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Penjelasan Profesi",
            "description": "Penjelasan lengkap tentang berbagai profesi"
          }
        }
      ]
    }
  };

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Fitur-Fitur EduCorner: SahabatMimpi",
    "description": "Daftar fitur utama yang tersedia di platform EduCorner: SahabatMimpi",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Kuis Cita-Cita Interaktif",
        "description": "Ikuti kuis untuk menemukan profesi yang sesuai dengan kepribadian dan minat Anda"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dashboard Cita-Cita",
        "description": "Lihat dan kelola riwayat hasil tes cita-cita Anda"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Penjelasan Profesi Lengkap",
        "description": "Pelajari lebih dalam tentang berbagai profesi yang direkomendasikan"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Rekomendasi Personal",
        "description": "Dapatkan rekomendasi profesi yang disesuaikan dengan hasil kuis Anda"
      }
    ]
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Eksplorasi Cita-Cita dan Karir dengan EduCorner",
    "description": "Kursus interaktif EduCorner untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui platform edu corner",
    "provider": {
      "@type": "Organization",
      "name": "EduCorner",
      "alternateName": "edu corner",
      "sameAs": baseUrl
    },
    "inLanguage": "id-ID",
    "courseCode": "EC-CAREER-001",
    "educationalLevel": "Elementary, Middle School, High School",
    "teaches": "Career exploration, Self-discovery, Professional development",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    }
  };
  const videoRef = useRef<HTMLDivElement>(null);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={educationalToolStructuredData} />
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={faqStructuredData} />
      <StructuredData data={howToStructuredData} />
      <StructuredData data={serviceStructuredData} />
      <StructuredData data={itemListStructuredData} />
      <StructuredData data={courseStructuredData} />
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[#FFE4E9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Fun Floating Shapes */}
        <div className="absolute top-1/4 left-[5%] w-16 h-16 bg-purple-300/30 rounded-lg rotate-12 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-[10%] w-12 h-12 bg-yellow-300/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-[15%] w-20 h-20 bg-green-300/30 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
        <div className="absolute top-[60%] right-[5%] w-14 h-14 bg-pink-300/35 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        
        {/* Star shapes */}
        <div className="absolute top-[15%] right-[20%] text-4xl opacity-20 animate-pulse" style={{ animationDuration: '2s' }} suppressHydrationWarning>⭐</div>
        <div className="absolute bottom-[20%] right-[15%] text-3xl opacity-20 animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.5s' }} suppressHydrationWarning>✨</div>
        <div className="absolute top-[45%] left-[8%] text-3xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} suppressHydrationWarning>🌟</div>
      </div>

      {/* Header - Nav dengan backdrop blur */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-6 md:px-10 lg:px-16 py-2 md:py-3 animate-slide-in-left shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo WebP dengan efek glow */}
          <div 
            className="p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3" 
            style={{ 
              boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
            }}
          >
            <Image
              src={logoWebp}
              alt="Logo EduCorner: SahabatMimpi"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              EduCorner: SahabatMimpi
            </h1>
            <p className="text-xs sm:text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Temukan potensi diri dan wujudkan mimpi langkah demi langkah.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-12 sm:pb-16 md:pb-20 pt-6 sm:pt-8 md:pt-10 max-w-[1400px] relative z-10">
        {/* Dashboard Tag - Green dengan background dan border */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 animate-fade-in">
          <div 
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 209, 41, 0.15) 0%, rgba(167, 209, 41, 0.1) 100%)',
              border: '1.5px solid rgba(167, 209, 41, 0.3)',
              boxShadow: '0px 4px 15px -5px rgba(167, 209, 41, 0.3)'
            }}
          >
            <span 
              className="text-sm sm:text-base md:text-lg font-bold text-[#A7D129] uppercase tracking-wide flex items-center gap-2" 
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.36em' }}
            >
              <span className="w-2 h-2 bg-[#A7D129] rounded-full animate-pulse"></span>
              EduCorner: SahabatMimpi
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-5 sm:mb-6 md:mb-7 animate-slide-in-right">
          <h1 
            className="font-bold text-[#111827] mb-3 sm:mb-4 leading-[1.01] px-2 sm:px-4"
            style={{
              fontSize: 'clamp(40px, 10vw, 72px)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-2.5%',
              lineHeight: '1.01em',
              textShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            Di mana{" "}
            <span className="relative inline-block">
              <span className="relative z-10">mimpi</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 sm:h-4 md:h-5 bg-gradient-to-r from-[#FFB6C1] via-[#FFC0CB] to-[#FFB6C1] opacity-70 -z-10 rounded-sm transform rotate-[-1deg]"></span>
            </span>{" "}
            dimulai.
          </h1>
          <p 
            className="text-[#6B7280] max-w-full sm:max-w-[600px] md:max-w-[672px] mx-auto leading-[1.53] mt-3 sm:mt-4 px-2 sm:px-4 text-base sm:text-lg md:text-xl font-medium"
            style={{
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.53em'
            }}
          >
            Yuk, mulai perjalananmu dengan mengenali diri, menumbuhkan semangat, dan melangkah meraih mimpi dengan cara yang seru.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center mb-12 sm:mb-14 md:mb-16 mt-6 sm:mt-8 md:mt-10 px-2 sm:px-4 animate-fade-in">
          {/* Pink Button - Mulai Kuis */}
          <Link 
            href="/kuis" 
            className="group relative bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white font-bold px-8 sm:px-10 py-5 sm:py-6 rounded-2xl flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto sm:min-w-[320px] md:min-w-[380px] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-100 overflow-hidden"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              lineHeight: '1.4em',
              boxShadow: '0px 8px 20px -5px rgba(255, 77, 109, 0.4), 0px 0px 0px 1px rgba(255, 77, 109, 0.1)'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <svg
              width="18"
              height="18"
              className="sm:w-5 sm:h-5 text-white relative z-10 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5V19L19 12L8 5Z"
                fill="currentColor"
              />
            </svg>
            <span className="relative z-10">Mulai Kuis</span>
          </Link>
        </div>

        {/* Cards Section - Scattered Layout */}
        <div className="relative mb-12 sm:mb-16 md:mb-20 px-2 sm:px-4">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-6 md:gap-8 items-start">
              {/* Left Card - Target Jadi Dokter */}
              <div className="relative md:mt-32 lg:mt-40 animate-slide-in-left">
                <div className="flex flex-col items-center md:items-end relative">
                  <div 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-5 w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] border relative z-10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      borderColor: 'rgba(255, 240, 243, 0.5)',
                      boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(255, 77, 109, 0.05)'
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Pink Rocket Icon */}
                      <div className="bg-[#FCE7F3] p-2 sm:p-2.5 rounded-lg shrink-0">
                        <svg
                          width="20"
                          height="20"
                          className="sm:w-6 sm:h-6 text-[#FF4D6D]"
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
                          className="text-[9px] sm:text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-0.5"
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
              <div ref={videoRef} className="relative flex flex-col items-center order-first md:order-0 animate-scale-in w-full">
                {/* YouTube Video Embed dengan styling lebih baik */}
                <div 
                  className="w-full border-4 border-white/90 rounded-3xl overflow-hidden bg-black transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.3), 0px 0px 0px 1px rgba(255, 255, 255, 0.1)',
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
                      suppressHydrationWarning
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Right Card - Achievement Juara Kelas */}
              <div className="relative md:mt-6 lg:mt-10 animate-slide-in-right">
                <div className="flex flex-col items-center md:items-start relative">
                  <div 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-5 w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] border relative z-10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      borderColor: 'rgba(255, 240, 243, 0.5)',
                      boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(255, 77, 109, 0.05)'
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Light Green Trophy Icon */}
                      <div className="bg-[#DCFCE7] p-2 sm:p-2.5 rounded-lg shrink-0">
                        <svg
                          width="20"
                          height="20"
                          className="sm:w-6 sm:h-6 text-[#A7D129]"
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
                          className="text-[9px] sm:text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-0.5"
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
        className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-10 backdrop-blur-sm bg-white/80"
        style={{
          borderColor: 'rgba(243, 244, 246, 0.5)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <p 
          className="text-xs sm:text-sm text-[#666666] font-medium" 
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
        </p>
      </footer>
      </div>
    </>
  );
}
