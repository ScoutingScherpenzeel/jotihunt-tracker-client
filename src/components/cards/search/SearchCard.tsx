import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import PropTypes, {InferProps} from "prop-types";
import {MapRef} from "@/components/Map.tsx";
import {useTeams} from "@/hooks/teams.hook.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Team} from "@/types/Team.ts";

export default function SearchCard({ mapRef }: InferProps<typeof SearchCard.propTypes>) {
    const [open, setOpen] = React.useState(false)
    const {teams} = useTeams();

    function navigateToTeam(team: Team) {
        setOpen(false);
        mapRef.current?.flyTo({
            center: [team.location.coordinates[0], team.location.coordinates[1]],
            zoom: 14,
            essential: true
        });
    }

    return (
        <div className={"w-full flex flex-col gap-2"}>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                  Snel navigeren naar groep...
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Zoeken..." />
                    <CommandList>

                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className={"h-200px"}>
                            {teams?.map((team) => (
                                <CommandItem
                                    key={team._id}
                                    value={team.name}
                                    onSelect={() => navigateToTeam(team)}
                                >
                                    {team.name}
                                </CommandItem>
                            ))}
                            </ScrollArea>
                        </CommandGroup>

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    )
}

SearchCard.propTypes = {
    mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
