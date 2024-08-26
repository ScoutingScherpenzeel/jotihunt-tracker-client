import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as turf from '@turf/turf';

/**
 * ClassName helper function
 * @param inputs The inputs to pass to clsx
 * @returns The className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert knots to km/h
 * @param knots The knots to convert
 * @returns The converted value in km/h
 */
export function knotsToKmh(knots: number) {
  return knots * 1.852;
}

/**
 * Convert an area name to a unique color
 * @param area The area name
 * @returns The color in hex format
 */
export function getColorFromArea(area: string) {
  area = area.trim().toLowerCase();
  switch (area) {
    case 'alpha':
      return '#f87171';
    case 'bravo':
      return '#4ade80';
    case 'charlie':
      return '#60a5fa';
    case 'delta':
      return '#facc15';
    case 'echo':
      return '#e879f9';
    case 'foxtrot':
      return '#2dd4bf';
    default:
      return '#9ca3af';
  }
}

/**
 * Capitalize the first letter of a string
 * @param string The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Create a circle in turf.js (to be used with geojson)
 * @param longitude The longitude of the center
 * @param latitude The latitude of the center
 * @param radius The radius of the circle
 * @returns The circle in turf.js format
 */
export function createCircle(longitude: number, latitude: number, radius: number) {
  const center = [longitude, latitude];
  const circle = turf.circle(center, radius, {
    steps: 64,
    units: 'meters',
  });
  return circle;
}

/**
 * Create a wind sector in turf.js (to be used with geojson)
 * @param longitude The longitude of the center
 * @param latitude The latitude of the center
 * @param radius The radius of the circle
 * @param direction The direction of the wind
 * @param angle The angle of the wind
 * @returns The wind sector in turf.js format
 */
export function createWindSector(longitude: number, latitude: number, radius: number, direction: number, angle: number) {
  const center = [longitude, latitude];
  const halfAngle = angle / 2;

  // Start and end angles for the sector
  const startAngle = direction - halfAngle;
  const endAngle = direction + halfAngle;

  // Generate points along the arc
  const arc = turf.lineArc(center, radius, startAngle, endAngle, {
    steps: 64,
    units: 'meters',
  });

  // Create a polygon by closing the arc
  const sector = turf.polygon([[center, ...arc.geometry.coordinates, center]]);

  return sector;
}
