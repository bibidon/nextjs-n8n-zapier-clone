"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
      // status={nodeStatus} TODO
      // onSettings={handleOpenSettings} TODO
      // onDoubleClick={handleOpenSettings} TODO
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
