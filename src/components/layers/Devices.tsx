import { Layer, Marker, Source } from 'react-map-gl';
import { useState } from 'react';
import MapPopup from '../map/MapPopup';
import { useDevices } from '@/hooks/devices.hook';
import carIcon from '@/assets/images/car.svg';
import bicycleIcon from '@/assets/images/bicycle.svg';
import walkingIcon from '@/assets/images/walking.svg';
import motorbikeIcon from '@/assets/images/motorbike.svg';
import phoneIcon from '@/assets/images/phone.svg';
import arrow from '@/assets/images/arrow.svg';
import { createCircle, knotsToKmh } from '@/lib/utils';
import { formatDistanceToNow, isBefore, parseISO, subMinutes } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Position } from '@/types/Position';
import MarkerRegistration from '../map/MarkerRegistration';
import GoogleMapsButton from '../map/GoogleMapsButton';

export default function Devices() {
  const GROUP_WALKING_ID: number = +import.meta.env.GROUP_WALKING_ID;
  const GROUP_CAR_ID: number = +import.meta.env.GROUP_CAR_ID;
  const GROUP_MOTORCYCLE_ID: number = +import.meta.env.GROUP_MOTORCYCLE_ID;
  const GROUP_BIKE_ID: number = +import.meta.env.GROUP_BIKE_ID;

  const { positions, devices } = useDevices();
  const [activeDeviceId, setActiveDeviceId] = useState<number>();
  const activeDevice = positions?.find((device) => device.deviceId === activeDeviceId);

  /**
   * Check if a timestamp is more than 5 minutes ago
   * @param fixTime The timestamp to check
   * @return True if the timestamp is more than 5 minutes ago, false otherwise
   */
  function isMoreThanFiveMinutesAgo(fixTime: string) {
    const date = parseISO(fixTime);
    const minutesAgo = subMinutes(new Date(), 5);
    return isBefore(date, minutesAgo);
  }

  /**
   * Get the icon for a device
   * @param position The "raw" position object to get the group from
   * @returns The SVG icon for the device
   */
  function getIcon(position: Position) {
    const device = devices?.find((device) => device.id === position.deviceId);
    const groupId = device?.groupId;
    switch (groupId) {
      case GROUP_WALKING_ID:
        return walkingIcon;
      case GROUP_CAR_ID:
        return carIcon;
      case GROUP_MOTORCYCLE_ID:
        return motorbikeIcon;
      case GROUP_BIKE_ID:
        return bicycleIcon;
      default:
        return phoneIcon;
    }
  }

  /**
   * Get the CSS style for the device icon based on the course.
   * Displays an arrow pointing in the direction of the course.
   * For example, with a course of 45 (P = device position):
   *
   *         *
   *        /
   *       P
   *
   * @param course The heading of the device.
   * @returns The CSS style for the device icon.
   */
  function getCoursePositionStyle(course: number) {
    const distance = 30;

    const translateX = Math.sin((course * Math.PI) / 180) * distance;
    const translateY = -Math.cos((course * Math.PI) / 180) * distance;

    return {
      transform: `translate(${translateX}px, ${translateY}px) rotate(${course}deg)`, //
      transformOrigin: 'center center',
    };
  }

  return (
    <>
      {positions?.map((position) => (
        <div key={position.deviceId}>
          <Marker
            key={position.id}
            longitude={position.longitude}
            latitude={position.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveDeviceId(position.deviceId);
            }}
            style={{ cursor: 'pointer', zIndex: 10 }}
          >
            <div className={`h-10 hover:brightness-125 hover:scale-105 transition-all ease-in-out ${isMoreThanFiveMinutesAgo(position.fixTime) && 'grayscale'}`}>
              {position.speed > 0 && (
                <div className="absolute w-10 h-10 transform flex items-center justify-center" style={getCoursePositionStyle(position.course)}>
                  <img src={arrow} alt="arrow" className="w-7 h-7" />
                </div>
              )}
              <img src={getIcon(position)} className="h-10" />
            </div>
          </Marker>
          <Source id={`circle-source-${position.deviceId}`} type="geojson" data={createCircle(position.longitude, position.latitude, position.accuracy)}>
            <Layer
              id={`circle-layer-${position.deviceId}`}
              type="fill"
              paint={{
                'fill-color': 'rgba(66, 135, 245, 0.2)',
                'fill-outline-color': 'rgba(66, 135, 245, 0.5)',
              }}
            />
          </Source>
        </div>
      ))}
      {activeDevice && (
        <MapPopup longitude={activeDevice.longitude} latitude={activeDevice.latitude} onClose={() => setActiveDeviceId(undefined)} offset={{ bottom: [0, -20] }}>
          <div className="mr-6 flex flex-col gap-2 w-full">
            <div>
              <h2 className="font-semibold">{activeDevice.deviceName}</h2>
              <p>Snelheid: {Math.round(knotsToKmh(activeDevice.speed))} km/h</p>
              <p>Batterij: {Math.round(activeDevice.attributes.batteryLevel)}%</p>
              <p>
                Laatste update:{' '}
                {formatDistanceToNow(activeDevice.fixTime, {
                  locale: nl,
                  addSuffix: true,
                })}
              </p>
            </div>
            <GoogleMapsButton lat={activeDevice.latitude} lng={activeDevice.longitude} />
            <MarkerRegistration lat={activeDevice.latitude} lng={activeDevice.longitude} />
          </div>
        </MapPopup>
      )}
    </>
  );
}
