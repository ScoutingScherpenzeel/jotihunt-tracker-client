import PropTypes, { InferProps } from "prop-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";

export default function FoxStatus({
  name,
  status,
  lastUpdate,
}: InferProps<typeof FoxStatus.propTypes>) {
  function getStatusStyles(status: string) {
    switch (status) {
      case "orange":
        return "bg-orange-200 border-orange-400 text-orange-600";
      case "red":
        return "bg-red-200 border-red-400 text-red-600";
      case "green":
        return "bg-green-200 border-green-400 text-green-600";
      default:
        return "bg-gray-200 border-gray-400 text-gray-600";
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="cursor-default">
            <div
              className={`border-2 rounded-lg p-3 text-center ${getStatusStyles(
                status
              )}`}
            >
              {name}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Laatst bijgewerkt:{" "}
              {formatDistanceToNow(new Date(lastUpdate), {
                locale: nl,
                addSuffix: true,
              })}
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
};
