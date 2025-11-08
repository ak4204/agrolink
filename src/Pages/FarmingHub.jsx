import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, TrendingUp, Newspaper, Sparkles, ArrowRight, Calendar, IndianRupee } from "lucide-react";
import ChatBot from "../components/ChatBot";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmingHub() {
  const navigate = useNavigate();
  
  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.Tool.list("-created_date", 6),
    initialData: [],
  });

  const { data: crops, isLoading: cropsLoading } = useQuery({
    queryKey: ['crops'],
    queryFn: () => base44.entities.Crop.list(),
    initialData: [],
  });

  const popularCrops = [
    {
      name: "Wheat",
      season: "Rabi (Oct-Mar)",
      investment: "Medium",
      profit: "High",
      difficulty: "Easy",
      tools: ["Tractor", "Planter", "Harvester"],
      description: "Most popular crop in India, excellent for beginners with stable market demand",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400"
    },
    {
      name: "Rice",
      season: "Kharif (Jun-Oct)",
      investment: "High",
      profit: "High",
      difficulty: "Medium",
      tools: ["Tractor", "Irrigation", "Harvester"],
      description: "Staple crop requiring good water management, high demand throughout the year",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
    },
    {
      name: "Tomatoes",
      season: "Year-round",
      investment: "Medium",
      profit: "Very High",
      difficulty: "Medium",
      tools: ["Tiller", "Sprayer", "Irrigation"],
      description: "Highly profitable vegetable with consistent market demand across India",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400"
    },
    {
      name: "Maize",
      season: "Kharif (Jun-Sep)",
      investment: "Low",
      profit: "Medium",
      difficulty: "Easy",
      tools: ["Tractor", "Planter", "Harvester"],
      description: "Versatile crop suitable for various climates, great for beginners",
      image: "https://images.unsplash.com/photo-1605664515727-ed2f51cfae1f?w=400"
    },
    {
      name: "Sugarcane",
      season: "Year-round",
      investment: "High",
      profit: "Very High",
      difficulty: "Hard",
      tools: ["Tractor", "Irrigation", "Harvester"],
      description: "Long-term investment crop with excellent returns, needs sustained care",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
    },
    {
      name: "Potato",
      season: "Rabi (Oct-Jan)",
      investment: "Medium",
      profit: "High",
      difficulty: "Easy",
      tools: ["Tiller", "Planter", "Harvester"],
      description: "Quick growing crop with good profit margins, perfect for small farms",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"
    }
  ];

  const farmingNews = [
    {
      title: "Government Announces New Agricultural Subsidy Scheme",
      date: "2 days ago",
      category: "Policy",
      summary: "New subsidies for farm equipment and irrigation systems to boost agricultural productivity"
    },
    {
      title: "Precision Farming Technology Revolutionizing Indian Agriculture",
      date: "1 week ago",
      category: "Technology",
      summary: "GPS-guided tractors and drones helping farmers optimize crop yields"
    },
    {
      title: "Organic Farming Demand Surges by 40% This Year",
      date: "2 weeks ago",
      category: "Market Trends",
      summary: "Increasing consumer demand for organic produce creates new opportunities for farmers"
    },
    {
      title: "Best Practices for Monsoon Season Preparation",
      date: "3 weeks ago",
      category: "Tips",
      summary: "Essential steps to protect crops and equipment during heavy rainfall"
    }
  ];

  const handleViewTools = (toolCategories) => {
    navigate(createPageUrl("Home") + `?category=${toolCategories[0]}`);
  };

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-emerald-200 text-sm font-medium">AI-Powered Farming Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Farming Information Hub
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Discover the best crops for your farm, learn modern techniques, and stay updated with latest agricultural trends
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Crops Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Popular Crops for New Farmers</h2>
              <p className="text-stone-600">Start your farming journey with these beginner-friendly crops</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCrops.map((crop, idx) => (
              <Card key={idx} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className="aspect-video bg-stone-200 overflow-hidden relative">
                  <img 
                    src={crop.image} 
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-emerald-700 border-0 shadow-lg">
                      {crop.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-stone-800 mb-3">{crop.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Season:</span>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                        <Calendar className="w-3 h-3 mr-1" />
                        {crop.season}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Investment:</span>
                      <Badge variant="outline" className={
                        crop.investment === "Low" ? "border-green-200 text-green-700" :
                        crop.investment === "Medium" ? "border-yellow-200 text-yellow-700" :
                        "border-orange-200 text-orange-700"
                      }>
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {crop.investment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Profit:</span>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {crop.profit}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                    {crop.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-stone-700 mb-2">Required Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {crop.tools.map((tool, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-stone-100">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleViewTools(crop.tools)}
                    variant="outline" 
                    className="w-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    View Required Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Tools Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Recently Added Equipment</h2>
              <p className="text-stone-600">Check out the latest tools available on AgroLink</p>
            </div>
          </div>

          {toolsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <div className="aspect-video bg-stone-200 overflow-hidden relative">
                    <img 
                      src={tool.images?.[0] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"} 
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-emerald-600">
                      {tool.category}
                    </Badge>
                    {tool.ai_condition_score && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">
                          {tool.ai_condition_score}/5
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-stone-800 mb-2 line-clamp-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                      {tool.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span className="text-2xl font-bold text-emerald-600">
                          {tool.price_per_day}
                        </span>
                        <span className="text-stone-500 text-sm">/day</span>
                      </div>
                      <Link to={`${createPageUrl("ToolDetail")}?id=${tool.id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to={createPageUrl("Home")}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse All Equipment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Farming News Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Farming News & Updates</h2>
              <p className="text-stone-600">Stay informed with the latest agricultural trends and insights</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {farmingNews.map((news, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-stone-500">{news.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-800 mb-2">
                    {news.title}
                  </h3>
                  
                  <p className="text-stone-600 mb-4">
                    {news.summary}
                  </p>
                  
                  <Button variant="link" className="p-0 h-auto text-emerald-600 hover:text-emerald-700">
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need Help Getting Started?</h2>
            <p className="text-emerald-100 text-lg mb-6">
              Our AI farming assistant can guide you through crop selection, equipment needs, and best practices for your region
            </p>
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
              Chat with AI Assistant
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
}