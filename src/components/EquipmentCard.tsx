import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Equipment {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  ownerName: string;
}

export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={equipment.imageUrl}
          alt={equipment.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{equipment.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {equipment.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{equipment.location}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">₹{equipment.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/{t('pricePerDay')}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{t('owner')}: {equipment.ownerName}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/equipment/${equipment.id}`} className="w-full">
          <Button className="w-full">{t('rentNow')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
