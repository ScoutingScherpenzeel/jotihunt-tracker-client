import PropTypes, { InferProps } from 'prop-types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { addSeconds, differenceInSeconds, formatDistance, formatDistanceToNow, isBefore } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Hunt } from '@/api';
import { useEffect, useState } from 'react';

export default function FoxStatus({ name, status, lastUpdate, lastHunt, hidden }: InferProps<typeof FoxStatus.propTypes>) {
  const [currentTime, setCurrentTime] = useState(new Date());

  /**
   * Convert the status of an area to a tailwind class.
   * @param status The status of the area
   * @returns The tailwind classes for the status
   */
  function getStatusStyles(status: string) {
    const isHuntable = areaIsHuntable();
    if (!isHuntable) return 'bg-blue-200 border-blue-400 text-blue-600';
    switch (status) {
      case 'orange':
        return 'bg-orange-200 border-orange-400 text-orange-600';
      case 'red':
        return 'bg-red-200 border-red-400 text-red-600';
      case 'green':
        return 'bg-green-200 border-green-400 text-green-600';
      default:
        return 'bg-gray-200 border-gray-400 text-gray-600';
    }
  }

  /**
   * Whether the area is huntable or not.
   * @returns True if the area is huntable, false otherwise
   */
  function areaIsHuntable() {
    if (!lastHunt || !lastHunt.huntTime) return true;
    const lastHuntTime = new Date(lastHunt.huntTime);
    const nextHuntTime = addSeconds(lastHuntTime, 3600); // 3600 seconds = 1 hour
    return isBefore(nextHuntTime, currentTime); // Checks if next hunt time is before the current time
  }

  /**
   * The time until the area is huntable again (after 1h)
   */
  function timeUntilHuntable() {
    if (!lastHunt || !lastHunt.huntTime) return null;
    const nextHuntTime = addSeconds(lastHunt.huntTime, 3600); // 3600 seconds = 1 hour
    if (currentTime >= nextHuntTime) return null;

    const secondsDifference = differenceInSeconds(nextHuntTime, currentTime);
    const hours = Math.floor(secondsDifference / 3600);
    const minutes = Math.floor((secondsDifference % 3600) / 60);
    const seconds = secondsDifference % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Run a timer every second to update the shown timer.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="w-full">
            <div className={`border-2 rounded-lg h-[52px] flex flex-col justify-center leading-none hover:brightness-105 ${hidden && 'opacity-50'} ${getStatusStyles(status)}`}>
              {areaIsHuntable() ? (
                name
              ) : (
                <>
                  <p className="text-xs">{name}</p>
                  <p>{timeUntilHuntable()}</p>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="hidden md:block">
            <p>
              Status laatst bijgewerkt:{' '}
              {formatDistanceToNow(new Date(lastUpdate), {
                locale: nl,
                addSuffix: true,
              })}
            </p>
            <p>
              Laatste hunt:{' '}
              {lastHunt
                ? formatDistance(new Date(lastHunt.huntTime), new Date(), {
                    locale: nl,
                    addSuffix: true,
                  })
                : 'Nog geen'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

FoxStatus.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  lastUpdate: PropTypes.string.isRequired,
  lastHunt: PropTypes.object as PropTypes.Requireable<Hunt>,
  hidden: PropTypes.bool.isRequired,
};
