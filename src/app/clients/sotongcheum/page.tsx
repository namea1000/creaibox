import React from "react";
import HeroSection from "./components/HeroSection";
import BusinessSection from "./components/BusinessSection";
import RentalSection from "./components/RentalSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactForm from "./components/ContactForm";

export default function SotongcheumLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Business Section */}
      <BusinessSection />

      {/* 3. System Rental Section */}
      <RentalSection />

      {/* 4. Portfolio Section */}
      <PortfolioSection />

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 bg-slate-50/50 scroll-mt-20 border-t border-slate-100/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
