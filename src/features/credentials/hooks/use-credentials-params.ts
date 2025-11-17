import { useQueryStates } from "nuqs";
import { credentialsParams } from "../params";

export default function useCredentialsParams() {
  return useQueryStates(credentialsParams);
}
