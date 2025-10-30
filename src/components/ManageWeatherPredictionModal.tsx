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
import { toast } from 'sonner@2.0.3';

interface ManageWeatherPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageWeatherPredictionModal({ isOpen, onClose }: ManageWeatherPredictionModalProps) {
  const { rainfallPredictions, addRainfallPrediction, removeRainfallPrediction, currentUser } = useApp();
  const [formData, setFormData] = useState({
    date: '',
    damName: '',
    balaiName: '',
    rainfallIntensity: 'sedang' as 'ringan' | 'sedang' | 'lebat' | 'sangat-lebat',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.damName || !formData.balaiName || !formData.amount) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    addRainfallPrediction({
      date: formData.date,
      damName: formData.damName,
      balaiName: formData.balaiName,
      rainfallIntensity: formData.rainfallIntensity,
      amount: parseFloat(formData.amount),
      createdBy: currentUser!.id,
    });

    toast.success('Prediksi curah hujan ditambahkan');
    setFormData({
      date: '',
      damName: '',
      balaiName: '',
      rainfallIntensity: 'sedang',
      amount: '',
    });
  };

  const handleDelete = (id: string) => {
    removeRainfallPrediction(id);
    toast.success('Prediksi dihapus');
  };

  // Get upcoming predictions (today and future)
  const today = new Date().toISOString().split('T')[0];
  const upcomingPredictions = rainfallPredictions
    .filter(p => p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Prediksi Curah Hujan</DialogTitle>
          <DialogDescription>
            Tambah atau hapus prediksi curah hujan untuk bendungan
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <h3 className="font-semibold mb-4">Tambah Prediksi Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="damName">Nama Bendungan *</Label>
                <Input
                  id="damName"
                  placeholder="Contoh: BWS Sumatera I"
                  value={formData.damName}
                  onChange={(e) => setFormData({ ...formData, damName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balaiName">Nama Balai *</Label>
                <Input
                  id="balaiName"
                  placeholder="Contoh: Balai Aceh"
                  value={formData.balaiName}
                  onChange={(e) => setFormData({ ...formData, balaiName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensitas *</Label>
                <Select 
                  value={formData.rainfallIntensity} 
                  onValueChange={(value: any) => setFormData({ ...formData, rainfallIntensity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ringan">🌦️ Ringan</SelectItem>
                    <SelectItem value="sedang">🌧️ Sedang</SelectItem>
                    <SelectItem value="lebat">⛈️ Lebat</SelectItem>
                    <SelectItem value="sangat-lebat">🌩️ Sangat Lebat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Curah Hujan (mm) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 50.5"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Prediksi
              </Button>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="font-semibold mb-4">Prediksi yang Akan Datang</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {upcomingPredictions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada prediksi
                </p>
              ) : (
                upcomingPredictions.map(pred => (
                  <div key={pred.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{pred.damName}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(pred.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{pred.balaiName}</p>
                        <p className="text-xs mt-1">
                          <span className="font-semibold">{pred.amount} mm</span> - {pred.rainfallIntensity}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(pred.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
