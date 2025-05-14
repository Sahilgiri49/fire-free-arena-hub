
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const NavbarAuth = () => {
  const { user, profile, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          to="/profile" 
          className="flex items-center gap-2 text-white hover:text-gaming-purple transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gaming-purple flex items-center justify-center">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <span className="hidden md:block">{profile?.username || 'Profile'}</span>
        </Link>
        <Button 
          variant="outline" 
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      <Link to="/login">
        <Button variant="ghost" className="text-white hover:text-gaming-purple hover:bg-transparent">
          Sign In
        </Button>
      </Link>
      <Link to="/register">
        <Button className="bg-gaming-purple hover:bg-gaming-purple-bright">
          Register
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAuth;
