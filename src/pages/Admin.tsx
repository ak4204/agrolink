import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <Navigate to="/browse" />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-muted-foreground">Admin features coming soon...</p>
      </main>
    </div>
  );
}
