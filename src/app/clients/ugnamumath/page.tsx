import React from "react";
import HeroSection from "./components/HeroSection";
import AcademyIntro from "./components/AcademyIntro";
import Curriculum from "./components/Curriculum";
import Achievements from "./components/Achievements";
import ConsultationForm from "./components/ConsultationForm";

export default function UgnamumathLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Branches Info Section */}
      <AcademyIntro />

      {/* 3. Curriculum Section */}
      <Curriculum />

      {/* 4. Achievements Section */}
      <Achievements />

      {/* 5. Consultation Section */}
      <section id="contact" className="py-24 bg-slate-50/50 scroll-mt-20 border-t border-slate-100/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ConsultationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
