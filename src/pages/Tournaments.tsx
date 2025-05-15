
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentCard, { TournamentCardData } from "@/components/TournamentCard";

const Tournaments = () => {
  const tournaments: TournamentCardData[] = [
    {
      title: "Free Fire Pro League Season 5",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "May 25-28, 2025",
      prizePool: "₹100,000",
      entryFee: "₹1,000",
      teamSize: "Squad (4 players)",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 64,
      maxTeams: 128,
    },
    {
      title: "Free Fire Masters Cup",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      date: "June 10-12, 2025",
      prizePool: "₹50,000",
      entryFee: "₹500",
      teamSize: "Squad (4 players)",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 42,
      maxTeams: 64,
    },
    {
      title: "Free Fire Solo Championship",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "May 20, 2025",
      prizePool: "₹25,000",
      entryFee: "₹200",
      teamSize: "Solo",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 85,
      maxTeams: 100,
    },
    {
      title: "Delhi LAN Tournament",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      date: "July 15-16, 2025",
      prizePool: "₹200,000",
      entryFee: "₹2,000",
      teamSize: "Squad (4 players)",
      mode: "Offline",
      status: "Registration Open",
      registeredTeams: 12,
      maxTeams: 32,
    },
    {
      title: "Free Fire Regional Qualifiers",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "June 5-7, 2025",
      prizePool: "₹30,000",
      entryFee: "₹300",
      teamSize: "Squad (4 players)",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 55,
      maxTeams: 128,
    },
    {
      title: "Free Fire Women's Cup",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      date: "June 18-20, 2025",
      prizePool: "₹75,000",
      entryFee: "₹500",
      teamSize: "Squad (4 players)",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 28,
      maxTeams: 64,
    },
    {
      title: "Free Fire Duo Showdown",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "May 30, 2025",
      prizePool: "₹20,000",
      entryFee: "₹250",
      teamSize: "Duo (2 players)",
      mode: "Online",
      status: "Registration Open",
      registeredTeams: 95,
      maxTeams: 128,
    },
    {
      title: "Mumbai Gaming Fest",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      date: "August 5-7, 2025",
      prizePool: "₹150,000",
      entryFee: "₹1,500",
      teamSize: "Squad (4 players)",
      mode: "Offline",
      status: "Registration Open",
      registeredTeams: 10,
      maxTeams: 32,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Tournaments</h1>
            <p className="text-white/70">
              Browse and register for upcoming Free Fire tournaments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tournaments.map((tournament, index) => (
              <TournamentCard 
                key={index} 
                title={tournament.title}
                image={tournament.image}
                date={tournament.date}
                prizePool={tournament.prizePool}
                entryFee={tournament.entryFee}
                teamSize={tournament.teamSize}
                mode={tournament.mode}
                status={tournament.status}
                registeredTeams={tournament.registeredTeams}
                maxTeams={tournament.maxTeams}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tournaments;
