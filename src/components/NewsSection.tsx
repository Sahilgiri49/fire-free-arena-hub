import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";
import { supabase } from "@/integrations/supabase/client";

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error) setNews(data || []);
      setIsLoading(false);
    };
    fetchNews();
  }, []);

  // Fallback mock data
  const mockNews = [
    {
      title: "Free Fire Pro League Season 5 Announcement",
      excerpt: "The biggest Free Fire tournament of the year is back with Season 5! Registration opens next week with a total prize pool of ₹2,000,000. Teams from all over India will compete for the ultimate championship.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "May 10, 2025",
      category: "Tournament",
      url: "#",
      featured: true,
    },
    {
      title: "Interview with Last Season's MVP",
      excerpt: "We sat down with 'HeadHunter', the MVP from last season's championship team to discuss strategies, team dynamics, and preparations for the upcoming tournaments.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      date: "May 8, 2025",
      category: "Interview",
      url: "#",
    },
    {
      title: "New Anti-Cheat Measures Implemented",
      excerpt: "FireTourneys has implemented advanced anti-cheat measures to ensure fair play in all tournaments. Learn about the new technology and reporting system.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "May 5, 2025",
      category: "Update",
      url: "#",
    },
  ];

  const displayNews = news.length > 0 ? news : mockNews;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Latest News
          </h2>
          <p className="text-white/70">
            Stay updated with the latest tournament announcements and esports news
          </p>
        </div>
        <Button
          variant="outline"
          className="border-gaming-purple/50 text-gaming-purple hover:bg-gaming-purple/20 hover:text-white"
        >
          View All News
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayNews.map((item, index) => (
            <NewsCard
              key={item.id || index}
              title={item.title}
              excerpt={item.content || item.excerpt}
              image={item.image_url || item.image}
              date={item.published_at ? new Date(item.published_at).toLocaleDateString() : item.date}
              category={item.category}
              url={"/news"}
              featured={item.is_featured || item.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
