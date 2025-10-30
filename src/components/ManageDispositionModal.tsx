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
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface ManageDispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageDispositionModal({ isOpen, onClose }: ManageDispositionModalProps) {
  const { dispositionTasks, addDispositionTask, removeDispositionTask, toggleDispositionTask, users } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    giverId: '',
    receiverId: '',
    period: 'harian' as 'harian' | 'mingguan' | 'bulanan',
  });

  const activeUsers = users.filter(u => u.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.giverId || !formData.receiverId) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    const giver = users.find(u => u.id === formData.giverId);
    const receiver = users.find(u => u.id === formData.receiverId);

    addDispositionTask({
      title: formData.title,
      description: formData.description,
      giverId: formData.giverId,
      giverName: giver?.name || '',
      receiverId: formData.receiverId,
      receiverName: receiver?.name || '',
      period: formData.period,
      isActive: true,
    });

    toast.success('Disposisi berhasil ditambahkan');
    setFormData({
      title: '',
      description: '',
      giverId: '',
      receiverId: '',
      period: 'harian',
    });
  };

  const handleDelete = (id: string) => {
    removeDispositionTask(id);
    toast.success('Disposisi dihapus');
  };

  const handleToggle = (id: string) => {
    toggleDispositionTask(id);
    toast.success('Status disposisi diubah');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Tugas Disposisi</DialogTitle>
          <DialogDescription>
            Tambah, edit, atau hapus tugas disposisi harian, mingguan, dan bulanan
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <h3 className="font-semibold mb-4">Tambah Disposisi Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Disposisi *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Laporan Harian Monitoring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan detail tugas disposisi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Periode *</Label>
                <Select 
                  value={formData.period} 
                  onValueChange={(value: any) => setFormData({ ...formData, period: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">📅 Harian</SelectItem>
                    <SelectItem value="mingguan">📆 Mingguan</SelectItem>
                    <SelectItem value="bulanan">🗓️ Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="giver">Pemberi Disposisi *</Label>
                <Select 
                  value={formData.giverId} 
                  onValueChange={(value) => setFormData({ ...formData, giverId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemberi" />
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
                <Label htmlFor="receiver">Penerima Disposisi *</Label>
                <Select 
                  value={formData.receiverId} 
                  onValueChange={(value) => setFormData({ ...formData, receiverId: value })}
                >
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

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Disposisi
              </Button>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="font-semibold mb-4">Daftar Disposisi</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {dispositionTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada disposisi
                </p>
              ) : (
                dispositionTasks.map(disp => (
                  <div key={disp.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{disp.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {disp.period}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{disp.description}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-muted-foreground">
                            Dari: <span className="font-medium">{disp.giverName}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Ke: <span className="font-medium">{disp.receiverName}</span>
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(disp.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                      <Switch
                        checked={disp.isActive}
                        onCheckedChange={() => handleToggle(disp.id)}
                      />
                      <span className="text-xs">{disp.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
