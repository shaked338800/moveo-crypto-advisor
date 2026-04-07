import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { registerApi } from '@/api/auth.api';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => registerApi(form.name, form.email, form.password),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/onboarding');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Something went wrong');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-purple-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-blue-700 opacity-20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md bg-white/5 border-white/10 text-white relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription className="text-white/50">
            Start your personalized crypto journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-white/70">Name</Label>
              <Input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black hover:bg-white/90 font-semibold"
            >
              {isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
