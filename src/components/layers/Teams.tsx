import { Marker } from "react-map-gl";
import { useTeams } from "../../hooks/teams.hook";
import MapMarker from "../map/MapMarker";
import { useMemo, useState } from "react";
import { Team } from "../../api";
import MapPopup from "../map/MapPopup";
import { getColorFromArea } from "@/lib/utils";

export default function Teams() {
  const { teams } = useTeams();
  const [activeTeam, setActiveTeam] = useState<Team>();

  const markers = useMemo(
    () =>
      teams?.map((team) => (
        <Marker
          key={team._id}
          longitude={team.location.coordinates[0]}
          latitude={team.location.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActiveTeam(team);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
            <MapMarker color={getColorFromArea(team.area)} />
          </div>
        </Marker>
      )),
    [teams]
  );

  return (
    <>
      {markers}
      {activeTeam && (
        <MapPopup
          longitude={activeTeam.location.coordinates[0]}
          latitude={activeTeam.location.coordinates[1]}
          onClose={() => setActiveTeam(undefined)}
        >
          <div>
            <h2 className="font-semibold">{activeTeam.name}</h2>
            <p>Accomodatie: {activeTeam.accomodation}</p>
            <p>
              {activeTeam.street} {activeTeam.houseNumber}{" "}
              {activeTeam.houseNumberAddition}
            </p>
            <p>
              {activeTeam.postCode} {activeTeam.city}
            </p>
            <a
              href={`https://www.google.com/maps?q=${activeTeam.location.coordinates[1]},${activeTeam.location.coordinates[0]}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-500"
            >
              Bekijk op Google Maps
            </a>
          </div>
        </MapPopup>
      )}
    </>
  );
}
