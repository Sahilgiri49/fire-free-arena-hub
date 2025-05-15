import React, { useState, useEffect } from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const LeaderboardSection = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('player_stats')
        .select('*, profiles:profile_id (username, full_name, avatar_url)')
        .order('kd_ratio', { ascending: false });
      if (!error) setPlayers(data || []);
      setIsLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Top Players
          </h2>
          <p className="text-white/70">
            Current leaderboard for Pro League Season 4
          </p>
        </div>
        <Button
          variant="outline"
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
        >
          View Full Rankings
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="gamer-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Player</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">Matches</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">Wins</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">K/D</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Points</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple mx-auto"></div>
                  </td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/70">No leaderboard data found</td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr
                    key={player.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                        index === 0 && "bg-yellow-500/80 text-white",
                        index === 1 && "bg-gray-400/80 text-white",
                        index === 2 && "bg-amber-700/80 text-white",
                        index > 2 && "bg-gaming-dark text-white/70"
                      )}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={player.profiles?.avatar_url || "https://ui-avatars.com/api/?name=" + (player.profiles?.username || player.profiles?.full_name || "Player")}
                          alt={player.profiles?.username || player.profiles?.full_name || "Player"}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <span className="font-medium text-white">{player.profiles?.username || player.profiles?.full_name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/70">{player.total_matches}</td>
                    <td className="px-6 py-4 text-center text-white/70">{player.wins}</td>
                    <td className="px-6 py-4 text-center text-white/70">{player.kd_ratio?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gaming-purple">{player.points || 0}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;
