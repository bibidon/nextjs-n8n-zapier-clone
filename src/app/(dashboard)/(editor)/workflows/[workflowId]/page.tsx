import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import EditorHeader from "@/features/editor/components/editor-header";

interface PageProps {
  params: Promise<{ workflowId: string }>;
};

export default async function Page({ params }: PageProps) {
  await requireAuth();
  const { workflowId } = await params;

  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
        <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
