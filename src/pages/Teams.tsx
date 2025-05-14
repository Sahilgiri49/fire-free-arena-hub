
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Users, Trophy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  name: string;
  logo: string;
  players: number;
  wins: number;
  rank: number;
  region: string;
}

const TeamCard = ({ name, logo, players, wins, rank, region }: TeamCardProps) => {
  return (
    <div className="gamer-card p-5 hover-scale">
      <div className="flex items-center mb-4">
        <img src={logo} alt={name} className="w-16 h-16 rounded-full object-cover mr-4" />
        <div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-white/70 text-sm">{region}</p>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="text-center">
          <p className="text-white/70 text-xs">Players</p>
          <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
            <Users className="w-3 h-3 text-gaming-purple" />
            {players}
          </div>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-xs">Wins</p>
          <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
            <Trophy className="w-3 h-3 text-gaming-orange" />
            {wins}
          </div>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-xs">Rank</p>
          <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
            <span className={cn(
              "w-5 h-5 rounded-full text-xs flex items-center justify-center",
              rank <= 10 && "bg-gaming-purple text-white",
              rank > 10 && "bg-white/10 text-white/80"
            )}>
              #{rank}
            </span>
          </div>
        </div>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        className="w-full border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white transition-colors"
      >
        View Team
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const Teams = () => {
  const teams = [
    {
      name: "Neon Strikers",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop",
      players: 4,
      wins: 32,
      rank: 1,
      region: "Delhi, India"
    },
    {
      name: "Phoenix Squad",
      logo: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&h=100&fit=crop",
      players: 4,
      wins: 28,
      rank: 2,
      region: "Mumbai, India"
    },
    {
      name: "Team Inferno",
      logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop",
      players: 4,
      wins: 25,
      rank: 3,
      region: "Bangalore, India"
    },
    {
      name: "Ghost Hunters",
      logo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&h=100&fit=crop",
      players: 4,
      wins: 21,
      rank: 4,
      region: "Chennai, India"
    },
    {
      name: "Elite Warriors",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop",
      players: 4,
      wins: 19,
      rank: 5,
      region: "Hyderabad, India"
    },
    {
      name: "Dragon Slayers",
      logo: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&h=100&fit=crop",
      players: 4,
      wins: 18,
      rank: 6,
      region: "Kolkata, India"
    },
    {
      name: "Shadow Wolves",
      logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop",
      players: 4,
      wins: 17,
      rank: 7,
      region: "Pune, India"
    },
    {
      name: "Nova Esports",
      logo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&h=100&fit=crop",
      players: 4,
      wins: 15,
      rank: 8,
      region: "Ahmedabad, India"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Teams</h1>
            <p className="text-white/70">
              Discover top Free Fire teams and their rankings
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="gamer-card p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    className="w-full bg-gaming-dark/50 border border-white/10 rounded-md py-2 px-10 text-white focus:outline-none focus:ring-2 focus:ring-gaming-purple/50"
                  />
                </div>
                <div className="flex gap-4">
                  <select className="bg-gaming-dark/50 border border-white/10 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gaming-purple/50">
                    <option value="">All Regions</option>
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="East">East India</option>
                    <option value="West">West India</option>
                  </select>
                  <select className="bg-gaming-dark/50 border border-white/10 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gaming-purple/50">
                    <option value="rank">Sort by Rank</option>
                    <option value="name">Sort by Name</option>
                    <option value="wins">Sort by Wins</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team, index) => (
              <TeamCard key={index} {...team} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white transition-colors"
            >
              Create Your Team
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teams;
