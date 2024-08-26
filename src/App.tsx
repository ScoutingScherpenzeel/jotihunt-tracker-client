import { MenuIcon } from 'lucide-react';
import Map, { MapRef } from './Map';
import logo from './assets/images/logo.png';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import { useToast } from './components/ui/use-toast';
import FoxStatusCard from './components/cards/FoxStatusCard';
import NextHintTime from './components/cards/NextHintTimeCard';
import HintEntryCard from './components/cards/HintEntryCard';
import { useNavigate } from 'react-router-dom';
import CounterHuntCard from './components/cards/CounterHuntCard';
import Layers from './components/Layers';

function App() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [errorShown, setErrorShown] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

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
    <>
      <SWRConfig value={{ onError: onSWRError }}>
        <div className="absolute z-10 top-0 left-0 w-full md:w-1/5 md:min-w-[450px]">
          <div className="flex flex-col p-2 gap-2">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="Jotihunt Tracker" className="w-12 h-12" />
                    <div>
                      <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                      <h2>Scouting Scherpenzeel e.o.</h2>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <Button variant="outline" size="sm" onClick={() => setShowMenu(!showMenu)}>
                      <MenuIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Layers />
                </div>
              </CardContent>
            </Card>

            {showMenu && (
              <div className={`flex flex-col gap-2 animate-in md:animate-none slide-in-from-top-2`}>
                <FoxStatusCard />
                <HintEntryCard mapRef={mapRef} />
                <CounterHuntCard mapRef={mapRef} />
                <NextHintTime />
              </div>
            )}
          </div>
        </div>

        <Map ref={mapRef} />
      </SWRConfig>
    </>
  );
}

export default App;
