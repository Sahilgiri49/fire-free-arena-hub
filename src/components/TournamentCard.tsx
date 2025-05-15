import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Tournament = Tables<"tournaments">;

// Define alternative tournament shape for mock data
export interface TournamentCardData {
  title: string;
  image?: string;
  image_url?: string; // Add this property to fix the error
  date: string;
  prizePool: string;
  entryFee: string;
  teamSize: string;
  mode: "Online" | "Offline" | "Hybrid";
  status: "Registration Open" | "Ongoing" | "Completed";
  registeredTeams?: number;
  maxTeams: number;
}

interface TournamentCardProps {
  tournament?: Tournament;
  showViewButton?: boolean;
  // Accept legacy props format for backward compatibility
  title?: string;
  image?: string;
  image_url?: string; // Add this property to fix the error
  date?: string;
  prizePool?: string;
  entryFee?: string;
  teamSize?: string;
  mode?: "Online" | "Offline" | "Hybrid";
  status?: "Registration Open" | "Ongoing" | "Completed";
  registeredTeams?: number;
  maxTeams?: number;
}

const TournamentCard: React.FC<TournamentCardProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utr, setUtr] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Handle both prop formats (tournament object or individual props)
  const tournament = props.tournament || {
    id: "",
    title: props.title || "",
    image_url: props.image_url || props.image || "",
    start_date: props.date ? new Date(props.date).toISOString() : new Date().toISOString(),
    prize_pool: props.prizePool || "",
    entry_fee: props.entryFee || "",
    team_size: props.teamSize || "",
    mode: props.mode || "Online",
    status: props.status || "Registration Open",
    max_teams: props.maxTeams || 0,
    description: "",
    creator_id: "",
    registration_deadline: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    end_date: null
  };

  const showViewButton = props.showViewButton ?? true;

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to join tournaments",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!tournament.id) {
      toast({
        title: "Error",
        description: "Cannot join mock tournament. Please view real tournaments.",
        variant: "destructive",
      });
      navigate("/tournaments");
      return;
    }
    if (tournament.entry_fee && tournament.entry_fee !== "Free" && tournament.entry_fee !== "0") {
      setShowPaymentModal(true);
      return;
    }
    try {
      // Check if user is already registered
      const { data: existingReg, error: checkError } = await supabase
        .from("tournament_registrations")
        .select("*")
        .eq("tournament_id", tournament.id)
        .eq("profile_id", user.id);
      if (existingReg && existingReg.length > 0) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this tournament",
        });
        return;
      }
      // Register the user
      const { error: regError } = await supabase
        .from("tournament_registrations")
        .insert([
          {
            profile_id: user.id,
            tournament_id: tournament.id,
            payment_status: "Free",
          }
        ]);
      if (regError) {
        throw regError;
      }
      toast({
        title: "Registration Successful",
        description: "You've been registered for this tournament!",
      });
      navigate(`/tournaments/${tournament.id}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentConfirm = async () => {
    if (!utr.match(/^\d{12}$/)) {
      toast({ title: "Invalid UTR", description: "Please enter a valid 12-digit UTR/Transaction ID.", variant: "destructive" });
      return;
    }
    setIsPaying(true);
    try {
      // Save registration with UTR and pending payment status
      const { data: existingReg, error: checkError } = await supabase
        .from("tournament_registrations")
        .select("*")
        .eq("tournament_id", tournament.id)
        .eq("profile_id", user.id);
      if (existingReg && existingReg.length > 0) {
        toast({ title: "Already Registered", description: "You are already registered for this tournament." });
        setIsPaying(false);
        setShowPaymentModal(false);
        return;
      }
      const { error: regError } = await supabase
        .from("tournament_registrations")
        .insert([
          {
            profile_id: user.id,
            tournament_id: tournament.id,
            payment_status: "Pending",
            payment_utr: utr,
          }
        ]);
      if (regError) throw regError;
      toast({
        title: "Payment Submitted!",
        description: "Thank you! Your payment is being verified. You will receive confirmation soon.",
      });
      setShowPaymentModal(false);
      setUtr("");
      navigate(`/tournaments/${tournament.id}`);
    } catch (error) {
      toast({ title: "Payment Failed", description: "Failed to submit payment. Please try again.", variant: "destructive" });
    } finally {
      setIsPaying(false);
    }
  };

  const viewTournament = () => {
    // Navigate to tournament details page if it has a real ID
    if (tournament.id) {
      navigate(`/tournaments/${tournament.id}`);
    } else {
      // This is a mock tournament, redirect to tournaments page
      navigate("/tournaments");
    }
  };

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Use a default image if none is provided
  const imageUrl = tournament.image_url || props.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <>
      <div className="gamer-card h-full flex flex-col cursor-pointer transform hover:scale-[1.01] transition-all duration-200" onClick={viewTournament}>
        <div
          className="h-40 bg-cover bg-center rounded-t-lg relative"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-2 left-3">
            <span className="px-2 py-1 text-xs rounded bg-gaming-purple text-white">
              {tournament.team_size}
            </span>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-gaming-purple/70 text-white">
              {tournament.mode}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold mb-1">{tournament.title}</h3>
          <p className="text-sm text-white/70 mb-2">{tournament.description?.substring(0, 60) || ''}{tournament.description?.length > 60 ? '...' : ''}</p>

          <div className="mt-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Prize Pool:</span>
              <span className="text-gaming-purple font-semibold">
                {tournament.prize_pool || "TBA"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Entry Fee:</span>
              <span>
                {tournament.entry_fee || "Free"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Start Date:</span>
              <span>
                {formatDate(tournament.start_date)}
              </span>
            </div>

            <div className="flex justify-between mt-4">
              {showViewButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 mr-2 border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white" 
                  onClick={(e) => {
                    e.stopPropagation();
                    viewTournament();
                  }}
                >
                  View Details
                </Button>
              )}
              <Button 
                className="flex-1 bg-gaming-purple hover:bg-gaming-purple-bright"
                size="sm"
                onClick={handleJoin}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Entry Fee</DialogTitle>
            <DialogDescription>
              Scan the QR code below or use the UPI ID to pay the entry fee.<br />
              After payment, enter your 12-digit UTR/Transaction ID for confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <img src="https://raw.githubusercontent.com/Sahilgiri49/fire-free-arena-hub/main/assest/NaviQR_SAHIL%20VILASRAV%20GIRI_15052025084619005.png" alt="UPI QR Code" className="w-40 h-40 border rounded-lg" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=QR+Code"; }} />
            <div className="text-center">
              <div className="font-semibold text-lg">UPI ID:</div>
              <div className="text-gaming-purple font-bold text-xl mb-2">7888075193@naviaxis</div>
              <div className="text-xs text-white/70">For payment issues, <a href="https://sahil-giri.netlify.app/" target="_blank" rel="noopener noreferrer" className="underline text-gaming-purple">contact developer</a>.</div>
            </div>
            <input
              type="text"
              maxLength={12}
              minLength={12}
              pattern="\\d{12}"
              placeholder="Enter 12-digit UTR/Transaction ID"
              className="w-full border rounded px-3 py-2 text-black"
              value={utr}
              onChange={e => setUtr(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={isPaying}
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePaymentConfirm} disabled={isPaying} className="w-full bg-gaming-purple hover:bg-gaming-purple-bright">
              {isPaying ? "Submitting..." : "I have paid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentCard;
