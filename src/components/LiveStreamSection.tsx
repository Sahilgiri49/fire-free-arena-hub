
import React from "react";
import { Video, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StreamCardProps {
  title: string;
  thumbnail: string;
  viewers: number;
  streamer: string;
  streamUrl: string;
  isLive: boolean;
  featured?: boolean;
}

const StreamCard = ({
  title,
  thumbnail,
  viewers,
  streamer,
  streamUrl,
  isLive,
  featured = false,
}: StreamCardProps) => {
  return (
    <div className={cn(
      "gamer-card overflow-hidden group",
      featured && "md:col-span-2 md:row-span-2"
    )}>
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full object-cover transition-transform duration-500 group-hover:scale-105",
            featured ? "h-72" : "h-48"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark-purple via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-gaming-purple/80 flex items-center justify-center">
            <Video className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
        )}
        
        {/* Viewers Count */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Users className="h-3 w-3" />
          {viewers} viewers
        </div>
      </div>
      
      {/* Stream Content */}
      <div className="p-4">
        <h3 className={cn(
          "font-bold text-white mb-1 line-clamp-2",
          featured ? "text-xl" : "text-base"
        )}>
          {title}
        </h3>
        <p className="text-sm text-white/70 mb-3">
          {streamer}
        </p>
        <a
          href={streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gaming-purple hover:text-gaming-purple-bright text-sm font-medium flex items-center transition-colors"
        >
          Watch stream
          <ArrowRight className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

const LiveStreamSection = () => {
  const streams = [
    {
      title: "Free Fire Pro League Season 4 - Day 2",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      viewers: 15420,
      streamer: "Official Free Fire Channel",
      streamUrl: "#",
      isLive: true,
      featured: true,
    },
    {
      title: "Free Fire Regional Cup - Semi-Finals",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      viewers: 8753,
      streamer: "Free Fire Esports",
      streamUrl: "#",
      isLive: true,
    },
    {
      title: "Road to Grand Finals - Team Analysis",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      viewers: 3241,
      streamer: "Pro Gaming Network",
      streamUrl: "#",
      isLive: false,
    },
    {
      title: "Free Fire Strategies & Tips with Pro Players",
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      viewers: 5823,
      streamer: "Gaming Academy",
      streamUrl: "#",
      isLive: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Live Streams</h2>
          <p className="text-white/70">Watch tournaments and matches live</p>
        </div>
        <Button
          variant="outline"
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream, index) => (
          <StreamCard
            key={index}
            {...stream}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveStreamSection;
