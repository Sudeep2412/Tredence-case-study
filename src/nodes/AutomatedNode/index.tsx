import React, { useEffect, useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';
import { z } from 'zod';
import { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import { NodeBadge } from '../../components/NodeBadge';
import { useNodeValidation } from '../../hooks/useNodeValidation';

export const AutomatedNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  actionId: z.string().min(1, 'Action is required'),
  params: z.any().optional(),
});

export const AutomatedNodeData = {
  label: 'Automated Step',
  actionId: '',
  params: {},
  type: 'automated',
};

export const AutomatedNodeComponent = memo(({ id, data, selected, type }: NodeProps) => {
  const { isValid, errors } = useNodeValidation(id, type || 'automated', AutomatedNodeSchema, data);
  const execClass = data.isExecuting ? 'node-executing' : data.isSuccess ? 'node-success' : '';

  // Generate deterministic mock analytics based on ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const reliability = (95 + (hash % 50) / 10).toFixed(1);

  return (
    <div className={`glass-panel w-[260px] ${selected ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : ''} ${execClass}`}>
      <NodeBadge isValid={isValid} errors={errors} />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500" />
      
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400">
          <Bot size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">Automated Step</div>
          <div className="text-xs text-white/40">{data.label}</div>
        </div>
      </div>

      <div className="p-4 bg-black/20 rounded-b-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/50">Integration</span>
          {data.actionId ? (
            <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20 capitalize">{data.actionId.replace('_', ' ')}</span>
          ) : (
            <span className="text-xs text-red-400">Not Configured</span>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-white/40 mb-1">
            <span>Reliability Score</span>
            <span className="text-orange-400">{reliability}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-1.5 rounded-full" style={{ width: `${reliability}%` }}></div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-orange-500" />
    </div>
  );
});

export const AutomatedNodeProperties = ({ control, errors, watch }: { control: Control<any>, errors: FieldErrors<any>, watch: UseFormWatch<any> }) => {
  const [automations, setAutomations] = useState<any[]>([]);
  const actionId = watch('actionId');

  useEffect(() => {
    fetch('/automations')
      .then(res => res.json())
      .then(data => setAutomations(data))
      .catch(console.error);
  }, []);

  const selectedAction = automations.find(a => a.id === actionId);

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
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Action</label>
        <select 
          {...control.register('actionId')} 
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
        >
          <option value="">Select Action</option>
          {automations.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {errors.actionId && <span className="text-xs text-red-400">{errors.actionId.message}</span>}
      </div>
      
      {selectedAction && selectedAction.params.map((param: string) => (
        <div key={param}>
          <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">{param}</label>
          <input 
            {...control.register(`params.${param}`)} 
            className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-accent focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
};
