import { AppProvider, useApp } from './contexts/AppContext';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  return currentUser.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AppProvider>
  );
}
