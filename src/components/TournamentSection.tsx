
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TournamentCard from "@/components/TournamentCard";

const TournamentSection = () => {
  const tournaments = [
    {
      title: "Free Fire Pro League Season 5",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "May 25-28, 2025",
      prizePool: "₹100,000",
      entryFee: "₹1,000",
      teamSize: "Squad (4 players)",
      mode: "Online" as const,
      status: "Registration Open" as const,
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
      mode: "Online" as const,
      status: "Registration Open" as const,
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
      mode: "Online" as const,
      status: "Registration Open" as const,
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
      mode: "Offline" as const,
      status: "Registration Open" as const,
      registeredTeams: 12,
      maxTeams: 32,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Upcoming Tournaments
          </h2>
          <p className="text-white/70">
            Register and compete in these exciting tournaments
          </p>
        </div>
        <Button
          variant="outline"
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tournaments.map((tournament, index) => (
          <TournamentCard key={index} {...tournament} />
        ))}
      </div>
    </div>
  );
};

export default TournamentSection;
