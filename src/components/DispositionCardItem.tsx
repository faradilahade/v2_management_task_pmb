import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Edit2, Trash2, Check, X, Calendar, Users } from 'lucide-react';
import { DispositionTask } from '../types';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DispositionCardItemProps {
  disposition: DispositionTask;
  onDelete: (id: string) => void;
}

export function DispositionCardItem({ disposition, onDelete }: DispositionCardItemProps) {
  const { currentUser, updateDispositionTask, users } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: disposition.title,
    description: disposition.description,
    status: disposition.status,
    period: disposition.period,
  });

  const canEdit = currentUser?.role === 'admin' || disposition.receiverIds.includes(currentUser?.id || '');

  const handleSave = () => {
    updateDispositionTask(disposition.id, {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      period: editForm.period,
      lastEditedBy: currentUser?.name || 'Unknown',
      lastEditedAt: new Date().toISOString(),
    });
    
    setIsEditing(false);
    toast.success('Disposisi berhasil diupdate');
  };

  const handleCancel = () => {
    setEditForm({
      title: disposition.title,
      description: disposition.description,
      status: disposition.status,
      period: disposition.period,
    });
    setIsEditing(false);
  };

  const getPeriodColor = () => {
    switch (disposition.period) {
      case 'harian':
        return 'bg-blue-500';
      case 'mingguan':
        return 'bg-purple-500';
      case 'bulanan':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = () => {
    switch (disposition.status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const receivers = users.filter((u) => disposition.receiverIds.includes(u.id));

  return (
    <Card className="group hover:shadow-lg transition-all border-2 hover:border-[#FFC72C]/50">
      <div className="p-4">
        {!isEditing ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">{disposition.title}</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${getPeriodColor()} text-white`}>
                    {disposition.period === 'harian' ? '📅 Harian' : disposition.period === 'mingguan' ? '📆 Mingguan' : '🗓️ Bulanan'}
                  </Badge>
                  <Badge className={`${getStatusColor()} text-white`}>
                    {disposition.status === 'active' ? '✅ Aktif' : disposition.status === 'completed' ? '✔️ Selesai' : '⏳ Pending'}
                  </Badge>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(disposition.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{disposition.description}</p>

            {/* Metadata */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{receivers.length} penerima</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(disposition.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {disposition.lastEditedBy && (
                <div className="text-xs text-gray-400 italic">
                  Terakhir diedit: {disposition.lastEditedBy} •{' '}
                  {new Date(disposition.lastEditedAt!).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Judul</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Deskripsi</label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Periode</label>
                  <Select
                    value={editForm.period}
                    onValueChange={(value: any) =>
                      setEditForm({ ...editForm, period: value })
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harian">Harian</SelectItem>
                      <SelectItem value="mingguan">Mingguan</SelectItem>
                      <SelectItem value="bulanan">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: any) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Simpan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Batal
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}