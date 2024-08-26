import { createCircle } from "@/lib/utils";
import { Layer, Source } from "react-map-gl";

export default function HomeCircle() {
  // get home location from .env
  const homeCoordsLat = import.meta.env.HOME_COORDS_LAT;
  const homeCoordsLon = import.meta.env.HOME_COORDS_LON;

  return (
    <>
      <Source
        id={`circle-source-home`}
        type="geojson"
        data={createCircle(homeCoordsLon, homeCoordsLat, 450)}
      >
        <Layer
          id={`circle-layer-home`}
          type="fill"
          paint={{
            "fill-color": "hsla(256, 90%, 61%, 0.2)",
            "fill-outline-color": "hsla(256, 90%, 61%, 0.5)",
          }}
        />
      </Source>
    </>
  );
}
