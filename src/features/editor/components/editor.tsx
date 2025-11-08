"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { useSetAtom } from "jotai";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { AddNodeButton } from "@/features/editor/components/add-node-button";
import { nodeComponents } from "@/config/node-components";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma";
import ExecuteWorkflowButton from "./execute-workflow-button";
import '@xyflow/react/dist/style.css';

export function EditorLoading() {
  return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
  return <ErrorView message="Error loading editor..." />;
}

export function Editor({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const setEditor = useSetAtom(editorAtom);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />

        <Controls />

        <MiniMap />

        <Panel position="top-right">
          <AddNodeButton />
        </Panel>

        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
        
      </ReactFlow>
    </div>
  );
}
