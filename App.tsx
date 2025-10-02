
import React from 'react';
import Dashboard from './components/Dashboard';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { SplitwiseProvider } from './hooks/useSplitwise.tsx';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <SplitwiseProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </SplitwiseProvider>
  );
};

export default App;
