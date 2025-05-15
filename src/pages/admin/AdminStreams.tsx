
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Define a mock stream type since there's no streams table in Supabase yet
interface Stream {
  id: string;
  title: string;
  description: string;
  stream_url: string;
  thumbnail_url: string;
  is_live: boolean;
  scheduled_for: string;
}

const AdminStreams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [streams, setStreams] = useState<Stream[]>([]);
  
  // Form state
  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    stream_url: "",
    thumbnail_url: "",
    scheduled_for: "",
  });

  useEffect(() => {
    // Since there's no streams table, we'll use mock data
    const fetchStreams = async () => {
      try {
        // In future, this would be replaced with a real Supabase query
        // const { data, error } = await supabase.from("streams").select("*");
        
        // Mock data for now
        const mockStreams: Stream[] = [
          {
            id: "1",
            title: "Free Fire Tournament Finals",
            description: "Watch the exciting finals of our monthly tournament",
            stream_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
            is_live: true,
            scheduled_for: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Pro Player Showcase",
            description: "Top players showing their skills",
            stream_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
            is_live: false,
            scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setStreams(mockStreams);
      } catch (error) {
        console.error("Error fetching streams:", error);
        toast({
          title: "Error",
          description: "Failed to fetch streams",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStream(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock adding a stream - would be replaced with Supabase
      // const { data, error } = await supabase.from("streams").insert([newStream]).select();
      
      // Mock implementation
      const newStreamWithId: Stream = {
        ...newStream,
        id: Date.now().toString(),
        is_live: false,
        scheduled_for: newStream.scheduled_for || new Date().toISOString(),
      };
      
      setStreams(prev => [...prev, newStreamWithId]);
      setNewStream({
        title: "",
        description: "",
        stream_url: "",
        thumbnail_url: "",
        scheduled_for: "",
      });
      
      toast({
        title: "Success",
        description: "Stream added successfully",
      });
    } catch (error) {
      console.error("Error adding stream:", error);
      toast({
        title: "Error",
        description: "Failed to add stream",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStream = async (id: string) => {
    try {
      // This would be a Supabase delete in production
      // await supabase.from("streams").delete().eq("id", id);
      
      // Mock implementation
      setStreams(streams.filter(stream => stream.id !== id));
      toast({
        title: "Success",
        description: "Stream deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting stream:", error);
      toast({
        title: "Error",
        description: "Failed to delete stream",
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
              <p className="text-white/70">Manage live streams and broadcasts</p>
            </div>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="gamer-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Stream</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stream Title</label>
                <Input
                  name="title"
                  value={newStream.title}
                  onChange={handleChange}
                  placeholder="Free Fire Tournament Finals"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  name="description"
                  value={newStream.description}
                  onChange={handleChange}
                  placeholder="Watch the exciting finals of our monthly tournament"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stream URL (YouTube embed)</label>
                <Input
                  name="stream_url"
                  value={newStream.stream_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <Input
                  name="thumbnail_url"
                  value={newStream.thumbnail_url}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date</label>
                <Input
                  type="datetime-local"
                  name="scheduled_for"
                  value={newStream.scheduled_for}
                  onChange={handleChange}
                />
              </div>
              
              <Button
                type="submit"
                className="bg-gaming-purple hover:bg-gaming-purple-bright"
                disabled={isLoading}
              >
                {isLoading ? "Adding Stream..." : "Add Stream"}
              </Button>
            </form>
          </div>

          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">Manage Streams</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading streams...</div>
            ) : streams.length === 0 ? (
              <div className="text-center py-8 text-white/70">No streams available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {streams.map((stream) => (
                  <div key={stream.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{
                        backgroundImage: stream.thumbnail_url
                          ? `url(${stream.thumbnail_url})`
                          : "url('https://images.unsplash.com/photo-1542751371-adc38448a05e')",
                      }}
                    >
                      {stream.is_live && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs rounded bg-red-600 text-white flex items-center">
                            <span className="h-2 w-2 bg-white rounded-full mr-1"></span>
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{stream.title}</h3>
                      <p className="text-sm text-white/70 mb-2">{stream.description}</p>
                      <div className="flex justify-between mb-4">
                        <span className="text-xs text-white/50">
                          {stream.is_live 
                            ? "Streaming now" 
                            : `Scheduled for: ${new Date(stream.scheduled_for).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(stream.stream_url, "_blank")}
                        >
                          View Stream
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteStream(stream.id)}
                        >
                          Delete
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
