import { create } from 'zustand';

interface AISuggestionState {
  suggestion: string | null;
  setSuggestion: (msg: string | null) => void;
}

export const useAISuggestionStore = create<AISuggestionState>((set) => ({
  suggestion: null,
  setSuggestion: (msg) => set({ suggestion: msg }),
}));

export const useAISuggestion = () => {
  const setSuggestion = useAISuggestionStore((state) => state.setSuggestion);

  const getSuggestion = (newNode: any, allNodes: any[], allEdges: any[]) => {
    // Simulate AI thinking
    setSuggestion("Thinking...");
    
    setTimeout(() => {
      let msg = "";
      switch (newNode.type) {
        case 'start':
          msg = "Great start! Consider adding a Task Node next to kick off the process.";
          break;
        case 'task':
          msg = "You added a Task Node. Don't forget to assign it to someone. Maybe an Approval Node should follow?";
          break;
        case 'approval':
          msg = "You just added an Approval Node. Consider adding a Notification Step branching off from a rejection.";
          break;
        case 'automated':
          msg = "Automated steps are great for efficiency. Ensure the parameters are mapped correctly.";
          break;
        case 'end':
          msg = "End node added. Ensure all your branches eventually lead here!";
          break;
        default:
          msg = "Consider connecting this node to the rest of your workflow.";
      }
      setSuggestion(`AI Co-pilot: ${msg}`);
      
      // Clear suggestion after 5 seconds
      setTimeout(() => {
        setSuggestion(null);
      }, 5000);
    }, 1000);
  };

  return getSuggestion;
};
