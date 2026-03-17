import { getLabels } from "@/server-actions/labels";
import { useQuery } from "@tanstack/react-query";

export const useOrgLabels = () => {
  return useQuery({
    queryKey: ["org-labels"],
    queryFn: async () => {
      const result = await getLabels();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
};
