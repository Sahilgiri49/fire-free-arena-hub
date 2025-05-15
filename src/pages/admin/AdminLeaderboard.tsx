import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PlayerStats {
  id: string;
  player_name: string;
  profile_id: string;
  total_matches: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  kd_ratio: number;
}

const AdminLeaderboard = () => {
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<PlayerStats | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    profile_id: '',
    total_matches: 0,
    wins: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    points: 0,
  });
  const [profiles, setProfiles] = useState<{id: string, username: string, full_name: string}[]>([]);

  useEffect(() => {
    fetchPlayerStats();
    fetchProfiles();
  }, []);

  const fetchPlayerStats = async () => {
    setIsLoading(true);
    try {
      // Join player_stats with profiles to get player names
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          *,
          profiles:profile_id (username, full_name)
        `)
        .order('kills', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include player name
      const transformedData = data.map((item: any) => ({
        ...item,
        player_name: item.profiles?.username || item.profiles?.full_name || 'Unknown Player',
      }));

      setPlayerStats(transformedData);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfiles = async () => {
    // Fetch all profiles for player selection
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name');
    if (!error && data) {
      setProfiles(data);
    }
  };

  const handleUpdatePlayerStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;

    try {
      // Calculate KD ratio
      const kdRatio = editingPlayer.deaths > 0 
        ? Number((editingPlayer.kills / editingPlayer.deaths).toFixed(2))
        : editingPlayer.kills;

      const { error } = await supabase
        .from('player_stats')
        .update({
          total_matches: editingPlayer.total_matches,
          wins: editingPlayer.wins,
          kills: editingPlayer.kills,
          deaths: editingPlayer.deaths,
          assists: editingPlayer.assists,
          kd_ratio: kdRatio,
        })
        .eq('id', editingPlayer.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Stats Updated",
        description: `Successfully updated stats for ${editingPlayer.player_name}`,
      });
      
      setEditingPlayer(null);
      fetchPlayerStats();
    } catch (error) {
      console.error('Error updating player stats:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update player stats",
        variant: "destructive",
      });
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.profile_id) return toast({ title: 'Error', description: 'Select a player profile', variant: 'destructive' });
    try {
      const kd_ratio = addForm.deaths > 0 ? Number((addForm.kills / addForm.deaths).toFixed(2)) : addForm.kills;
      const { error } = await supabase.from('player_stats').insert([
        {
          profile_id: addForm.profile_id,
          total_matches: addForm.total_matches,
          wins: addForm.wins,
          kills: addForm.kills,
          deaths: addForm.deaths,
          assists: addForm.assists,
          kd_ratio,
          points: addForm.points,
        },
      ]);
      if (error) throw error;
      toast({ title: 'Player Added', description: 'Player stats added to leaderboard!' });
      setShowAddForm(false);
      setAddForm({ profile_id: '', total_matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0, points: 0 });
      fetchPlayerStats();
    } catch (error) {
      toast({ title: 'Add Failed', description: 'Failed to add player', variant: 'destructive' });
    }
  };

  const filteredStats = playerStats.filter(player => 
    player.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Leaderboard Management</h1>
              <p className="text-white/70">Update player statistics and rankings</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Player
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {showAddForm && (
            <div className="gamer-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Player to Leaderboard</h2>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
              <form onSubmit={handleAddPlayer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Player Profile</label>
                  <select
                    className="w-full bg-gaming-dark border border-white/10 rounded-md py-2 px-3 text-white"
                    value={addForm.profile_id}
                    onChange={e => setAddForm({ ...addForm, profile_id: e.target.value })}
                    required
                  >
                    <option value="">Select Player</option>
                    {profiles.map(profile => (
                      <option key={profile.id} value={profile.id}>
                        {profile.username || profile.full_name || profile.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Matches</label>
                    <Input type="number" min="0" value={addForm.total_matches} onChange={e => setAddForm({ ...addForm, total_matches: parseInt(e.target.value) || 0 })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Wins</label>
                    <Input type="number" min="0" value={addForm.wins} onChange={e => setAddForm({ ...addForm, wins: parseInt(e.target.value) || 0 })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kills</label>
                    <Input type="number" min="0" value={addForm.kills} onChange={e => setAddForm({ ...addForm, kills: parseInt(e.target.value) || 0 })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deaths</label>
                    <Input type="number" min="0" value={addForm.deaths} onChange={e => setAddForm({ ...addForm, deaths: parseInt(e.target.value) || 0 })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assists</label>
                    <Input type="number" min="0" value={addForm.assists} onChange={e => setAddForm({ ...addForm, assists: parseInt(e.target.value) || 0 })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <Input
                    name="points"
                    type="number"
                    value={addForm.points}
                    onChange={e => setAddForm({ ...addForm, points: Number(e.target.value) })}
                    placeholder="Points"
                    className="mb-2"
                  />
                </div>
                <Button type="submit" className="bg-gaming-purple hover:bg-gaming-purple-bright">Add Player</Button>
              </form>
            </div>
          )}

          {editingPlayer ? (
            <div className="gamer-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Update Player Stats: {editingPlayer.player_name}</h2>
                <Button 
                  variant="outline"
                  onClick={() => setEditingPlayer(null)}
                >
                  Cancel
                </Button>
              </div>
              
              <form onSubmit={handleUpdatePlayerStats} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Matches</label>
                    <Input
                      type="number"
                      min="0"
                      value={editingPlayer.total_matches}
                      onChange={(e) => setEditingPlayer({
                        ...editingPlayer,
                        total_matches: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Wins</label>
                    <Input
                      type="number"
                      min="0"
                      value={editingPlayer.wins}
                      onChange={(e) => setEditingPlayer({
                        ...editingPlayer,
                        wins: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kills</label>
                    <Input
                      type="number"
                      min="0"
                      value={editingPlayer.kills}
                      onChange={(e) => setEditingPlayer({
                        ...editingPlayer,
                        kills: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deaths</label>
                    <Input
                      type="number"
                      min="0"
                      value={editingPlayer.deaths}
                      onChange={(e) => setEditingPlayer({
                        ...editingPlayer,
                        deaths: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assists</label>
                    <Input
                      type="number"
                      min="0"
                      value={editingPlayer.assists}
                      onChange={(e) => setEditingPlayer({
                        ...editingPlayer,
                        assists: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  Update Stats
                </Button>
              </form>
            </div>
          ) : null}

          <div className="gamer-card p-6">
            <div className="mb-4">
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4 text-left">Rank</th>
                      <th className="py-2 px-4 text-left">Player</th>
                      <th className="py-2 px-4 text-left">Matches</th>
                      <th className="py-2 px-4 text-left">Wins</th>
                      <th className="py-2 px-4 text-left">Kills</th>
                      <th className="py-2 px-4 text-left">Deaths</th>
                      <th className="py-2 px-4 text-left">Assists</th>
                      <th className="py-2 px-4 text-left">K/D Ratio</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStats.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-white/70">
                          No player stats found
                        </td>
                      </tr>
                    ) : (
                      filteredStats.map((player, index) => (
                        <tr key={player.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{player.player_name}</td>
                          <td className="py-3 px-4">{player.total_matches}</td>
                          <td className="py-3 px-4">{player.wins}</td>
                          <td className="py-3 px-4">{player.kills}</td>
                          <td className="py-3 px-4">{player.deaths}</td>
                          <td className="py-3 px-4">{player.assists}</td>
                          <td className="py-3 px-4">{player.kd_ratio.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setEditingPlayer(player)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
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

export default AdminLeaderboard;
