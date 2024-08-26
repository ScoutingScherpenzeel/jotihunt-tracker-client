import { createCircle, createWindSector } from "@/lib/utils";
import useCounterHuntStore from "@/stores/counterhunt.store";
import { Layer, Source } from "react-map-gl";

export default function HomeCircle() {
  // Configured home coordinates
  const homeCoordsLat = import.meta.env.HOME_COORDS_LAT;
  const homeCoordsLon = import.meta.env.HOME_COORDS_LON;
  // 45-degree sector, counter hunts can be up to 45 degrees (probably)
  const windAngleRange = 45;

  const { visible, direction } = useCounterHuntStore();

  // If the counter hunt is not visible, show the home circle
  if (!visible) {
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

  // Otherwise, show the wind sector
  return (
    <>
      <Source
        id={`circle-source-home`}
        type="geojson"
        data={createWindSector(
          homeCoordsLon,
          homeCoordsLat,
          450,
          direction,
          windAngleRange
        )}
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
