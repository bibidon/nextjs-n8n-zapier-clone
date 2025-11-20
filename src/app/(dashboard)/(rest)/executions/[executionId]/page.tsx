import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";
import ExecutionView from "@/features/executions/components/execution";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { ExecutionsError, ExecutionsLoading } from "@/features/executions/components/executions";
import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{ executionId: string }>;
};

export default async function Page({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  prefetchExecution(executionId);

  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
            <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}
