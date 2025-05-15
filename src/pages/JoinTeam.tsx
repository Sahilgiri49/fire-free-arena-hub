import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const JoinTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [teamCode, setTeamCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Find the team with the provided code
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("team_code", teamCode.toUpperCase())
        .single();

      if (teamError) {
        toast({
          title: "Invalid Team Code",
          description: "Please check the team code and try again",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already in a team
      const { data: existingMembership, error: membershipError } = await supabase
        .from("team_members")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (existingMembership) {
        toast({
          title: "Already in a Team",
          description: "You are already a member of a team",
          variant: "destructive",
        });
        return;
      }

      // Add user to the team
      const { error: joinError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: team.id,
            profile_id: user.id,
            role: "member",
          },
        ]);

      if (joinError) throw joinError;

      toast({
        title: "Team Joined!",
        description: `You have successfully joined ${team.name}`,
      });

      navigate(`/teams/${team.id}`);
    } catch (error) {
      console.error("Error joining team:", error);
      toast({
        title: "Error",
        description: "Failed to join team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gradient mb-2">Join a Team</h1>
          <p className="text-white/70 mb-8">
            Enter the team code provided by your team captain
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamCode">Team Code</Label>
              <Input
                id="teamCode"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                placeholder="Enter team code (e.g., ABC123)"
                required
                className="uppercase"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gaming-purple hover:bg-gaming-purple-bright"
              disabled={isLoading}
            >
              {isLoading ? "Joining Team..." : "Join Team"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              Don't have a team code?{" "}
              <button
                onClick={() => navigate("/teams/create")}
                className="text-gaming-purple hover:text-gaming-purple-bright"
              >
                Create your own team
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinTeam; 