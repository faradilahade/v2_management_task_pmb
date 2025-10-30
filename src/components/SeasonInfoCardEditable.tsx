import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { CloudRain, Droplets, Calendar, Edit2, Check, X, Edit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface SeasonInfoCardEditableProps {
  compact?: boolean;
}

export function SeasonInfoCardEditable({ compact = false }: SeasonInfoCardEditableProps) {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [seasonData, setSeasonData] = useState({
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'Maret 2026',
    status: 'peak' as 'peak' | 'early' | 'late',
    rainfallIntensity: 'Tinggi',
    description: 'Periode puncak musim hujan dengan curah hujan tinggi',
    lastUpdatedBy: 'Siti Nurhaliza',
    lastUpdatedAt: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState(seasonData);

  const handleEdit = () => {
    setEditForm(seasonData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setSeasonData({
      ...editForm,
      lastUpdatedBy: currentUser?.name || 'Unknown',
      lastUpdatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
    toast.success('Info musim berhasil diupdate');
  };

  const handleCancel = () => {
    setEditForm(seasonData);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    switch (seasonData.status) {
      case 'peak':
        return 'bg-blue-500 text-white';
      case 'early':
        return 'bg-cyan-500 text-white';
      case 'late':
        return 'bg-indigo-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = () => {
    switch (seasonData.status) {
      case 'peak':
        return 'Puncak Musim';
      case 'early':
        return 'Awal Musim';
      case 'late':
        return 'Akhir Musim';
      default:
        return 'Musim';
    }
  };

  // Compact mode - untuk top banner
  if (compact) {
    return (
      <>
        <Card className="relative h-full shadow-lg border-2 border-[#1565C0]/30 dark:border-[#1565C0]/40 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle, #1565C0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 text-[#1565C0]" />
          </Button>

          <CardContent className="relative p-5 h-full flex flex-col">
            {/* Icon & Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-lg">
                <CloudRain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#1565C0] dark:text-white mb-1">
                  Musim Sekarang
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {seasonData.type}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-xs mt-auto">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{seasonData.startDate} - {seasonData.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {seasonData.rainfallIntensity}
                </span>
              </div>
              <Badge className={`${getStatusColor()} text-xs`}>
                {getStatusLabel()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Info Musim</DialogTitle>
              <DialogDescription>
                Update informasi tentang musim saat ini dan periode curah hujan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Musim</label>
                <Input
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  placeholder="Nama Musim"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Mulai</label>
                  <Input
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    placeholder="Bulan Mulai"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Selesai</label>
                  <Input
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    placeholder="Bulan Selesai"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Intensitas Curah Hujan</label>
                <Select
                  value={editForm.rainfallIntensity}
                  onValueChange={(value) => setEditForm({ ...editForm, rainfallIntensity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rendah">Rendah</SelectItem>
                    <SelectItem value="Sedang">Sedang</SelectItem>
                    <SelectItem value="Tinggi">Tinggi</SelectItem>
                    <SelectItem value="Sangat Tinggi">Sangat Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-[#1565C0] hover:bg-[#0d47a1] text-white">
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Regular mode
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200/50 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white shadow-md">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                Info Musim
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Prediksi & Antisipasi
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
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2.5 bg-blue-500 rounded-lg text-white">
            <CloudRain className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{seasonData.icon}</span>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    {seasonData.type}
                  </h3>
                </div>

                <div className="space-y-2">
                  {/* Period */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200">
                      {seasonData.startDate} - {seasonData.endDate}
                    </span>
                  </div>

                  {/* Intensity */}
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200">
                      Intensitas: {seasonData.rainfallIntensity}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`${getStatusColor()} text-xs`}>
                    {getStatusLabel()}
                  </Badge>

                  {/* Description */}
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    {seasonData.description}
                  </p>

                  {/* Last Updated */}
                  <div className="text-xs text-blue-600 dark:text-blue-400 pt-2 border-t border-blue-200 dark:border-blue-800">
                    Update: {seasonData.lastUpdatedBy} •{' '}
                    {new Date(seasonData.lastUpdatedAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Input
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  placeholder="Nama Musim"
                  className="text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    placeholder="Bulan Mulai"
                    className="text-xs"
                  />
                  <Input
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    placeholder="Bulan Selesai"
                    className="text-xs"
                  />
                </div>

                <Select
                  value={editForm.rainfallIntensity}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, rainfallIntensity: value })
                  }
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

                <Select
                  value={editForm.status}
                  onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early">Awal Musim</SelectItem>
                    <SelectItem value="peak">Puncak Musim</SelectItem>
                    <SelectItem value="late">Akhir Musim</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Deskripsi"
                  className="text-xs"
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
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-7 w-7 p-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}