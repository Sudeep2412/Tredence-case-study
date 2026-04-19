import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Stamp } from 'lucide-react';
import { z } from 'zod';
import { Control, FieldErrors } from 'react-hook-form';
import { NodeBadge } from '../../components/NodeBadge';
import { useNodeValidation } from '../../hooks/useNodeValidation';

export const ApprovalNodeSchema = z.object({
  label: z.string().min(1, 'Title is required'),
  approverRole: z.string().min(1, 'Approver Role is required'),
  autoApproveThreshold: z.number().optional(),
});

export const ApprovalNodeData = {
  label: 'Approval',
  approverRole: '',
  autoApproveThreshold: 0,
  type: 'approval',
};

export const ApprovalNodeComponent = memo(({ id, data, selected, type }: NodeProps) => {
  const { isValid, errors } = useNodeValidation(id, type || 'approval', ApprovalNodeSchema, data);
  const execClass = data.isExecuting ? 'node-executing' : data.isSuccess ? 'node-success' : '';

  return (
    <div className={`glass-panel w-[260px] ${selected ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : ''} ${execClass}`}>
      <NodeBadge isValid={isValid} errors={errors} />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
          <Stamp size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">Approval Gate</div>
          <div className="text-xs text-white/40">{data.label}</div>
        </div>
      </div>

      <div className="p-4 bg-black/20 rounded-b-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/50">Required Role</span>
          {data.approverRole ? (
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20">{data.approverRole}</span>
          ) : (
            <span className="text-xs text-red-400">Not Set</span>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-md py-1 text-center text-[10px] text-green-400 font-medium">
            Approved
          </div>
          <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-md py-1 text-center text-[10px] text-red-400 font-medium">
            Rejected
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="approved" className="w-3 h-3 bg-green-500 top-[calc(100%-24px)] right-16 translate-x-1/2 rounded-sm" />
      <Handle type="source" position={Position.Right} id="rejected" className="w-3 h-3 bg-red-500 top-[calc(100%-24px)] right-4 translate-x-1/2 rounded-sm" />
    </div>
  );
});

export const ApprovalNodeProperties = ({ control, errors }: { control: Control<any>, errors: FieldErrors<any> }) => {
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
        <label className="block text-sm font-medium text-gray-400 mb-1">Approver Role</label>
        <select 
          {...control.register('approverRole')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        >
          <option value="">Select Role</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
          <option value="Director">Director</option>
        </select>
        {errors.approverRole && <span className="text-xs text-red-400">{errors.approverRole.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Auto-Approve Threshold ($ or Value)</label>
        <input 
          type="number"
          {...control.register('autoApproveThreshold', { valueAsNumber: true })} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        />
      </div>
    </div>
  );
};
