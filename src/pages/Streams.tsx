import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Video, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface StreamCardProps {
  title: string;
  thumbnail: string;
  viewers: number;
  streamer: string;
  streamUrl: string;
  isLive: boolean;
  scheduled?: string;
  description?: string;
}

const StreamCard = ({
  title,
  thumbnail,
  viewers,
  streamer,
  streamUrl,
  isLive,
  scheduled,
  description
}: StreamCardProps) => {
  return (
    <div className="gamer-card overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark-purple via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-gaming-purple/80 flex items-center justify-center">
            <Video className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Live/Scheduled Badge */}
        {isLive ? (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
        ) : scheduled ? (
          <div className="absolute top-3 left-3 bg-gaming-purple/80 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Calendar className="h-3 w-3 mr-1" />
            {scheduled}
          </div>
        ) : null}
        
        {/* Viewers Count */}
        {isLive && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Users className="h-3 w-3" />
            {viewers} viewers
          </div>
        )}
      </div>
      
      {/* Stream Content */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-white/70 mb-2">
          {streamer}
        </p>
        {description && (
          <p className="text-sm text-white/60 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <a
          href={streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gaming-purple hover:text-gaming-purple-bright text-sm font-medium flex items-center transition-colors"
        >
          {isLive ? "Watch stream" : "View details"}
          <ArrowRight className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

const Streams = () => {
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .order("scheduled_for", { ascending: true });
      if (!error) setStreams(data || []);
      setIsLoading(false);
    };
    fetchStreams();
  }, []);

  // Fallback mock data
  const mockStreams = [
    {
      title: "Free Fire Pro League Season 4 - Day 2",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      viewers: 15420,
      streamer: "Official Free Fire Channel",
      streamUrl: "#",
      isLive: true,
      description: "Quarterfinals - Group A vs Group B"
    },
    {
      title: "Free Fire Regional Cup - Semi-Finals",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      viewers: 8753,
      streamer: "Free Fire Esports",
      streamUrl: "#",
      isLive: true,
      description: "Team Inferno vs Ghost Hunters"
    },
    {
      title: "Free Fire Strategies & Tips with Pro Players",
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      viewers: 5823,
      streamer: "Gaming Academy",
      streamUrl: "#",
      isLive: true,
      description: "Learn from the champions of last season"
    },
  ];

  const displayStreams = streams.length > 0 ? streams : mockStreams;

  // Split streams into live, upcoming, and past
  const now = new Date();
  const liveStreams = displayStreams.filter(s => s.is_live);
  const upcomingStreams = displayStreams.filter(s => !s.is_live && new Date(s.scheduled_for) > now);
  const pastStreams = displayStreams.filter(s => !s.is_live && new Date(s.scheduled_for) <= now);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Live Streams</h1>
            <p className="text-white/70">
              Watch tournaments, matches, and Free Fire content live
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
            </div>
          ) : (
            <>
              {/* Live Now */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Live Now</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveStreams.map((stream, index) => (
                    <StreamCard
                      key={stream.id || index}
                      title={stream.title}
                      thumbnail={stream.thumbnail_url}
                      viewers={stream.viewers || 0}
                      streamer={stream.streamer || ""}
                      streamUrl={stream.stream_url}
                      isLive={stream.is_live}
                      scheduled={stream.scheduled_for ? new Date(stream.scheduled_for).toLocaleString() : undefined}
                      description={stream.description}
                    />
                  ))}
                </div>
              </div>
              {/* Upcoming Streams */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {upcomingStreams.map((stream, index) => (
                    <StreamCard
                      key={stream.id || index}
                      title={stream.title}
                      thumbnail={stream.thumbnail_url}
                      viewers={stream.viewers || 0}
                      streamer={stream.streamer || ""}
                      streamUrl={stream.stream_url}
                      isLive={stream.is_live}
                      scheduled={stream.scheduled_for ? new Date(stream.scheduled_for).toLocaleString() : undefined}
                      description={stream.description}
                    />
                  ))}
                </div>
              </div>
              {/* Past Streams */}
              <h2 className="text-2xl font-bold text-white mb-6">Past Broadcasts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastStreams.map((stream, index) => (
                  <StreamCard
                    key={stream.id || index}
                    title={stream.title}
                    thumbnail={stream.thumbnail_url}
                    viewers={stream.viewers || 0}
                    streamer={stream.streamer || ""}
                    streamUrl={stream.stream_url}
                    isLive={stream.is_live}
                    scheduled={stream.scheduled_for ? new Date(stream.scheduled_for).toLocaleString() : undefined}
                    description={stream.description}
                  />
                ))}
                <div className="col-span-full text-center mt-4">
                  <Button 
                    variant="outline" 
                    className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
                  >
                    View All Past Broadcasts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Streams;
