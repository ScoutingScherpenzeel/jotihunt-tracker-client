import { MapIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function GoogleMapsButton({ lat, lng }: { lat: number; lng: number }) {
  return (
    <Button variant="outline" size="sm" asChild className="w-full">
      <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${lat},${lng}`}>
        <MapIcon className="mr-2 h-4 w-4" /> Bekijk op Google Maps
      </a>
    </Button>
  );
}
