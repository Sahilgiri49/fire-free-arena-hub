
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Users, Edit, Trash } from "lucide-react";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  region: string | null;
  bio: string | null;
  captain_id: string;
  created_at: string;
  captain_name?: string;
  member_count?: number;
}

const AdminTeams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    region: "",
    bio: ""
  });

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      // Get teams with captain information and member count
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          profiles:captain_id (username, full_name),
          team_members (id)
        `);

      if (error) {
        throw error;
      }

      // Transform data to include captain name and member count
      const transformedData = data.map((team: any) => ({
        ...team,
        captain_name: team.profiles?.username || team.profiles?.full_name || 'Unknown',
        member_count: team.team_members?.length || 1 // At least 1 for captain
      }));

      setTeams(transformedData || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to manage teams",
          variant: "destructive",
        });
        return;
      }
      
      const teamData = {
        name: formData.name,
        logo_url: formData.logoUrl || null,
        region: formData.region || null,
        bio: formData.bio || null,
        captain_id: userData.user.id
      };
      
      let result;
      
      if (isEditing && currentTeamId) {
        // Only update the fields we allow (not captain_id)
        const updateData = {
          name: formData.name,
          logo_url: formData.logoUrl || null,
          region: formData.region || null,
          bio: formData.bio || null
        };
        
        result = await supabase
          .from("teams")
          .update(updateData)
          .eq("id", currentTeamId);
      } else {
        result = await supabase
          .from("teams")
          .insert([teamData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Success",
        description: isEditing ? "Team updated successfully" : "Team created successfully",
      });
      
      setFormData({
        name: "",
        logoUrl: "",
        region: "",
        bio: ""
      });
      
      setIsCreating(false);
      setIsEditing(false);
      setCurrentTeamId(null);
      
      fetchTeams();
    } catch (error) {
      console.error("Error saving team:", error);
      toast({
        title: "Error",
        description: "Failed to save team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (team: Team) => {
    setFormData({
      name: team.name,
      logoUrl: team.logo_url || "",
      region: team.region || "",
      bio: team.bio || ""
    });
    
    setCurrentTeamId(team.id);
    setIsEditing(true);
    setIsCreating(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team? This will also remove all team members.")) {
      return;
    }
    
    try {
      // Delete team (cascade will handle team_members)
      const { error } = await supabase.from("teams").delete().eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.captain_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Team Management</h1>
              <p className="text-white/70">Manage teams participating in tournaments</p>
            </div>
            <div className="flex space-x-4">
              {!isCreating ? (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  Create Team
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
                <h2 className="text-xl font-bold">{isEditing ? "Edit Team" : "Create New Team"}</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setCurrentTeamId(null);
                    setFormData({
                      name: "",
                      logoUrl: "",
                      region: "",
                      bio: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Team Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Team name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <Input
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  >
                    <option value="">Select Region</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Team Bio</label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Team description and achievements..."
                    rows={4}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  {isEditing ? "Update Team" : "Create Team"}
                </Button>
              </form>
            </div>
          )}

          <div className="gamer-card p-6">
            <div className="mb-4">
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Users className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>{searchQuery ? "No teams match your search" : "No teams found"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <div key={team.id} className="bg-gaming-dark-purple/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 bg-gaming-purple/30 rounded-full flex items-center justify-center">
                          {team.logo_url ? (
                            <img 
                              src={team.logo_url} 
                              alt={team.name} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <Users className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{team.name}</h3>
                          <p className="text-white/60 text-sm">
                            {team.region || "No region"} • {team.member_count} {team.member_count === 1 ? "member" : "members"}
                          </p>
                          <p className="text-white/60 text-sm">Captain: {team.captain_name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(team)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(team.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {team.bio && (
                      <div className="mt-3 text-sm text-white/70">
                        <p className="line-clamp-2">{team.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTeams;
