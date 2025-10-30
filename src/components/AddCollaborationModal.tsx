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
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Plus, Save, CalendarPlus, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (collaboration: any) => void;
}

export function AddCollaborationModal({
  isOpen,
  onClose,
  onAdd,
}: AddCollaborationModalProps) {
  const { users, currentUser } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    givenBy: '',
    memberIds: [] as string[],
    urgency: 'not-urgent' as 'urgent' | 'not-urgent',
    priority: 'medium' as 'low' | 'medium' | 'high',
    deadline: '',
    notes: '',
    sendEmail: true,
    createMeeting: false,
  });

  const activeUsers = users.filter((u) => u.isActive && u.role === 'user');

  const handleToggleMember = (userId: string) => {
    if (formData.memberIds.includes(userId)) {
      setFormData({
        ...formData,
        memberIds: formData.memberIds.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        memberIds: [...formData.memberIds, userId],
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Judul kolaborasi harus diisi');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Deskripsi harus diisi');
      return;
    }

    if (!formData.givenBy.trim()) {
      toast.error('Pemberi kolaborasi harus diisi');
      return;
    }

    if (formData.memberIds.length === 0) {
      toast.error('Pilih minimal 1 anggota tim');
      return;
    }

    const newCollaboration = {
      title: formData.title,
      description: formData.description,
      createdBy: currentUser?.name || 'Unknown',
      givenBy: formData.givenBy,
      members: formData.memberIds,
      urgency: formData.urgency,
      tasks: [],
      priority: formData.priority,
      deadline: formData.deadline,
      notes: formData.notes,
    };

    onAdd(newCollaboration);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      givenBy: '',
      memberIds: [],
      urgency: 'not-urgent',
      priority: 'medium',
      deadline: '',
      notes: '',
      sendEmail: true,
      createMeeting: false,
    });
    
    if (formData.sendEmail) {
      toast.success('Kolaborasi ditambahkan & notifikasi email terkirim');
    } else {
      toast.success('Kolaborasi berhasil ditambahkan');
    }
    
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#1565C0]" />
            Tambah Kolaborasi Baru
          </DialogTitle>
          <DialogDescription>
            Buat kolaborasi tim baru dengan isian lengkap seperti disposisi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Judul */}
          <div>
            <Label htmlFor="title" className="font-semibold">
              Judul Kolaborasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Proyek Pembangunan Bendungan Q4"
              className="mt-2"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="description" className="font-semibold">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Jelaskan tujuan dan detail kolaborasi..."
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Pemberi Kolaborasi */}
          <div>
            <Label htmlFor="givenBy" className="font-semibold">
              Pemberi Kolaborasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="givenBy"
              value={formData.givenBy}
              onChange={(e) => setFormData({ ...formData, givenBy: e.target.value })}
              placeholder="Contoh: Kepala Balai PMB, Koordinator Tim"
              className="mt-2"
            />
          </div>

          {/* Anggota Tim */}
          <div>
            <Label className="font-semibold mb-3 block">
              Anggota Tim <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Checkbox
                    id={`member-${user.id}`}
                    checked={formData.memberIds.includes(user.id)}
                    onCheckedChange={() => handleToggleMember(user.id)}
                  />
                  <label
                    htmlFor={`member-${user.id}`}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#1565C0] text-white text-xs">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.position}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {formData.memberIds.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.memberIds.length} anggota dipilih
              </p>
            )}
          </div>

          {/* Status Kolaborasi */}
          <div>
            <Label htmlFor="urgency" className="font-semibold">
              Status Kolaborasi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.urgency}
              onValueChange={(value: 'urgent' | 'not-urgent') =>
                setFormData({ ...formData, urgency: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Urgent</span>
                  </div>
                </SelectItem>
                <SelectItem value="not-urgent">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Not Urgent</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid: Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <Label htmlFor="priority" className="font-semibold">
                Prioritas
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${getPriorityColor('low')}`}>
                        Rendah
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${getPriorityColor('medium')}`}>
                        Sedang
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${getPriorityColor('high')}`}>
                        Tinggi
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div>
              <Label htmlFor="deadline" className="font-semibold">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <Label htmlFor="notes" className="font-semibold">
              Catatan Tambahan
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan atau instruksi khusus..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Opsi Tambahan */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
            <h4 className="font-semibold text-sm">Opsi Tambahan</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1565C0]" />
                <Label htmlFor="sendEmail" className="cursor-pointer">
                  Kirim notifikasi email ke anggota
                </Label>
              </div>
              <Checkbox
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendEmail: checked as boolean })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-[#1565C0]" />
                <Label htmlFor="createMeeting" className="cursor-pointer">
                  Buat jadwal meeting otomatis
                </Label>
              </div>
              <Checkbox
                id="createMeeting"
                checked={formData.createMeeting}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, createMeeting: checked as boolean })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[#1565C0] hover:bg-[#0d47a1] dark:bg-[#FFB74D] dark:hover:bg-[#FFA726] dark:text-gray-900"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Kolaborasi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
