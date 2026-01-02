import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/landing/LandingPage';
import { GraphCanvas } from './components/graph/GraphCanvas';
import { NodeDetails } from './components/graph/NodeDetails';
import { mockGraphData } from './data/mockData';

function App() {
  const [view, setView] = useState<'landing' | 'graph'>('landing');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Initialize theme from system preference or local storage (if we had it)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme with DOM whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleGetStarted = () => {
    setView('graph');
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <Layout isDark={isDark} toggleTheme={toggleTheme}>
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-vsg-neutral-200 dark:border-vsg-neutral-800 shadow-sm">
        <GraphCanvas
          data={mockGraphData}
          className="w-full h-full"
        />

        {/* Mock interaction to open details - in a real app this would be triggered by graph events */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setSelectedNode('Ayodele')}
            className="bg-white px-3 py-1 rounded shadow text-xs hover:bg-gray-50"
          >
            Debug: Select Node
          </button>
        </div>

        {selectedNode && (
          <NodeDetails
            nodeId={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
