
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          bio,
        })
        .eq("id", user.id);
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="gamer-card p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gradient">My Profile</h1>
              <div className="space-x-4">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="destructive" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gaming-dark-purple/50 rounded-lg p-6 mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      rows={4} 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gaming-purple">Email</h2>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gaming-purple">Username</h2>
                    <p>{profile.username || "Not set"}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gaming-purple">Full Name</h2>
                    <p>{profile.full_name || "Not set"}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gaming-purple">Bio</h2>
                    <p>{profile.bio || "No bio provided"}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gaming-dark-purple/50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gaming-dark-purple rounded-lg p-4 text-center">
                  <p className="text-sm text-white/70">Total Matches</p>
                  <p className="text-3xl font-bold text-gaming-purple">0</p>
                </div>
                <div className="bg-gaming-dark-purple rounded-lg p-4 text-center">
                  <p className="text-sm text-white/70">Tournaments Won</p>
                  <p className="text-3xl font-bold text-gaming-purple">0</p>
                </div>
                <div className="bg-gaming-dark-purple rounded-lg p-4 text-center">
                  <p className="text-sm text-white/70">K/D Ratio</p>
                  <p className="text-3xl font-bold text-gaming-purple">0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
