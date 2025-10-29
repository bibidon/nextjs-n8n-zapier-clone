"use client";

import { memo, useState } from "react";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "../base-execution-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import HttpRequestDialog, { FormType } from "./dialog";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus: NodeStatus = "initial";

  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  function handleOpenSettings() {
    setOpen(true);
  }

  function handleSubmit(values: FormType) {
    setNodes((nodes) => nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            endpoint: values.endpoint,
            method: values.method,
            body: values.body,
          },
        };
      }

      return node;
    }));
  }

  return (
    <>
      <HttpRequestDialog
        open={open}
        defaultEndpoint={nodeData.endpoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
