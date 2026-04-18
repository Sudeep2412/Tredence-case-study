# HR Workflow Designer

## The 30-Second Pitch
The HR Workflow Designer is a highly modular, extensible, and type-safe visual editor for AI-agentic workflows. Built to simulate complex enterprise HR processes (like automated onboarding and approvals), it leverages React Flow for a seamless canvas experience and Zustand for ultra-fast, zero-boilerplate state management (including full undo/redo capabilities).

**Key Highlights for the Tredence AI Agentic Platform:**
* **AI Co-pilot Integration:** Includes a context-aware mock AI hook (`useAISuggestion`) that analyzes the canvas in real-time and provides intelligent suggestions for next steps when nodes are dropped, demonstrating an understanding of Agentic UX.
* **Tredence Enterprise Aesthetics:** Fully adheres to a premium dark-mode theme (`#151721` base) with vibrant orange accents, glassmorphism panels, and dynamic data visualization components that match the required high-end design language.
* **The Node Registry Pattern:** The most significant architectural bet. Instead of tightly coupling React Flow components, forms, and validation logic, everything is decentralized into a single registry (`src/nodes/registry.ts`). Adding a new node type requires touching exactly one file system location. This inherently answers the requirement for a highly scalable, production-ready design.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *(Note: The application uses MSW to mock the backend. A service worker will intercept API requests.)*

## Architecture & Design Decisions
* **MSW (Mock Service Worker):** Chosen over simple mock JSON files to simulate a real network layer perfectly. This allowed me to build the frontend as if it were talking to a real microservice, with the ability to mock complex backend validation and execution steps during the workflow simulation.
* **Zustand + Zundo:** Redux is too heavy for a simple workflow canvas, and React Context causes unnecessary re-renders. Zustand provides a lightweight slice of state, and the `zundo` middleware gives us temporal state (Undo/Redo) with effectively zero extra code.
* **React Hook Form + Zod + The Registry:** Forms are dynamically rendered based on the currently selected node type. By mapping Zod schemas in the Node Registry, we can perform strict type checking and display inline validation badges directly on the canvas elements if required fields or connections are missing.

## Tricky Problems Solved
* **Sandbox Simulation & Graph Traversal:** Validating the graph in the MSW handler required implementing a basic Depth-First Search (DFS) to detect cycles. If a cycle is detected, the execution stops, and an error is returned. If successful, the execution visually traces the path on the frontend with amber pulses (executing) and green borders (success).
* **Inline Validation Badges:** Building a `useNodeValidation` hook that actively checks both the localized Zod schema *and* the global edge state (checking for orphaned nodes) ensures the user is aware of broken workflows before they hit "Run."

## What I'd Add Next
1. **Real Websockets / Collaboration:** Implementing Yjs or a similar CRDT to allow multiple HR managers to edit a workflow simultaneously.
2. **Node Versioning:** The ability to snapshot and version specific nodes or entire workflows.
3. **Advanced AI Co-pilot:** Replacing the mocked Claude hook with a real Anthropics integration that can auto-generate entire workflow branches based on natural language prompts (e.g., "Build a standard software engineer onboarding flow").
