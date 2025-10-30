import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { AlertTriangle, Edit2, Check, X, MapPin, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface FloodAlertCardEditableProps {
  compact?: boolean;
}

interface DamAlert {
  damName: string;
  status: 'normal' | 'waspada' | 'siaga';
  alertDate: string;
  waterLevel: string;
  normalLevel: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export function FloodAlertCardEditable({ compact = false }: FloodAlertCardEditableProps) {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [currentDamIndex, setCurrentDamIndex] = useState(0);
  const [damAlerts, setDamAlerts] = useState<DamAlert[]>([
    {
      damName: 'Bendungan Jatiluhur',
      status: 'siaga',
      alertDate: '28 Oktober 2025',
      waterLevel: '450cm',
      normalLevel: '250cm',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      damName: 'Bendungan Delingan',
      status: 'waspada',
      alertDate: '28 Oktober 2025',
      waterLevel: '320cm',
      normalLevel: '250cm',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      damName: 'Bendungan Notopuro',
      status: 'normal',
      alertDate: '28 Oktober 2025',
      waterLevel: '240cm',
      normalLevel: '250cm',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
  ]);

  const [editDamForm, setEditDamForm] = useState(damAlerts[currentDamIndex]);

  // Update editDamForm when currentDamIndex changes
  useEffect(() => {
    setEditDamForm(damAlerts[currentDamIndex]);
  }, [currentDamIndex, damAlerts]);

  const handleEdit = () => {
    setEditDamForm(damAlerts[currentDamIndex]);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedDamAlerts = [...damAlerts];
    updatedDamAlerts[currentDamIndex] = {
      ...editDamForm,
      lastUpdatedBy: currentUser?.name || 'Unknown',
      lastUpdatedAt: new Date().toISOString(),
    };
    setDamAlerts(updatedDamAlerts);
    setIsEditing(false);
    toast.success(`Alert ${editDamForm.damName} berhasil diupdate`);
  };

  const handleCancel = () => {
    setEditDamForm(damAlerts[currentDamIndex]);
    setIsEditing(false);
  };

  const nextDam = () => {
    setCurrentDamIndex((prev) => (prev + 1) % damAlerts.length);
  };

  const prevDam = () => {
    setCurrentDamIndex((prev) => (prev - 1 + damAlerts.length) % damAlerts.length);
  };
  
  const currentDam = damAlerts[currentDamIndex];

  const getStatusColor = (status?: string) => {
    const statusToCheck = status || currentDam.status;
    switch (statusToCheck) {
      case 'normal':
        return 'bg-green-500';
      case 'waspada':
        return 'bg-yellow-500';
      case 'siaga':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status?: string) => {
    const statusToCheck = status || currentDam.status;
    switch (statusToCheck) {
      case 'normal':
        return 'NORMAL';
      case 'waspada':
        return 'WASPADA';
      case 'siaga':
        return 'SIAGA';
      default:
        return 'UNKNOWN';
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Compact mode for top banner
  if (compact) {
    return (
      <>
        <Card className="relative h-full shadow-lg border-2 border-red-500/30 dark:border-red-500/40 bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all overflow-hidden group">
          {/* Blinking Alert Animation */}
          {currentDam.status === 'siaga' && (
            <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
          )}

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
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
            <Edit2 className="w-4 h-4 text-red-500" />
          </Button>

          {/* Navigation Arrows */}
          <button
            onClick={prevDam}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={nextDam}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-red-500" />
          </button>

          <CardContent className="relative p-5 h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDamIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg ${
                    currentDam.status === 'siaga' ? 'animate-pulse' : ''
                  }`}>
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">
                      Alert Banjir
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                      {currentDam.damName}
                    </p>
                  </div>
                </div>

                {/* Status & Level */}
                <div className="space-y-2 mt-auto">
                  <Badge className={`${getStatusColor()} text-white text-xs px-2 py-1 ${
                    currentDam.status === 'siaga' ? 'animate-pulse' : ''
                  }`}>
                    {getStatusLabel()}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentDam.alertDate}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{currentDam.waterLevel}</span> / {currentDam.normalLevel}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="truncate">{currentDam.lastUpdatedBy}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dam Navigation Indicators */}
            {damAlerts.length > 1 && (
              <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                {damAlerts.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentDamIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentDamIndex
                        ? 'bg-red-500 w-3'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Edit Alert Banjir
              </DialogTitle>
              <DialogDescription>
                Update informasi alert banjir untuk {currentDam.damName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Nama Bendungan
                </label>
                <Input
                  value={editDamForm.damName}
                  onChange={(e) => setEditDamForm({ ...editDamForm, damName: e.target.value })}
                  placeholder="Nama Bendungan"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Status Alert
                </label>
                <Select
                  value={editDamForm.status}
                  onValueChange={(value: any) => setEditDamForm({ ...editDamForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>NORMAL</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="waspada">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>WASPADA</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="siaga">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>SIAGA</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Alert
                </label>
                <Input
                  value={editDamForm.alertDate}
                  onChange={(e) => setEditDamForm({ ...editDamForm, alertDate: e.target.value })}
                  placeholder="28 Oktober 2025"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Level Saat Ini (cm)</label>
                  <Input
                    value={editDamForm.waterLevel}
                    onChange={(e) => setEditDamForm({ ...editDamForm, waterLevel: e.target.value })}
                    placeholder="450cm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Level Normal (cm)</label>
                  <Input
                    value={editDamForm.normalLevel}
                    onChange={(e) => setEditDamForm({ ...editDamForm, normalLevel: e.target.value })}
                    placeholder="250cm"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white">
                  <Check className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-200/50 dark:border-red-800 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
      {/* Blinking Alert Animation */}
      {data.level === 'Tinggi' || data.level === 'Bahaya' ? (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      ) : null}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white shadow-md ${
              data.level === 'Tinggi' || data.level === 'Bahaya' ? 'animate-pulse' : ''
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-100">
                Alert Banjir
              </h3>
              <p className="text-xs text-red-700 dark:text-red-300">
                Status Terkini
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-7 w-7 p-0 text-red-700 hover:text-red-900 hover:bg-red-100 dark:text-red-300"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 relative z-10">
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={`${getLevelColor()} text-white font-bold animate-pulse`}>
                {data.status}
              </Badge>
              <Badge variant="outline" className="border-red-300 text-red-700">
                Level: {data.level}
              </Badge>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-800 dark:text-red-200">
                {data.location}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-red-600 dark:text-red-400">Tinggi Air</p>
                <p className="font-bold text-red-900 dark:text-red-100">{data.waterLevel}</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-red-600 dark:text-red-400">Normal</p>
                <p className="font-bold text-red-900 dark:text-red-100">{data.normalLevel}</p>
              </div>
            </div>

            <p className="text-xs text-red-700 dark:text-red-300 bg-white/50 dark:bg-black/20 rounded-lg p-2">
              {data.description}
            </p>

            <div className="text-xs text-red-600 dark:text-red-400 pt-2 border-t border-red-200 dark:border-red-800">
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
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              placeholder="Status (SIAGA 1/2/3)"
              className="text-sm"
            />

            <Select
              value={editForm.level}
              onValueChange={(value) => setEditForm({ ...editForm, level: value })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rendah">Rendah</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Bahaya">Bahaya</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
              placeholder="Lokasi"
              className="text-xs"
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editForm.waterLevel}
                onChange={(e) =>
                  setEditForm({ ...editForm, waterLevel: e.target.value })
                }
                placeholder="Tinggi air (cm)"
                className="text-xs"
              />
              <Input
                value={editForm.normalLevel}
                onChange={(e) =>
                  setEditForm({ ...editForm, normalLevel: e.target.value })
                }
                placeholder="Normal (cm)"
                className="text-xs"
              />
            </div>

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
