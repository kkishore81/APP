
import React from 'react';
// Fix: Corrected import path for useAuth to remove extension.
import { AuthProvider, useAuth } from './hooks/useAuth';
// Fix: Explicitly import from .tsx file to resolve conflict with empty .ts file.
import { SplitwiseProvider } from './hooks/useSplitwise.tsx';
// Fix: Corrected import path for LoginPage to remove extension if it was implied.
import LoginPage from './components/LoginPage';
// Fix: Corrected import path for Dashboard to remove extension.
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
    
    return user ? <Dashboard /> : <LoginPage />;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <SplitwiseProvider>
            <AppContent />
        </SplitwiseProvider>
    </AuthProvider>
  );
};

export default App;
