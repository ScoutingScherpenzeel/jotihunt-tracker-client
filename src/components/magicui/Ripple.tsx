import { CSSProperties } from 'react';
import PropTypes, { InferProps } from 'prop-types';

// Modify these
const MAIN_CIRCLE_SIZE = 210;
const MAIN_CIRCLE_OPACITY = 0.24;
const NUM_CIRCLES = 8;

export default function Ripple({ color = 'sky' }: InferProps<typeof Ripple.propTypes>) {
  /**
   * Map the color of the ripple to a tailwind class
   * @param color The color of the ripple
   * @returns The tailwind class for the ripple
   */
  function getRippleColor(color: string) {
    switch (color) {
      case 'blue':
        return 'bg-sky-400';
      case 'green':
        return 'bg-green-400';
      default:
        return 'bg-sky-400';
    }
  }

  return (
    <div className="absolute left-1/2 top-1/2 h-full w-full overflow-visible">
      {Array.from({ length: NUM_CIRCLES }, (_, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full transition-all ease-in-out ${getRippleColor(color)}`}
          style={
            {
              width: MAIN_CIRCLE_SIZE + i * 70,
              height: MAIN_CIRCLE_SIZE + i * 70,
              opacity: MAIN_CIRCLE_OPACITY - i * 0.03,
              animationDelay: `${i * 0.06}s`,
            } as CSSProperties
          }
        ></div>
      ))}
    </div>
  );
}

Ripple.propTypes = {
  color: PropTypes.string.isRequired,
};
