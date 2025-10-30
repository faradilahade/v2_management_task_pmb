import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { CloudRain, Droplets, Calendar, Edit2, Check, X, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface SeasonInfoCardEditableProps {
  compact?: boolean;
}

interface IslandSeasonData {
  island: string;
  type: string;
  icon: string;
  startDate: string;
  endDate: string;
  status: 'peak' | 'early' | 'late';
  rainfallIntensity: string;
  description: string;
}

const defaultIslandData: IslandSeasonData[] = [
  {
    island: 'Jawa',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'Maret 2026',
    status: 'peak',
    rainfallIntensity: 'Tinggi',
    description: 'Periode puncak musim hujan dengan curah hujan tinggi',
  },
  {
    island: 'Sumatra',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'Maret 2026',
    status: 'peak',
    rainfallIntensity: 'Sangat Tinggi',
    description: 'Intensitas hujan sangat tinggi di wilayah Sumatra',
  },
  {
    island: 'Kalimantan',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'April 2026',
    status: 'early',
    rainfallIntensity: 'Sedang',
    description: 'Awal musim hujan di Kalimantan',
  },
  {
    island: 'Sulawesi',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'Maret 2026',
    status: 'peak',
    rainfallIntensity: 'Tinggi',
    description: 'Puncak musim hujan Sulawesi',
  },
  {
    island: 'Bali & Nusa Tenggara',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'November 2025',
    endDate: 'Maret 2026',
    status: 'early',
    rainfallIntensity: 'Sedang',
    description: 'Awal musim hujan di Bali dan Nusa Tenggara',
  },
  {
    island: 'Papua',
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'April 2026',
    status: 'peak',
    rainfallIntensity: 'Sangat Tinggi',
    description: 'Curah hujan sangat tinggi sepanjang tahun',
  },
];

export function SeasonInfoCardEditableV2({ compact = false }: SeasonInfoCardEditableProps) {
  const { currentUser } = useApp();
  const [currentIslandIndex, setCurrentIslandIndex] = useState(0);
  const [islandData, setIslandData] = useState<IslandSeasonData[]>(defaultIslandData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(islandData[currentIslandIndex]);

  const currentIsland = islandData[currentIslandIndex];

  const handleEdit = () => {
    setEditForm(currentIsland);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedData = [...islandData];
    updatedData[currentIslandIndex] = editForm;
    setIslandData(updatedData);
    setIsEditing(false);
    toast.success(`Info musim ${currentIsland.island} berhasil diupdate`);
  };

  const handleCancel = () => {
    setEditForm(currentIsland);
    setIsEditing(false);
  };

  const nextIsland = () => {
    setCurrentIslandIndex((prev) => (prev + 1) % islandData.length);
  };

  const prevIsland = () => {
    setCurrentIslandIndex((prev) => (prev - 1 + islandData.length) % islandData.length);
  };

  const getStatusColor = () => {
    switch (currentIsland.status) {
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
    switch (currentIsland.status) {
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

          {/* Navigation Arrows */}
          <button
            onClick={prevIsland}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-[#1565C0]" />
          </button>
          <button
            onClick={nextIsland}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-[#1565C0]" />
          </button>

          <CardContent className="relative p-5 h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIslandIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
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
                      {currentIsland.island}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-xs mt-auto">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{currentIsland.startDate} - {currentIsland.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {currentIsland.rainfallIntensity}
                    </span>
                  </div>
                  <Badge className={`${getStatusColor()} text-xs`}>
                    {getStatusLabel()}
                  </Badge>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Island Indicators */}
            <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              {islandData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIslandIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentIslandIndex
                      ? 'bg-[#1565C0] w-3'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Info Musim - {currentIsland.island}</DialogTitle>
              <DialogDescription>
                Update informasi tentang musim saat ini di {currentIsland.island}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Pulau</label>
                <Input
                  value={editForm.island}
                  onChange={(e) => setEditForm({ ...editForm, island: e.target.value })}
                  placeholder="Nama Pulau"
                />
              </div>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Status Musim</label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early">Awal Musim</SelectItem>
                    <SelectItem value="peak">Puncak Musim</SelectItem>
                    <SelectItem value="late">Akhir Musim</SelectItem>
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

  // Regular mode (tidak digunakan dalam compact mode, tapi tetap ada untuk konsistensi)
  return null;
}
