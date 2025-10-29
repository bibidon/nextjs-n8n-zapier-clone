"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";
import ManualTriggerDialog from "./dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const nodeStatus: NodeStatus = "initial";

  function handleOpenSettings() {
    setOpen(true);
  }

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
