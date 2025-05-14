
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

  useEffect(() => {
    fetchPlayerStats();
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
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>

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
