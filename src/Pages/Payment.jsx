import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, IndianRupee, Shield, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function Payment() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const bookingData = JSON.parse(decodeURIComponent(urlParams.get("data") || "{}"));
  
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [processing, setProcessing] = useState(false);
  const [emiPlan, setEmiPlan] = useState("3");
  const [paymentStep, setPaymentStep] = useState(1);

  const calculateEMI = () => {
    const months = parseInt(emiPlan);
    const interestRate = months === 3 ? 0 : months === 6 ? 0.05 : 0.08;
    const totalWithInterest = bookingData.total_price * (1 + interestRate);
    return Math.ceil(totalWithInterest / months);
  };

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStep(2);
    
    // Simulate payment processing with progress
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStep(3);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create booking
    try {
      await base44.entities.Booking.create({
        ...bookingData,
        payment_method: paymentMethod,
        emi_plan: paymentMethod === "emi" ? emiPlan : null,
        payment_status: "completed"
      });
      
      // Navigate to success page
      navigate(createPageUrl("PaymentSuccess") + `?bookingId=${bookingData.booking_id}`);
    } catch (error) {
      alert("Payment failed. Please try again.");
      setProcessing(false);
      setPaymentStep(1);
    }
  };

  if (!bookingData.tool_id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600">Invalid booking data</p>
        <Button onClick={() => navigate(createPageUrl("Home"))} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!processing && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Options */}
          <div className="md:col-span-2 space-y-6">
            {!processing ? (
              <>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Choose Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {/* Full Payment */}
                      <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === "full" ? "border-emerald-600 bg-emerald-50" : "border-stone-200"
                      }`} onClick={() => setPaymentMethod("full")}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="full" id="full" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="full" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                              Pay Full Amount
                              <Badge className="bg-emerald-600">Recommended</Badge>
                            </Label>
                            <p className="text-sm text-stone-600 mt-1">
                              Pay the complete amount now with no extra charges
                            </p>
                            <div className="mt-3 flex items-baseline gap-1">
                              <IndianRupee className="w-5 h-5 text-emerald-600" />
                              <span className="text-2xl font-bold text-emerald-600">
                                {bookingData.total_price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* EMI Payment */}
                      <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === "emi" ? "border-emerald-600 bg-emerald-50" : "border-stone-200"
                      }`} onClick={() => setPaymentMethod("emi")}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="emi" id="emi" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="emi" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                              Pay with EMI
                              <Badge variant="outline" className="border-blue-300 text-blue-700">Flexible</Badge>
                            </Label>
                            <p className="text-sm text-stone-600 mt-1 mb-3">
                              Split your payment into easy monthly installments
                            </p>

                            {paymentMethod === "emi" && (
                              <div className="space-y-2">
                                <RadioGroup value={emiPlan} onValueChange={setEmiPlan}>
                                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200">
                                    <div className="flex items-center gap-3">
                                      <RadioGroupItem value="3" id="emi3" />
                                      <Label htmlFor="emi3" className="cursor-pointer">
                                        <div className="font-semibold">3 Months</div>
                                        <div className="text-xs text-stone-500">No interest</div>
                                      </Label>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-emerald-600">₹{Math.ceil(bookingData.total_price / 3)}</div>
                                      <div className="text-xs text-stone-500">per month</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200">
                                    <div className="flex items-center gap-3">
                                      <RadioGroupItem value="6" id="emi6" />
                                      <Label htmlFor="emi6" className="cursor-pointer">
                                        <div className="font-semibold">6 Months</div>
                                        <div className="text-xs text-stone-500">5% interest</div>
                                      </Label>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-emerald-600">₹{calculateEMI()}</div>
                                      <div className="text-xs text-stone-500">per month</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-stone-200">
                                    <div className="flex items-center gap-3">
                                      <RadioGroupItem value="12" id="emi12" />
                                      <Label htmlFor="emi12" className="cursor-pointer">
                                        <div className="font-semibold">12 Months</div>
                                        <div className="text-xs text-stone-500">8% interest</div>
                                      </Label>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-emerald-600">₹{calculateEMI()}</div>
                                      <div className="text-xs text-stone-500">per month</div>
                                    </div>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Fake Razorpay Payment Button */}
                    <div className="pt-4">
                      <Button
                        onClick={handlePayment}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs">R</span>
                          </div>
                          Pay with Razorpay
                        </div>
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-500">
                        <Shield className="w-3 h-3" />
                        Secured by Razorpay • 100% Safe & Secure
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card className="border-0 shadow-md bg-blue-50 border-l-4 border-l-blue-600">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800 mb-1">Safe & Secure Payment</p>
                        <p className="text-sm text-stone-600">
                          Your payment information is encrypted and secure. This is a demo payment gateway.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12">
                  <div className="text-center space-y-6">
                    {paymentStep === 2 && (
                      <>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                        <div>
                          <h3 className="text-xl font-bold text-stone-800 mb-2">
                            Processing Payment...
                          </h3>
                          <p className="text-stone-600">
                            Please wait while we process your payment securely
                          </p>
                        </div>
                      </>
                    )}
                    
                    {paymentStep === 3 && (
                      <>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-800 mb-2">
                            Payment Verified
                          </h3>
                          <p className="text-stone-600">
                            Finalizing your booking...
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-stone-200 rounded-lg overflow-hidden">
                  <img 
                    src={bookingData.tool_image || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"}
                    alt={bookingData.tool_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">
                    {bookingData.tool_name}
                  </h3>
                  <p className="text-sm text-stone-600">
                    Owner: {bookingData.owner_name}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-stone-800">Rental Period</div>
                      <div>
                        {format(parseISO(bookingData.start_date), "MMM d")} - {format(parseISO(bookingData.end_date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-3 border-t border-stone-200">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold">₹{bookingData.total_price}</span>
                  </div>

                  {paymentMethod === "emi" && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Interest ({emiPlan === "3" ? "0" : emiPlan === "6" ? "5" : "8"}%)</span>
                        <span className="font-semibold">
                          ₹{Math.ceil(bookingData.total_price * (emiPlan === "3" ? 0 : emiPlan === "6" ? 0.05 : 0.08))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Monthly EMI</span>
                        <span className="font-semibold text-emerald-600">₹{calculateEMI()}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t-2 border-stone-300">
                    <span className="font-bold text-stone-800">Total Amount</span>
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-5 h-5 text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-600">
                        {paymentMethod === "emi" 
                          ? Math.ceil(bookingData.total_price * (1 + (emiPlan === "3" ? 0 : emiPlan === "6" ? 0.05 : 0.08)))
                          : bookingData.total_price
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}