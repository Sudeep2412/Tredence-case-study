import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkflowStore, AppNode } from '../store/workflowStore';
import { NodeRegistry, NodeType, NodeDefinition } from '../nodes/registry';
import { X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export const PropertiesPanel = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-[#151721] border-l border-white/10 p-6 flex flex-col h-full text-gray-500">
        <div className="text-center mt-20">
          <p>Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const nodeDef = NodeRegistry[selectedNode.type as NodeType];
  const PropertiesComponent = nodeDef.propertiesComponent;

  // We use key={selectedNode.id} to force a re-render of the form when a new node is selected
  return (
    <div className="w-80 bg-[#151721] border-l border-white/10 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#151721]/95 backdrop-blur z-10">
        <h2 className="text-lg font-semibold capitalize">{selectedNode.type} Node</h2>
        <button onClick={() => setSelectedNodeId(null)} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="p-4">
        <NodeForm 
          key={selectedNode.id} 
          node={selectedNode} 
          nodeDef={nodeDef} 
          updateNodeData={updateNodeData} 
        />
      </div>
    </div>
  );
};

const NodeForm = ({ node, nodeDef, updateNodeData }: { node: AppNode, nodeDef: NodeDefinition, updateNodeData: (nodeId: string, data: Record<string, unknown>) => void }) => {
  const removeNode = useWorkflowStore((state) => state.removeNode);

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(nodeDef.schema),
    defaultValues: node.data,
  });

  const formValues = watch();
  const [debouncedValues] = useDebounce(formValues, 300);

  // Watch for changes and update node data in real-time
  useEffect(() => {
    updateNodeData(node.id, debouncedValues);
  }, [debouncedValues, updateNodeData, node.id]);

  return (
    <div className="flex flex-col h-full justify-between pb-8">
      <form className="space-y-4">
        <nodeDef.propertiesComponent control={control} errors={errors} watch={watch} />
      </form>
      <div className="mt-8 pt-4 border-t border-white/10">
        <button 
          onClick={(e) => {
            e.preventDefault();
            removeNode(node.id);
          }}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-md transition-colors text-sm font-medium border border-red-500/20"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
};
