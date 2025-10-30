import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Link as LinkIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FolderOpen,
  Cloud,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface ImportantLink {
  id: string;
  title: string;
  url: string;
  type: 'onedrive' | 'gdrive' | 'other';
  description?: string;
  createdBy: string;
  createdAt: string;
}

const defaultLinks: ImportantLink[] = [
  {
    id: '1',
    title: 'Dokumen PMB - OneDrive',
    url: 'https://onedrive.live.com/pmb-docs',
    type: 'onedrive',
    description: 'Folder dokumen utama PMB',
    createdBy: 'Admin PMB',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Data Bendungan - Google Drive',
    url: 'https://drive.google.com/bendungan-data',
    type: 'gdrive',
    description: 'Database informasi bendungan seluruh Indonesia',
    createdBy: 'Admin PMB',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Portal BMKG',
    url: 'https://www.bmkg.go.id',
    type: 'other',
    description: 'Portal resmi BMKG untuk data cuaca',
    createdBy: 'Admin PMB',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Sistem Monitoring - Google Drive',
    url: 'https://drive.google.com/monitoring',
    type: 'gdrive',
    description: 'Laporan monitoring harian',
    createdBy: 'Admin PMB',
    createdAt: new Date().toISOString(),
  },
];

export function ImportantLinksManager() {
  const [links, setLinks] = useState<ImportantLink[]>(defaultLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<ImportantLink | null>(null);
  const [selectedLink, setSelectedLink] = useState<ImportantLink | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    type: 'other' as 'onedrive' | 'gdrive' | 'other',
    description: '',
  });

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'onedrive':
        return <Cloud className="w-4 h-4" />;
      case 'gdrive':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'onedrive':
        return 'bg-blue-500 text-white';
      case 'gdrive':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'onedrive':
        return 'OneDrive';
      case 'gdrive':
        return 'Google Drive';
      default:
        return 'Link';
    }
  };

  const handleAddLink = () => {
    const newLink: ImportantLink = {
      id: Date.now().toString(),
      ...linkForm,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    };
    setLinks([...links, newLink]);
    setShowAddDialog(false);
    setLinkForm({ title: '', url: '', type: 'other', description: '' });
    toast.success('Link berhasil ditambahkan');
  };

  const handleEditLink = () => {
    if (!editingLink) return;
    setLinks(
      links.map((link) =>
        link.id === editingLink.id
          ? { ...link, ...linkForm }
          : link
      )
    );
    setEditingLink(null);
    setShowAddDialog(false);
    setLinkForm({ title: '', url: '', type: 'other', description: '' });
    toast.success('Link berhasil diupdate');
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
      setLinks(links.filter((link) => link.id !== id));
      setShowDetailDialog(false);
      toast.success('Link berhasil dihapus');
    }
  };

  const openEditDialog = (link: ImportantLink) => {
    setEditingLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      type: link.type,
      description: link.description || '',
    });
    setShowAddDialog(true);
    setShowDetailDialog(false);
  };

  const openDetailDialog = (link: ImportantLink) => {
    setSelectedLink(link);
    setShowDetailDialog(true);
  };

  return (
    <>
      <Card className="border-2 border-[#1565C0]/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-md">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1565C0]">Link Penting PMB</h3>
                <p className="text-xs text-muted-foreground">
                  Dokumen & resource penting
                </p>
              </div>
            </div>
            <Badge className="bg-[#1565C0] text-white h-6 px-3">
              {filteredLinks.length}
            </Badge>
          </div>

          {/* Search and Add - Compact */}
          <div className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingLink(null);
                setLinkForm({ title: '', url: '', type: 'other', description: '' });
                setShowAddDialog(true);
              }}
              className="h-8 bg-[#1565C0] hover:bg-[#0d47a1] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 max-h-[220px]">
            <AnimatePresence mode="popLayout">
              {filteredLinks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-gray-300"
                >
                  <LinkIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs text-gray-400">Tidak ada link</p>
                </motion.div>
              ) : (
                filteredLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                    className="group p-2.5 rounded-lg border bg-white hover:bg-blue-50 border-gray-200 hover:border-[#1565C0]/50 transition-all hover:shadow-md cursor-pointer"
                    onClick={() => openDetailDialog(link)}
                  >
                    <div className="flex items-start gap-2">
                      {/* Type Icon Badge - Compact */}
                      <div
                        className={`p-1.5 rounded-lg ${getTypeColor(
                          link.type
                        )} flex-shrink-0`}
                      >
                        {getTypeIcon(link.type)}
                      </div>

                      {/* Link Info - Compact */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate text-gray-900 mb-0.5 leading-tight">
                          {link.title}
                        </h4>
                        {link.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mb-1 leading-tight">
                            {link.description}
                          </p>
                        )}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-[#1565C0] hover:underline flex items-center gap-1 truncate"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{link.url}</span>
                        </a>
                      </div>

                      {/* Quick Actions - Compact */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(link);
                          }}
                          className="p-1 bg-[#FFB74D] hover:bg-[#FFA726] text-white rounded transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(link.id);
                          }}
                          className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Link' : 'Tambah Link Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? 'Update informasi link yang sudah ada'
                : 'Tambahkan link penting untuk akses cepat'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Judul Link</label>
              <Input
                value={linkForm.title}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, title: e.target.value })
                }
                placeholder="Contoh: Dokumen PMB"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <Input
                value={linkForm.url}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipe Link</label>
              <Select
                value={linkForm.type}
                onValueChange={(value: any) =>
                  setLinkForm({ ...linkForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onedrive">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      OneDrive
                    </div>
                  </SelectItem>
                  <SelectItem value="gdrive">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Google Drive
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Link Lainnya
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Deskripsi (Opsional)
              </label>
              <Input
                value={linkForm.description}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, description: e.target.value })
                }
                placeholder="Deskripsi singkat"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingLink(null);
                }}
              >
                Batal
              </Button>
              <Button
                onClick={editingLink ? handleEditLink : handleAddLink}
                className="bg-[#1565C0] hover:bg-[#0d47a1] dark:bg-[#FFB74D] dark:hover:bg-[#FFA726] dark:text-gray-900"
                disabled={!linkForm.title || !linkForm.url}
              >
                {editingLink ? 'Update' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(selectedLink?.type || 'other')}`}>
                {getTypeIcon(selectedLink?.type || 'other')}
              </div>
              {selectedLink?.title}
            </DialogTitle>
            <DialogDescription>
              Detail informasi link
            </DialogDescription>
          </DialogHeader>
          {selectedLink && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Tipe
                </label>
                <Badge className={getTypeColor(selectedLink.type)}>
                  {getTypeLabel(selectedLink.type)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  URL
                </label>
                <a
                  href={selectedLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {selectedLink.url}
                </a>
              </div>
              {selectedLink.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Deskripsi
                  </label>
                  <p className="text-sm">{selectedLink.description}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Dibuat oleh
                </label>
                <p className="text-sm">
                  {selectedLink.createdBy} •{' '}
                  {new Date(selectedLink.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(selectedLink)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteLink(selectedLink.id)}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
