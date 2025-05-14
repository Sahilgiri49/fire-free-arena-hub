
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Bell } from "lucide-react";

const AdminDashboard = () => {
  const { profile } = useAuth();
  
  const adminModules = [
    {
      title: "Tournaments",
      icon: <Trophy className="h-10 w-10" />,
      description: "Create and manage tournaments",
      href: "/admin/tournaments",
      color: "bg-gaming-purple",
    },
    {
      title: "Teams",
      icon: <Users className="h-10 w-10" />,
      description: "Manage team registrations and details",
      href: "/admin/teams",
      color: "bg-blue-600",
    },
    {
      title: "Matches & Schedule",
      icon: <Calendar className="h-10 w-10" />,
      description: "Create and manage match schedules",
      href: "/admin/schedule",
      color: "bg-green-600",
    },
    {
      title: "Leaderboard",
      icon: <Trophy className="h-10 w-10" />,
      description: "Update player and team rankings",
      href: "/admin/leaderboard",
      color: "bg-amber-600",
    },
    {
      title: "News & Announcements",
      icon: <Bell className="h-10 w-10" />,
      description: "Publish news and announcements",
      href: "/admin/news",
      color: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
            <p className="text-white/70">
              Welcome back, {profile?.full_name || profile?.username || "Admin"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => (
              <Link 
                key={index} 
                to={module.href} 
                className="gamer-card hover:border-gaming-purple transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center p-6 text-center">
                  <div className={`rounded-full ${module.color} p-4 mb-4`}>
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-white/70 mb-4">{module.description}</p>
                  <Button className="bg-gaming-purple hover:bg-gaming-purple-bright">
                    Manage
                  </Button>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="gamer-card p-4">
                <p className="text-white/70">Total Tournaments</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <div className="gamer-card p-4">
                <p className="text-white/70">Active Teams</p>
                <p className="text-3xl font-bold">16</p>
              </div>
              <div className="gamer-card p-4">
                <p className="text-white/70">Registered Players</p>
                <p className="text-3xl font-bold">64</p>
              </div>
              <div className="gamer-card p-4">
                <p className="text-white/70">Upcoming Matches</p>
                <p className="text-3xl font-bold">12</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
