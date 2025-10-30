import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from './ui/card';
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock,
  AlertCircle 
} from 'lucide-react';

export function StatsOverview() {
  const { users, tasks } = useApp();

  const activeUsers = users.filter(u => u.isActive && u.role === 'user').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const stats = [
    {
      label: 'Total User Aktif',
      value: activeUsers,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Total Tugas',
      value: totalTasks,
      icon: ClipboardList,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Tugas Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      label: 'Sedang Dikerjakan',
      value: activeTasks,
      icon: AlertCircle,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950',
    },
    {
      label: 'Tugas Selesai',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
