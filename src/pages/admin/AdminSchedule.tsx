
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Calendar, Edit, Trash } from "lucide-react";

interface Tournament {
  id: string;
  title: string;
}

interface Match {
  id: string;
  tournament_id: string;
  tournament_title?: string;
  round_number: number;
  match_number: number;
  status: string;
  map: string | null;
  start_time: string;
  end_time: string | null;
  stream_url: string | null;
}

const AdminSchedule = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tournamentId: "",
    roundNumber: 1,
    matchNumber: 1,
    startTime: "",
    endTime: "",
    map: "",
    status: "Scheduled",
    streamUrl: ""
  });

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("id, title")
        .order("created_at", { ascending: false });

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
    }
  };

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      // Join matches with tournament title
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          tournaments (title)
        `)
        .order("start_time", { ascending: true });

      if (error) {
        throw error;
      }

      // Transform data to include tournament title
      const transformedData = data.map((match: any) => ({
        ...match,
        tournament_title: match.tournaments?.title || "Unknown Tournament"
      }));

      setMatches(transformedData || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast({
        title: "Error",
        description: "Failed to load match schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTournaments();
      await fetchMatches();
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.tournamentId) {
        toast({
          title: "Error",
          description: "Please select a tournament",
          variant: "destructive",
        });
        return;
      }

      const matchData = {
        tournament_id: formData.tournamentId,
        round_number: parseInt(formData.roundNumber.toString()),
        match_number: parseInt(formData.matchNumber.toString()),
        start_time: formData.startTime,
        end_time: formData.endTime || null,
        map: formData.map || null,
        status: formData.status,
        stream_url: formData.streamUrl || null
      };
      
      let result;
      
      if (isEditing && currentMatchId) {
        result = await supabase
          .from("matches")
          .update(matchData)
          .eq("id", currentMatchId);
      } else {
        result = await supabase
          .from("matches")
          .insert([matchData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Success",
        description: isEditing ? "Match updated successfully" : "Match created successfully",
      });
      
      setFormData({
        tournamentId: "",
        roundNumber: 1,
        matchNumber: 1,
        startTime: "",
        endTime: "",
        map: "",
        status: "Scheduled",
        streamUrl: ""
      });
      
      setIsCreating(false);
      setIsEditing(false);
      setCurrentMatchId(null);
      
      fetchMatches();
    } catch (error) {
      console.error("Error saving match:", error);
      toast({
        title: "Error",
        description: "Failed to save match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (match: Match) => {
    setFormData({
      tournamentId: match.tournament_id,
      roundNumber: match.round_number,
      matchNumber: match.match_number,
      startTime: new Date(match.start_time).toISOString().slice(0, 16),
      endTime: match.end_time ? new Date(match.end_time).toISOString().slice(0, 16) : "",
      map: match.map || "",
      status: match.status,
      streamUrl: match.stream_url || ""
    });
    
    setCurrentMatchId(match.id);
    setIsEditing(true);
    setIsCreating(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this match?")) {
      return;
    }
    
    try {
      const { error } = await supabase.from("matches").delete().eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Match deleted successfully",
      });
      
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
      toast({
        title: "Error",
        description: "Failed to delete match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeStr).toLocaleString(undefined, options);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500/30 text-blue-300';
      case 'live':
        return 'bg-red-500/30 text-red-300';
      case 'completed':
        return 'bg-green-500/30 text-green-300';
      case 'cancelled':
        return 'bg-gray-500/30 text-gray-300';
      default:
        return 'bg-purple-500/30 text-purple-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Match Schedule</h1>
              <p className="text-white/70">Manage tournament matches and schedule</p>
            </div>
            <div className="flex space-x-4">
              {!isCreating ? (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  Create Match
                </Button>
              ) : null}
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {isCreating && (
            <div className="gamer-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditing ? "Edit Match" : "Create New Match"}</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setCurrentMatchId(null);
                    setFormData({
                      tournamentId: "",
                      roundNumber: 1,
                      matchNumber: 1,
                      startTime: "",
                      endTime: "",
                      map: "",
                      status: "Scheduled",
                      streamUrl: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tournament</label>
                    <select
                      name="tournamentId"
                      value={formData.tournamentId}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                      required
                    >
                      <option value="">Select Tournament</option>
                      {tournaments.map((tournament) => (
                        <option key={tournament.id} value={tournament.id}>
                          {tournament.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Round Number</label>
                    <Input
                      type="number"
                      name="roundNumber"
                      value={formData.roundNumber}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Match Number</label>
                    <Input
                      type="number"
                      name="matchNumber"
                      value={formData.matchNumber}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time (optional)</label>
                    <Input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Map</label>
                    <Input
                      name="map"
                      value={formData.map}
                      onChange={handleChange}
                      placeholder="e.g., Bermuda, Kalahari, Purgatory"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Stream URL (optional)</label>
                    <Input
                      name="streamUrl"
                      value={formData.streamUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  {isEditing ? "Update Match" : "Create Match"}
                </Button>
              </form>
            </div>
          )}

          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">Match Schedule</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Calendar className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No matches scheduled</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4 text-left">Tournament</th>
                      <th className="py-2 px-4 text-left">Match</th>
                      <th className="py-2 px-4 text-left">Time</th>
                      <th className="py-2 px-4 text-left">Map</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{match.tournament_title}</td>
                        <td className="py-3 px-4">Round {match.round_number}, Match {match.match_number}</td>
                        <td className="py-3 px-4">{formatDateTime(match.start_time)}</td>
                        <td className="py-3 px-4">{match.map || "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusClass(match.status)}`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(match)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(match.id)}
                            >
                              <Trash className="h-4 w-4" />
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

export default AdminSchedule;
