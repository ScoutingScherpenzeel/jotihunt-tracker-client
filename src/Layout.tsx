import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useToast } from './components/ui/use-toast';
import { RefObject, useEffect, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import Map, { MapRef } from './components/Map';

type ContextType = {
  mapRef: RefObject<MapRef>;
};

export default function Layout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errorShown, setErrorShown] = useState(false);

  const mapRef = useRef<MapRef>(null);

  function onSWRError(error: any) {
    if (error.response?.status === 401) {
      toast({
        variant: 'default',
        title: 'Je sessie is verlopen.',
        description: 'Log opnieuw in om verder te gaan.',
        duration: Infinity,
      });
      navigate('/login');
      return;
    }
    if (errorShown) return;
    setErrorShown(true);
    toast({
      variant: 'destructive',
      title: 'Oeps! Er is iets misgegaan.',
      description: 'Er is een fout opgetreden bij het ophalen van de data, probeer het later opnieuw. (Foutmelding: ' + error.message + ')',
      duration: Infinity,
    });
  }

  return (
    <SWRConfig value={{ onError: onSWRError }}>
      <Outlet context={{ mapRef } satisfies ContextType} />
      <Map ref={mapRef} />
    </SWRConfig>
  );
}
export function useOutlet() {
  return useOutletContext<ContextType>();
}
