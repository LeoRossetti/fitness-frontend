"use client";

import Link from 'next/link';
import { Dumbbell, Users, Calendar, MessageCircle, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function HomePage() {
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const benefitsSection = document.getElementById('benefits-section');
      if (benefitsSection) {
        const benefitsTop = benefitsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Показываем стрелочку, если верхняя часть секции Benefits видна в окне
        setIsArrowVisible(benefitsTop <= windowHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      {/* Main Content */}
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#FFFF] to-[#dacdf0] py-16" id='hero-section'>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-[#7c3aed] mb-4 leading-tight">
              Transform your <br /> Training Business
            </h1>
            <p className="text-lg text-[#6B7280] mb-8">
              The all-in-one platform for personal trainers to manage clients, schedule sessions, and track progress with ease.
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1F2A44] mb-8">See TrainerHub in Action</h2>
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-gray-200 rounded-lg shadow-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">VIDEO</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-[#F7F7F7]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1F2A44] text-center mb-12">Everything You Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Client Management</h3>
                <p className="text-[#6B7280]">
                  Organize client data, track progress, manage subscriptions effortlessly.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Workout Builder</h3>
                <p className="text-[#6B7280]">
                  Create customized workout plans with intuitive drag and drop interface.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Smart Scheduling</h3>
                <p className="text-[#6B7280]">
                  Effortlessly schedule sessions, reduce bookings, and reschedule conflicts.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Progress Tracking</h3>
                <p className="text-[#6B7280]">
                  Track client progress with detailed analytics and beautiful charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16" id='benefits-section'>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1F2A44] text-center mb-12">Why Choose TrainerHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Save Time</h3>
                <p className="text-[#6B7280]">
                  Automate repetitive tasks and focus on what matters: your clients.
                </p>
              </div>
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Grow Your Business</h3>
                <p className="text-[#6B7280]">
                  Scale your training business with preference tools.
                </p>
              </div>
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Delight Clients</h3>
                <p className="text-[#6B7280]">
                  Provide a premium experience with professional features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Our Users Say Section */}
        <section className="py-16 bg-[#F7F7F7]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1F2A44] text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#7c3aed]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-[#7c3aed]" />
                  </div>
                </div>
                <p className="text-[#6B7280] text-center mb-4">
                &quot;TrainerHub transformed how I manage my fitness business. The scheduling and progress tracking features are game-changers!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">SJ</span>
                  <p className="text-sm text-[#6B7280]">Sarah Johnson, Personal Trainer, NYC</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#7c3aed]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-[#7c3aed]" />
                  </div>
                </div>
                <p className="text-[#6B7280] text-center mb-4">
                &quot;The workout builder is intuitive and saves me hours of planning time. My clients love the progress tracking!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">MR</span>
                  <p className="text-sm text-[#6B7280]">Mike Rodriguez, Fitness Coach, LA</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#7c3aed]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-[#7c3aed]" />
                  </div>
                </div>
                <p className="text-[#6B7280] text-center mb-4">
                &quot;Since using TrainerHub, I have doubled my client base. The automated scheduling is a massive time-saver!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">EW</span>
                  <p className="text-sm text-[#6B7280]">Emma Wilson, Health Coach, Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured In Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold text-[#1F2A44] text-center mb-8">Featured In</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center gap-2 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[#2563EB] font-medium">Tech Weekly</span>
              </div>
              <p className="text-sm text-[#6B7280] text-center">Revolutionary fitness platform</p>
            </div>
            <div className="flex flex-col items-center gap-2 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[#2563EB] font-medium">Fitness Today</span>
              </div>
              <p className="text-sm text-[#6B7280] text-center">Best trainer platform of 2025</p>
            </div>
            <div className="flex flex-col items-center gap-2 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[#2563EB] font-medium">Digital Trends</span>
              </div>
              <p className="text-sm text-[#6B7280] text-center">Leading the future of fitness</p>
            </div>
          </div>
        </section>

        {/* Testimonial Section (Sarah Johnson) */}
        <section className="py-16 bg-white text-[#1F2A44]">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#7c3aed]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg italic">&quot;TrainerHub transformed how I manage my fitness business&quot;</p>
              <p className="text-sm mt-2">Sarah Johnson, Personal Trainer, NYC</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#7c3aed] text-white py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform YOUR Training Experience?</h2>
            <p className="text-lg mb-8">Join TrainerHub today as a trainer or client and reach your fitness goals.</p>
            <Link href="/signup">
              <button className="bg-white text-[#7c3aed] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Sign Up Now
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F7F7F7] py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} TrainerHub. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Arrow */} {/* Стрелочка должна будет пропасть после нажатия и выполнения подъёма */}
      {isArrowVisible && (
        <button
          onClick={scrollToHero}
          className="fixed bottom-8 right-8 p-3 bg-[#7c3aed] text-white rounded-full shadow-lg hover:bg-[#3A0066] transition-all duration-300 ease-in-out transform hover:scale-110 z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
}