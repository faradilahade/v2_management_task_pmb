import { useState, useEffect } from 'react';
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
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Plus, Save, Mail, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ManageDispositionModalEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  editingDisposition?: any;
}

export function ManageDispositionModalEnhanced({
  isOpen,
  onClose,
  editingDisposition,
}: ManageDispositionModalEnhancedProps) {
  const { addDispositionTask, updateDispositionTask, users, addMeeting } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    giverNames: [] as string[], // Changed to string array instead of IDs
    receiverIds: [] as string[],
    receivedDate: '', // Tanggal terima disposisi
    linkND: '', // Separated Link ND
    linkMeet: '', // Separated Link Meet
    notes: '',
    status: 'active' as 'active' | 'completed' | 'pending',
    sendEmail: true,
    createMeeting: false,
    meetingDate: '',
    meetingStartTime: '',
    meetingEndTime: '',
  });

  // Input state for adding new giver name
  const [newGiverName, setNewGiverName] = useState('');

  const activeUsers = users.filter((u) => u.isActive);

  useEffect(() => {
    if (editingDisposition) {
      // Parse links from single link field
      const links = editingDisposition.link?.split('|') || [];
      setFormData({
        title: editingDisposition.title,
        description: editingDisposition.description,
        giverNames: editingDisposition.giverNames || [],
        receiverIds: editingDisposition.receiverIds,
        receivedDate: editingDisposition.receivedDate || '',
        linkND: links[0] || '',
        linkMeet: links[1] || '',
        notes: editingDisposition.notes || '',
        status: editingDisposition.status,
        sendEmail: true,
        createMeeting: false,
        meetingDate: '',
        meetingStartTime: '',
        meetingEndTime: '',
      });
    } else {
      // Reset form when adding new disposition
      setFormData({
        title: '',
        description: '',
        giverNames: [],
        receiverIds: [],
        receivedDate: new Date().toISOString().split('T')[0], // Default to today
        linkND: '',
        linkMeet: '',
        notes: '',
        status: 'active',
        sendEmail: true,
        createMeeting: false,
        meetingDate: '',
        meetingStartTime: '',
        meetingEndTime: '',
      });
    }
  }, [editingDisposition, isOpen]);

  const handleAddGiverName = () => {
    if (newGiverName.trim()) {
      setFormData({
        ...formData,
        giverNames: [...formData.giverNames, newGiverName.trim()],
      });
      setNewGiverName('');
    }
  };

  const handleRemoveGiverName = (index: number) => {
    setFormData({
      ...formData,
      giverNames: formData.giverNames.filter((_, i) => i !== index),
    });
  };

  const handleToggleReceiver = (userId: string) => {
    if (formData.receiverIds.includes(userId)) {
      setFormData({
        ...formData,
        receiverIds: formData.receiverIds.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        receiverIds: [...formData.receiverIds, userId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      formData.giverNames.length === 0 ||
      formData.receiverIds.length === 0
    ) {
      toast.error('Harap lengkapi semua field dan isi minimal 1 pemberi & penerima');
      return;
    }

    // Validate meeting fields if creating meeting
    if (formData.createMeeting) {
      if (!formData.meetingDate || !formData.meetingStartTime || !formData.meetingEndTime) {
        toast.error('Harap lengkapi tanggal dan waktu meeting');
        return;
      }
    }

    const receiverNames = formData.receiverIds.map(
      (id) => users.find((u) => u.id === id)?.name || ''
    );

    // Combine links into single field separated by |
    const combinedLink = [formData.linkND, formData.linkMeet].filter(l => l).join('|');

    // Create giverIds for backwards compatibility (use first user ID as placeholder)
    const giverIds = formData.giverNames.length > 0 ? [users[0]?.id || '1'] : [];

    if (editingDisposition) {
      updateDispositionTask(editingDisposition.id, {
        title: formData.title,
        description: formData.description,
        giverNames: formData.giverNames,
        giverIds: giverIds, // Placeholder
        receiverIds: formData.receiverIds,
        receiverNames,
        receivedDate: formData.receivedDate,
        link: combinedLink,
        notes: formData.notes,
        status: formData.status,
      });
      
      if (formData.sendEmail) {
        toast.success('Disposisi berhasil diupdate dan email notifikasi terkirim');
      } else {
        toast.success('Disposisi berhasil diupdate');
      }
    } else {
      addDispositionTask({
        title: formData.title,
        description: formData.description,
        giverNames: formData.giverNames,
        giverIds: giverIds, // Placeholder
        receiverIds: formData.receiverIds,
        receiverNames,
        receivedDate: formData.receivedDate,
        link: combinedLink,
        notes: formData.notes,
        status: formData.status,
        isActive: true,
      });
      
      // Create meeting if requested
      if (formData.createMeeting) {
        const startDateTime = new Date(`${formData.meetingDate}T${formData.meetingStartTime}`);
        const endDateTime = new Date(`${formData.meetingDate}T${formData.meetingEndTime}`);
        
        addMeeting({
          title: `Rapat: ${formData.title}`,
          description: formData.description,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          participants: formData.receiverIds,
          createdBy: users[0]?.id || '1',
          emailNotificationSent: formData.sendEmail,
        });
      }
      
      if (formData.sendEmail && formData.createMeeting) {
        toast.success('Disposisi ditambahkan, rapat terjadwal, dan email notifikasi terkirim');
      } else if (formData.sendEmail) {
        toast.success('Disposisi berhasil ditambahkan dan email notifikasi terkirim');
      } else if (formData.createMeeting) {
        toast.success('Disposisi ditambahkan dan rapat terjadwal');
      } else {
        toast.success('Disposisi berhasil ditambahkan');
      }
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDisposition ? 'Edit Disposisi' : 'Tambah Disposisi Baru'}
          </DialogTitle>
          <DialogDescription>
            Kelola tugas disposisi dengan pemberi dan penerima multiple
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Disposisi *</Label>
            <Input
              id="title"
              placeholder="Contoh: Laporan Harian Monitoring"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan detail tugas disposisi..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">✅ Aktif</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="completed">✔️ Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pemberi Disposisi *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan nama pemberi..."
                    value={newGiverName}
                    onChange={(e) => setNewGiverName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGiverName())}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddGiverName}
                    disabled={!newGiverName.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.giverNames.length > 0 && (
                  <div className="border rounded-lg p-3 space-y-2 max-h-[150px] overflow-y-auto bg-muted/30">
                    {formData.giverNames.map((name, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-white px-3 py-2 rounded border"
                      >
                        <span className="text-sm">{name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGiverName(index)}
                          className="h-6 w-6 p-0 hover:bg-red-50"
                        >
                          <span className="text-red-600">×</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.giverNames.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.giverNames.length} pemberi ditambahkan
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Penerima Disposisi * (Pilih satu atau lebih)</Label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.receiverIds.includes(user.id)}
                      onCheckedChange={() => handleToggleReceiver(user.id)}
                    />
                    <label
                      className="text-sm cursor-pointer flex-1"
                      onClick={() => handleToggleReceiver(user.id)}
                    >
                      {user.name} - {user.position}
                    </label>
                  </div>
                ))}
              </div>
              {formData.receiverIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.receiverIds.length} penerima dipilih
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkND">Link ND (Nota Dinas)</Label>
              <Input
                id="linkND"
                type="url"
                placeholder="https://..."
                value={formData.linkND}
                onChange={(e) => setFormData({ ...formData, linkND: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkMeet">Link Meet (Rapat Online)</Label>
              <Input
                id="linkMeet"
                type="url"
                placeholder="https://meet.google.com/..."
                value={formData.linkMeet}
                onChange={(e) => setFormData({ ...formData, linkMeet: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receivedDate">Tanggal Terima Disposisi *</Label>
            <Input
              id="receivedDate"
              type="date"
              value={formData.receivedDate}
              onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ruang Diskusi (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan atau ruang diskusi untuk kolaborasi..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Email & Meeting Options */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-medium text-sm">Opsi Notifikasi & Rapat</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <div>
                  <Label htmlFor="sendEmail" className="cursor-pointer">
                    Kirim Email Notifikasi
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Penerima akan menerima email disposisi
                  </p>
                </div>
              </div>
              <Switch
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendEmail: checked })
                }
              />
            </div>

            {!editingDisposition && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="w-4 h-4 text-blue-600" />
                    <div>
                      <Label htmlFor="createMeeting" className="cursor-pointer">
                        Buat Jadwal Rapat
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Otomatis tambahkan ke kalender rapat
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="createMeeting"
                    checked={formData.createMeeting}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, createMeeting: checked })
                    }
                  />
                </div>

                {/* Meeting Fields - Only show when createMeeting is enabled */}
                {formData.createMeeting && (
                  <div className="space-y-3 pl-6 border-l-2 border-blue-300 ml-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="meetingDate" className="text-xs">
                          Tanggal Rapat *
                        </Label>
                        <Input
                          id="meetingDate"
                          type="date"
                          value={formData.meetingDate}
                          onChange={(e) =>
                            setFormData({ ...formData, meetingDate: e.target.value })
                          }
                          min={new Date().toISOString().split('T')[0]}
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meetingStartTime" className="text-xs">
                          Waktu Mulai *
                        </Label>
                        <Input
                          id="meetingStartTime"
                          type="time"
                          value={formData.meetingStartTime}
                          onChange={(e) =>
                            setFormData({ ...formData, meetingStartTime: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meetingEndTime" className="text-xs">
                          Waktu Selesai *
                        </Label>
                        <Input
                          id="meetingEndTime"
                          type="time"
                          value={formData.meetingEndTime}
                          onChange={(e) =>
                            setFormData({ ...formData, meetingEndTime: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Peserta rapat otomatis: Semua penerima disposisi
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingDisposition ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Disposisi
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Disposisi
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}