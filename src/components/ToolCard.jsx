import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, ArrowRight, Star, Sparkles, IndianRupee } from "lucide-react";

export default function ToolCard({ tool }) {
  const primaryImage = tool.images?.[0] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400";

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white">
      <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden">
        <img 
          src={primaryImage} 
          alt={tool.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Badge className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-700 border-0 shadow-lg">
          {tool.category}
        </Badge>
        {tool.is_available && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-emerald-600">Available</span>
          </div>
        )}
        {tool.ai_condition_score && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-stone-800">AI Verified</span>
            <div className="flex gap-0.5 ml-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < tool.ai_condition_score
                      ? "fill-emerald-500 text-emerald-500"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-stone-800 mb-3 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {tool.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <span className="line-clamp-1">{tool.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <User className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <span className="line-clamp-1">{tool.owner_name || tool.created_by}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
          <div>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-4 h-4 text-emerald-600 mt-1" />
              <span className="text-3xl font-bold text-emerald-600">
                {tool.price_per_day}
              </span>
              <span className="text-stone-500 text-sm font-medium">/day</span>
            </div>
          </div>
          
          <Link to={`${createPageUrl("ToolDetail")}?id=${tool.id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 group/btn">
              View
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}