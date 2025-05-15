import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentCard from "@/components/TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import { Tables, RealtimePostgresChangesPayload } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tables<"tournaments">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "hybrid">("all");

  useEffect(() => {
    fetchTournaments();

    // Subscribe to tournament changes
    const subscription = supabase
      .channel('tournaments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournaments'
        },
        (payload: RealtimePostgresChangesPayload<Tables<"tournaments">>) => {
          console.log('Received real-time update:', payload);
          console.log('Current tournaments before update:', tournaments);
          
          if (payload.eventType === 'DELETE') {
            console.log('Handling DELETE event for tournament:', payload.old.id);
            // Remove the deleted tournament
            setTournaments(prev => {
              const updated = prev.filter(t => t.id !== payload.old.id);
              console.log('Tournaments after deletion:', updated);
              return updated;
            });
            toast({
              title: "Tournament Deleted",
              description: "The tournament has been removed",
            });
          } else if (payload.eventType === 'INSERT') {
            // Add the new tournament
            setTournaments(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Update the modified tournament
            setTournaments(prev => 
              prev.map(t => t.id === payload.new.id ? payload.new : t)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching tournaments...');
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log('Fetched tournaments:', data);
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

  const filteredTournaments = filter === "all" 
    ? tournaments 
    : tournaments.filter(t => t.mode.toLowerCase() === filter);

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

          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-gaming-purple" : "border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20"}
            >
              All
            </Button>
            <Button 
              variant={filter === "online" ? "default" : "outline"} 
              onClick={() => setFilter("online")}
              className={filter === "online" ? "bg-gaming-purple" : "border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20"}
            >
              Online
            </Button>
            <Button 
              variant={filter === "offline" ? "default" : "outline"} 
              onClick={() => setFilter("offline")}
              className={filter === "offline" ? "bg-gaming-purple" : "border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20"}
            >
              Offline
            </Button>
            <Button 
              variant={filter === "hybrid" ? "default" : "outline"} 
              onClick={() => setFilter("hybrid")}
              className={filter === "hybrid" ? "bg-gaming-purple" : "border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20"}
            >
              Hybrid
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/70">
              <p className="text-xl">No tournaments available at the moment.</p>
              <p>Check back later for upcoming events!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tournaments;
