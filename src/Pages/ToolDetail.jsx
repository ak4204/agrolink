import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, MapPin, User, Phone, Calendar, IndianRupee, CheckCircle } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import ChatBot from "../components/ChatBot";
import AIAnalysisBox from "../components/AIAnalysisBox";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToolDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const toolId = urlParams.get("id");
  
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: tool, isLoading } = useQuery({
    queryKey: ['tool', toolId],
    queryFn: async () => {
      const tools = await base44.entities.Tool.filter({ id: toolId });
      return tools[0];
    },
    enabled: !!toolId,
  });

  const calculateTotal = () => {
    if (!startDate || !endDate || !tool) return 0;
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    return days > 0 ? days * tool.price_per_day : 0;
  };

  const handleBooking = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select rental dates");
      return;
    }

    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    if (days <= 0) {
      alert("End date must be after start date");
      return;
    }

    const bookingId = `BK${Date.now()}`;
    
    const bookingData = {
      tool_id: tool.id,
      tool_name: tool.name,
      tool_image: tool.images?.[0] || "",
      owner_id: tool.created_by,
      owner_name: tool.owner_name || tool.created_by,
      renter_id: user.email,
      renter_name: user.full_name,
      start_date: startDate,
      end_date: endDate,
      total_price: calculateTotal(),
      status: "confirmed",
      booking_id: bookingId
    };

    // Navigate to payment page
    navigate(createPageUrl("Payment") + `?data=${encodeURIComponent(JSON.stringify(bookingData))}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert>
          <AlertDescription>Tool not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const images = tool.images?.length > 0 
    ? tool.images 
    : ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"];

  const days = startDate && endDate ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1 : 0;

  return (
    <div className="bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-6 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Images & Details */}
          <div className="md:col-span-3">
            <div className="aspect-[4/3] bg-stone-200 rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img
                src={images[selectedImageIndex]}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-video bg-stone-200 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx 
                        ? "border-emerald-600 shadow-md scale-105" 
                        : "border-transparent hover:border-stone-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* AI Analysis */}
            {tool.ai_condition_score && (
              <div className="mb-6">
                <AIAnalysisBox analysis={tool} />
              </div>
            )}

            {/* Description Card */}
            <Card className="mb-6 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">About This Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 leading-relaxed">
                  {tool.description}
                </p>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-stone-700">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{tool.owner_name || tool.created_by}</p>
                    <p className="text-sm text-stone-500">Equipment Owner</p>
                  </div>
                </div>
                {tool.owner_contact && (
                  <div className="flex items-center gap-3 text-stone-700 pt-2 border-t border-stone-100">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{tool.owner_contact}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <Badge className="mb-3 bg-emerald-600 hover:bg-emerald-700 text-sm px-3 py-1">
                {tool.category}
              </Badge>
              
              <h1 className="text-3xl font-bold text-stone-800 mb-3">
                {tool.name}
              </h1>
              
              <div className="flex items-center gap-2 text-stone-600 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{tool.location}</span>
              </div>

              {/* Booking Card */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-stone-100">
                    <IndianRupee className="w-6 h-6 text-emerald-600 mt-1" />
                    <span className="text-4xl font-bold text-emerald-600">
                      {tool.price_per_day}
                    </span>
                    <span className="text-stone-600 text-lg">/day</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || format(new Date(), "yyyy-MM-dd")}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {startDate && endDate && days > 0 && (
                    <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-stone-600">
                          ₹{tool.price_per_day} x {days} {days === 1 ? 'day' : 'days'}
                        </span>
                        <span className="font-semibold text-stone-800">
                          ₹{tool.price_per_day * days}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                        <span className="font-semibold text-stone-800">Total</span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{calculateTotal()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={!startDate || !endDate}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </Button>

                  <p className="text-xs text-stone-500 text-center mt-4">
                    Secure payment with Razorpay • EMI options available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
}