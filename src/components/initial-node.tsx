"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "@/components/workflow-node";
import { NodeSelector } from "@/components/node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setOpen(true)}>
          <div className="flex items-center justify-center cursor-pointer">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
