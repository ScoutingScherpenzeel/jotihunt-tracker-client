import {Layer, Marker, Source} from 'react-map-gl/mapbox';
import {useTeams} from '@/hooks/teams.hook.ts';
import MapMarker from '../map/MapMarker';
import {useMemo, useState} from 'react';
import {Team} from '@/types/Team';
import MapPopup from '../map/MapPopup';
import {cn, createCircle, getColorFromArea} from '@/lib/utils';
import {useAreas} from '@/hooks/areas.hook';
import GoogleMapsButton from '../map/GoogleMapsButton';
import {Badge} from '../ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';
import useLayersStore from '@/stores/layers.store';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export default function Teams() {
    const HOME_TEAM_API_ID = import.meta.env.HOME_TEAM_API_ID;
    const TEAMS_AREA_EDITING = import.meta.env.TEAMS_AREA_EDITING === 'true';

    const {showGroupCircles} = useLayersStore();
    const {teams, setTeamArea} = useTeams();
    const {isVisible} = useAreas();

    const [activeTeam, setActiveTeam] = useState<Team>();
    const [tooltipOpenId, setTooltipOpenId] = useState<string | null>(null);
    const {areas} = useAreas();

    /**
     * Handle area change from the select.
     * Disabled if TEAMS_AREA_EDITING is false.
     * @param area The new area to set.
     */
    function handleAreaChange(area: string) {
        if (!TEAMS_AREA_EDITING) return;
        if (!activeTeam) return;
        activeTeam.area = area === 'onbekend' ? undefined : area;
        setTeamArea(activeTeam._id, activeTeam.area);
    }

    /**
     * Handle the tooltip for a marker.
     * @param open Whether the tooltip should be open or closed.
     * @param teamId The ID of the device for which the tooltip is being handled.
     */
    function handleMarkerTooltip(open: boolean, teamId: string) {
        if (activeTeam) {
            setTooltipOpenId(null);
            return;
        }

        setTooltipOpenId(open ? teamId : null);
    }

    const markers = useMemo(() => {
        return teams
            ?.filter((team) => isVisible(team.area || ''))
            .map((team) => (
                <div key={team._id}>
                    <Marker

                        longitude={team.location.coordinates[0]}
                        latitude={team.location.coordinates[1]}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            if (activeTeam?._id === team._id) {
                                setActiveTeam(undefined);
                            } else {
                                setActiveTeam(team);
                            }
                        }}
                        style={{cursor: 'pointer'}}
                        className={cn(tooltipOpenId === team._id && 'z-20')}
                    >
                        <Tooltip
                            delayDuration={0}
                            open={tooltipOpenId === team._id && !activeTeam}
                            onOpenChange={(open) => handleMarkerTooltip(open, team._id)}
                        >
                            <TooltipTrigger asChild>
                                <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
                                    <MapMarker color={getColorFromArea(team.area || '')}/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className={"flex gap-2 items-center"}>
                                <span className="text-sm font-medium">{team.name}</span>
                                {team.area && (
                                    <Badge
                                        className="text-white border-0"
                                        style={{
                                            backgroundColor: getColorFromArea(team.area || ''),
                                        }}
                                    >
                                        {team.area ?? 'Onbekend'}
                                    </Badge>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </Marker>
                    {showGroupCircles && team.apiId != HOME_TEAM_API_ID && (
                        <Source key={team.apiId} id={`circle-team-${team.apiId}`} type="geojson"
                                data={createCircle(team.location.coordinates[0], team.location.coordinates[1], 500)}>
                            <Layer
                                id={`circle-team-layer-${team.apiId}`}
                                type="fill"
                                paint={{
                                    'fill-color': `${getColorFromArea(team.area || '')}`,
                                    'fill-opacity': 0.2,
                                }}
                            />
                        </Source>
                    )}
                </div>
            ));
    }, [teams, isVisible, activeTeam, tooltipOpenId]);

    return (
        <>
            {markers}
            {activeTeam && (
                <MapPopup longitude={activeTeam.location.coordinates[0]} latitude={activeTeam.location.coordinates[1]}
                          onClose={() => setActiveTeam(undefined)}>
                    <div className="mr-6 flex flex-col gap-3 w-full">
                        <div>
                            <h2 className="font-semibold">{activeTeam.name}</h2>
                            <div className="flex items-center gap-1">
                                <p>Deelgebied</p>
                                <Badge
                                    className="text-white border-0"
                                    style={{
                                        backgroundColor: getColorFromArea(activeTeam.area || ''),
                                    }}
                                >
                                    {activeTeam.area ?? 'Onbekend'}
                                </Badge>
                            </div>
                            <p>Accomodatie: {activeTeam.accomodation}</p>
                            <p>
                                {activeTeam.street} {activeTeam.houseNumber} {activeTeam.houseNumberAddition}
                            </p>
                            <p>
                                {activeTeam.postCode} {activeTeam.city}
                            </p>
                        </div>
                        {/* Select with areas */}
                        <div className="flex flex-col gap-2">
                            {TEAMS_AREA_EDITING && (
                                <Select onValueChange={handleAreaChange} value={activeTeam.area ?? 'onbekend'}>
                                    <SelectTrigger autoFocus={false}>
                                        <SelectValue placeholder="Kies deelgebied..."/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="onbekend">Onbekend deelgebied</SelectItem>
                                        {areas?.map((area) => (
                                            <SelectItem key={area._id} value={area.name}>
                                                {area.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <GoogleMapsButton lat={activeTeam.location.coordinates[1]}
                                              lng={activeTeam.location.coordinates[0]}/>
                        </div>

                    </div>
                </MapPopup>
            )}
        </>
    );
}
