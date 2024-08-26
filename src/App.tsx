import { LayersIcon, MenuIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import CounterHuntCard from "./components/cards/CounterHuntCard";

function App() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showTeams, setShowTeams] = useState(true);
  const [showCars, setShowCars] = useState(true);
  const [showHintLocationsPart1, setShowHintLocationsPart1] = useState(true);
  const [showHintLocationsPart2, setShowHintLocationsPart2] = useState(true);
  const [showHomeCircle, setShowHomeCircle] = useState(true);

  const [errorShown, setErrorShown] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const mapRef = useRef<MapRef>(null);

  return (
    <>
      <SWRConfig
        value={{
          onError: (error) => {
            if (error.response?.status === 401) {
              toast({
                variant: "default",
                title: "Je sessie is verlopen.",
                description: "Log opnieuw in om verder te gaan.",
                duration: Infinity,
              });
              navigate("/login");
              return;
            }
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
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="Jotihunt Tracker"
                      className="w-12 h-12"
                    />
                    <div>
                      <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                      <h2>Scouting Scherpenzeel e.o.</h2>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <MenuIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="md:block hidden">
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
                          checked={showHintLocationsPart1}
                          onCheckedChange={() =>
                            setShowHintLocationsPart1(!showHintLocationsPart1)
                          }
                        >
                          Hint locaties (speelhelft 1)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={showHintLocationsPart2}
                          onCheckedChange={() =>
                            setShowHintLocationsPart2(!showHintLocationsPart2)
                          }
                        >
                          Hint locaties (speelhelft 2)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={showHomeCircle}
                          onCheckedChange={() =>
                            setShowHomeCircle(!showHomeCircle)
                          }
                        >
                          Tegenhunt cirkel
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showMenu && (
              <div
                className={`flex flex-col gap-2 animate-in md:animate-none slide-in-from-top-2`}
              >
                <FoxStatusCard />
                <HintEntryCard mapRef={mapRef} />
                <CounterHuntCard mapRef={mapRef} />
                <NextHintTime />
              </div>
            )}
          </div>
        </div>

        <Map
          ref={mapRef}
          showTeams={showTeams}
          showDevices={showCars}
          showHintsPart1={showHintLocationsPart1}
          showHintsPart2={showHintLocationsPart2}
          showHomeCircle={showHomeCircle}
        />
      </SWRConfig>
    </>
  );
}

export default App;
