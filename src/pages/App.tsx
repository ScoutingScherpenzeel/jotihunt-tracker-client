import {MenuIcon} from 'lucide-react';
import logo from '@/assets/images/logo.png';
import {Button} from '../components/ui/button';
import {Card, CardContent} from '../components/ui/card';
import FoxStatusCard from '../components/cards/fox-status/FoxStatusCard.tsx';
import NextHintTime from '../components/cards/next-hint-time/NextHintTimeCard.tsx';
import HintEntryCard from '../components/cards/hint-entry/HintEntryCard.tsx';
import CounterHuntCard from '../components/cards/counter-hunt/CounterHuntCard.tsx';
import Settings from '../components/Settings';
import useMenuStore from '../stores/menu.store';
import {useOutlet} from '@/Layout';
import {ScrollArea} from '@/components/ui/scroll-area';
import SearchCard from "@/components/cards/search/SearchCard.tsx";
import CoordinatesCard from "@/components/cards/coordinates/CoordinatesCard.tsx";
import ActiveDevices from "@/components/map/ActiveDevices.tsx";

function App() {
    const {menuOpen, toggleMenu} = useMenuStore();
    const {mapRef} = useOutlet();

    return (
        <>
            <div
                className="absolute z-40 top-0 left-0 w-full md:w-1/5 md:min-w-[450px] h-dvh overflow-y-auto pointer-events-none">
                <ScrollArea className="h-full overflow-x-auto">
                    <div className="flex flex-col p-2 gap-2 pointer-events-auto">
                        <Card className="sticky top-2 z-40">
                            <CardContent>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={logo} alt="Jotihunt Tracker" className="w-12 h-12"/>
                                        <div>
                                            <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                                            <h2 className="truncate">Scouting Scherpenzeel e.o.</h2>
                                        </div>
                                    </div>

                                    <div className="md:hidden">
                                        <Button variant="outline" size="sm" onClick={toggleMenu}>
                                            <MenuIcon/>
                                        </Button>
                                    </div>

                                    {/* Desktop position for settings menu */}
                                    <Settings mobile={false}/>
                                </div>
                            </CardContent>
                        </Card>
                        <div className={"md:fixed md:top-2 md:right-12 md:z-20 flex gap-2"}>
                            <div className={"hidden md:block"}>
                                <CoordinatesCard mapRef={mapRef}/>
                            </div>
                            <div className={"w-full md:w-auto"}>
                                <SearchCard mapRef={mapRef}/>
                            </div>
                        </div>

                        <div
                            className={`flex-col gap-2 animate-in md:animate-none slide-in-from-top-4 fade-in z-30 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
                            {/* Mobile position for settings menu */}
                            <Settings mobile={true}/>
                            <FoxStatusCard/>
                            <HintEntryCard mapRef={mapRef}/>
                            <CounterHuntCard mapRef={mapRef}/>
                            <NextHintTime/>
                        </div>
                    </div>
                </ScrollArea>
            </div>
            <div className={"absolute bottom-2.5 right-2 z-50 hidden md:block"}>
                <ActiveDevices mapRef={mapRef}/>
            </div>
        </>
    );
}

export default App;
