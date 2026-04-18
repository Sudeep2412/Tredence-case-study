import React, { DragEvent } from 'react';
import { Play, CheckSquare, Stamp, Bot, Square } from 'lucide-react';

const nodeTypes = [
  { type: 'start', label: 'Start', icon: <Play size={18} /> },
  { type: 'task', label: 'Task', icon: <CheckSquare size={18} /> },
  { type: 'approval', label: 'Approval', icon: <Stamp size={18} /> },
  { type: 'automated', label: 'Automated Step', icon: <Bot size={18} /> },
  { type: 'end', label: 'End', icon: <Square size={18} /> },
];

export const Sidebar = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-[#151721] border-r border-white/10 p-4 flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Node Palette</h2>
      <div className="flex flex-col gap-3">
        {nodeTypes.map((nt) => (
          <div
            key={nt.type}
            className="flex items-center gap-3 p-3 glass-panel cursor-grab hover:border-accent/50 transition-colors"
            onDragStart={(event) => onDragStart(event, nt.type)}
            draggable
          >
            <div className="text-accent">{nt.icon}</div>
            <span className="text-sm font-medium">{nt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
