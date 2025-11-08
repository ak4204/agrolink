import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Tractor, Users, Shield, TrendingUp, IndianRupee } from "lucide-react";
import ToolCard from "../components/ToolCard";
import ChatBot from "../components/ChatBot";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  useEffect(() => {
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
  }, [categoryParam]);

  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.Tool.list("-created_date"),
    initialData: [],
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    const matchesLocation = !locationFilter || tool.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation && tool.is_available !== false;
  });

  const totalValue = tools.reduce((sum, tool) => sum + (tool.price_per_day || 0), 0);

  const stats = [
    { label: "Equipment Listed", value: tools.length, icon: Tractor },
    { label: "Total Value", value: `₹${totalValue.toLocaleString('en-IN')}`, icon: IndianRupee },
    { label: "Trust & Safety", value: "100%", icon: Shield },
    { label: "Cost Savings", value: "40%", icon: TrendingUp }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
              <span className="text-emerald-200 text-sm font-medium">🌾 Connecting Farmers Nationwide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Share Equipment.<br />
              <span className="text-emerald-400">Save Money.</span><br />
              Grow Together.
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 leading-relaxed">
              Access lakhs worth of farm equipment without the massive investment. Rent what you need, when you need it.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-500 w-5 h-5" />
                  <Input
                    placeholder="Search tractors, harvesters, planters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="md:w-56 h-12 border-0 bg-stone-50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    <SelectItem value="Tractor">Tractors</SelectItem>
                    <SelectItem value="Harvester">Harvesters</SelectItem>
                    <SelectItem value="Planter">Planters</SelectItem>
                    <SelectItem value="Sprayer">Sprayers</SelectItem>
                    <SelectItem value="Irrigation">Irrigation</SelectItem>
                    <SelectItem value="Tiller">Tillers</SelectItem>
                    <SelectItem value="Mower">Mowers</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="md:w-56 h-12 border-0 bg-stone-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-stone-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-stone-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">
                {categoryFilter === "all" ? "Available Equipment" : `${categoryFilter}s`}
              </h2>
              <p className="text-stone-600 mt-1">
                {filteredTools.length} {filteredTools.length === 1 ? 'listing' : 'listings'} found
              </p>
            </div>
            
            {searchTerm && (
              <div className="bg-white px-4 py-2 rounded-lg border border-stone-200">
                <span className="text-sm text-stone-600">
                  Searching for: <span className="font-semibold text-stone-800">"{searchTerm}"</span>
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-56 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-stone-300">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-800 text-xl font-semibold mb-2">No equipment found</p>
              <p className="text-stone-600">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              How AgroLink Works
            </h2>
            <p className="text-xl text-stone-600">Simple, fast, and reliable equipment sharing</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Browse & Search</h3>
              <p className="text-stone-600">Find the perfect equipment in your area with our easy search filters</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Book & Pay</h3>
              <p className="text-stone-600">Select your dates, pay securely with Razorpay - EMI options available</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Get to Work</h3>
              <p className="text-stone-600">Pick up the equipment and focus on what matters - your farm</p>
            </div>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
}