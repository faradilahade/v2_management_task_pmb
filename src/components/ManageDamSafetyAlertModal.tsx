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

interface ManageDamSafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageDamSafetyAlertModal({ isOpen, onClose }: ManageDamSafetyAlertModalProps) {
  const { damSafetyAlerts, addDamSafetyAlert, removeDamSafetyAlert, toggleDamSafetyAlert, currentUser } = useApp();
  const [formData, setFormData] = useState({
    damName: '',
    alertType: 'instrumentasi' as 'instrumentasi' | 'struktur' | 'operasional',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.damName || !formData.description) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    addDamSafetyAlert({
      damName: formData.damName,
      alertType: formData.alertType,
      severity: formData.severity,
      description: formData.description,
      createdBy: currentUser!.id,
      isActive: true,
    });

    toast.success('Alert dam safety ditambahkan');
    setFormData({
      damName: '',
      alertType: 'instrumentasi',
      severity: 'medium',
      description: '',
    });
  };

  const handleDelete = (id: string) => {
    removeDamSafetyAlert(id);
    toast.success('Alert dihapus');
  };

  const handleToggle = (id: string) => {
    toggleDamSafetyAlert(id);
    toast.success('Status alert diubah');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Alert Dam Safety & Instrumentasi</DialogTitle>
          <DialogDescription>
            Tambah, edit, atau hapus alert terkait keamanan bendungan
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <h3 className="font-semibold mb-4">Tambah Alert Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="damName">Nama Bendungan *</Label>
                <Input
                  id="damName"
                  placeholder="Contoh: Bendungan Jatiluhur"
                  value={formData.damName}
                  onChange={(e) => setFormData({ ...formData, damName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertType">Tipe Alert *</Label>
                <Select 
                  value={formData.alertType} 
                  onValueChange={(value: any) => setFormData({ ...formData, alertType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instrumentasi">📊 Instrumentasi</SelectItem>
                    <SelectItem value="struktur">🏗️ Struktur</SelectItem>
                    <SelectItem value="operasional">⚙️ Operasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Tingkat Keparahan *</Label>
                <Select 
                  value={formData.severity} 
                  onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Rendah</SelectItem>
                    <SelectItem value="medium">🟡 Sedang</SelectItem>
                    <SelectItem value="high">🟠 Tinggi</SelectItem>
                    <SelectItem value="critical">🔴 Kritis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan temuan atau masalah yang ditemukan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Alert
              </Button>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="font-semibold mb-4">Daftar Alert</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {damSafetyAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada alert
                </p>
              ) : (
                damSafetyAlerts.map(alert => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.damName}</span>
                          <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.alertType}</p>
                        <p className="text-xs mt-1">{alert.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(alert.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => handleToggle(alert.id)}
                      />
                      <span className="text-xs">{alert.isActive ? 'Aktif' : 'Nonaktif'}</span>
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
