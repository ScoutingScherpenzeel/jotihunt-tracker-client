import { CogIcon, EyeIcon, LayersIcon, LogOutIcon } from 'lucide-react';
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
import { User } from '@/api';
import useSettingsStore from '@/stores/settings.store';
import { MapStyle } from '@/types/MapStyle';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  // Store for all layers / settings
  const { showTeams, showDevices, showHintsPart1, showHintsPart2, showHomeCircle, toggleTeams, toggleDevices, toggleHintsPart1, toggleHintsPart2, toggleHomeCircle } = useLayersStore();
  const { mapStyle, setMapStyle } = useSettingsStore();

  // Authentication stuff
  const auth = useAuthUser<User>();
  const signOut = useSignOut();

  function logout() {
    signOut();
    navigate('/login');
  }

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <CogIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Hoi, {auth?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
                <DropdownMenuCheckboxItem checked={showHintsPart1} onCheckedChange={toggleHintsPart1} onSelect={(e) => e.preventDefault()}>
                  Hint locaties (speelhelft 1)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showHintsPart2} onCheckedChange={toggleHintsPart2} onSelect={(e) => e.preventDefault()}>
                  Hint locaties (speelhelft 2)
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
                  <DropdownMenuRadioItem value={MapStyle.Streets}>Straten</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={MapStyle.Outdoors}>Outdoor</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={MapStyle.Satellite}>Satelliet</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Uitloggen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
