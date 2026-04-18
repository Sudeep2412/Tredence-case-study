import React from 'react';
import { Handle, Position } from 'reactflow';
import { Square } from 'lucide-react';
import { z } from 'zod';
import { NodeBadge } from '../../components/NodeBadge';
import { useNodeValidation } from '../../hooks/useNodeValidation';

export const EndNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export const EndNodeData = {
  label: 'End',
  type: 'end',
};

export const EndNodeComponent = ({ id, data, selected }: any) => {
  const { isValid, errors } = useNodeValidation(id, EndNodeSchema, data);
  const execClass = data.isExecuting ? 'node-executing' : data.isSuccess ? 'node-success' : '';

  return (
    <div className={`glass-panel w-[180px] ${selected ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''} ${execClass}`}>
      <NodeBadge isValid={isValid} errors={errors} />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500" />
      
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="bg-red-500/10 p-3 rounded-full text-red-400 border border-red-500/20">
          <Square size={20} />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white/90">Workflow End</div>
          <div className="text-xs text-white/40">{data.label}</div>
        </div>
      </div>
    </div>
  );
};

export const EndNodeProperties = ({ control, errors }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Label</label>
        <input 
          {...control.register('label')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
        {errors.label && <span className="text-xs text-red-400">{errors.label.message}</span>}
      </div>
    </div>
  );
};
