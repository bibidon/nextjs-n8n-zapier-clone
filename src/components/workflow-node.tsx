"use client";

import type { ReactNode } from "react";
import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkFlowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkFlowNodeProps) {
  return (
    <>

      {showToolbar && (
        <NodeToolbar>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}

      {children}

      {name && (
        <NodeToolbar position={Position.Bottom} isVisible className="max-w-[200px] text-center">
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-muted-foreground truncate text-sm">{description}</p>
          )}
        </NodeToolbar>
      )}

    </>
  );
}
