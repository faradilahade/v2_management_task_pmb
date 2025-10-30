import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, CheckCircle2, AlertCircle, Send, UserPlus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function ActivityFeed() {
  const { tasks, users, notifications } = useApp();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Combine different activities
    const allActivities = [
      ...tasks.map(task => ({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        user: users.find(u => u.id === task.receiverId)?.name || 'Unknown',
        status: task.status,
        timestamp: task.completedAt || task.createdAt,
        icon: task.status === 'completed' ? CheckCircle2 : Send,
        color: task.status === 'completed' ? 'text-green-600' : 'text-blue-600',
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivities(allActivities);
  }, [tasks, users, notifications]);

  const getActivityText = (activity: any) => {
    if (activity.type === 'task') {
      if (activity.status === 'completed') {
        return `${activity.user} menyelesaikan "${activity.title}"`;
      } else if (activity.status === 'in-progress') {
        return `${activity.user} sedang mengerjakan "${activity.title}"`;
      } else {
        return `${activity.user} menerima tugas "${activity.title}"`;
      }
    }
    return activity.title;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    return 'Baru saja';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Aktivitas Terkini</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-1 px-4 pb-4">
            {activities.slice(0, 20).map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors animate-slide-up"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationDuration: '0.3s',
                    animationFillMode: 'backwards',
                  }}
                >
                  <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{getActivityText(activity)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
