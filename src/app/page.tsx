"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto bg-white">
        <div className="flex items-center gap-2">
          <span className="text-[#4B0082] text-xl font-bold">TrainerHub</span>
        </div>
        <Link href="/clients">
          <button className="bg-[#4B0082] text-white px-6 py-2 rounded-lg hover:bg-[#3A0066] transition-colors cursor-pointer">
            Go to Dashboard
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="bg-white">

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-[#F7F7F7] py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-[#4B0082] mb-4">Transform Your Training Business</h1>
            <p className="text-lg text-[#6B7280] mb-8">
              The all-in-one platform for personal trainers to manage clients, schedule sessions, and track progress with ease.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/clients">
                <button className="bg-[#4B0082] text-white px-6 py-3 rounded-lg hover:bg-[#3A0066] transition-colors">
                  Get Started Now
                </button>
              </Link>
              <button className="border border-[#4B0082] text-[#4B0082] px-6 py-3 rounded-lg hover:bg-[#4B0082] hover:text-white transition-colors">
                Watch Demo
              </button>
            </div>
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
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Client Management</h3>
                <p className="text-[#6B7280]">
                  Organize client data, track progress, manage subscriptions effortlessly.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Workout Builder</h3>
                <p className="text-[#6B7280]">
                  Create customized workout plans with intuitive drag and drop interface.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Smart Scheduling</h3>
                <p className="text-[#6B7280]">
                  Effortlessly schedule sessions, reduce bookings, and reschedule conflicts.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-[#E6E6FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
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
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1F2A44] text-center mb-12">Why Choose TrainerHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Save Time</h3>
                <p className="text-[#6B7280]">
                  Automate repetitive tasks and focus on what matters: your clients.
                </p>
              </div>
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Grow Your Business</h3>
                <p className="text-[#6B7280]">
                  Scale your training business with preference tools.
                </p>
              </div>
              <div className="bg-[#E6E6FA] rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4B0082] text-xl"></span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A44] mb-2">Delight Clients</h3>
                <p className="text-[#6B7280]">
                  Provide a premium experience with professional features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-[#F7F7F7]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1F2A44] text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-[#6B7280] text-center">
                  TrainerHub transformed how I manage my fitness business. The scheduling and progress tracking saves me hours of planning.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-[#6B7280] text-center">
                  The workout builder is a game-changer for my client base. The automated reminders are a bonus!
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-[#6B7280] text-center">
                  Since using TrainerHub, I have doubled my client list. The platform makes managing sessions seamless.
                </p>
              </div>
            </div>
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
    </>
  );
}