"use client";

import { LogoutBtn } from "@/features/auth/components/logout-btn";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  /* await requireAuth();
  const users = await caller.getUsers(); */
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: users } = useQuery(trpc.getUsers.queryOptions());
  const { data: workflows } = useQuery(trpc.getWorkflows.queryOptions());

  const { mutate: createWorkflow, isPending } = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
    },
  }));

  const { mutate: testAI, isPending: isTestAIPending } = useMutation(trpc.testAI.mutationOptions({
    onSuccess: () => {
      toast.success("AI job queued");
    },
  }));

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
      protected server page
      <p>{JSON.stringify(users, null, 2)}</p>
      <p>{JSON.stringify(workflows, null, 2)}</p>
      <p>
        <Button onClick={() => createWorkflow()} disabled={isPending}>Create Workflow</Button>
      </p>
      <p>
        <Button onClick={() => testAI()} disabled={isTestAIPending}>Test AI</Button>
      </p>
      <p>
        <LogoutBtn />
      </p>
    </div>
  );
}
