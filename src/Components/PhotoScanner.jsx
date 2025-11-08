import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIAnalysisBox from "./AIAnalysisBox";

export default function PhotoScanner({ images, onAnalysisComplete }) {
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setError("Unable to access camera. Please upload images instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const file = new File([blob], `equipment-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
      stopCamera();
      await analyzeImages([file]);
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await analyzeImages(files);
    }
  };

  const analyzeImages = async (files) => {
    setScanning(true);
    setError("");

    try {
      // Upload images first if they're files
      let imageUrls = images;
      
      if (files && files.length > 0) {
        const uploadPromises = files.map(file => 
          base44.integrations.Core.UploadFile({ file })
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map(r => r.file_url);
      }

      if (imageUrls.length === 0) {
        setError("Please upload at least one image to analyze");
        setScanning(false);
        return;
      }

      // Analyze with AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert farm equipment inspector. Analyze the provided equipment photos and provide:

1. Condition Score (1-5): Rate the overall condition
2. Detailed Feedback: Describe the visible condition, maintenance quality, and any concerns
3. Reliability Estimate: Low, Medium, or High based on visual assessment
4. Photo Presentation Tips: Suggest improvements for better photos (lighting, angles, etc.)

Provide your response as a structured analysis.`,
        file_urls: imageUrls,
        response_json_schema: {
          type: "object",
          properties: {
            condition_score: { type: "number", description: "Rating from 1-5" },
            feedback: { type: "string", description: "Detailed condition assessment" },
            reliability: { type: "string", description: "Low, Medium, or High" },
            presentation_tips: { type: "string", description: "Photo improvement suggestions" }
          }
        }
      });

      const analysisData = {
        ai_condition_score: result.condition_score,
        ai_feedback: result.feedback,
        ai_reliability_score: result.reliability,
        ai_presentation_tips: result.presentation_tips,
        last_analysis_date: new Date().toISOString()
      };

      setAnalysis(analysisData);
      onAnalysisComplete(analysisData);
    } catch (err) {
      setError("Failed to analyze images. Please try again.");
      console.error("Analysis error:", err);
    }

    setScanning(false);
  };

  return (
    <div className="space-y-4">
      {!analysis && !scanning && (
        <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">
                AI Equipment Scanner
              </h3>
              <p className="text-sm text-stone-600 mb-6">
                Get instant AI-powered condition analysis and ratings for your equipment
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Camera className="w-8 h-8" />
                  <span>Use Camera</span>
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Upload className="w-8 h-8" />
                  <span>Upload Photos</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              {images.length > 0 && (
                <Button
                  onClick={() => analyzeImages()}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Uploaded Images
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera View */}
      {showCamera && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <Button
                onClick={stopCamera}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={capturePhoto}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture & Analyze
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Scanning State */}
      {scanning && (
        <Card className="border-2 border-emerald-300 bg-emerald-50">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="font-semibold text-stone-800 mb-2">Analyzing Equipment...</p>
            <p className="text-sm text-stone-600">
              Our AI is examining the photos and generating a detailed condition report
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && <AIAnalysisBox analysis={analysis} />}
    </div>
  );
}