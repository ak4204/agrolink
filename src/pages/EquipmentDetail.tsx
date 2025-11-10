import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import BookingPanel from '@/components/BookingPanel';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, User, ArrowLeft } from 'lucide-react';

interface Equipment {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  category: string;
}

export default function EquipmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'equipment', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEquipment({ id: docSnap.id, ...docSnap.data() } as Equipment);
          
          // Fetch booked dates
          const bookingsQuery = query(
            collection(db, 'bookings'),
            where('equipmentId', '==', id),
            where('status', 'in', ['pending', 'confirmed'])
          );
          const bookingsSnap = await getDocs(bookingsQuery);
          const dates: Date[] = [];
          bookingsSnap.forEach((doc) => {
            const booking = doc.data();
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              dates.push(new Date(d));
            }
          });
          setBookedDates(dates);
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Equipment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={equipment.imageUrl}
                alt={equipment.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{equipment.title}</h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{equipment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{equipment.ownerName}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">₹{equipment.pricePerDay}</span>
                <span className="text-muted-foreground ml-2">per day</span>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{equipment.description}</p>
              </div>

              {equipment.ownerEmail ? (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Contact Owner:</span>{' '}
                    <a href={`mailto:${equipment.ownerEmail}`} className="text-primary hover:underline">
                      {equipment.ownerEmail}
                    </a>
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <BookingPanel
                equipment={equipment}
                bookedDates={bookedDates}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
