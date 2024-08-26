import { Popup } from 'react-map-gl';
import PropTypes, { InferProps } from 'prop-types';
import { Offset } from 'mapbox-gl';

export default function MapPopup({ longitude, latitude, onClose, offset = { bottom: [0, -45] } as Offset, children }: InferProps<typeof MapPopup.propTypes>) {
  return (
    <Popup anchor="bottom" longitude={longitude} latitude={latitude} onClose={onClose} closeOnClick={true} offset={offset} maxWidth="400px">
      <div>{children}</div>
    </Popup>
  );
}

MapPopup.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  offset: PropTypes.object as PropTypes.Requireable<Offset>,
  children: PropTypes.node.isRequired,
};
