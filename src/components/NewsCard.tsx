
import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  url: string;
  featured?: boolean;
}

const NewsCard = ({
  title,
  excerpt,
  image,
  date,
  category,
  url,
  featured = false,
}: NewsCardProps) => {
  return (
    <div className={cn(
      "gamer-card overflow-hidden group",
      featured ? "md:col-span-2" : ""
    )}>
      <div className="md:flex h-full">
        {/* Image */}
        <div className={cn(
          "relative",
          featured ? "md:w-1/2" : "md:w-2/5"
        )}>
          <img
            src={image}
            alt={title}
            className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div 
            className={cn(
              "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium",
              category === "Tournament" && "bg-gaming-purple/80 text-white",
              category === "Update" && "bg-gaming-blue/80 text-white",
              category === "Interview" && "bg-gaming-orange/80 text-white",
            )}
          >
            {category}
          </div>
        </div>
        
        {/* Content */}
        <div className={cn(
          "p-5",
          featured ? "md:w-1/2" : "md:w-3/5"
        )}>
          <div className="flex items-center text-xs text-white/70 mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{date}</span>
          </div>
          
          <h3 className={cn(
            "font-bold text-white mb-2 line-clamp-2",
            featured ? "text-xl" : "text-lg"
          )}>
            {title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-3">
            {excerpt}
          </p>
          
          <a
            href={url}
            className="inline-flex items-center text-gaming-purple hover:text-gaming-purple-bright transition-colors font-medium text-sm"
          >
            Read More
            <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
