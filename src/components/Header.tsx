import React from 'react';
import { Play, Undo2, Redo2, Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export const Header = ({ onSimulate }: { onSimulate: () => void }) => {
  const { undo, redo } = useWorkflowStore.temporal.getState();
  const pastStates = useWorkflowStore.temporal.getState().pastStates;
  const futureStates = useWorkflowStore.temporal.getState().futureStates;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    const state = useWorkflowStore.getState();
    const data = JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.nodes && json.edges) {
          useWorkflowStore.getState().setWorkflow(json.nodes, json.edges);
        }
      } catch (err) {
        console.error('Failed to parse workflow file', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded text-sm text-gray-300 transition-colors"
            title="Export JSON"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded text-sm text-gray-300 transition-colors"
            title="Import JSON"
          >
            <Upload size={16} /> Import
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept="application/json" 
            className="hidden" 
          />
        </div>
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
