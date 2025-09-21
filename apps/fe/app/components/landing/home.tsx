'use client';

import Collaboration from "./collabration";
import CTA from "./cta";
import Features from "./features";
import Footer from "./footer";
import Hero from "./hero";
import Navbar from "./navbar";
import Security from "./security";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Collaboration />
      <Security />
      <CTA />
      <Footer />
    </div>
  );
}