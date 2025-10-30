import { useApp } from '../contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function TasksManagementTable() {
  const { tasks, users } = useApp();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'pending': { variant: 'secondary', label: 'Pending' },
      'accepted': { variant: 'default', label: 'Diterima' },
      'in-progress': { variant: 'default', label: 'Dikerjakan' },
      'completed': { variant: 'default', label: 'Selesai' },
      'declined': { variant: 'destructive', label: 'Ditolak' },
      'revision-requested': { variant: 'secondary', label: 'Revisi' },
    };
    const config = variants[status] || variants['pending'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { icon: string; label: string }> = {
      'low': { icon: '🟢', label: 'Rendah' },
      'medium': { icon: '🟡', label: 'Sedang' },
      'high': { icon: '🟠', label: 'Tinggi' },
      'urgent': { icon: '🔴', label: 'Mendesak' },
    };
    const p = config[priority] || config['medium'];
    return <span className="text-sm">{p.icon} {p.label}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semua Tugas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Dari</TableHead>
              <TableHead>Kepada</TableHead>
              <TableHead>Prioritas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => {
              const sender = users.find(u => u.id === task.senderId);
              const receiver = users.find(u => u.id === task.receiverId);
              
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <p>{task.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{sender?.name}</TableCell>
                  <TableCell className="text-sm">{receiver?.name}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="h-2" />
                        <span className="text-xs">{task.progress}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(task.deadline).toLocaleDateString('id-ID')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
