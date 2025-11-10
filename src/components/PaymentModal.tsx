import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';

interface PaymentModalProps {
  bookingId: string;
  amount: number;
  onClose: () => void;
}

export default function PaymentModal({ bookingId, amount, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(true);

  const handlePayment = async (success: boolean) => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await updateDoc(doc(db, 'bookings', bookingId), {
        status: success ? 'confirmed' : 'failed',
        paymentMethod,
        paymentSimulated: true,
        paymentDate: new Date().toISOString(),
      });

      if (success) {
        toast.success('Payment successful! Booking confirmed.');
      } else {
        toast.error('Payment failed. Please try again.');
      }

      setOpen(false);
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fake Payment (Demo)</DialogTitle>
          <DialogDescription>
            This is a simulated payment. Choose a method and test success/failure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="text-3xl font-bold text-primary">₹{amount}</div>
          </div>

          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5" />
                Fake Card Payment
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="h-5 w-5" />
                Fake UPI
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building2 className="h-5 w-5" />
                Netbanking (Demo)
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            <Button
              onClick={() => handlePayment(true)}
              disabled={processing}
              className="flex-1"
            >
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simulate Success
            </Button>
            <Button
              onClick={() => handlePayment(false)}
              disabled={processing}
              variant="destructive"
              className="flex-1"
            >
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simulate Failure
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This is a demo payment system. No real transaction will occur.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
