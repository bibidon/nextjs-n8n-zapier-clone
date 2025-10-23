import { useQueryStates } from "nuqs";
import { workfkowsParams } from "../params";

export default function useWorkflowsParams() {
  return useQueryStates(workfkowsParams);
}
