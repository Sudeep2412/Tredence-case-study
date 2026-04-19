import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { z } from 'zod';
import { Control } from 'react-hook-form';
import { NodeBadge } from '../../components/NodeBadge';
import { useNodeValidation } from '../../hooks/useNodeValidation';

export const StartNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  metadata: z.string().optional(),
});

export const StartNodeData = {
  label: 'Start',
  metadata: '',
  type: 'start',
};

export const StartNodeComponent = memo(({ id, data, selected, type }: NodeProps) => {
  const { isValid, errors } = useNodeValidation(id, type || 'start', StartNodeSchema, data);
  const execClass = data.isExecuting ? 'node-executing' : data.isSuccess ? 'node-success' : '';

  return (
    <div className={`glass-panel w-[180px] ${selected ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''} ${execClass}`}>
      <NodeBadge isValid={isValid} errors={errors} />
      
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="bg-green-500/10 p-3 rounded-full text-green-400 border border-green-500/20">
          <Play size={20} className="ml-1" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white/90">Workflow Start</div>
          <div className="text-xs text-white/40">{data.label}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500" />
    </div>
  );
});

export const StartNodeProperties = ({ control }: { control: Control<any> }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
        <input 
          {...control.register('label')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Metadata (JSON format)</label>
        <textarea 
          {...control.register('metadata')} 
          placeholder='{"key": "value"}'
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none h-24"
        />
      </div>
    </div>
  );
};
