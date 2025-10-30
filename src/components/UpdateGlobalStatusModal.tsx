import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Season } from '../types';
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
import { toast } from 'sonner@2.0.3';

interface UpdateGlobalStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateGlobalStatusModal({ isOpen, onClose }: UpdateGlobalStatusModalProps) {
  const { globalStatus, updateGlobalStatus } = useApp();
  const [season, setSeason] = useState<Season>(globalStatus.season);
  const [currentIssue, setCurrentIssue] = useState(globalStatus.currentIssue);
  const [todayFocus, setTodayFocus] = useState(globalStatus.todayFocus);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    updateGlobalStatus({
      season,
      currentIssue,
      todayFocus,
    });

    toast.success('Status global berhasil diperbarui');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Status Global</DialogTitle>
          <DialogDescription>
            Perbarui informasi umum yang ditampilkan di dashboard semua user
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="season">Musim Saat Ini</Label>
            <Select value={season} onValueChange={(value) => setSeason(value as Season)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hujan">🌧️ Musim Hujan</SelectItem>
                <SelectItem value="kemarau">☀️ Musim Kemarau</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Masalah Saat Ini</Label>
            <Textarea
              id="issue"
              value={currentIssue}
              onChange={(e) => setCurrentIssue(e.target.value)}
              placeholder="Contoh: Curah hujan tinggi di wilayah hulu"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus">Fokus Hari Ini</Label>
            <Textarea
              id="focus"
              value={todayFocus}
              onChange={(e) => setTodayFocus(e.target.value)}
              placeholder="Contoh: Monitoring debit air dan kesiapan spillway"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Update Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
