import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export const hasCycle = (connection: Connection, edges: Edge[]) => {
  const target = connection.target;
  const source = connection.source;

  if (target === source) return true;

  const visited = new Set<string>();
  const stack = [target];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === source) return true;
    if (current && !visited.has(current)) {
      visited.add(current);
      const nextNodes = edges.filter((e) => e.source === current).map((e) => e.target);
      stack.push(...nextNodes);
    }
  }

  return false;
};

export type AppNode = Node;

export type WorkflowState = {
  nodes: AppNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  removeNode: (nodeId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setWorkflow: (nodes: AppNode[], edges: Edge[]) => void;
};

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        if (hasCycle(connection, get().edges)) {
          console.warn("Cycle detected: Cannot connect these nodes.");
          return;
        }
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      setNodes: (nodes: AppNode[]) => {
        set({ nodes });
      },
      setEdges: (edges: Edge[]) => {
        set({ edges });
      },
      addNode: (node: AppNode) => {
        set({ nodes: [...get().nodes, node] });
      },
      updateNodeData: (nodeId: string, data: Record<string, unknown>) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },
      removeNode: (nodeId: string) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        });
      },
      setSelectedNodeId: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },
      setWorkflow: (nodes: AppNode[], edges: Edge[]) => {
        set({ nodes, edges, selectedNodeId: null });
      },
    }),
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    }
  )
);
