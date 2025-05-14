
import React from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  team: string;
  logo: string;
  matches: number;
  wins: number;
  kd: number;
  points: number;
}

const LeaderboardSection = () => {
  const leaderboardEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      team: "Neon Strikers",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=50&h=50&fit=crop",
      matches: 24,
      wins: 16,
      kd: 3.8,
      points: 520,
    },
    {
      rank: 2,
      team: "Phoenix Squad",
      logo: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=50&h=50&fit=crop",
      matches: 24,
      wins: 14,
      kd: 3.5,
      points: 482,
    },
    {
      rank: 3,
      team: "Team Inferno",
      logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=50&h=50&fit=crop",
      matches: 24,
      wins: 13,
      kd: 3.2,
      points: 455,
    },
    {
      rank: 4,
      team: "Ghost Hunters",
      logo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=50&h=50&fit=crop",
      matches: 24,
      wins: 11,
      kd: 2.9,
      points: 420,
    },
    {
      rank: 5,
      team: "Elite Warriors",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=50&h=50&fit=crop",
      matches: 24,
      wins: 10,
      kd: 2.7,
      points: 392,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Top Teams
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
                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Team</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">Matches</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">Wins</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/70">K/D</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardEntries.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                      entry.rank === 1 && "bg-yellow-500/80 text-white",
                      entry.rank === 2 && "bg-gray-400/80 text-white",
                      entry.rank === 3 && "bg-amber-700/80 text-white",
                      entry.rank > 3 && "bg-gaming-dark text-white/70"
                    )}>
                      {entry.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={entry.logo}
                        alt={entry.team}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <span className="font-medium text-white">{entry.team}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-white/70">{entry.matches}</td>
                  <td className="px-6 py-4 text-center text-white/70">{entry.wins}</td>
                  <td className="px-6 py-4 text-center text-white/70">{entry.kd}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-gaming-purple">{entry.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;
