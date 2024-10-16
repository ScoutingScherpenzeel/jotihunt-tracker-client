import { BugIcon, CogIcon, DownloadIcon, EyeIcon, KeyIcon, LayersIcon, LogOutIcon, MoonIcon, UsersIcon } from 'lucide-react';
import { Button } from './ui/button';
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
import { MapStyle } from '@/types/MapStyle';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/User';
import PropTypes, { InferProps } from 'prop-types';
import usePWA from 'react-pwa-install-prompt';
import { Dialog, DialogTrigger } from './ui/dialog';
import DebugInfo from './DebugInfo';
import ResetPassword from './ResetPassword';
import { useState } from 'react';

export default function Settings({ mobile }: InferProps<typeof Settings.propTypes>) {
  const navigate = useNavigate();
  const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  // Store for all layers / settings
  const { showTeams, showDevices, showMarkersPart1, showMarkersPart2, showHomeCircle, toggleTeams, toggleDevices, toggleMarkersPart1, toggleMarkersPart2, toggleHomeCircle } = useLayersStore();
  const { mapStyle, setMapStyle, darkMode, setDarkMode } = useSettingsStore();

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

  const mobileTrigger = () => (
    <div className="block md:hidden bg-background rounded-lg">
      <Button size="default" className="w-full">
        <CogIcon className="h-4 nr-2" /> Instellingen
      </Button>
    </div>
  );

  const desktopTrigger = () => (
    <div className="md:block hidden">
      <Button variant="outline" size="sm">
        <CogIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{mobile ? mobileTrigger() : desktopTrigger()}</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Hoi, {auth?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isStandalone && isInstallPromptSupported && (
            <DropdownMenuItem onClick={promptInstall}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Installeer app
            </DropdownMenuItem>
          )}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <EyeIcon className="mr-2 h-4 w-4" />
              Zichtbare lagen
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem checked={showTeams} onCheckedChange={toggleTeams} onSelect={(e) => e.preventDefault()}>
                  Deelnemende groepen
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showDevices} onCheckedChange={toggleDevices} onSelect={(e) => e.preventDefault()}>
                  Huidige locatie auto's
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showMarkersPart1} onCheckedChange={toggleMarkersPart1} onSelect={(e) => e.preventDefault()}>
                  Markers (speelhelft 1)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showMarkersPart2} onCheckedChange={toggleMarkersPart2} onSelect={(e) => e.preventDefault()}>
                  Markers (speelhelft 2)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showHomeCircle} onCheckedChange={toggleHomeCircle} onSelect={(e) => e.preventDefault()}>
                  Tegenhunt cirkel
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <LayersIcon className="mr-2 h-4 w-4" />
              Kaartstijl
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={mapStyle} onValueChange={(s) => setMapStyle(s as MapStyle)}>
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
              <MoonIcon className="mr-2 h-4 w-4" />
              Donkere modus
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={darkMode != null ? `${darkMode}` : 'auto'} onValueChange={(d) => changeDarkMode(d)}>
                  <DropdownMenuRadioItem value={'auto'}>Automatisch</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={'true'}>Aan</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={'false'}>Uit</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          {auth?.admin && (
            <>
              <DropdownMenuItem onClick={() => navigate('/users')}>
                <UsersIcon className="mr-2 h-4 w-4" />
                Gebruikers
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <BugIcon className="mr-2 h-4 w-4" />
                  Debug
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setResetPasswordOpen(true)}>
            <KeyIcon className="mr-2 h-4 w-4" /> Wachtwoord wijzigen
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Uitloggen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetPassword open={resetPasswordOpen} setIsOpen={setResetPasswordOpen} allowClose={true} />
      <DebugInfo />
    </Dialog>
  );
}

Settings.propTypes = {
  mobile: PropTypes.bool.isRequired,
};
