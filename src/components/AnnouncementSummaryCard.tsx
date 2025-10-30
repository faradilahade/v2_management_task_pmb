import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Edit, Megaphone, Bell, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

export function AnnouncementSummaryCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Pengumuman Penting');
  const [mainAnnouncement, setMainAnnouncement] = useState('Rapat Koordinasi Bendungan besok jam 09.00');
  const [subAnnouncements, setSubAnnouncements] = useState([
    'Update sistem monitoring',
    'Evaluasi keamanan struktural',
  ]);

  const handleSave = () => {
    toast.success('Pengumuman berhasil diperbarui');
    setIsEditing(false);
  };

  return (
    <>
      <Card className="relative h-full shadow-lg border-2 border-[#FFB74D]/30 dark:border-[#FFB74D]/40 bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all overflow-hidden group">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #FFB74D 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Edit Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4 text-[#FFB74D]" />
        </Button>

        <CardContent className="relative p-5 h-full flex flex-col">
          {/* Icon & Title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-[#FFB74D] to-[#FFA726] rounded-xl shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1565C0] dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Info terbaru untuk tim
              </p>
            </div>
          </div>

          {/* Main Announcement */}
          <div className="mb-3 p-3 bg-gradient-to-r from-[#FFB74D]/20 to-orange-100/50 dark:from-[#FFB74D]/10 dark:to-orange-900/20 rounded-lg border border-[#FFB74D]/30">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-[#FFB74D] flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                {mainAnnouncement}
              </p>
            </div>
          </div>

          {/* Sub Announcements */}
          <div className="space-y-2 mt-auto">
            {subAnnouncements.map((announcement, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFB74D]" />
                <span className="line-clamp-1">{announcement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengumuman</DialogTitle>
            <DialogDescription>
              Ubah pengumuman penting dan informasi untuk tim
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Judul</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul pengumuman"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Pengumuman Utama</label>
              <Textarea
                value={mainAnnouncement}
                onChange={(e) => setMainAnnouncement(e.target.value)}
                placeholder="Pengumuman utama"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sub-pengumuman</label>
              {subAnnouncements.map((announcement, index) => (
                <div key={index} className="mb-2">
                  <Input
                    value={announcement}
                    onChange={(e) => {
                      const newAnnouncements = [...subAnnouncements];
                      newAnnouncements[index] = e.target.value;
                      setSubAnnouncements(newAnnouncements);
                    }}
                    placeholder={`Sub-pengumuman ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
              <Button onClick={handleSave} className="bg-[#FFB74D] hover:bg-[#FFA726] text-white">
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
