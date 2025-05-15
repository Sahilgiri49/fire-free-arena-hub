
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Users, Calendar, Trophy, MapPin, Clock, Info } from "lucide-react";

type Tournament = Tables<"tournaments">;

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeams, setRegisteredTeams] = useState(0);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) setTournament(data);

        // Check if user is registered
        if (user) {
          const { data: regData, error: regError } = await supabase
            .from("tournament_registrations")
            .select("*")
            .eq("tournament_id", id)
            .eq("profile_id", user.id);

          if (!regError && regData && regData.length > 0) {
            setIsRegistered(true);
          }
        }

        // Get registered teams count
        const { count, error: countError } = await supabase
          .from("tournament_registrations")
          .select("*", { count: "exact" })
          .eq("tournament_id", id);

        if (!countError) {
          setRegisteredTeams(count || 0);
        }
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        toast({
          title: "Error",
          description: "Failed to load tournament details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournament();
  }, [id, user]);

  const handleJoin = async () => {
    if (!tournament) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to join tournaments",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      // Register the user
      const { error: regError } = await supabase
        .from("tournament_registrations")
        .insert([
          {
            profile_id: user.id,
            tournament_id: tournament.id,
            payment_status: tournament.entry_fee ? "Pending" : "Free",
          }
        ]);
      
      if (regError) {
        throw regError;
      }
      
      setIsRegistered(true);
      setRegisteredTeams(prevCount => prevCount + 1);
      
      toast({
        title: "Registration Successful",
        description: tournament.entry_fee 
          ? "You've been registered! Please complete payment." 
          : "You've been registered for this tournament!",
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format the date to be more readable
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
          <Button onClick={() => navigate("/tournaments")}>Back to Tournaments</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section with Tournament Banner */}
          <div className="relative rounded-lg overflow-hidden mb-8 h-64 md:h-80">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${tournament.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gaming-purple text-white mr-2">
                  {tournament.status}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gaming-purple/70 text-white">
                  {tournament.mode}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">{tournament.title}</h1>
              <p className="text-white/70 mt-2 max-w-2xl">{tournament.description}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tournament Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tournament Details */}
              <div className="gamer-card p-6">
                <h2 className="text-xl font-bold mb-4">Tournament Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">Start Date</p>
                      <p className="font-medium">{formatDate(tournament.start_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">End Date</p>
                      <p className="font-medium">{formatDate(tournament.end_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">Registration Deadline</p>
                      <p className="font-medium">{formatDate(tournament.registration_deadline)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">Mode</p>
                      <p className="font-medium">{tournament.mode}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">Team Size</p>
                      <p className="font-medium">{tournament.team_size}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Trophy className="mr-3 text-gaming-purple h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/70">Prize Pool</p>
                      <p className="font-medium">{tournament.prize_pool || "TBA"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules & Regulations */}
              <div className="gamer-card p-6">
                <h2 className="text-xl font-bold mb-4">Rules & Regulations</h2>
                <div className="prose prose-invert max-w-none">
                  {tournament.rules ? (
                    <div dangerouslySetInnerHTML={{ __html: tournament.rules }} />
                  ) : (
                    <p>No specific rules have been specified for this tournament. Standard gaming rules apply.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Registration */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="gamer-card p-6">
                <h2 className="text-xl font-bold mb-4">Registration</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Entry Fee:</span>
                    <span className="font-semibold">{tournament.entry_fee || "Free"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">Teams Registered:</span>
                    <span className="font-semibold">{registeredTeams} / {tournament.max_teams}</span>
                  </div>

                  <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                    <div 
                      className="bg-gaming-purple h-2.5 rounded-full" 
                      style={{ width: `${(registeredTeams / tournament.max_teams) * 100}%` }}
                    ></div>
                  </div>

                  <div className="pt-4">
                    {isRegistered ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                        Already Registered
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-gaming-purple hover:bg-gaming-purple-bright"
                        onClick={handleJoin}
                        disabled={registeredTeams >= tournament.max_teams}
                      >
                        {registeredTeams >= tournament.max_teams ? "Tournament Full" : "Register Now"}
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-white/70">
                    Registration closes on {formatDate(tournament.registration_deadline)}
                  </div>
                </div>
              </div>

              {/* Contact / Info Card */}
              <div className="gamer-card p-6">
                <div className="flex items-center mb-4">
                  <Info className="mr-2 text-gaming-purple h-5 w-5" />
                  <h3 className="text-lg font-bold">Need Help?</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  If you have any questions about this tournament, please contact our support team.
                </p>
                <Button variant="outline" className="w-full border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentDetails;
