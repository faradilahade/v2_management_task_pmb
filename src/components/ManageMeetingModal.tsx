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
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Calendar, Video, Mail, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ManageMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageMeetingModal({ isOpen, onClose }: ManageMeetingModalProps) {
  const { users, addMeeting, currentUser } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    participantIds: [] as string[],
    location: '',
    meetingLink: '',
    syncToGoogleCalendar: false,
    sendEmailNotification: true,
  });

  const activeUsers = users.filter((u) => u.isActive);

  const handleToggleParticipant = (userId: string) => {
    if (formData.participantIds.includes(userId)) {
      setFormData({
        ...formData,
        participantIds: formData.participantIds.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        participantIds: [...formData.participantIds, userId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      formData.participantIds.length === 0
    ) {
      toast.error('Harap lengkapi semua field yang wajib');
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error('Waktu selesai harus lebih dari waktu mulai');
      return;
    }

    addMeeting({
      title: formData.title,
      description: formData.description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      participants: formData.participantIds,
      location: formData.location,
      meetingLink: formData.meetingLink,
      googleCalendarId: formData.syncToGoogleCalendar ? 'pending-sync' : undefined,
      createdBy: currentUser!.id,
      emailNotificationSent: formData.sendEmailNotification,
    });

    if (formData.sendEmailNotification) {
      toast.success(
        `Meeting dibuat dan email notifikasi dikirim ke ${formData.participantIds.length} peserta`
      );
    } else {
      toast.success('Meeting berhasil dibuat');
    }

    if (formData.syncToGoogleCalendar) {
      toast.info('Sinkronisasi dengan Google Calendar sedang diproses...');
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Buat Meeting Baru
          </DialogTitle>
          <DialogDescription>
            Meeting akan otomatis tersinkron dengan Google Calendar dan mengirim email
            notifikasi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Meeting *</Label>
            <Input
              id="title"
              placeholder="Contoh: Rapat Koordinasi PMB"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Agenda dan detail meeting..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="startTime">Waktu Mulai *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Waktu Selesai *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Peserta * (Pilih satu atau lebih)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded-lg p-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.participantIds.includes(user.id)}
                    onCheckedChange={() => handleToggleParticipant(user.id)}
                  />
                  <label
                    className="text-sm cursor-pointer flex-1"
                    onClick={() => handleToggleParticipant(user.id)}
                  >
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
            {formData.participantIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {formData.participantIds.length} peserta dipilih
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi (Opsional)</Label>
              <Input
                id="location"
                placeholder="Ruang Meeting PMB"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink">Link Meeting (Opsional)</Label>
              <div className="relative">
                <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="meetingLink"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingLink: e.target.value })
                  }
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <Label htmlFor="googleCalendar" className="cursor-pointer">
                    Sinkron ke Google Calendar
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Meeting akan ditambahkan ke Google Calendar
                  </p>
                </div>
              </div>
              <Switch
                id="googleCalendar"
                checked={formData.syncToGoogleCalendar}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, syncToGoogleCalendar: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <div>
                  <Label htmlFor="emailNotification" className="cursor-pointer">
                    Kirim Email Notifikasi
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Peserta akan menerima undangan via email
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotification"
                checked={formData.sendEmailNotification}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendEmailNotification: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Buat Meeting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
