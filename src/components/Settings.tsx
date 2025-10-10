import {
    BugIcon,
    CogIcon,
    DownloadIcon,
    EyeIcon,
    KeyIcon,
    LayersIcon,
    LogOutIcon,
    MoonIcon, RefreshCwIcon,
    ShieldIcon,
    UsersIcon
} from 'lucide-react';
import {siDiscord} from "simple-icons"
import {Button} from './ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import useLayersStore from '@/stores/layers.store';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSettingsStore from '@/stores/settings.store';
import {MapStyle} from '@/types/MapStyle';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import {useNavigate} from 'react-router-dom';
import {User} from '@/types/User';
import PropTypes, {InferProps} from 'prop-types';
import usePWA from 'react-pwa-install-prompt';
import {Dialog, DialogTrigger} from './ui/dialog';
import DebugInfo from './DebugInfo';
import ResetPassword from './ResetPassword';
import {useState} from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {useTeams} from "@/hooks/teams.hook.ts";
import {toast} from "sonner";

export default function Settings({mobile}: InferProps<typeof Settings.propTypes>) {

    const DISCORD_URL = import.meta.env.DISCORD_URL;

    const navigate = useNavigate();
    const {isStandalone, isInstallPromptSupported, promptInstall} = usePWA();
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [isConfirmReloadDialogOpen, setIsConfirmReloadDialogOpen] = useState(false);

    // Store for all layers / settings
    const {
        showTeams,
        showDevices,
        showMarkersPart1,
        showMarkersPart2,
        showHomeCircle,
        showGroupCircles,
        toggleGroupCircles,
        toggleTeams,
        toggleDevices,
        toggleMarkersPart1,
        toggleMarkersPart2,
        toggleHomeCircle,
    } = useLayersStore();
    const {mapStyle, setMapStyle, darkMode, setDarkMode} = useSettingsStore();
    const {reloadTeams} = useTeams();

    // Authentication stuff
    const auth = useAuthUser<User>();
    const signOut = useSignOut();

    function logout() {
        signOut();
        navigate('/login');
    }

    function changeDarkMode(d: string) {
        if (d === 'true') {
            setDarkMode(true);
        } else if (d === 'false') {
            setDarkMode(false);
        } else {
            setDarkMode(undefined);
        }
    }

    async function handleReloadTeams() {
        const result = await reloadTeams();
        if (result) {
            toast.success('Teams herladen', {
                description: 'Alle teams zijn succesvol herladen vanuit de Jotihunt API.',
            });
            setIsConfirmReloadDialogOpen(false);
        } else {
            toast.error('Fout bij herladen teams', {
                description: 'Er is iets misgegaan bij het herladen van de teams. Probeer het later opnieuw.',
            });
        }
    }

    const mobileTrigger = () => (
        <div className="block md:hidden bg-background rounded-lg">
            <Button size="default" className="w-full">
                <CogIcon/> Instellingen
            </Button>
        </div>
    );

    const desktopTrigger = () => (
        <div className="md:block hidden">
            <Button variant="outline" size="sm">
                <CogIcon/>
            </Button>
        </div>
    );

    return (
        <Dialog>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{mobile ? mobileTrigger() : desktopTrigger()}</DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Hoi, {auth?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {!isStandalone && isInstallPromptSupported && (
                        <DropdownMenuItem onClick={promptInstall}>
                            <DownloadIcon/>
                            Installeer app
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <EyeIcon/>
                            Zichtbare lagen
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuCheckboxItem checked={showTeams} onCheckedChange={toggleTeams}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Deelnemende groepen
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={showDevices} onCheckedChange={toggleDevices}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Huidige locatie auto's
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={showMarkersPart1}
                                                          onCheckedChange={toggleMarkersPart1}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Markers (speelhelft 1)
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={showMarkersPart2}
                                                          onCheckedChange={toggleMarkersPart2}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Markers (speelhelft 2)
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={showHomeCircle} onCheckedChange={toggleHomeCircle}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Tegenhunt cirkel
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={showGroupCircles}
                                                          onCheckedChange={toggleGroupCircles}
                                                          onSelect={(e) => e.preventDefault()}>
                                    Groepen cirkels
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <LayersIcon/>
                            Kaartstijl
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={mapStyle}
                                                        onValueChange={(s) => setMapStyle(s as MapStyle)}>
                                    <DropdownMenuRadioItem value={''}>Automatisch</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={MapStyle.Streets}>Straten</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={MapStyle.Outdoors}>Outdoor</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={MapStyle.Satellite}>Satelliet</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={MapStyle.Dark}>Donker</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <MoonIcon/>
                            Donkere modus
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={darkMode != null ? `${darkMode}` : 'auto'}
                                                        onValueChange={(d) => changeDarkMode(d)}>
                                    <DropdownMenuRadioItem value={'auto'}>Automatisch</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={'true'}>Aan</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={'false'}>Uit</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator/>
                    {auth?.admin && (
                        <>
                            <DropdownMenuItem onClick={() => navigate('/users')}>
                                <UsersIcon/>
                                Gebruikers
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <ShieldIcon/>
                                    Admin tools
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setIsConfirmReloadDialogOpen(true)}>
                                            <RefreshCwIcon/>Herlaad teams uit API
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    <BugIcon/>
                                    Debug
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator/>
                        </>
                    )}
                    {DISCORD_URL && (
                        <DropdownMenuItem asChild>
                            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                            <span className={"fill-white"} dangerouslySetInnerHTML={{__html: siDiscord.svg}}></span>
                            Join de Discord
                            </a>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setResetPasswordOpen(true)}>
                        <KeyIcon/> Wachtwoord wijzigen
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={logout}>
                        <LogOutIcon/>
                        Uitloggen
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ResetPassword open={resetPasswordOpen} setIsOpen={setResetPasswordOpen} allowClose={true}/>
            <DebugInfo/>

            <AlertDialog open={isConfirmReloadDialogOpen} onOpenChange={setIsConfirmReloadDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet je zeker dat je all teams wilt herladen?</AlertDialogTitle>
                        <AlertDialogDescription>Dit reset alle ingevulde deelgebieden. Deze actie kan niet ongedaan
                            worden gemaakt.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReloadTeams}>
                            Herladen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </Dialog>
    );
}

Settings.propTypes = {
    mobile: PropTypes.bool.isRequired,
};
