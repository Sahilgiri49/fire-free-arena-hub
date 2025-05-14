
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TournamentCardProps {
  title: string;
  image: string;
  date: string;
  prizePool: string;
  entryFee: string;
  teamSize: string;
  mode: "Online" | "Offline";
  status: "Registration Open" | "In Progress" | "Completed";
  registeredTeams: number;
  maxTeams: number;
}

const TournamentCard = ({
  title,
  image,
  date,
  prizePool,
  entryFee,
  teamSize,
  mode,
  status,
  registeredTeams,
  maxTeams,
}: TournamentCardProps) => {
  return (
    <div className="gamer-card overflow-hidden group">
      {/* Tournament Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark-purple/90 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div 
          className={cn(
            "absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium",
            status === "Registration Open" && "bg-green-500/80 text-white",
            status === "In Progress" && "bg-gaming-orange/80 text-white",
            status === "Completed" && "bg-gray-500/80 text-white",
          )}
        >
          {status}
        </div>
        
        {/* Mode Badge */}
        <div 
          className={cn(
            "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium",
            mode === "Online" && "bg-gaming-purple/80 text-white",
            mode === "Offline" && "bg-gaming-blue/80 text-white",
          )}
        >
          {mode}
        </div>
      </div>
      
      {/* Tournament Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        <div className="space-y-3 mb-4">
          {/* Date */}
          <div className="flex items-center text-sm text-white/70">
            <Calendar className="h-4 w-4 mr-2 text-gaming-purple" />
            <span>{date}</span>
          </div>
          
          {/* Team Size */}
          <div className="flex items-center text-sm text-white/70">
            <Users className="h-4 w-4 mr-2 text-gaming-purple" />
            <span>{teamSize}</span>
          </div>
          
          {/* Prize Pool */}
          <div className="flex items-center text-sm text-white/70">
            <Trophy className="h-4 w-4 mr-2 text-gaming-orange" />
            <span>{prizePool}</span>
          </div>
        </div>
        
        {/* Registration Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/70">Registration</span>
            <span className="text-white/90">
              {registeredTeams}/{maxTeams} Teams
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gaming-purple to-gaming-purple-bright rounded-full"
              style={{ width: `${(registeredTeams / maxTeams) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Registration Details */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-white/70">
            Entry Fee
            <span className="block text-sm font-medium text-white">
              {entryFee}
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-gaming-purple hover:bg-gaming-purple-bright text-white"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
