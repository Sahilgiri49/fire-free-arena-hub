
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TournamentFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool: string;
  entryFee: string;
  maxTeams: number;
  teamSize: string;
  mode: string;
  imageUrl: string;
  rules: string;
}

const AdminTournaments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<TournamentFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    prizePool: "",
    entryFee: "",
    maxTeams: 32,
    teamSize: "Squad (4 players)",
    mode: "Online",
    imageUrl: "",
    rules: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a tournament",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("tournaments")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            start_date: formData.startDate,
            end_date: formData.endDate || null,
            registration_deadline: formData.registrationDeadline,
            prize_pool: formData.prizePool,
            entry_fee: formData.entryFee,
            max_teams: formData.maxTeams,
            team_size: formData.teamSize,
            mode: formData.mode,
            image_url: formData.imageUrl || null,
            rules: formData.rules || null,
            creator_id: user.id,
            status: "Registration Open",
          },
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Tournament created successfully!",
      });
      
      navigate("/tournaments");
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Tournament Management</h1>
              <p className="text-white/70">Create and manage tournaments</p>
            </div>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">Create New Tournament</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tournament Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Free Fire Pro League Season 6"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tournament description..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date (optional)</label>
                    <Input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Deadline</label>
                    <Input
                      type="datetime-local"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prize Pool</label>
                    <Input
                      name="prizePool"
                      value={formData.prizePool}
                      onChange={handleChange}
                      placeholder="₹100,000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Entry Fee</label>
                    <Input
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleChange}
                      placeholder="₹1,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Teams</label>
                    <Input
                      type="number"
                      name="maxTeams"
                      value={formData.maxTeams}
                      onChange={handleChange}
                      min="2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Team Size</label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                      required
                    >
                      <option value="Solo">Solo</option>
                      <option value="Duo (2 players)">Duo (2 players)</option>
                      <option value="Squad (4 players)">Squad (4 players)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Mode</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                      required
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/tournament-image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tournament Rules</label>
                <Textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Detailed tournament rules and regulations..."
                  rows={5}
                />
              </div>
              
              <Button
                type="submit"
                className="bg-gaming-purple hover:bg-gaming-purple-bright"
                disabled={isLoading}
              >
                {isLoading ? "Creating Tournament..." : "Create Tournament"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTournaments;
