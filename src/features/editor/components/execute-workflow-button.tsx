import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export default function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  const executeWorkflow = useExecuteWorkflow();

  function handleExecute() {
    executeWorkflow.mutate({ id: workflowId });
  }

  return (
    <Button size="lg" disabled={executeWorkflow.isPending} onClick={handleExecute}>
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
}
