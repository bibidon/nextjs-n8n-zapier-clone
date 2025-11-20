import { useQueryStates } from "nuqs";
import { executionsParams } from "../params";

export default function useExecutionsParams() {
  return useQueryStates(executionsParams);
}
