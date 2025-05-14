
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Video, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const liveStreams = [
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

  const upcomingStreams = [
    {
      title: "Free Fire Pro League Season 5 - Opening Day",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      viewers: 0,
      streamer: "Official Free Fire Channel",
      streamUrl: "#",
      isLive: false,
      scheduled: "May 25, 18:00 IST",
      description: "The biggest Free Fire tournament kicks off!"
    },
    {
      title: "Free Fire Masters Cup - Group Stage Draw",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      viewers: 0,
      streamer: "Free Fire Esports",
      streamUrl: "#",
      isLive: false,
      scheduled: "May 28, 16:00 IST",
      description: "Find out which group your favorite team is in"
    },
    {
      title: "Free Fire Solo Championship - Qualifier Preview",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      viewers: 0,
      streamer: "Pro Gaming Network",
      streamUrl: "#",
      isLive: false,
      scheduled: "May 30, 20:00 IST",
      description: "Analysis of the top solo players to watch"
    },
    {
      title: "Delhi LAN Tournament - Venue Tour",
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      viewers: 0,
      streamer: "Gaming Academy",
      streamUrl: "#",
      isLive: false,
      scheduled: "June 5, 15:00 IST",
      description: "First look at the arena for the upcoming LAN event"
    },
  ];
  
  const pastStreams = [
    {
      title: "Free Fire Pro League Season 4 - Finals Highlights",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      viewers: 42650,
      streamer: "Official Free Fire Channel",
      streamUrl: "#",
      isLive: false,
      description: "The thrilling conclusion to last season"
    },
    {
      title: "Pro Player Analysis - Best Plays of the Month",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      viewers: 18340,
      streamer: "Pro Gaming Network",
      streamUrl: "#",
      isLive: false,
      description: "Learn strategies from the best in the game"
    },
  ];

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

          {/* Featured Stream */}
          <div className="gamer-card overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 relative">
                <div className="aspect-video bg-gaming-dark">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                    title="Featured Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE NOW
                  </span>
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    18,245 viewers
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Free Fire Pro League Season 4 - Grand Finals
                </h2>
                <p className="text-white/70 mb-2">
                  Official Free Fire Channel
                </p>
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  Watch the top teams battle for the championship title and a prize pool of ₹1,000,000! 
                  Don't miss the action as Neon Strikers, Phoenix Squad, Team Inferno and Ghost Hunters 
                  face off in the grand finals.
                </p>
                <div className="flex gap-3">
                  <Button
                    className="bg-gaming-purple hover:bg-gaming-purple-bright text-white grow"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Watch Full Screen
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gaming-purple/50 hover:bg-gaming-purple/20 hover:text-white"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Live Streams */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Live Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.map((stream, index) => (
                <StreamCard key={index} {...stream} />
              ))}
            </div>
          </div>
          
          {/* Upcoming Streams */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Streams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingStreams.map((stream, index) => (
                <StreamCard key={index} {...stream} />
              ))}
            </div>
          </div>
          
          {/* Past Streams */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Past Broadcasts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastStreams.map((stream, index) => (
                <StreamCard key={index} {...stream} />
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Streams;
