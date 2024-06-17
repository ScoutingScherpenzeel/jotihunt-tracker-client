import { useAreas } from "@/hooks/areas.hook";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FoxStatus from "./FoxStatus";
import { Skeleton } from "../ui/skeleton";

export default function FoxStatusCard() {

  const { areas, isLoading, isError } = useAreas();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vossen status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
         
             {(isLoading || isError) && <>
              <Skeleton className="h-[52px] rounded-lg" />
              <Skeleton className="h-[52px] rounded-lg" />
              <Skeleton className="h-[52px] rounded-lg" />
              <Skeleton className="h-[52px] rounded-lg" />
              <Skeleton className="h-[52px] rounded-lg" />
              <Skeleton className="h-[52px] rounded-lg" />
             </>}
            {areas && areas.map((area) => (
              <FoxStatus key={area._id} name={area.name} status="green" lastUpdate={area.updatedAt} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
