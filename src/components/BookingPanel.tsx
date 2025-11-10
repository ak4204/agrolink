import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { differenceInDays } from 'date-fns';
import PaymentModal from './PaymentModal';

interface Equipment {
  id: string;
  title: string;
  pricePerDay: number;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
}

interface BookingPanelProps {
  equipment: Equipment;
  bookedDates: Date[];
}

export default function BookingPanel({ equipment, bookedDates }: BookingPanelProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.toDateString() === date.toDateString()
    );
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = differenceInDays(endDate, startDate) + 1;
    return days * equipment.pricePerDay;
  };

  const handleBooking = async () => {
    if (!user || !startDate || !endDate) {
      toast.error('Please select dates');
      return;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        equipmentId: equipment.id,
        equipmentTitle: equipment.title,
        renterId: user.uid,
        renterEmail: user.email,
        ownerId: equipment.ownerId,
        ownerEmail: equipment.ownerEmail,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: calculateTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setBookingId(bookingRef.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const total = calculateTotal();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('bookNow')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{t('startDate')}</p>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) => date < new Date() || isDateBooked(date)}
              className="rounded-md border"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{t('endDate')}</p>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => !startDate || date < startDate || isDateBooked(date)}
              className="rounded-md border"
            />
          </div>

          {startDate && endDate ? (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>₹{equipment.pricePerDay} × {days} days</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t('totalPrice')}</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
          ) : null}

          <Button
            onClick={handleBooking}
            disabled={!startDate || !endDate}
            className="w-full"
          >
            {t('confirmBooking')}
          </Button>
        </CardContent>
      </Card>

      {showPayment ? (
        <PaymentModal
          bookingId={bookingId}
          amount={total}
          onClose={() => {
            setShowPayment(false);
            navigate('/bookings');
          }}
        />
      ) : null}
    </>
  );
}
