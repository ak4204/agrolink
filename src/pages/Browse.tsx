import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import EquipmentCard from '@/components/EquipmentCard';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

interface Equipment {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  category: string;
}

export default function Browse() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const q = query(collection(db, 'equipment'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const items: Equipment[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Equipment);
        });
        setEquipment(items);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('browse')}</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        )}

        {!loading && equipment.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No equipment available yet
          </div>
        ) : null}
      </main>
    </div>
  );
}
