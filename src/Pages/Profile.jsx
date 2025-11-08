import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [deleteToolId, setDeleteToolId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: myTools, isLoading: toolsLoading } = useQuery({
    queryKey: ['myTools', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Tool.filter({ created_by: user.email }, "-created_date");
    },
    enabled: !!user,
  });

  const { data: myBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['myBookings', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Booking.filter({ renter_id: user.email }, "-created_date");
    },
    enabled: !!user,
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (toolId) => {
      return await base44.entities.Tool.delete(toolId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTools'] });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      setDeleteToolId(null);
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-stone-800">{user.full_name}</h3>
              <p className="text-stone-600">{user.email}</p>
              {user.location && (
                <div className="flex items-center gap-2 text-stone-600 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tools">
            My Equipment ({myTools?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="bookings">
            My Bookings ({myBookings?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* My Tools Tab */}
        <TabsContent value="tools" className="mt-6">
          {toolsLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : myTools?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-600 mb-4">You haven't listed any equipment yet</p>
                <Button
                  onClick={() => navigate(createPageUrl("AddTool"))}
                  className="bg-green-600 hover:bg-green-700"
                >
                  List Your First Tool
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myTools.map(tool => (
                <Card key={tool.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={tool.images?.[0] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200"}
                          alt={tool.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-stone-800">
                              {tool.name}
                            </h3>
                            <Badge className="mt-1 bg-green-600">{tool.category}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`${createPageUrl("EditTool")}?id=${tool.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteToolId(tool.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-stone-600 mb-3 line-clamp-2">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-green-600">
                              ${tool.price_per_day}/day
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tool.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Bookings Tab */}
        <TabsContent value="bookings" className="mt-6">
          {bookingsLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : myBookings?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-600 mb-4">You haven't made any bookings yet</p>
                <Button
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Browse Equipment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myBookings.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={booking.tool_image || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200"}
                          alt={booking.tool_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-stone-800">
                              {booking.tool_name}
                            </h3>
                            <Badge 
                              className={
                                booking.status === "confirmed" ? "bg-blue-600" :
                                booking.status === "completed" ? "bg-green-600" :
                                "bg-stone-600"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              ${booking.total_price}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-stone-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(booking.start_date), "MMM d, yyyy")} - {format(new Date(booking.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span> {booking.owner_name}
                          </div>
                          <div>
                            <span className="font-medium">Booking ID:</span> {booking.booking_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteToolId} onOpenChange={() => setDeleteToolId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this equipment listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteToolMutation.mutate(deleteToolId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}