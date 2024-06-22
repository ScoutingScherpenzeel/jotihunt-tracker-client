import { useMarkers } from "@/hooks/markers.hook";
import { useMemo } from "react";
import MapMarker from "../map/MapMarker";
import { getColorFromArea } from "@/lib/utils";
import { Marker } from "react-map-gl";
export default function Hints() {

    const {markers} = useMarkers();

    const mapMarkers = useMemo(
        () =>
          markers?.map((marker) => (
            <Marker
              key={marker._id}
              longitude={marker.location.coordinates[0]}
              latitude={marker.location.coordinates[1]}
              anchor="bottom"
            //   onClick={(e) => {
            //     e.originalEvent.stopPropagation();
            //     setActiveTeam(team);
            //   }}
              style={{ cursor: "pointer" }}
            >
              <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
                <MapMarker color={getColorFromArea(marker.area)} />
              </div>
            </Marker>
          )),
        [markers]
      );
    

    return (
        <>{mapMarkers}</>
    )
}