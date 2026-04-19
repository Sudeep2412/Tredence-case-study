# Tredence AI Agentic Platform: HR Workflow Designer

An enterprise-grade, high-performance HR Workflow Designer built for the Tredence Studio AI Agent Engineering internship case study. 

This prototype is engineered with a strict "zero-to-one" mindset, focusing on highly scalable architecture, rigorous TypeScript typing, advanced React performance optimizations, and applied graph algorithms.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
3. **Run the Test Suite:**
   ```bash
   npx vitest run
   ```

*Note: You can easily import the `example_workflow.json` file included in the root directory via the top header to instantly see a fully configured "Global VP Onboarding" workflow.*

---

## ✨ Features & Functional Requirements Completed

- **Interactive Canvas (React Flow):** Drag-and-drop workflow canvas with custom themes and snap-to-grid alignment.
- **Node Registry Pattern:** 5 highly customized, strongly-typed nodes (Start, Task, Approval, Automated Step, End).
- **Dynamic Contextual Forms:** A properties panel built with `react-hook-form` and `zod` schema validation that updates instantly based on the selected node.
- **Mock Network Layer (MSW):** A robust mock API that handles asynchronous requests for automation configurations and workflow simulation.
- **Workflow Sandbox Simulation:** A real-time validation and execution engine that traces execution paths directly on the canvas UI.

### 🌟 Bonus / Advanced Features Implemented
- **Undo / Redo (Temporal State):** Implemented lightweight time-travel debugging using `zundo`.
- **DAG Auto-Layout Engine:** Integrated `dagre` to automatically format messy graphs into perfect hierarchical trees at the click of a button.
- **JSON Import / Export:** Fully functional serialization and deserialization of the canvas state.
- **Real-time Node Validation:** Visual error badges dynamically appear on nodes if required edges (e.g., missing incoming connections) or required form fields are missing.
- **Automated Testing:** Included `Vitest` and `React Testing Library` (RTL) tests validating both UI rendering and graph algorithms.

---

## 🏗️ Architecture & Design Decisions

### 1. The `NodeRegistry` Pattern (Scalability)
Instead of relying on massive `switch` statements to render the canvas and properties forms, I built a `NodeRegistry`. It securely binds a Node's UI Component, its Zod Validation Schema, and its Form Properties Component under a strict TypeScript generic interface `NodeDefinition<T>`. This decoupled architecture makes extending the app with dozens of new agentic nodes trivial.

### 2. Zustand + `useShallow` Optimization (Performance)
Diagramming tools are notoriously prone to drag lag. By migrating away from React Context to Zustand, and explicitly applying `useShallow` with boolean primitive selectors (e.g., `hasIncoming`, `hasOutgoing`), I ensured that a node **only re-renders** if an edge strictly connected to it is altered. Panning and moving nodes on the canvas maintains a strict 60fps.

### 3. Graph Algorithms & Branching (DSA)
The `/simulate` endpoint relies on applied graph algorithms:
*   **Cycle Detection:** Uses a Depth-First Search (DFS) recursion stack to proactively hunt for back-edges (infinite loops).
*   **Execution Tracer:** Uses a custom Breadth-First Search (BFS) implementation that natively supports DAG "diamond" branching. This perfectly handles scenarios where multiple parallel tasks independently merge into a single Approval Gate without throwing false-positive cycle errors.

---

## 🐛 The Tricky Frontend Bug I Solved

*As requested in the application instructions:*

**The Bug:** While implementing the real-time node validation badges (checking if a node lacked an incoming edge), the canvas crashed with a *"Maximum update depth exceeded"* infinite loop.

**The Root Cause:** I initially used Zustand's `useShallow` to map incoming edges: `useWorkflowStore(useShallow(state => state.edges.filter(...)`. Because `.filter()` creates a *brand-new array reference in memory* on every execution, the shallow equality check (`prev === next`) constantly failed. Zustand thought the state mutated on every render, triggering an endless synchronous loop.

**The Fix:** I refactored the selector to resolve to a boolean primitive using `.some()` instead of returning an array. Since `true === true` perfectly satisfies `useShallow`, the infinite loop broke instantly, drastically cutting down React render cycles and restoring buttery-smooth drag-and-drop performance.

---

## 🔮 What I Would Add With More Time

1. **Backend Persistence & Authentication:** Migrate the MSW mocks to a Python (FastAPI)/PostgreSQL backend with Azure OAuth integration as outlined in the JD.
2. **Real-time Collaboration:** Implement WebSockets or Server-Sent Events (SSE) (e.g., using Yjs) to allow multiple HR admins to collaboratively edit the workflow canvas in real-time.
3. **E2E Testing Pipeline:** Build out comprehensive Cypress/Playwright integration tests via a GitHub Actions CI/CD pipeline to guarantee canvas structural integrity on every push.
4. **Micro-Frontends:** For an enterprise product, I would split the Workflow Viewer and the Workflow Designer into a monorepo structure (using tools like Turborepo) to optimize bundle sizes for end users.
