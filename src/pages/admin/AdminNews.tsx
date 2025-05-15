import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, Bell } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string;
  is_featured: boolean;
  author_id: string;
}

const AdminNews = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    imageUrl: "",
    isFeatured: false
  });

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        throw error;
      }

      setNewsItems(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to load news items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to publish news",
          variant: "destructive",
        });
        return;
      }
      const newsData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        image_url: formData.imageUrl || null,
        is_featured: !!formData.isFeatured,
        author_id: userData.user.id,
        published_at: new Date().toISOString(),
      };
      console.log("newsData being sent:", newsData);
      let result;
      if (isEditing && currentNewsId) {
        result = await supabase
          .from("news")
          .update(newsData)
          .eq("id", currentNewsId);
      } else {
        result = await supabase
          .from("news")
          .insert([newsData]);
      }
      if (result.error) {
        throw result.error;
      }
      toast({
        title: "Success",
        description: isEditing ? "News updated successfully" : "News published successfully",
      });
      setFormData({
        title: "",
        content: "",
        category: "General",
        imageUrl: "",
        isFeatured: false
      });
      setIsCreating(false);
      setIsEditing(false);
      setCurrentNewsId(null);
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: "Error",
        description: "Failed to save news. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (news: NewsItem) => {
    setFormData({
      title: news.title,
      content: news.content,
      category: news.category,
      imageUrl: news.image_url || "",
      isFeatured: news.is_featured
    });
    
    setCurrentNewsId(news.id);
    setIsEditing(true);
    setIsCreating(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) {
      return;
    }
    
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "News deleted successfully",
      });
      
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "Error",
        description: "Failed to delete news. Please try again.",
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
              <h1 className="text-3xl font-bold text-gradient">News Management</h1>
              <p className="text-white/70">Create and manage news articles</p>
            </div>
            <div className="flex space-x-4">
              {!isCreating ? (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  Create News
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
                <h2 className="text-xl font-bold">{isEditing ? "Edit News" : "Create News"}</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setCurrentNewsId(null);
                    setFormData({
                      title: "",
                      content: "",
                      category: "General",
                      imageUrl: "",
                      isFeatured: false
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="News title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Tournaments">Tournaments</option>
                    <option value="Updates">Updates</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="News content"
                    rows={6}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured">Feature this news article</label>
                </div>
                
                <Button
                  type="submit"
                  className="bg-gaming-purple hover:bg-gaming-purple-bright"
                >
                  {isEditing ? "Update News" : "Publish News"}
                </Button>
              </form>
            </div>
          )}

          <div className="gamer-card p-6">
            <h2 className="text-xl font-bold mb-4">News Articles</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Bell className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No news articles found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <div key={news.id} className="bg-gaming-dark-purple/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{news.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-white/70 mb-2">
                          <span className="bg-gaming-purple/30 px-2 py-0.5 rounded">{news.category}</span>
                          <span>•</span>
                          <span>{new Date(news.published_at).toLocaleDateString()}</span>
                          {news.is_featured && (
                            <>
                              <span>•</span>
                              <span className="text-gaming-purple">Featured</span>
                            </>
                          )}
                        </div>
                        <p className="text-white/70 line-clamp-2">{news.content}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(news)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(news.id)}
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

export default AdminNews;
