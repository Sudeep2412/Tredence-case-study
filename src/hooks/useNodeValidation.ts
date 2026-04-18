import { z } from 'zod';
import { useWorkflowStore } from '../store/workflowStore';

export const useNodeValidation = (nodeId: string, schema: z.ZodSchema<any>, data: any) => {
  const edges = useWorkflowStore(state => state.edges);
  
  const result = schema.safeParse(data);
  const dataErrors = !result.success ? result.error.issues : [];
  
  // Validate edges (simple heuristic)
  const incoming = edges.filter(e => e.target === nodeId);
  const outgoing = edges.filter(e => e.source === nodeId);
  
  const edgeErrors = [];
  if (data.type !== 'start' && incoming.length === 0) {
    edgeErrors.push('Missing incoming connection');
  }
  if (data.type !== 'end' && outgoing.length === 0) {
    edgeErrors.push('Missing outgoing connection');
  }

  return {
    isValid: dataErrors.length === 0 && edgeErrors.length === 0,
    errors: [...dataErrors.map((e: any) => e.message), ...edgeErrors]
  };
};
