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
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    region: "",
    logo_url: "",
    team_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Generate a unique team code
      const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data, error } = await supabase
        .from("teams")
        .insert([
          {
            ...formData,
            captain_id: user.id,
            team_code: teamCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add the captain as the first team member
      await supabase.from("team_members").insert([
        {
          team_id: data.id,
          profile_id: user.id,
          role: "captain",
        },
      ]);

      toast({
        title: "Team Created!",
        description: `Your team code is: ${teamCode}. Share this code with your teammates to let them join.`,
      });

      // Navigate to the team details page
      navigate(`/teams/${data.id}`);
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gradient mb-2">Create Your Team</h1>
          <p className="text-white/70 mb-8">
            Form your squad and compete in tournaments together
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your team name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Team Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your team"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full bg-gaming-dark/50 border border-white/10 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gaming-purple/50"
                required
              >
                <option value="">Select Region</option>
                <option value="North">North India</option>
                <option value="South">South India</option>
                <option value="East">East India</option>
                <option value="West">West India</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Team Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="Enter URL for your team logo"
                type="url"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gaming-purple hover:bg-gaming-purple-bright"
              disabled={isLoading}
            >
              {isLoading ? "Creating Team..." : "Create Team"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam; 