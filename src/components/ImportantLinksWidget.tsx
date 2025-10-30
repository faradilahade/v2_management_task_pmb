import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  FolderOpen,
  Cloud,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface ImportantLink {
  id: string;
  title: string;
  url: string;
  type: 'onedrive' | 'gdrive' | 'other';
  createdBy: string;
  createdAt: string;
}

export function ImportantLinksWidget() {
  const [links, setLinks] = useState<ImportantLink[]>([
    {
      id: '1',
      title: 'Folder Laporan Bendungan 2025',
      url: 'https://onedrive.com/...',
      type: 'onedrive',
      createdBy: 'Admin PMB',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Dokumen Survey & Data',
      url: 'https://drive.google.com/...',
      type: 'gdrive',
      createdBy: 'Admin PMB',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'SOP & Panduan Teknis',
      url: 'https://onedrive.com/...',
      type: 'onedrive',
      createdBy: 'Admin PMB',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Arsip Rapat Koordinasi',
      url: 'https://drive.google.com/...',
      type: 'gdrive',
      createdBy: 'Admin PMB',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<ImportantLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'onedrive' as 'onedrive' | 'gdrive' | 'other',
  });

  const handleAdd = () => {
    setFormData({ title: '', url: '', type: 'onedrive' });
    setShowAddDialog(true);
  };

  const handleSaveNew = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Judul dan URL harus diisi');
      return;
    }

    const newLink: ImportantLink = {
      id: Date.now().toString(),
      title: formData.title,
      url: formData.url,
      type: formData.type,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    };

    setLinks([...links, newLink]);
    setShowAddDialog(false);
    toast.success('Link berhasil ditambahkan');
  };

  const handleEdit = (link: ImportantLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      type: link.type,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingLink) return;

    setLinks(
      links.map((l) =>
        l.id === editingLink.id
          ? { ...l, title: formData.title, url: formData.url, type: formData.type }
          : l
      )
    );
    setShowEditDialog(false);
    toast.success('Link berhasil diperbarui');
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    toast.success('Link dihapus');
  };

  const getIcon = (type: string) => {
    if (type === 'onedrive') {
      return <Cloud className="w-4 h-4 text-blue-600" />;
    } else if (type === 'gdrive') {
      return <FolderOpen className="w-4 h-4 text-green-600" />;
    }
    return <LinkIcon className="w-4 h-4 text-gray-600" />;
  };

  const getTypeBadge = (type: string) => {
    if (type === 'onedrive') {
      return <Badge className="bg-blue-100 text-blue-800 text-xs">OneDrive</Badge>;
    } else if (type === 'gdrive') {
      return <Badge className="bg-green-100 text-green-800 text-xs">Google Drive</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 text-xs">Link</Badge>;
  };

  return (
    <>
      <Card className="shadow-lg border-2 bg-white">
        <CardHeader className="pb-3 px-5 pt-4 border-b bg-gradient-to-r from-[#2E4B7C]/5 to-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#2E4B7C]" />
              <h3 className="font-bold text-[#2E4B7C]">Link Penting PMB</h3>
            </div>
            <Button
              size="sm"
              onClick={handleAdd}
              className="h-8 px-3 bg-[#2E4B7C] hover:bg-[#1e3555]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4 pt-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="group p-3 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors hover:border-[#2E4B7C]/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      {getIcon(link.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h5 className="font-semibold text-sm line-clamp-1">
                          {link.title}
                        </h5>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(link)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="w-3 h-3 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(link.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {getTypeBadge(link.type)}
                      </div>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {links.length === 0 && (
                <div className="text-center py-12 text-gray-300">
                  <LinkIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-gray-400">Belum ada link tersimpan</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Link Baru</DialogTitle>
            <DialogDescription>
              Tambahkan link penting ke folder atau dokumen PMB.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Folder Laporan Bendungan"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipe</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={formData.type === 'onedrive' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'onedrive' })}
                  className="flex-1"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  OneDrive
                </Button>
                <Button
                  variant={formData.type === 'gdrive' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'gdrive' })}
                  className="flex-1"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Google Drive
                </Button>
                <Button
                  variant={formData.type === 'other' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'other' })}
                  className="flex-1"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Lainnya
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveNew} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Perbarui informasi link penting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipe</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={formData.type === 'onedrive' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'onedrive' })}
                  className="flex-1"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  OneDrive
                </Button>
                <Button
                  variant={formData.type === 'gdrive' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'gdrive' })}
                  className="flex-1"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Google Drive
                </Button>
                <Button
                  variant={formData.type === 'other' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, type: 'other' })}
                  className="flex-1"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Lainnya
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
