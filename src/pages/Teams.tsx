import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Users, Trophy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import CompeteSection from "@/components/CompeteSection";

interface TeamCardProps {
  id: string;
  name: string;
  logo: string;
  players: number;
  wins: number;
  rank: number;
  region: string;
}

const TeamCard = ({ id, name, logo, players, wins, rank, region }: TeamCardProps) => {
  const navigate = useNavigate();

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
        onClick={() => navigate(`/teams/${id}`)}
      >
        View Team
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreateTeam = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/teams/create");
  };

  const handleJoinTeam = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/teams/join");
  };

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setTeams(data || []);
      setIsLoading(false);
    };
    fetchTeams();
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : (
              teams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  name={team.name}
                  logo={team.logo_url}
                  players={1} // Placeholder, can be replaced with real count
                  wins={0}    // Placeholder, can be replaced with real wins
                  rank={index + 1}
                  region={team.region}
                />
              ))
            )}
          </div>
          
          <div className="mt-12 flex justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gaming-purple hover:bg-gaming-purple-bright text-white"
              onClick={handleCreateTeam}
            >
              <Users className="mr-2 h-5 w-5" />
              Create Team
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-gaming-purple text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
              onClick={handleJoinTeam}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Join Team
            </Button>
          </div>
        </div>

        {/* Add CompeteSection */}
        <CompeteSection />
      </main>
      <Footer />
    </div>
  );
};

export default Teams;
