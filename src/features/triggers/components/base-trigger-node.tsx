"use client";

import { type ReactNode, memo } from "react";
import Image from "next/image";
import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  // status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(({
  id,
  icon: Icon,
  name,
  description,
  children,
  // status,
  onSettings,
  onDoubleClick,
}: BaseTriggerNodeProps) => {
  // TODO: Add delete functionality
  function handleDelete() { }

  return (
    <WorkflowNode
      name={name}
      description={description}
      onSettings={onSettings}
      onDelete={handleDelete}
    >
      {/* TODO: Wrap within NodeStatusIndicator */}
      <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
        <BaseNodeContent>

          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name} width={16} height={16} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}

          {children}

          <BaseHandle id="source-1" type="source" position={Position.Right} />

        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = "BaseTriggerNode";
