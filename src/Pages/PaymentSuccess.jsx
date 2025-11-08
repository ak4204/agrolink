import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, User, Sparkles } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  useEffect(() => {
    // Simple confetti-like animation
    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 2 + 's';
      document.getElementById('sparkle-container')?.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 3000);
    };

    const interval = setInterval(createSparkle, 200);
    setTimeout(() => clearInterval(interval), 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div id="sparkle-container" className="absolute inset-0 pointer-events-none">
        <style>{`
          .sparkle {
            position: absolute;
            top: -10px;
            width: 10px;
            height: 10px;
            background: linear-gradient(45deg, #10b981, #34d399);
            border-radius: 50%;
            animation: fall 3s linear forwards;
            opacity: 0.8;
          }
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      <Card className="max-w-md w-full border-0 shadow-2xl relative z-10">
        <CardContent className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-500 absolute -bottom-1 -left-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            Payment Successful! 🎉
          </h1>

          <p className="text-stone-600 mb-6">
            Your booking has been confirmed. The equipment owner will contact you shortly with pickup details.
          </p>

          {bookingId && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-stone-600 mb-1">Booking Reference</p>
              <p className="text-lg font-bold text-emerald-600 font-mono">{bookingId}</p>
              <p className="text-xs text-stone-500 mt-2">Save this for your records</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>💳 Payment Mode:</strong> Demo Razorpay (Fake Payment)
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This is a demonstration. No real payment was processed.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate(createPageUrl("Profile"))}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
            >
              <User className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>

            <Button 
              onClick={() => navigate(createPageUrl("Home"))}
              variant="outline"
              className="w-full h-12"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-stone-500 mt-6">
            You'll receive a confirmation notification shortly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}