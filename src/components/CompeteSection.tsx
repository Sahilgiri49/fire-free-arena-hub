import { useNavigate } from "react-router-dom";
import { Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const CompeteSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinTournament = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join tournaments",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/tournaments");
  };

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

  return (
    <div className="bg-gaming-dark-purple py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Ready to Compete?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join thousands of players competing in Free Fire tournaments. Form
            your team today and start your journey to the top.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gaming-purple hover:bg-gaming-purple-bright text-white min-w-[200px]"
            onClick={handleJoinTournament}
          >
            <Trophy className="mr-2 h-5 w-5" />
            Join Tournament
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gaming-purple text-gaming-purple hover:bg-gaming-purple/20 hover:text-white min-w-[200px]"
            onClick={handleCreateTeam}
          >
            <Users className="mr-2 h-5 w-5" />
            Create Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompeteSection; 