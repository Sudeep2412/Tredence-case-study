import { z } from 'zod';
import { useWorkflowStore } from '../store/workflowStore';
import { useShallow } from 'zustand/react/shallow';

export const useNodeValidation = (nodeId: string, nodeType: string, schema: z.ZodSchema<any>, data: any) => {
  const { hasIncoming, hasOutgoing } = useWorkflowStore(useShallow(state => ({
    hasIncoming: state.edges.some(e => e.target === nodeId),
    hasOutgoing: state.edges.some(e => e.source === nodeId)
  })));
  
  const result = schema.safeParse(data);
  const dataErrors = !result.success ? result.error.issues : [];
  
  const edgeErrors = [];
  if (nodeType !== 'start' && !hasIncoming) {
    edgeErrors.push('Missing incoming connection');
  }
  if (nodeType !== 'end' && !hasOutgoing) {
    edgeErrors.push('Missing outgoing connection');
  }

  return {
    isValid: dataErrors.length === 0 && edgeErrors.length === 0,
    errors: [...dataErrors.map((e: any) => e.message), ...edgeErrors]
  };
};
