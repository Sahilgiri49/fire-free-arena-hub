
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

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
  const [tournaments, setTournaments] = useState<Tables<"tournaments">[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTournamentId, setCurrentTournamentId] = useState<string | null>(null);
  
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

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to load tournaments",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (tournament: Tables<"tournaments">) => {
    setIsEditing(true);
    setCurrentTournamentId(tournament.id);
    
    // Format dates for datetime-local input
    const formatDate = (dateString: string | null) => {
      if (!dateString) return "";
      return new Date(dateString).toISOString().slice(0, 16);
    };
    
    setFormData({
      title: tournament.title,
      description: tournament.description || "",
      startDate: formatDate(tournament.start_date),
      endDate: formatDate(tournament.end_date),
      registrationDeadline: formatDate(tournament.registration_deadline),
      prizePool: tournament.prize_pool || "",
      entryFee: tournament.entry_fee || "",
      maxTeams: tournament.max_teams,
      teamSize: tournament.team_size,
      mode: tournament.mode,
      imageUrl: tournament.image_url || "",
      rules: tournament.rules || "",
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    
    try {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tournament deleted successfully",
      });
      
      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast({
        title: "Error",
        description: "Failed to delete tournament",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
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
    setIsEditing(false);
    setCurrentTournamentId(null);
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
      
      const tournamentData = {
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
      };
      
      let result;
      
      if (isEditing && currentTournamentId) {
        // Update existing tournament
        result = await supabase
          .from("tournaments")
          .update(tournamentData)
          .eq("id", currentTournamentId);
      } else {
        // Create new tournament
        result = await supabase
          .from("tournaments")
          .insert([tournamentData])
          .select();
      }
      
      if (result.error) {
        console.error("Database error:", result.error);
        throw result.error;
      }
      
      toast({
        title: "Success",
        description: isEditing ? "Tournament updated successfully!" : "Tournament created successfully!",
      });
      
      resetForm();
      fetchTournaments();
    } catch (error) {
      console.error("Error creating/updating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to save tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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

          <div className="gamer-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Tournament" : "Create New Tournament"}</h2>
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
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                  disabled={isLoading}
                >
                  {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Tournament" : "Create Tournament")}
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
          
          {/* Tournament List */}
          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">Tournament List</h2>
            
            {tournaments.length === 0 ? (
              <p className="text-center text-white/70 py-6">No tournaments created yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Teams</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournaments.map((tournament) => (
                      <tr key={tournament.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{tournament.title}</td>
                        <td className="py-3 px-4">{formatDate(tournament.start_date)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            tournament.status === "Registration Open" 
                              ? "bg-green-500/20 text-green-300" 
                              : tournament.status === "Ongoing" 
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }`}>
                            {tournament.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{tournament.max_teams}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
                              onClick={() => handleEdit(tournament)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-300"
                              onClick={() => handleDelete(tournament.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTournaments;
