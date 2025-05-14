
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Search } from "lucide-react";

const News = () => {
  const featuredNews = {
    title: "Free Fire Pro League Season 5 Announcement",
    excerpt: "The biggest Free Fire tournament of the year is back with Season 5! Registration opens next week with a total prize pool of ₹2,000,000. Teams from all over India will compete for the ultimate championship. The tournament will feature multiple stages, including qualifiers, group stages, and playoffs, culminating in a grand finals event in Delhi.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    date: "May 10, 2025",
    category: "Tournament",
    url: "#",
    featured: true,
  };
  
  const newsItems = [
    {
      title: "Interview with Last Season's MVP",
      excerpt: "We sat down with 'HeadHunter', the MVP from last season's championship team to discuss strategies, team dynamics, and preparations for the upcoming tournaments. HeadHunter reveals his training routine and the secret behind his impressive performance.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      date: "May 8, 2025",
      category: "Interview",
      url: "#",
    },
    {
      title: "New Anti-Cheat Measures Implemented",
      excerpt: "FireTourneys has implemented advanced anti-cheat measures to ensure fair play in all tournaments. Learn about the new technology and reporting system designed to keep competitions fair and balanced for all participants.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "May 5, 2025",
      category: "Update",
      url: "#",
    },
    {
      title: "Top 5 Landing Spots in the New Free Fire Map",
      excerpt: "Our experts analyze the best landing spots in the newly released Free Fire map. This guide includes strategic locations, loot quality ratings, and rotation recommendations for competitive play.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      date: "May 3, 2025",
      category: "Guide",
      url: "#",
    },
    {
      title: "Free Fire Masters Cup Registration Details",
      excerpt: "Everything you need to know about registering for the upcoming Free Fire Masters Cup. Learn about eligibility requirements, team composition rules, and the registration process for this exciting tournament.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "April 30, 2025",
      category: "Tournament",
      url: "#",
    },
    {
      title: "Phoenix Squad Announces New Roster",
      excerpt: "Phoenix Squad, last season's runner-up, has announced major changes to their roster ahead of the upcoming Free Fire Pro League Season 5. The team is bringing in two new players in hopes of claiming the championship.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      date: "April 28, 2025",
      category: "Team News",
      url: "#",
    },
    {
      title: "Free Fire Solo Championship Format Revealed",
      excerpt: "The format for the upcoming Free Fire Solo Championship has been revealed. The tournament will feature a unique scoring system that balances eliminations and placement points to find the ultimate solo player.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "April 25, 2025",
      category: "Tournament",
      url: "#",
    },
  ];

  const categories = [
    "All",
    "Tournament",
    "Team News",
    "Update",
    "Interview",
    "Guide",
  ];

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
                  />
                </div>
                <div className="flex gap-4 overflow-x-auto py-1 no-scrollbar">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                        index === 0
                          ? "bg-gaming-purple text-white"
                          : "bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured News */}
          <div className="mb-8">
            <NewsCard {...featuredNews} />
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <NewsCard key={index} {...item} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-purple text-white">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-white/70">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gaming-dark/50 text-white/70 hover:bg-gaming-purple/20 hover:text-white">8</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
