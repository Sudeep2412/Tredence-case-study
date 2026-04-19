import { http, HttpResponse } from 'msw';

// Mocked automations data
const automations = [
  { id: 'send_email', name: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', name: 'Generate Document', params: ['template', 'recipient'] },
];

export const handlers = [
  // GET /automations
  http.get('/automations', () => {
    return HttpResponse.json(automations);
  }),

  // POST /simulate
  http.post('/simulate', async ({ request }) => {
    const data = await request.json() as any;
    const { nodes, edges } = data;

    // Simple validation
    if (!nodes || nodes.length === 0) {
      return HttpResponse.json({ error: 'No nodes provided' }, { status: 400 });
    }

    // Handle Disconnected / Orphaned Nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge: any) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const hasOrphans = nodes.some((n: any) => 
      nodes.length > 1 && !connectedNodeIds.has(n.id)
    );

    if (hasOrphans) {
      return HttpResponse.json({ error: 'Validation Error: Orphaned nodes detected. All nodes must be connected.' }, { status: 400 });
    }

    // Build execution steps
    const steps: any[] = [];
    
    // Find start node
    const startNode = nodes.find((n: any) => n.type === 'start');
    if (!startNode) {
      return HttpResponse.json({ error: 'No start node found' }, { status: 400 });
    }

    // Proper Cycle Detection using DFS recursion stack
    const visiting = new Set<string>();
    const fullyVisited = new Set<string>();
    let hasCycle = false;

    const checkCycle = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        hasCycle = true;
        return;
      }
      if (fullyVisited.has(nodeId)) return;

      visiting.add(nodeId);
      const outgoingEdges = edges.filter((e: any) => e.source === nodeId);
      for (const edge of outgoingEdges) {
        checkCycle(edge.target);
      }
      visiting.delete(nodeId);
      fullyVisited.add(nodeId);
    };

    checkCycle(startNode.id);

    if (hasCycle) {
      return HttpResponse.json({ error: 'Cycle detected: Invalid workflow path' }, { status: 400 });
    }

    // BFS for building execution steps (handles merging paths/diamonds without false cycles)
    let queue = [startNode.id];
    const executed = new Set<string>();

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      
      if (executed.has(currentNodeId)) continue;
      executed.add(currentNodeId);

      const node = nodes.find((n: any) => n.id === currentNodeId);
      if (!node) continue;

      steps.push({
        nodeId: node.id,
        status: 'success',
        delay: 500, // 500ms delay per step for simulation
      });

      const outgoingEdges = edges.filter((e: any) => e.source === currentNodeId);
      for (const edge of outgoingEdges) {
         if (!executed.has(edge.target) && !queue.includes(edge.target)) {
             queue.push(edge.target);
         }
      }
    }

    // Return steps array
    return HttpResponse.json({ steps });
  }),
];
