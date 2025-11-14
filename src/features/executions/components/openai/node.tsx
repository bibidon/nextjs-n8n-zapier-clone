"use client";

import { memo, useState } from "react";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import useNodeStatus from "../../hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";
import OpenAiDialog, { type OpenAiFormValues } from "./dialog";

type OpenAiNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `gpt-4o: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  function handleOpenSettings() {
    setOpen(true);
  }

  function handleSubmit(values: OpenAiFormValues) {
    setNodes((nodes) => nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          },
        };
      }

      return node;
    }));
  }

  return (
    <>
      <OpenAiDialog
        open={open}
        defaultValues={nodeData}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/openai.svg"
        name="OpenAI"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
