
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, Video } from "lucide-react";

interface StreamData {
  id: string;
  title: string;
  stream_url: string;
  thumbnail_url: string | null;
  streamer_name: string;
  is_live: boolean;
  created_at: string;
}

const AdminStreams = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    streamUrl: "",
    thumbnailUrl: "",
    streamerName: "",
    isLive: true
  });

  // Create streams table if it doesn't exist
  const createStreamsTableIfNeeded = async () => {
    try {
      // Check if the streams table exists
      const { data, error } = await supabase
        .from('streams')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist, we need to create it
        // In a real app, this should be done through proper migrations
        console.log("Streams table doesn't exist. You may need to create it in the Supabase dashboard.");
      }
      
      // For demo purposes, let's populate with mock data
      setStreams([
        {
          id: '1',
          title: 'Free Fire Championship Finals',
          stream_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: 'https://via.placeholder.com/320x180.png?text=Free+Fire+Stream',
          streamer_name: 'OfficialFreeFire',
          is_live: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Team Aura Practice Session',
          stream_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: 'https://via.placeholder.com/320x180.png?text=Team+Aura',
          streamer_name: 'TeamAuraOfficial',
          is_live: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (error) {
      console.error("Error checking for streams table:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createStreamsTableIfNeeded();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Mock the save operation since we don't have a real streams table yet
      if (isEditing && currentStreamId) {
        // Find and update the stream in our mock data
        setStreams(prev => prev.map(stream => 
          stream.id === currentStreamId ? {
            ...stream,
            title: formData.title,
            stream_url: formData.streamUrl,
            thumbnail_url: formData.thumbnailUrl,
            streamer_name: formData.streamerName,
            is_live: formData.isLive
          } : stream
        ));
      } else {
        // Add a new mock stream
        setStreams(prev => [
          {
            id: String(Date.now()),
            title: formData.title,
            stream_url: formData.streamUrl,
            thumbnail_url: formData.thumbnailUrl,
            streamer_name: formData.streamerName,
            is_live: formData.isLive,
            created_at: new Date().toISOString()
          },
          ...prev
        ]);
      }
      
      toast({
        title: "Success",
        description: isEditing ? "Stream updated successfully" : "Stream added successfully",
      });
      
      setFormData({
        title: "",
        streamUrl: "",
        thumbnailUrl: "",
        streamerName: "",
        isLive: true
      });
      
      setIsCreating(false);
      setIsEditing(false);
      setCurrentStreamId(null);
      
    } catch (error) {
      console.error("Error saving stream:", error);
      toast({
        title: "Error",
        description: "Failed to save stream. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stream: StreamData) => {
    setFormData({
      title: stream.title,
      streamUrl: stream.stream_url,
      thumbnailUrl: stream.thumbnail_url || "",
      streamerName: stream.streamer_name,
      isLive: stream.is_live
    });
    
    setCurrentStreamId(stream.id);
    setIsEditing(true);
    setIsCreating(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this stream?")) {
      return;
    }
    
    try {
      // Remove from our mock data
      setStreams(prev => prev.filter(stream => stream.id !== id));
      
      toast({
        title: "Success",
        description: "Stream deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting stream:", error);
      toast({
        title: "Error",
        description: "Failed to delete stream. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Stream Management</h1>
              <p className="text-white/70">Manage live and upcoming streams</p>
            </div>
            <div className="flex space-x-4">
              {!isCreating ? (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  Add Stream
                </Button>
              ) : null}
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {isCreating && (
            <div className="gamer-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditing ? "Edit Stream" : "Add Stream"}</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setCurrentStreamId(null);
                    setFormData({
                      title: "",
                      streamUrl: "",
                      thumbnailUrl: "",
                      streamerName: "",
                      isLive: true
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stream Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter stream title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Streamer Name</label>
                  <Input
                    name="streamerName"
                    value={formData.streamerName}
                    onChange={handleChange}
                    placeholder="Enter streamer name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Stream URL (YouTube or Twitch embed URL)</label>
                  <Input
                    name="streamUrl"
                    value={formData.streamUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <Input
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isLive"
                    name="isLive"
                    checked={formData.isLive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isLive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isLive">This stream is live now</label>
                </div>
                
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  {isEditing ? "Update Stream" : "Add Stream"}
                </Button>
              </form>
            </div>
          )}

          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">Manage Streams</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : streams.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Video className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No streams found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {streams.map((stream) => (
                  <div key={stream.id} className="bg-gaming-dark-purple/50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 relative flex-shrink-0">
                          <img 
                            src={stream.thumbnail_url || "https://via.placeholder.com/320x180.png?text=No+Thumbnail"} 
                            alt={stream.title}
                            className="w-full h-full object-cover rounded"
                          />
                          {stream.is_live && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                              LIVE
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{stream.title}</h3>
                          <p className="text-white/70">Streamer: {stream.streamer_name}</p>
                          <p className="text-white/50 text-sm">Added on: {new Date(stream.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(stream)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(stream.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminStreams;
