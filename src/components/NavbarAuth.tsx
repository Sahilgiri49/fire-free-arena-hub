
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User, Settings } from "lucide-react";

interface NavbarAuthProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

const NavbarAuth: React.FC<NavbarAuthProps> = ({ isMobile = false, closeMenu }) => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    if (closeMenu) closeMenu();
  };

  const handleLinkClick = () => {
    if (closeMenu) closeMenu();
  };

  if (user) {
    return (
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
        <Link 
          to="/profile" 
          className="flex items-center gap-2 text-white hover:text-gaming-purple transition-colors"
          onClick={handleLinkClick}
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
          <span className={isMobile ? "block" : "hidden md:block"}>{profile?.username || 'Profile'}</span>
        </Link>

        {/* Admin Dashboard Link (only show for admins) */}
        {profile?.is_admin && (
          <Link
            to="/admin"
            className={`flex items-center gap-2 text-white hover:text-gaming-purple transition-colors ${isMobile ? 'py-2' : ''}`}
            onClick={handleLinkClick}
          >
            <Settings className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
        )}
        
        <Button 
          variant="outline" 
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
      <Link to="/login" onClick={handleLinkClick}>
        <Button variant="ghost" className="text-white hover:text-gaming-purple hover:bg-transparent">
          Sign In
        </Button>
      </Link>
      <Link to="/register" onClick={handleLinkClick}>
        <Button className="bg-gaming-purple hover:bg-gaming-purple-bright">
          Register
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAuth;
