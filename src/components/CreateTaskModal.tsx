import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TaskPriority } from '../types';
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
import { toast } from 'sonner@2.0.3';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedReceiver?: string;
  preselectedReceiverId?: string;
}

export function CreateTaskModal({ isOpen, onClose, preselectedReceiver, preselectedReceiverId }: CreateTaskModalProps) {
  const { users, createTask, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [receiverId, setReceiverId] = useState(preselectedReceiver || preselectedReceiverId || '');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const activeUsers = users.filter(u => u.isActive && u.role === 'user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !receiverId || !deadline) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    createTask({
      title,
      description,
      senderId: currentUser!.id,
      receiverId,
      deadline,
      priority,
      status: 'pending',
      progress: 0,
    });

    toast.success('Tugas berhasil dibuat dan dikirim');
    
    // Reset form
    setTitle('');
    setDescription('');
    setReceiverId('');
    setDeadline('');
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Tugas Baru</DialogTitle>
          <DialogDescription>
            Buat dan kirim tugas kepada anggota tim
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas *</Label>
            <Input
              id="title"
              placeholder="Contoh: Mapping Zona Rawan Banjir"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan detail tugas yang harus dikerjakan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiver">Ditujukan Kepada *</Label>
              <Select value={receiverId} onValueChange={setReceiverId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penerima" />
                </SelectTrigger>
                <SelectContent>
                  {activeUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Rendah</SelectItem>
                <SelectItem value="medium">🟡 Sedang</SelectItem>
                <SelectItem value="high">🟠 Tinggi</SelectItem>
                <SelectItem value="urgent">🔴 Mendesak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Buat & Kirim Tugas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}