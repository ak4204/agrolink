import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, IndianRupee } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PhotoScanner from "../components/PhotoScanner";

export default function AddTool() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price_per_day: "",
    location: "",
    owner_contact: "",
    images: []
  });
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const createToolMutation = useMutation({
    mutationFn: async (toolData) => {
      return await base44.entities.Tool.create(toolData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      navigate(createPageUrl("Profile"));
    },
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(r => r.file_url);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (err) {
      setError("Failed to upload images");
    }
    
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAIAnalysisComplete = (analysis) => {
    setAiAnalysis(analysis);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price_per_day || !formData.location) {
      setError("Please fill in all required fields");
      return;
    }

    await createToolMutation.mutateAsync({
      ...formData,
      price_per_day: parseFloat(formData.price_per_day),
      owner_name: user?.full_name || user?.email,
      is_available: true,
      ...aiAnalysis
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">List Your Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., John Deere 5075E Tractor"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tractor">Tractor</SelectItem>
                  <SelectItem value="Harvester">Harvester</SelectItem>
                  <SelectItem value="Planter">Planter</SelectItem>
                  <SelectItem value="Sprayer">Sprayer</SelectItem>
                  <SelectItem value="Irrigation">Irrigation</SelectItem>
                  <SelectItem value="Tiller">Tiller</SelectItem>
                  <SelectItem value="Mower">Mower</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your equipment, its condition, and any special features..."
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per Day (₹) *</Label>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                    placeholder="500"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="City, State"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contact">Contact Phone</Label>
              <Input
                id="contact"
                value={formData.owner_contact}
                onChange={(e) => setFormData({...formData, owner_contact: e.target.value})}
                placeholder="+91 98765 43210"
                className="mt-2"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Equipment Photos (Max 3)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading || formData.images.length >= 3}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-stone-50 transition-colors ${
                    uploading || formData.images.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload className="w-5 h-5 text-stone-400" />
                  <span className="text-stone-600">
                    {uploading ? "Uploading..." : "Click to upload images"}
                  </span>
                </label>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="relative aspect-video bg-stone-200 rounded-lg overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Photo Scanner */}
            {formData.images.length > 0 && (
              <PhotoScanner 
                images={formData.images} 
                onAnalysisComplete={handleAIAnalysisComplete}
              />
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(createPageUrl("Profile"))}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createToolMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {createToolMutation.isPending ? "Listing..." : "List Equipment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}