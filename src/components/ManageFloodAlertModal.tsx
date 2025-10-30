import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertLevel } from '../types';
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

interface ManageFloodAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageFloodAlertModal({ isOpen, onClose }: ManageFloodAlertModalProps) {
  const { floodAlerts, addFloodAlert, removeFloodAlert, toggleFloodAlert, currentUser } = useApp();
  const [formData, setFormData] = useState({
    damName: '',
    alertLevel: 'normal' as AlertLevel,
    waterLevel: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.damName || !formData.waterLevel || !formData.description) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    addFloodAlert({
      damName: formData.damName,
      alertLevel: formData.alertLevel,
      waterLevel: parseFloat(formData.waterLevel),
      description: formData.description,
      createdBy: currentUser!.id,
      isActive: true,
    });

    toast.success('Alert banjir ditambahkan');
    setFormData({
      damName: '',
      alertLevel: 'normal',
      waterLevel: '',
      description: '',
    });
  };

  const handleDelete = (id: string) => {
    removeFloodAlert(id);
    toast.success('Alert dihapus');
  };

  const handleToggle = (id: string) => {
    toggleFloodAlert(id);
    toast.success('Status alert diubah');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Status Siaga Banjir</DialogTitle>
          <DialogDescription>
            Tambah, edit, atau hapus status siaga banjir bendungan
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
                  placeholder="Contoh: Bendungan Cirata"
                  value={formData.damName}
                  onChange={(e) => setFormData({ ...formData, damName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertLevel">Level Alert *</Label>
                <Select 
                  value={formData.alertLevel} 
                  onValueChange={(value: AlertLevel) => setFormData({ ...formData, alertLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">🟢 Normal</SelectItem>
                    <SelectItem value="waspada">🟡 Waspada</SelectItem>
                    <SelectItem value="siaga">🟠 Siaga</SelectItem>
                    <SelectItem value="awas">🔴 Awas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterLevel">Tinggi Muka Air (m) *</Label>
                <Input
                  id="waterLevel"
                  type="number"
                  step="0.01"
                  placeholder="Contoh: 125.50"
                  value={formData.waterLevel}
                  onChange={(e) => setFormData({ ...formData, waterLevel: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan kondisi terkini dan tindakan yang perlu dilakukan..."
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
              {floodAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada alert
                </p>
              ) : (
                floodAlerts.map(alert => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.damName}</span>
                          <Badge variant={alert.alertLevel === 'awas' || alert.alertLevel === 'siaga' ? 'destructive' : 'default'}>
                            {alert.alertLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.waterLevel} m</p>
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
