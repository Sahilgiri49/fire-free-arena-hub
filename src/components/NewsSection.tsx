
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";

const NewsSection = () => {
  const news = [
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, index) => (
          <NewsCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
