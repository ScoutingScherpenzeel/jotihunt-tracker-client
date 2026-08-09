import {useEffect} from 'react';
import {useControl, useMap} from 'react-map-gl/mapbox';
import type {ControlPosition} from 'react-map-gl/mapbox';
import MapboxImageControl from '@mapbox-controls/image';
import '@mapbox-controls/image/src/index.css';

type ImageControlOptions = ConstructorParameters<typeof MapboxImageControl>[0];
type ImageControlEvent = mapboxgl.MapboxEvent & Record<string, unknown>;

type ImageControlProps = ImageControlOptions & {
    position?: ControlPosition;
    onSelect?: (event: ImageControlEvent) => void;
    onDeselect?: (event: ImageControlEvent) => void;
    onMode?: (event: ImageControlEvent) => void;
    onUpdate?: (event: ImageControlEvent) => void;
    onAdd?: (event: ImageControlEvent) => void;
    onRemove?: (event: ImageControlEvent) => void;
};

export default function ImageControl({
    position = 'top-right',
    onSelect,
    onDeselect,
    onMode,
    onUpdate,
    onAdd,
    onRemove,
    ...options
}: ImageControlProps) {
    useControl(() => new MapboxImageControl(options), {position});

    const {current: mapRef} = useMap();
    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        if (onSelect) map.on('image.select', onSelect);
        if (onDeselect) map.on('image.deselect', onDeselect);
        if (onMode) map.on('image.mode', onMode);
        if (onUpdate) map.on('image.update', onUpdate);
        if (onAdd) map.on('image.add', onAdd);
        if (onRemove) map.on('image.remove', onRemove);

        return () => {
            if (onSelect) map.off('image.select', onSelect);
            if (onDeselect) map.off('image.deselect', onDeselect);
            if (onMode) map.off('image.mode', onMode);
            if (onUpdate) map.off('image.update', onUpdate);
            if (onAdd) map.off('image.add', onAdd);
            if (onRemove) map.off('image.remove', onRemove);
        };
    }, [mapRef, onSelect, onDeselect, onMode, onUpdate, onAdd, onRemove]);

    return null;
}
