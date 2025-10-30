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
import { Checkbox } from './ui/checkbox';
import { UserPlus, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { RequestTask } from '../types';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRequestModal({ isOpen, onClose }: CreateRequestModalProps) {
  const { users, currentUser, addNotification } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToIds: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    notes: '',
  });

  const activeUsers = users.filter((u) => u.isActive && u.id !== currentUser?.id);

  const handleToggleAssignee = (userId: string) => {
    if (formData.assignedToIds.includes(userId)) {
      setFormData({
        ...formData,
        assignedToIds: formData.assignedToIds.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        assignedToIds: [...formData.assignedToIds, userId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.assignedToIds.length === 0) {
      toast.error('Harap lengkapi semua field dan pilih minimal 1 anggota');
      return;
    }

    if (!currentUser) {
      toast.error('User tidak ditemukan');
      return;
    }

    const assignedToNames = formData.assignedToIds.map(
      (id) => users.find((u) => u.id === id)?.name || ''
    );

    // Create request object
    const newRequest: Omit<RequestTask, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      assignedToIds: formData.assignedToIds,
      assignedToNames,
      status: 'pending',
      responses: formData.assignedToIds.map((id) => ({
        userId: id,
        userName: users.find((u) => u.id === id)?.name || '',
        response: 'pending',
      })),
      progress: 0,
      notes: formData.notes,
      priority: formData.priority,
    };

    // Store in localStorage for now (in real app, would use context/API)
    const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const requestWithId: RequestTask = {
      ...newRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('requests', JSON.stringify([...existingRequests, requestWithId]));

    // Send notifications to assigned users
    formData.assignedToIds.forEach((userId) => {
      addNotification({
        userId,
        type: 'request-created',
        message: `${currentUser.name} mengirim request: ${formData.title}`,
        requestId: requestWithId.id,
        isRead: false,
      });
    });

    toast.success(`Request berhasil dikirim ke ${formData.assignedToIds.length} anggota`);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      assignedToIds: [],
      priority: 'medium',
      notes: '',
    });
    
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Request Baru</DialogTitle>
          <DialogDescription>
            Kirim request pekerjaan ke anggota tim (bisa memilih lebih dari 1 anggota)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Request *</Label>
            <Input
              id="title"
              placeholder="Contoh: Review Laporan Monitoring Bendungan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan detail request dan apa yang diharapkan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Low Priority
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Medium Priority
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    High Priority
                  </span>
                </SelectItem>
                <SelectItem value="urgent">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Urgent
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pilih Anggota Tim * (bisa lebih dari 1)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto border rounded-lg p-3 bg-muted/30">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                  <Checkbox
                    checked={formData.assignedToIds.includes(user.id)}
                    onCheckedChange={() => handleToggleAssignee(user.id)}
                  />
                  <label
                    className="text-sm cursor-pointer flex-1"
                    onClick={() => handleToggleAssignee(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.position}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        user.workStatus === 'busy' ? 'bg-red-500' :
                        user.workStatus === 'meeting' ? 'bg-blue-500' :
                        user.workStatus === 'field' ? 'bg-orange-500' :
                        'bg-green-500'
                      }`} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {formData.assignedToIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {formData.assignedToIds.length} anggota dipilih
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan atau instruksi khusus..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-[#1565C0] to-[#0d47a1] hover:from-[#0d47a1] hover:to-[#1565C0]"
            >
              <Send className="w-4 h-4 mr-2" />
              Kirim Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
