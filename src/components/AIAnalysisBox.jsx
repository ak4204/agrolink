import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function AIAnalysisBox({ analysis }) {
  if (!analysis || !analysis.ai_condition_score) return null;

  const getConditionColor = (score) => {
    if (score >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getReliabilityIcon = (reliability) => {
    if (reliability === "High") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (reliability === "Medium") return <TrendingUp className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-orange-600" />;
  };

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          AI Equipment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Condition Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-stone-700">Condition Rating</span>
            <Badge className={`${getConditionColor(analysis.ai_condition_score)} border`}>
              {analysis.ai_condition_score}/5
            </Badge>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < analysis.ai_condition_score
                    ? "fill-emerald-500 text-emerald-500"
                    : "text-stone-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        {analysis.ai_feedback && (
          <div className="bg-white rounded-lg p-3 border border-emerald-100">
            <p className="text-sm font-semibold text-stone-700 mb-1">Condition Assessment</p>
            <p className="text-sm text-stone-600">{analysis.ai_feedback}</p>
          </div>
        )}

        {/* Reliability Score */}
        {analysis.ai_reliability_score && (
          <div className="bg-white rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              {getReliabilityIcon(analysis.ai_reliability_score)}
              <p className="text-sm font-semibold text-stone-700">
                Reliability: {analysis.ai_reliability_score}
              </p>
            </div>
            <p className="text-xs text-stone-600">
              Based on visible condition and maintenance quality
            </p>
          </div>
        )}

        {/* Presentation Tips */}
        {analysis.ai_presentation_tips && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-1">💡 Photo Tips</p>
            <p className="text-sm text-blue-700">{analysis.ai_presentation_tips}</p>
          </div>
        )}

        {/* Verified Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">
            AI Verified Equipment
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
