import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ErrorBoundary } from 'react-error-boundary';
import { useWorkflowStore } from '../store/workflowStore';
import { customNodeTypes, NodeRegistry, NodeType } from '../nodes/registry';
import { useAISuggestion } from '../hooks/useAISuggestion';

const CanvasContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
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

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

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
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-red-500 p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Canvas Error</h2>
            <p className="mb-4 text-gray-300">An error occurred while rendering the workflow canvas.</p>
            <pre className="text-sm bg-black/50 p-4 rounded-md mb-4 max-w-full overflow-auto text-left">{error.message}</pre>
            <button onClick={resetErrorBoundary} className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-md hover:bg-red-500/30 transition-colors">
              Try Again
            </button>
          </div>
        )}
      >
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
      </ErrorBoundary>
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
