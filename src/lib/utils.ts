import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as turf from '@turf/turf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function knotsToKmh(knots: number) {
  return knots * 1.852;
}

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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createCircle(longitude: number, latitude: number, radius: number) {
  const center = [longitude, latitude];
  const circle = turf.circle(center, radius, {
    steps: 64,
    units: 'meters',
  });
  return circle;
}

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
