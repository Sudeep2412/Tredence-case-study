import React, { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { X, Play, Loader } from 'lucide-react';

export const SandboxModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { nodes, edges, updateNodeData } = useWorkflowStore();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSimulate = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      
      if (data.error) {
        setResult({ type: 'error', message: data.error });
        setIsRunning(false);
        return;
      }

      // Animate steps
      setResult({ type: 'success', message: 'Simulation started...' });
      
      for (const step of data.steps) {
        // Highlight node (simulate amber pulse by updating node data with an "executing" state)
        updateNodeData(step.nodeId, { isExecuting: true });
        
        await new Promise(resolve => setTimeout(resolve, step.delay));
        
        // Transition to success
        updateNodeData(step.nodeId, { isExecuting: false, isSuccess: true });
      }

      setResult({ type: 'success', message: 'Simulation complete!' });

    } catch (err) {
      setResult({ type: 'error', message: 'Failed to connect to simulator.' });
    } finally {
      setIsRunning(false);
      
      // Cleanup visual states after 3 seconds
      setTimeout(() => {
        nodes.forEach(n => updateNodeData(n.id, { isExecuting: false, isSuccess: false }));
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Simulate Workflow</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 text-gray-300 text-sm">
          This will run your workflow through the mock execution engine to validate paths and detect cycles.
        </div>

        {result && (
          <div className={`p-3 rounded-md mb-4 text-sm ${result.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
            {result.message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={isRunning}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isRunning ? <Loader className="animate-spin" size={18} /> : <Play size={18} />}
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>
    </div>
  );
};
