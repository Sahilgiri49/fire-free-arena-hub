
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TournamentSection from "@/components/TournamentSection";
import LiveStreamSection from "@/components/LiveStreamSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import NewsSection from "@/components/NewsSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TournamentSection />
        <LiveStreamSection />
        <LeaderboardSection />
        <NewsSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
