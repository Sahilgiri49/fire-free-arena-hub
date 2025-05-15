import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categories = [
    "All",
    ...Array.from(new Set(displayNews.map((item) => item.category))).filter(Boolean),
  ];

  const filteredNews = selectedCategory === "All"
    ? displayNews
    : displayNews.filter((item) => item.category === selectedCategory);

  // Featured news: first item
  const featuredNews = filteredNews[0];
  const gridNews = filteredNews.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">News & Updates</h1>
            <p className="text-white/70">
              Stay informed with the latest Free Fire tournament news and updates
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="gamer-card p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    className="w-full bg-gaming-dark/50 border border-white/10 rounded-md py-2 px-10 text-white focus:outline-none focus:ring-2 focus:ring-gaming-purple/50"
                    // Add search logic if needed
                  />
                </div>
                <div className="flex gap-4 overflow-x-auto py-1 no-scrollbar">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                        selectedCategory === category
                          ? "bg-gaming-purple text-white"
                          : "bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
            </div>
          ) : (
            <>
              {/* Featured News */}
              {featuredNews && (
                <div className="mb-8">
                  <NewsCard
                    title={featuredNews.title}
                    excerpt={featuredNews.content || featuredNews.excerpt}
                    image={featuredNews.image_url || featuredNews.image}
                    date={featuredNews.published_at ? new Date(featuredNews.published_at).toLocaleDateString() : featuredNews.date}
                    category={featuredNews.category}
                    url={"/news"}
                    featured={featuredNews.is_featured || featuredNews.featured}
                  />
                </div>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridNews.map((item, index) => (
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

              {/* Pagination (static for now) */}
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-purple text-white">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">3</button>
                  <span className="w-10 h-10 flex items-center justify-center text-white/70">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">8</button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
