import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-white/50 mb-8">Your dashboard is coming soon.</p>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black"
      >
        Logout
      </Button>
    </div>
  );
}
