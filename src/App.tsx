import { LayersIcon } from "lucide-react";
import Map, { MapRef } from "./Map";
import logo from "./assets/images/logo.png";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { useRef, useState } from "react";
import { SWRConfig } from "swr";
import { useToast } from "./components/ui/use-toast";
import FoxStatusCard from "./components/cards/FoxStatusCard";
import NextHintTime from "./components/cards/NextHintTimeCard";
import HintEntryCard from "./components/cards/HintEntryCard";

function App() {
  const { toast } = useToast();

  const [showTeams, setShowTeams] = useState(true);
  const [showCars, setShowCars] = useState(true);
  const [showHintLocations, setShowHintLocations] = useState(true);
  const [errorShown, setErrorShown] = useState(false);

  const mapRef = useRef<MapRef>(null);

  return (
    <>
      <SWRConfig
        value={{
          onError: (error) => {
            if (errorShown) return;
            setErrorShown(true);
            toast({
              variant: "destructive",
              title: "Oeps! Er is iets misgegaan.",
              description:
                "Er is een fout opgetreden bij het ophalen van de data, probeer het later opnieuw. (Foutmelding: " +
                error.message +
                ")",
              duration: Infinity,
            });
          },
        }}
      >
        <div className="absolute z-10 top-0 left-0  w-full md:w-1/5 md:min-w-[450px]">
          <div className="flex flex-col p-2 gap-2">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <img src={logo} alt="Jotihunt Tracker" className="w-12" />
                    <div>
                      <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                      <h2>Scouting Scherpenzeel e.o.</h2>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <LayersIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Zichtbare lagen</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={showTeams}
                        onCheckedChange={() => setShowTeams(!showTeams)}
                      >
                        Deelnemende groepen
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={showCars}
                        onCheckedChange={() => setShowCars(!showCars)}
                      >
                        Huidige locatie auto's
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={showHintLocations}
                        onCheckedChange={() =>
                          setShowHintLocations(!showHintLocations)
                        }
                      >
                        Hint locaties
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <FoxStatusCard />

            <HintEntryCard mapRef={mapRef} />
            <NextHintTime />
          </div>
        </div>

        <Map
          ref={mapRef}
          showTeams={showTeams}
          showDevices={showCars}
          showHints={showHintLocations}
        />
      </SWRConfig>
    </>
  );
}

export default App;
