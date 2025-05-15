import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Copy, Shield } from "lucide-react";

interface TeamMember {
  id: string;
  profile_id: string;
  role: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  region: string;
  team_code: string;
  captain_id: string;
  wins: number;
  total_matches: number;
  created_at: string;
}

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!id) return;

      try {
        // Fetch team details
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single();

        if (teamError) {
          console.error("Team fetch error:", teamError);
          throw teamError;
        }
        if (teamData) {
          console.log("Team data:", teamData);
          setTeam(teamData);
          setIsCaptain(user?.id === teamData.captain_id);
        }

        // Fetch team members with user profiles
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", id);

        if (membersError) {
          console.error("Members fetch error:", membersError);
          throw membersError;
        }
        if (membersData) {
          console.log("Members data:", membersData);
          // Fetch profiles for each member
          const profileIds = membersData.map(member => member.profile_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .in("id", profileIds);

          if (profilesError) {
            console.error("Profiles fetch error:", profilesError);
            throw profilesError;
          }

          // Combine member data with profile data
          const membersWithProfiles = membersData.map(member => {
            const profile = profilesData?.find(p => p.id === member.profile_id);
            return {
              ...member,
              user: profile || { username: "Unknown User", avatar_url: null }
            };
          });

          console.log("Members with profiles:", membersWithProfiles);
          setMembers(membersWithProfiles);
        }

      } catch (error: any) {
        console.error("Error fetching team details:", error);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);
        toast({
          title: "Error",
          description: error.message || "Failed to load team details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id, user]);

  const copyTeamCode = () => {
    if (team?.team_code) {
      navigator.clipboard.writeText(team.team_code);
      toast({
        title: "Team Code Copied!",
        description: "Share this code with players you want to invite",
      });
    }
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

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <Button onClick={() => navigate("/teams")}>Back to Teams</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Team Header */}
        <div className="gamer-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={team.logo_url || "https://via.placeholder.com/150"}
              alt={team.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gradient mb-2">{team.name}</h1>
              <p className="text-white/70 mb-4">{team.description}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Trophy className="text-gaming-orange" />
                  <span>{team.wins} Wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-gaming-purple" />
                  <span>{members.length} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-gaming-purple" />
                  <span>{team.region}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Code Section (Only visible to team captain) */}
          {isCaptain && (
            <div className="mt-6 p-4 bg-gaming-dark/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Team Code</h3>
                  <p className="text-white/70 text-sm">Share this code to invite players</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gaming-dark px-4 py-2 rounded">{team.team_code}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTeamCode}
                    className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="gamer-card p-6">
          <h2 className="text-xl font-bold mb-6">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-gaming-dark/50 rounded-lg"
              >
                <img
                  src={member.user?.avatar_url || "https://via.placeholder.com/40"}
                  alt={member.user?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{member.user?.username}</p>
                  <p className="text-sm text-white/70 capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamDetails; 