import { useAreas } from '@/hooks/areas.hook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import FoxStatus from './FoxStatus';
import { Skeleton } from '../ui/skeleton';
import { useHunts } from '@/hooks/hunts.hook';
import { Hunt } from '@/types/Hunt';

export default function FoxStatusCard() {
  const { areas, isLoading: isLoadingAreas, isError: isErrorAreas, toggleHidden, isHidden } = useAreas();
  const { hunts, isLoading: isLoadingHunts, isError: isErrorHunts } = useHunts();

  /**
   * Get the last hunt for an area.
   * Exclude the hunts that have status "Tegenhunt", those don't matter for the time since 2024.
   * @param areaName The name of the area
   * @returns The last hunt for the area
   */
  function getLastHunt(areaName: string): Hunt | undefined {
    return hunts?.filter((hunt) => !hunt.status.toLowerCase().includes('tegenhunt')).find((hunt) => hunt.area.toLowerCase() == areaName.toLowerCase());
  }

  return (
    <>
      <Card collapsible={true} defaultOpen={true}>
        <CardHeader>
          <CardTitle>Vossen status</CardTitle>
          <CardDescription>Klik op een deelgebied om deze te verbergen op de kaart.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {(isLoadingAreas || isErrorAreas || isLoadingHunts || isErrorHunts) && (!areas || !hunts) && <FoxStatusSkeleton />}
            {areas &&
              hunts &&
              areas.map((area) => (
                <div onClick={() => toggleHidden(area.name)} key={area._id}>
                  <FoxStatus name={area.name} status={area.status} lastUpdate={area.updatedAt} lastHunt={getLastHunt(area.name)} hidden={isHidden(area.name)} />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FoxStatusSkeleton() {
  return (
    <>
      <Skeleton className="h-[52px] rounded-lg" />
      <Skeleton className="h-[52px] rounded-lg" />
      <Skeleton className="h-[52px] rounded-lg" />
      <Skeleton className="h-[52px] rounded-lg" />
      <Skeleton className="h-[52px] rounded-lg" />
      <Skeleton className="h-[52px] rounded-lg" />
    </>
  );
}
