
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 to-gaming-blue/10" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-gradient-primary">Free Fire</span>{" "}
              <span className="text-gradient">Tournament Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Join the ultimate gaming competition. Register your team, 
              compete in tournaments, and battle for the top position on the leaderboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gaming-purple hover:bg-gaming-purple-bright text-white transition-all group"
              >
                <Trophy className="mr-2 h-5 w-5 group-hover:animate-float" />
                Join Tournament
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white transition-all"
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Schedule
              </Button>
            </div>
            
            {/* Stats Counter */}
            <div className="flex flex-wrap mt-12 gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-gaming-purple">12+</p>
                <p className="text-white/60 text-sm">Active Tournaments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gaming-purple">250+</p>
                <p className="text-white/60 text-sm">Teams Registered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gaming-purple">10K+</p>
                <p className="text-white/60 text-sm">Monthly Players</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative lg:block">
            <div className="gamer-card p-3 neon-glow animate-pulse-glow">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Free Fire Tournament" 
                className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 rounded-lg flex items-center space-x-2">
              <Users className="h-5 w-5 text-gaming-purple" />
              <span className="text-white font-medium">Squad Mode</span>
            </div>
            
            <div className="absolute -top-4 -right-4 glass-card px-4 py-2 rounded-lg flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-gaming-orange" />
              <span className="text-white font-medium">₹50,000 Prize Pool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
