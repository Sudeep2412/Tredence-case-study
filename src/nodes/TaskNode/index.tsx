import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import { z } from 'zod';
import { Control, FieldErrors } from 'react-hook-form';
import { NodeBadge } from '../../components/NodeBadge';
import { useNodeValidation } from '../../hooks/useNodeValidation';

export const TaskNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  customFields: z.string().optional(),
});

export const TaskNodeData = {
  label: 'Task',
  description: '',
  assignee: '',
  dueDate: '',
  customFields: '',
  type: 'task',
};

export const TaskNodeComponent = memo(({ id, data, selected }: NodeProps) => {
  const { isValid, errors } = useNodeValidation(id, TaskNodeSchema, data);
  const execClass = data.isExecuting ? 'node-executing' : data.isSuccess ? 'node-success' : '';

  return (
    <div className={`glass-panel w-[260px] ${selected ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''} ${execClass}`}>
      <NodeBadge isValid={isValid} errors={errors} />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
          <CheckSquare size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">Manual Task</div>
          <div className="text-xs text-white/40">{data.label}</div>
        </div>
      </div>

      <div className="p-4 bg-black/20 rounded-b-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/50">Assignee</span>
          {data.assignee ? (
            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">@{data.assignee}</span>
          ) : (
            <span className="text-xs text-red-400">Unassigned</span>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-white/40 mb-1">
            <span>Historical Avg Time</span>
            <span className="text-blue-400">2.4 hrs</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full w-[65%]"></div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
});

export const TaskNodeProperties = ({ control, errors }: { control: Control<any>, errors: FieldErrors<any> }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
        <input 
          {...control.register('label')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
        {errors.label && <span className="text-xs text-red-400">{errors.label.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
        <textarea 
          {...control.register('description')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none h-16"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
        <input 
          {...control.register('assignee')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
        {errors.assignee && <span className="text-xs text-red-400">{errors.assignee.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
        <input 
          type="date"
          {...control.register('dueDate')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Custom Fields (JSON)</label>
        <textarea 
          {...control.register('customFields')} 
          placeholder='{"priority": "high"}'
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none h-16"
        />
      </div>
    </div>
  );
};
