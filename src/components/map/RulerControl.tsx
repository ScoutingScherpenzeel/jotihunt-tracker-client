// Ruler.tsx
import {useEffect} from 'react';
import {useControl, useMap} from 'react-map-gl/mapbox';
import type {ControlPosition} from 'react-map-gl/mapbox';
import RulerControl from '@mapbox-controls/ruler';
import '@mapbox-controls/ruler/src/index.css';
import {LinePaint} from "mapbox-gl";

type RulerProps = {
    position?: ControlPosition;              // e.g. 'bottom-right'
    onActivate?: () => void;                 // 'ruler.on'
    onDeactivate?: () => void;               // 'ruler.off'
    linePaint?: LinePaint;
};

export default function Ruler({position = 'bottom-right', onActivate, onDeactivate, ...options}: RulerProps) {
    // Add the control
    useControl(() => new RulerControl(options), {position});

    // Wire map events
    const {current: mapRef} = useMap();
    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        if (onActivate) map.on('ruler.on', onActivate);
        if (onDeactivate) map.on('ruler.off', onDeactivate);

        return () => {
            if (onActivate) map.off('ruler.on', onActivate);
            if (onDeactivate) map.off('ruler.off', onDeactivate);
        };
    }, [mapRef, onActivate, onDeactivate]);

    return null;
}