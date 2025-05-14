
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Video, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "Tournaments", href: "/tournaments", icon: <Trophy size={18} /> },
    { title: "Teams", href: "/teams", icon: <Users size={18} /> },
    { title: "Schedule", href: "/schedule", icon: <Calendar size={18} /> },
    { title: "Live Streams", href: "/streams", icon: <Video size={18} /> },
    { title: "News", href: "/news", icon: <Bell size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gaming-purple/20 backdrop-blur-md bg-gaming-dark-purple/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-gaming-purple animate-pulse-glow flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gaming-dark" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">FireTourneys</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-gaming-purple/20 flex items-center gap-2 transition-colors"
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="hover:bg-gaming-purple/20 text-white/90 transition-colors"
              size="sm"
            >
              Login
            </Button>
            <Button
              className="bg-gaming-purple hover:bg-gaming-purple-bright text-white transition-colors"
              size="sm"
            >
              Register
            </Button>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-white/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-gaming-dark-purple/95 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-md font-medium text-white/80 hover:text-white hover:bg-gaming-purple/20 flex items-center gap-3 transition-colors"
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
          <div className="flex flex-col mt-4 gap-3 px-4">
            <Button
              variant="ghost"
              className="hover:bg-gaming-purple/20 text-white/90 transition-colors w-full justify-start"
            >
              Login
            </Button>
            <Button
              className="bg-gaming-purple hover:bg-gaming-purple-bright text-white transition-colors w-full"
            >
              Register
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
