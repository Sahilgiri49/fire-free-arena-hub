import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar as CalendarIcon, Calendar, Users, Trophy, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface MatchCardProps {
  team1: string;
  team2: string;
  team1Logo: string;
  team2Logo: string;
  date: string;
  time: string;
  tournament: string;
  round: string;
  hasLivestream: boolean;
}

const MatchCard = ({
  team1,
  team2,
  team1Logo,
  team2Logo,
  date,
  time,
  tournament,
  round,
  hasLivestream
}: MatchCardProps) => {
  return (
    <div className="gamer-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gaming-purple" />
          <span className="text-sm text-white/70">{date} • {time}</span>
        </div>
        {hasLivestream && (
          <span className="flex items-center gap-1 bg-red-600/80 text-white text-xs px-2 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE STREAM
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-8 my-8">
        <div className="text-center">
          <img src={team1Logo} alt={team1} className="w-16 h-16 mb-2 mx-auto rounded-full object-cover" />
          <h3 className="font-bold text-white">{team1}</h3>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-gaming-dark flex items-center justify-center border border-gaming-purple/30">
            <span className="text-white text-sm">VS</span>
          </div>
        </div>
        
        <div className="text-center">
          <img src={team2Logo} alt={team2} className="w-16 h-16 mb-2 mx-auto rounded-full object-cover" />
          <h3 className="font-bold text-white">{team2}</h3>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between text-sm mb-4">
        <div>
          <span className="text-white/70">Tournament:</span>
          <span className="text-white ml-1">{tournament}</span>
        </div>
        <div>
          <span className="text-white/70">Round:</span>
          <span className="text-white ml-1">{round}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        {hasLivestream && (
          <Button
            size="sm"
            className="bg-gaming-purple hover:bg-gaming-purple-bright text-white grow"
          >
            <Video className="mr-2 h-4 w-4" />
            Watch Live
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white grow"
        >
          Match Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Schedule = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*, tournaments (title)')
        .order('start_time', { ascending: true });
      if (!error) setMatches(data || []);
      setIsLoading(false);
    };
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Match Schedule</h1>
            <p className="text-white/70">
              Stay updated with upcoming Free Fire matches
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList className="bg-gaming-dark/50 border border-gaming-purple/20">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                Upcoming Matches
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
                Past Matches
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
                  </div>
                ) : (
                  matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      team1={match.team1 || "TBD"}
                      team2={match.team2 || "TBD"}
                      team1Logo={match.team1Logo || ""}
                      team2Logo={match.team2Logo || ""}
                      date={match.start_time ? new Date(match.start_time).toLocaleDateString() : "TBD"}
                      time={match.start_time ? new Date(match.start_time).toLocaleTimeString() : "TBD"}
                      tournament={match.tournaments?.title || "Unknown"}
                      round={`Round ${match.round_number}`}
                      hasLivestream={!!match.stream_url}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match, index) => (
                  <MatchCard key={index} {...match} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="gamer-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Tournament Calendar</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Tournament</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Stage</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Teams</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gaming-purple mr-2" />
                        <span className="text-white">May 25-28, 2025</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">Free Fire Pro League Season 5</td>
                    <td className="px-4 py-3 text-white">Quarter Finals</td>
                    <td className="px-4 py-3 text-white">8 Teams</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gaming-purple mr-2" />
                        <span className="text-white">May 30, 2025</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">Free Fire Duo Showdown</td>
                    <td className="px-4 py-3 text-white">Qualifiers</td>
                    <td className="px-4 py-3 text-white">64 Teams</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gaming-purple mr-2" />
                        <span className="text-white">June 5-7, 2025</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">Free Fire Regional Qualifiers</td>
                    <td className="px-4 py-3 text-white">Group Stage</td>
                    <td className="px-4 py-3 text-white">32 Teams</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gaming-purple mr-2" />
                        <span className="text-white">June 10-12, 2025</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">Free Fire Masters Cup</td>
                    <td className="px-4 py-3 text-white">All Rounds</td>
                    <td className="px-4 py-3 text-white">16 Teams</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
