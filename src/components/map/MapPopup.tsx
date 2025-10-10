import {Popup, type PopupProps} from 'react-map-gl/mapbox';
import PropTypes from 'prop-types';
import {ReactNode} from "react";
import {Anchor} from "mapbox-gl";

type OffsetObject = Partial<Record<Anchor, [number, number]>>;

type MapPopupProps = {
    longitude: number;
    latitude: number;
    onClose: () => void;
    children: ReactNode;
    // Match react-map-gl exactly (number | [x,y] | Anchor-map | function)
    offset?: PopupProps['offset'];
};

const defaultOffset: OffsetObject = {bottom: [0, -45]};

export default function MapPopup({longitude, latitude, onClose, offset = defaultOffset, children}: MapPopupProps) {
    return (
        <Popup anchor="bottom" longitude={longitude} latitude={latitude} onClose={onClose} closeOnClick={true}
               offset={offset} maxWidth="400px" className="z-20">
            <div>{children}</div>
        </Popup>
    );
}

MapPopup.propTypes = {
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    offset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
        PropTypes.func,
    ]),
    children: PropTypes.node.isRequired,
};
