import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TournamentCard from "@/components/TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const MemoTournamentCard = React.memo(TournamentCard);

const TournamentSection = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tables<"tournaments">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);
        
        if (error) {
          throw error;
        }
        
        setTournaments(data || []);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        toast({
          title: "Error",
          description: "Failed to load tournaments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Fallback to mock data if no tournaments from Supabase
  const mockTournaments = [
    {
      title: "Free Fire Pro League Season 5",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "May 25-28, 2025",
      prizePool: "₹100,000",
      entryFee: "₹1,000",
      teamSize: "Squad (4 players)",
      mode: "Online" as "Online" | "Offline" | "Hybrid", // Fix type with assertion
      status: "Registration Open" as "Registration Open" | "Ongoing" | "Completed", // Fix type with assertion
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
      mode: "Online" as "Online" | "Offline" | "Hybrid", // Fix type with assertion
      status: "Registration Open" as "Registration Open" | "Ongoing" | "Completed", // Fix type with assertion
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
      mode: "Online" as "Online" | "Offline" | "Hybrid", // Fix type with assertion
      status: "Registration Open" as "Registration Open" | "Ongoing" | "Completed", // Fix type with assertion
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
      mode: "Offline" as "Online" | "Offline" | "Hybrid", // Fix type with assertion
      status: "Registration Open" as "Registration Open" | "Ongoing" | "Completed", // Fix type with assertion
      registeredTeams: 12,
      maxTeams: 32,
    },
  ];

  const displayTournaments = tournaments.length > 0 ? tournaments : mockTournaments;

  const handleViewAll = () => {
    navigate("/tournaments");
  };

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
          onClick={handleViewAll}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTournaments.map((tournament, index) => (
            <MemoTournamentCard 
              key={tournament.id || index} 
              tournament={tournament as Tables<"tournaments">}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentSection;
