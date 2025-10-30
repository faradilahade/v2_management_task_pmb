import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Shield, Edit2, Check, X, Activity, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
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

interface DamSafetyCardEditableProps {
  compact?: boolean;
}

interface HydraulicDamStatus {
  damName: string;
  status: 'aman' | 'waspada' | 'bahaya';
  alertDate: string;
  waterCapacity: string;
  structuralCondition: string;
  lastInspection: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export function DamSafetyCardEditable({ compact = false }: DamSafetyCardEditableProps) {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [currentDamIndex, setCurrentDamIndex] = useState(0);
  const [damStatuses, setDamStatuses] = useState<HydraulicDamStatus[]>([
    {
      damName: 'Bendungan Jatiluhur',
      status: 'aman',
      alertDate: '28 Oktober 2025',
      waterCapacity: '87%',
      structuralCondition: 'Baik',
      lastInspection: '20 Oktober 2025',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      damName: 'Bendungan Delingan',
      status: 'waspada',
      alertDate: '28 Oktober 2025',
      waterCapacity: '92%',
      structuralCondition: 'Perlu Monitoring',
      lastInspection: '20 Oktober 2025',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      damName: 'Bendungan Notopuro',
      status: 'aman',
      alertDate: '28 Oktober 2025',
      waterCapacity: '75%',
      structuralCondition: 'Baik',
      lastInspection: '20 Oktober 2025',
      lastUpdatedBy: 'Admin PMB',
      lastUpdatedAt: new Date().toISOString(),
    },
  ]);

  const [editDamForm, setEditDamForm] = useState(damStatuses[currentDamIndex]);

  // Update editDamForm when currentDamIndex changes
  useEffect(() => {
    setEditDamForm(damStatuses[currentDamIndex]);
  }, [currentDamIndex, damStatuses]);

  const handleEdit = () => {
    setEditDamForm(damStatuses[currentDamIndex]);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedDamStatuses = [...damStatuses];
    updatedDamStatuses[currentDamIndex] = {
      ...editDamForm,
      lastUpdatedBy: currentUser?.name || 'Unknown',
      lastUpdatedAt: new Date().toISOString(),
    };
    setDamStatuses(updatedDamStatuses);
    setIsEditing(false);
    toast.success(`Data ${editDamForm.damName} berhasil diupdate`);
  };

  const handleCancel = () => {
    setEditDamForm(damStatuses[currentDamIndex]);
    setIsEditing(false);
  };

  const nextDam = () => {
    setCurrentDamIndex((prev) => (prev + 1) % damStatuses.length);
  };

  const prevDam = () => {
    setCurrentDamIndex((prev) => (prev - 1 + damStatuses.length) % damStatuses.length);
  };
  
  const currentDam = damStatuses[currentDamIndex];

  const getStatusColor = (status?: string) => {
    const statusToCheck = status || currentDam.status;
    switch (statusToCheck) {
      case 'aman':
        return 'bg-green-500';
      case 'waspada':
        return 'bg-yellow-500';
      case 'bahaya':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status?: string) => {
    const statusToCheck = status || currentDam.status;
    switch (statusToCheck) {
      case 'aman':
        return 'AMAN';
      case 'waspada':
        return 'WASPADA';
      case 'bahaya':
        return 'BAHAYA';
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
        <Card className="relative h-full shadow-lg border-2 border-[#81C784]/30 dark:border-[#81C784]/40 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all overflow-hidden group">
          {/* Blinking effect for Waspada or Bahaya */}
          {(currentDam.status === 'waspada' || currentDam.status === 'bahaya') && (
            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
          )}
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle, #81C784 1px, transparent 1px)',
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
            <Edit2 className="w-4 h-4 text-[#81C784]" />
          </Button>

          {/* Navigation Arrows */}
          <button
            onClick={prevDam}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-[#81C784]" />
          </button>
          <button
            onClick={nextDam}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-[#81C784]" />
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
                  <div className="p-2.5 bg-gradient-to-br from-[#81C784] to-[#66BB6A] rounded-xl shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1565C0] dark:text-white mb-1 text-sm">
                      Status Keamanan Bendungan Hidrolis
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                      {currentDam.damName}
                    </p>
                  </div>
                </div>

                {/* Status & Info */}
                <div className="space-y-2 mt-auto">
                  <Badge className={`${getStatusColor()} text-white text-xs px-2 py-1 ${
                    currentDam.status === 'waspada' || currentDam.status === 'bahaya' ? 'animate-pulse' : ''
                  }`}>
                    {getStatusLabel()}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentDam.alertDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="truncate">{currentDam.lastUpdatedBy}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dam Navigation Indicators */}
            {damStatuses.length > 1 && (
              <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                {damStatuses.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentDamIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentDamIndex
                        ? 'bg-[#81C784] w-3'
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
                <Shield className="w-5 h-5 text-[#81C784]" />
                Edit Status Keamanan Bendungan
              </DialogTitle>
              <DialogDescription>
                Update informasi keamanan untuk {currentDam.damName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
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
                  <Activity className="w-4 h-4" />
                  Status Keamanan
                </label>
                <Select
                  value={editDamForm.status}
                  onValueChange={(value: any) => setEditDamForm({ ...editDamForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aman">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>AMAN</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="waspada">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>WASPADA</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bahaya">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>BAHAYA</span>
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
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-[#81C784] hover:bg-[#66BB6A] text-white">
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
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200/50 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 dark:text-emerald-100">
                Status Keamanan Bendungan Hidrolis
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Status & Monitoring
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-7 w-7 p-0 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 dark:text-emerald-300"
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
              <h4 className={`font-bold text-emerald-900 dark:text-emerald-100 mb-1 ${
                currentDam.status === 'Waspada' || currentDam.status === 'Bahaya' ? 'animate-pulse' : ''
              }`}>
                {currentDam.damName}
              </h4>
              <Badge className={`${getStatusColor()} text-white ${
                currentDam.status === 'Waspada' || currentDam.status === 'Bahaya' ? 'animate-pulse' : ''
              }`}>
                Status: {currentDam.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Kapasitas Air
                </p>
                <p className="font-bold text-emerald-900 dark:text-emerald-100">
                  {data.waterCapacity}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Kondisi Struktur
                </p>
                <p className="font-bold text-emerald-900 dark:text-emerald-100">
                  {data.structuralCondition}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-200">
                Inspeksi terakhir: {data.lastInspection}
              </span>
            </div>

            <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-white/50 dark:bg-black/20 rounded-lg p-2">
              {data.description}
            </p>

            <div className="text-xs text-emerald-600 dark:text-emerald-400 pt-2 border-t border-emerald-200 dark:border-emerald-800">
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
              value={editDamForm.damName}
              onChange={(e) => setEditDamForm({ ...editDamForm, damName: e.target.value })}
              placeholder="Nama bendungan"
              className="text-sm"
            />

            <Select
              value={editDamForm.status}
              onValueChange={(value) => setEditDamForm({ ...editDamForm, status: value })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aman">Aman</SelectItem>
                <SelectItem value="Waspada">Waspada</SelectItem>
                <SelectItem value="Bahaya">Bahaya</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editForm.waterCapacity}
                onChange={(e) =>
                  setEditForm({ ...editForm, waterCapacity: e.target.value })
                }
                placeholder="Kapasitas air (%)"
                className="text-xs"
              />
              <Input
                value={editForm.structuralCondition}
                onChange={(e) =>
                  setEditForm({ ...editForm, structuralCondition: e.target.value })
                }
                placeholder="Kondisi struktur"
                className="text-xs"
              />
            </div>

            <Input
              value={editForm.lastInspection}
              onChange={(e) =>
                setEditForm({ ...editForm, lastInspection: e.target.value })
              }
              placeholder="Tanggal inspeksi terakhir"
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
