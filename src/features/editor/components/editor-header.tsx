"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { SaveIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useSuspenseWorkflow, useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";

export function EditorNameInput({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  async function handleSave() {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name
      });
    } catch (error) {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  }

  function handleKeyDowm(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDowm}
        disabled={updateWorkflow.isPending}
        className="h-7 w-auto min-w-[100px] px-2"
      />
    );
  }

  return (
    <BreadcrumbItem
      className="cursor-pointer hove:text-foreground transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {name}
    </ BreadcrumbItem>
  );
}

export function EditorBreadcrumbs({ workflowId }: { workflowId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/workflows" prefetch>Workflows</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <EditorNameInput workflowId={workflowId} />

      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  function handleSave() {
    if (!editor) { return; }
    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  }

  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
}

export default function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
}
