import { Marker } from "react-map-gl";
import { useTeams } from "./hooks/teams.hook";
import MapMarker from "./components/MapMarker";
import { useState } from "react";
import { Team } from "./api";
import MapPopup from "./components/MapPopup";

export default function Teams() {
  const { teams } = useTeams();
  const [activeTeam, setActiveTeam] = useState<Team>();

  function getColor(area: string) {
    switch (area) {
      case "Alpha":
        return "#f87171";
      case "Bravo":
        return "#4ade80";
      case "Charlie":
        return "#60a5fa";
      case "Delta":
        return "#facc15";
      case "Echo":
        return "#e879f9";
      case "Foxtrot":
        return "#2dd4bf";
      default:
        return "#9ca3af";
    }
  }

  return (
    <>
      {teams?.map((team) => (
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
            <MapMarker color={getColor(team.area)} />
          </div>
        </Marker>
      ))}
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
          </div>
        </MapPopup>
      )}
    </>
  );
}
