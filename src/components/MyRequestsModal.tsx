import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Plus, Trash2, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { TaskPriority } from '../types';

interface MyRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyRequestsModal({ isOpen, onClose }: MyRequestsModalProps) {
  const { users, tasks, currentUser, createTask, updateTaskStatus, deleteTask } = useApp();
  const [activeTab, setActiveTab] = useState('create');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isUrgent, setIsUrgent] = useState(false);

  const activeUsers = users.filter(u => u.isActive && u.role === 'user' && u.id !== currentUser?.id);
  
  // Get my sent requests
  const mySentRequests = tasks.filter(t => t.senderId === currentUser?.id);
  const pendingRequests = mySentRequests.filter(t => t.status === 'pending' || t.status === 'revision-requested');
  const acceptedRequests = mySentRequests.filter(t => t.status === 'in-progress' || t.status === 'accepted');
  const completedRequests = mySentRequests.filter(t => t.status === 'completed');
  const rejectedRequests = mySentRequests.filter(t => t.status === 'declined');

  const handleToggleReceiver = (userId: string) => {
    if (selectedReceivers.includes(userId)) {
      setSelectedReceivers(selectedReceivers.filter(id => id !== userId));
    } else {
      setSelectedReceivers([...selectedReceivers, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || selectedReceivers.length === 0 || !deadline) {
      toast.error('Harap lengkapi semua field dan pilih minimal 1 penerima');
      return;
    }

    // Create request for each selected receiver
    selectedReceivers.forEach(receiverId => {
      createTask({
        title,
        description,
        senderId: currentUser!.id,
        receiverId,
        deadline,
        priority: isUrgent ? 'urgent' : priority,
        status: 'pending',
        progress: 0,
      });
    });

    toast.success(`Request berhasil dikirim ke ${selectedReceivers.length} penerima`);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedReceivers([]);
    setDeadline('');
    setPriority('medium');
    setIsUrgent(false);
    setActiveTab('pending');
  };

  const handleDeleteRequest = (taskId: string) => {
    if (deleteTask) {
      deleteTask(taskId);
      toast.success('Request dihapus');
    }
  };

  const handleHoldRequest = (taskId: string) => {
    updateTaskStatus(taskId, 'pending');
    toast.success('Request di-hold');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string; icon: any }> = {
      'pending': { variant: 'secondary', label: 'Pending', icon: Clock },
      'in-progress': { variant: 'default', label: 'Dikerjakan', icon: Clock },
      'completed': { variant: 'default', label: 'Selesai', icon: CheckCircle2 },
      'declined': { variant: 'destructive', label: 'Ditolak', icon: XCircle },
      'revision-requested': { variant: 'secondary', label: 'Revisi', icon: AlertTriangle },
    };
    const c = config[status] || config['pending'];
    const Icon = c.icon;
    return (
      <Badge variant={c.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {c.label}
      </Badge>
    );
  };

  const renderRequestList = (requestList: any[]) => {
    if (requestList.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-8">
          Tidak ada request
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {requestList.map(task => {
          const receiver = users.find(u => u.id === task.receiverId);
          return (
            <Card key={task.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Kepada:</span>
                    <span className="text-xs font-medium">{receiver?.name}</span>
                  </div>
                </div>
                {getStatusBadge(task.status)}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-4">
                  <span>Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}</span>
                  <span>Prioritas: {task.priority}</span>
                  {task.progress > 0 && <span>Progress: {task.progress}%</span>}
                </div>
                
                {task.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleHoldRequest(task.id)}
                    >
                      Hold
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRequest(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Saya</DialogTitle>
          <DialogDescription>
            Buat dan kelola request ke anggota tim lain
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="create">Buat Request</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Dikerjakan ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Selesai ({completedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Request *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Bantuan Analisis Data GIS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan detail request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Penerima * (Pilih satu atau lebih)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                  {activeUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedReceivers.includes(user.id)}
                        onCheckedChange={() => handleToggleReceiver(user.id)}
                      />
                      <label className="text-sm cursor-pointer flex-1" onClick={() => handleToggleReceiver(user.id)}>
                        {user.name} - {user.position}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedReceivers.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedReceivers.length} penerima dipilih
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Rendah</SelectItem>
                      <SelectItem value="medium">🟡 Sedang</SelectItem>
                      <SelectItem value="high">🟠 Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isUrgent}
                  onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
                  id="urgent"
                />
                <Label htmlFor="urgent" className="cursor-pointer">
                  🔴 Tandai sebagai URGENT
                </Label>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Kirim Request
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="pending">
            {renderRequestList(pendingRequests)}
          </TabsContent>

          <TabsContent value="accepted">
            {renderRequestList(acceptedRequests)}
          </TabsContent>

          <TabsContent value="completed">
            {renderRequestList(completedRequests)}
          </TabsContent>

          <TabsContent value="rejected">
            {renderRequestList(rejectedRequests)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}