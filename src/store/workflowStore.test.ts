import { describe, it, expect } from 'vitest';
import { hasCycle } from './workflowStore';
import { Connection, Edge } from 'reactflow';

describe('Cycle Detection Algorithm (DFS)', () => {
  it('should return false for an acyclic connection', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'A', target: 'B' },
      { id: 'e2', source: 'B', target: 'C' }
    ] as any;
    // Connecting C to D should not form a cycle
    const connection: Connection = { source: 'C', target: 'D', sourceHandle: null, targetHandle: null };
    expect(hasCycle(connection, edges)).toBe(false);
  });

  it('should return true for a direct cycle', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'A', target: 'B' }
    ] as any;
    // Connecting B back to A
    const connection: Connection = { source: 'B', target: 'A', sourceHandle: null, targetHandle: null };
    expect(hasCycle(connection, edges)).toBe(true);
  });

  it('should return true for an indirect (deep) cycle', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'A', target: 'B' },
      { id: 'e2', source: 'B', target: 'C' },
      { id: 'e3', source: 'C', target: 'D' }
    ] as any;
    // Connecting D back to A forms A->B->C->D->A
    const connection: Connection = { source: 'D', target: 'A', sourceHandle: null, targetHandle: null };
    expect(hasCycle(connection, edges)).toBe(true);
  });
});
