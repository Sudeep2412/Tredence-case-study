import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { customNodeTypes, NodeRegistry, NodeType } from '../nodes/registry';
import { useAISuggestion } from '../hooks/useAISuggestion';

const CanvasContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
  } = useWorkflowStore();

  const getSuggestion = useAISuggestion();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left ?? 0),
        y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top ?? 0),
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { ...NodeRegistry[type].defaultData },
      };

      addNode(newNode);
      getSuggestion(newNode, nodes, edges);
    },
    [addNode, getSuggestion, nodes, edges]
  );

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={customNodeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#4b5563', strokeWidth: 2, strokeDasharray: '5 5' },
          animated: true,
        }}
        connectionLineStyle={{ stroke: '#e8633a', strokeWidth: 2 }}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background color="#333333" gap={16} size={1} />
        <Controls className="bg-[#151721] border border-white/10 fill-white" />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#22c55e';
              case 'task': return '#3b82f6';
              case 'approval': return '#a855f7';
              case 'automated': return '#f97316';
              case 'end': return '#ef4444';
              default: return '#e8633a';
            }
          }}
          className="bg-[#151721] border border-white/10"
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
};
