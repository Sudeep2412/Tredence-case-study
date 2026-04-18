import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './canvas/WorkflowCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { SandboxModal } from './sandbox/SandboxModal';
import { useAISuggestionStore } from './hooks/useAISuggestion';
import { Bot } from 'lucide-react';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const suggestion = useAISuggestionStore((state) => state.suggestion);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden">
      <Header onSimulate={() => setIsSandboxOpen(true)} />
      
      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 relative">
          <WorkflowCanvas />
          
          {suggestion && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-md animate-in slide-in-from-bottom-5">
              <Bot className="text-blue-400 shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium text-blue-50">{suggestion}</p>
            </div>
          )}
        </div>
        
        <PropertiesPanel />
      </main>

      <SandboxModal isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
    </div>
  );
}

export default App;
