import { LayersIcon } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import useLayersStore from '@/stores/layers.store';

export default function Layers() {
  // Store for all layers
  const { showTeams, showDevices, showHintsPart1, showHintsPart2, showHomeCircle, toggleTeams, toggleDevices, toggleHintsPart1, toggleHintsPart2, toggleHomeCircle } = useLayersStore();

  return (
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
          <DropdownMenuCheckboxItem checked={showTeams} onCheckedChange={toggleTeams}>
            Deelnemende groepen
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showDevices} onCheckedChange={toggleDevices}>
            Huidige locatie auto's
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showHintsPart1} onCheckedChange={toggleHintsPart1}>
            Hint locaties (speelhelft 1)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showHintsPart2} onCheckedChange={toggleHintsPart2}>
            Hint locaties (speelhelft 2)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showHomeCircle} onCheckedChange={toggleHomeCircle}>
            Tegenhunt cirkel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
