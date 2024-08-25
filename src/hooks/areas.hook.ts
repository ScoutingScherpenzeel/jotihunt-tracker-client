import { Area, useAuthSWR } from "../api";
import useHiddenAreasStore from "@/stores/hiddenareas.store";

export const useAreas = () => {
  const { data, error } = useAuthSWR<Area[]>("/areas", {
    refreshInterval: 1000,
  });

  const { hiddenAreas, toggleHidden } = useHiddenAreasStore();

  const isHidden = (areaName: string) =>
    hiddenAreas.includes(areaName.toLowerCase());
  const isVisible = (areaName: string) =>
    !hiddenAreas.includes(areaName.toLowerCase());

  return {
    areas: data,
    isLoading: !error && !data,
    isError: error,
    toggleHidden,
    isHidden,
    isVisible,
    hiddenAreas,
  };
};
