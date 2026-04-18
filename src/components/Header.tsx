import React from 'react';
import { Play, Undo2, Redo2 } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

export const Header = ({ onSimulate }: { onSimulate: () => void }) => {
  // zundo hooks for temporal state
  const { undo, redo } = useWorkflowStore.temporal.getState();
  const pastStates = useWorkflowStore.temporal.getState().pastStates;
  const futureStates = useWorkflowStore.temporal.getState().futureStates;

  return (
    <header className="bg-[#151721] border-b border-white/10 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold">
          T
        </div>
        <h1 className="text-xl font-bold tracking-tight">HR Workflow Designer</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-md border border-white/5">
          <button 
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo"
          >
            <Redo2 size={18} />
          </button>
        </div>

        <button 
          onClick={onSimulate}
          className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Play size={18} fill="currentColor" />
          Simulate
        </button>
      </div>
    </header>
  );
};
