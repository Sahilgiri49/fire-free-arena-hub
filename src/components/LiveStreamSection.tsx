import { useState, useEffect } from "react";
import { Video, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Stream = Database['public']['Tables']['streams']['Row'];

interface StreamCardProps {
  title: string;
  thumbnail: string;
  viewers: number;
  streamer: string;
  streamUrl: string;
  isLive: boolean;
  featured?: boolean;
  scheduled?: string;
}

const StreamCard = ({
  title,
  thumbnail,
  viewers,
  streamer,
  streamUrl,
  isLive,
  featured = false,
  scheduled,
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
          loading="lazy"
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
            {new Date(scheduled).toLocaleString()}
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
        <h3 className={cn(
          "font-bold text-white mb-1 line-clamp-2",
          featured && "text-lg"
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
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStreams = async () => {
      try {
        const { data: streamData, error } = await supabase
          .from('streams')
          .select('*')
          .or('is_live.eq.true,scheduled_for.gt.now()')
          .order('is_live', { ascending: false })
          .order('scheduled_for', { ascending: true })
          .limit(6);
        
        if (error) throw error;
        
        if (isMounted) {
          setStreams(streamData || []);
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStreams();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
        </div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gradient mb-2">Live Streams</h2>
          <p className="text-white/70 mb-8">No live streams available at the moment</p>
        </div>
      </div>
    );
  }

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
          onClick={() => window.location.href = '/streams'}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream, index) => (
          <StreamCard
            key={stream.id}
            title={stream.title}
            thumbnail={stream.thumbnail_url}
            viewers={stream.viewers}
            streamer={stream.streamer}
            streamUrl={stream.stream_url}
            isLive={stream.is_live}
            featured={index === 0}
            scheduled={stream.scheduled_for}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveStreamSection;
