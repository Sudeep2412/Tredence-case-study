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

    // Build execution steps
    const steps: any[] = [];
    
    // Find start node
    const startNode = nodes.find((n: any) => n.type === 'start');
    if (!startNode) {
      return HttpResponse.json({ error: 'No start node found' }, { status: 400 });
    }

    let currentNodeId = startNode.id;
    const visited = new Set<string>();

    while (currentNodeId) {
      if (visited.has(currentNodeId)) {
        return HttpResponse.json({ error: 'Cycle detected' }, { status: 400 });
      }
      visited.add(currentNodeId);

      const node = nodes.find((n: any) => n.id === currentNodeId);
      if (!node) break;

      steps.push({
        nodeId: node.id,
        status: 'success',
        delay: 500, // 500ms delay per step for simulation
      });

      // Find next node (simple path, first edge found)
      const outgoingEdge = edges.find((e: any) => e.source === currentNodeId);
      currentNodeId = outgoingEdge ? outgoingEdge.target : null;
    }

    // Return steps array
    return HttpResponse.json({ steps });
  }),
];
