import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { CloudRain, Edit2, Check, X, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function WeatherPredictionCardEditable() {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    prediction: 'Hujan Lebat',
    intensity: 'Tinggi',
    startDate: '25 Oktober 2025',
    endDate: '28 Oktober 2025',
    rainAmount: '150-200mm',
    description: 'Prakiraan hujan lebat dengan curah hujan tinggi',
    lastUpdatedBy: 'BMKG',
    lastUpdatedAt: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState(data);

  const handleEdit = () => {
    setEditForm(data);
    setIsEditing(true);
  };

  const handleSave = () => {
    setData({
      ...editForm,
      lastUpdatedBy: currentUser?.name || 'Unknown',
      lastUpdatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
    toast.success('Prediksi cuaca berhasil diupdate');
  };

  const handleCancel = () => {
    setEditForm(data);
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200/50 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white shadow-md">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                Prediksi Cuaca
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Prakiraan BMKG
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-7 w-7 p-0 text-blue-700 hover:text-blue-900 hover:bg-blue-100 dark:text-blue-300"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!isEditing ? (
          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                {data.prediction}
              </h4>
              <Badge className="bg-blue-500 text-white">
                Intensitas: {data.intensity}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {data.startDate} - {data.endDate}
              </span>
            </div>

            <div className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Curah Hujan:</span> {data.rainAmount}
            </div>

            <p className="text-xs text-blue-700 dark:text-blue-300">
              {data.description}
            </p>

            <div className="text-xs text-blue-600 dark:text-blue-400 pt-2 border-t border-blue-200 dark:border-blue-800">
              Update: {data.lastUpdatedBy} •{' '}
              {new Date(data.lastUpdatedAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              value={editForm.prediction}
              onChange={(e) =>
                setEditForm({ ...editForm, prediction: e.target.value })
              }
              placeholder="Prediksi cuaca"
              className="text-sm"
            />

            <Select
              value={editForm.intensity}
              onValueChange={(value) => setEditForm({ ...editForm, intensity: value })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rendah">Rendah</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Sangat Tinggi">Sangat Tinggi</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editForm.startDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, startDate: e.target.value })
                }
                placeholder="Tanggal mulai"
                className="text-xs"
              />
              <Input
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                placeholder="Tanggal selesai"
                className="text-xs"
              />
            </div>

            <Input
              value={editForm.rainAmount}
              onChange={(e) =>
                setEditForm({ ...editForm, rainAmount: e.target.value })
              }
              placeholder="Curah hujan (mm)"
              className="text-xs"
            />

            <Textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Deskripsi"
              className="text-xs"
              rows={2}
            />

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">
                <Check className="w-3 h-3 mr-1" />
                Simpan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="w-3 h-3 mr-1" />
                Batal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
