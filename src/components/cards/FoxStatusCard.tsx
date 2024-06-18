import { useAreas } from "@/hooks/areas.hook";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FoxStatus from "./FoxStatus";
import { Skeleton } from "../ui/skeleton";
import { useHunts } from "@/hooks/hunts.hook";
import { Hunt } from "@/api";

export default function FoxStatusCard() {
  const {
    areas,
    isLoading: isLoadingAreas,
    isError: isErrorAreas,
  } = useAreas();
  const {
    hunts,
    isLoading: isLoadingHunts,
    isError: isErrorHunts,
  } = useHunts();

  function getLastHunt(areaName: string): Hunt | undefined {
    return hunts?.find((hunt) => hunt.area === areaName);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vossen status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {(isLoadingAreas ||
              isErrorAreas ||
              isLoadingHunts ||
              isErrorHunts) &&
              (!areas || !hunts) && (
                <>
                  <Skeleton className="h-[52px] rounded-lg" />
                  <Skeleton className="h-[52px] rounded-lg" />
                  <Skeleton className="h-[52px] rounded-lg" />
                  <Skeleton className="h-[52px] rounded-lg" />
                  <Skeleton className="h-[52px] rounded-lg" />
                  <Skeleton className="h-[52px] rounded-lg" />
                </>
              )}
            {areas &&
              hunts &&
              areas.map((area) => (
                <FoxStatus
                  key={area._id}
                  name={area.name}
                  status="green"
                  lastUpdate={area.updatedAt}
                  lastHunt={getLastHunt(area.name)}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
