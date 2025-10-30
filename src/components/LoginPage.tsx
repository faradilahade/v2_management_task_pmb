import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dam, Lock, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    
    if (success) {
      toast.success('Login berhasil!');
    } else {
      toast.error('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <Dam className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Sistem Manajemen Tugas PMB</CardTitle>
          <CardDescription>Pusat Monitoring Bendungan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-center mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>User:</strong> arif / arif123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}