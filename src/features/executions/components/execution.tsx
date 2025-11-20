"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2Icon, CircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useSuspenseExecution } from "../hooks/use-executions";
import { ExecutionStatus } from "@/generated/prisma";

function getStatusIcon(status: ExecutionStatus) {
  switch (status) {
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    default:
      return <CircleIcon className="size-5 text-muted-foreground" />;
  }
}

function formatStatus(status: ExecutionStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function ExecutionView({ executionId }: { executionId: string }) {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);
  const duration = execution.completedAt
    ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div className="flex flex-col gap-1">
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>Execution for {execution.workflow.name}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-sm font-medium text-muted-foreground">Workflow</p>
            <Link
              prefetch
              href={`/workflows/${execution.workflow.id}`}
              className="text-sm text-primary hover:underline"
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">{formatDistanceToNow(execution.startedAt, { addSuffix: true })}</p>
          </div>

          {execution.completedAt && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-sm">{formatDistanceToNow(execution.completedAt, { addSuffix: true })}</p>
            </div>
          )}

          {duration !== null && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-sm">{duration}s</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Event ID</p>
            <p className="text-sm">{execution.inngestEventId}</p>
          </div>

        </div>

        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-800 font-mono">{execution.error}</p>
            </div>

            {execution.errorStack && (
              <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-900 hover:bg-red-100">
                    {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <pre className="text-xs form-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Output</p>
            <pre className="text-xs font-mono overflow-auto">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
