
import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="gamer-card p-8 md:p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gaming-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gaming-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Ready to Compete?</h2>
            <p className="text-white/80 text-lg mb-6 max-w-xl">
              Join thousands of players competing in Free Fire tournaments. 
              Register your team today and start your journey to the top.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
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
                <Users className="mr-2 h-5 w-5" />
                Create Team
              </Button>
            </div>
          </div>
          
          {/* Stats or Icon */}
          <div className="w-40 h-40 rounded-full bg-gaming-purple/10 flex items-center justify-center animate-pulse-glow">
            <div className="w-32 h-32 rounded-full bg-gaming-purple/20 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-gaming-purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
