import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { FileText, Plus, Edit2, Trash2, Check, X, Search, ExternalLink, Link, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { ManageDispositionModalEnhanced } from './ManageDispositionModalEnhanced';
import { DispositionEditModal } from './DispositionEditModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

export function DispositionTaskCardEnhanced() {
  const { dispositionTasks, currentUser, removeDispositionTask, updateDispositionTask, users } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    giverNames: [] as string[],
    receiverIds: [] as string[], // Add receiver editing
    linkND: '',
    linkMeet: '',
  });

  const canCreateDisposition = currentUser !== null;
  const activeUsers = users.filter((u) => u.isActive);

  // Filter and sort dispositions
  const filteredDispositions = dispositionTasks
    .filter((d) => d.isActive)
    .filter((d) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.giverNames.some(name => name.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      // Prioritize by status: active > pending > completed
      const statusOrder = { active: 0, pending: 1, completed: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate statistics
  const totalActive = dispositionTasks.filter(d => d.status === 'active').length;
  const totalPending = dispositionTasks.filter(d => d.status === 'pending' || !d.verificationStatus || d.verificationStatus === 'pending').length; // Belum Diverifikasi
  const totalCompleted = dispositionTasks.filter(d => d.status === 'completed').length;
  const totalVerified = dispositionTasks.filter(d => d.verificationStatus === 'verified').length; // Terverifikasi

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      removeDispositionTask(deleteId);
      toast.success('Disposisi berhasil dihapus');
      setDeleteId(null);
    }
  };

  const handleEdit = (disp: any) => {
    // Extract link ND and link Meet from link field if it exists
    const links = disp.link?.split('|') || [];
    setFormData({
      title: disp.title,
      description: disp.description,
      giverNames: disp.giverNames || [],
      receiverIds: disp.receiverIds || [], // Add receiver editing
      linkND: links[0] || '',
      linkMeet: links[1] || '',
    });
    setSelectedDisposition(disp);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedDisposition) return;

    const updatedLink = [formData.linkND, formData.linkMeet].filter(l => l).join('|');
    
    // Get updated receiver names from IDs
    const receiverNames = formData.receiverIds.map(
      (id) => users.find((u) => u.id === id)?.name || ''
    );

    updateDispositionTask(selectedDisposition.id, {
      title: formData.title,
      description: formData.description,
      giverNames: formData.giverNames,
      receiverIds: formData.receiverIds, // Add receiver editing
      receiverNames, // Update receiver names
      link: updatedLink,
      lastEditedBy: currentUser?.name,
      lastEditedAt: new Date().toISOString(),
    });

    setShowEditDialog(false);
    toast.success('Disposisi berhasil diupdate');
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

  const handleOpenDetail = (disp: any) => {
    setSelectedDisposition(disp);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500 text-white text-xs h-5 px-2">Aktif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white text-xs h-5 px-2">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white text-xs h-5 px-2">Selesai</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs h-5 px-2">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-3 h-3 text-blue-600" />;
      case 'pending':
        return <Circle className="w-3 h-3 text-yellow-600" />;
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      default:
        return <Circle className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <>
      <Card className="border-2 border-[#FFC72C]/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#2E4B7C] to-[#1e3555] rounded-xl shadow-md">
                <FileText className="w-5 h-5 text-[#FFC72C]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2E4B7C]">Tugas Disposisi</h3>
                <p className="text-xs text-muted-foreground">
                  {filteredDispositions.length} tugas aktif
                </p>
              </div>
            </div>
            {canCreateDisposition && (
              <Button
                size="sm"
                onClick={() => setShowManageModal(true)}
                className="bg-gradient-to-r from-[#2E4B7C] to-[#1e3555] hover:from-[#1e3555] hover:to-[#2E4B7C]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            )}
          </div>

          {/* Statistics Rekapitulasi - Grid 4 Kolom Sejajar */}
          <div className="mt-3 pt-3 border-t border-[#FFC72C]/20">
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/50 rounded-lg p-2 border border-red-500/20">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1">Urgent</span>
                  <Badge className="bg-red-500 text-white h-5 px-2 text-xs">{totalActive}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-amber-500/20">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1 text-center">Belum Diverifikasi</span>
                  <Badge className="bg-amber-500 text-white h-5 px-2 text-xs">{totalPending}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-[#FFB74D]/20">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1">On Progress</span>
                  <Badge className="bg-[#FFB74D] text-white h-5 px-2 text-xs">{totalCompleted}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-green-500/20">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1">Terverifikasi</span>
                  <Badge className="bg-green-500 text-white h-5 px-2 text-xs">{totalVerified}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari tugas disposisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-white border-gray-200 focus:border-[#1565C0]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-1">
            {filteredDispositions.map((disp) => {
              const links = disp.link?.split('|') || [];
              const linkND = links[0] || '';
              const linkMeet = links[1] || '';

              return (
                <div
                  key={disp.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-[#1565C0]/40 transition-all hover:shadow-lg bg-white p-3 cursor-pointer"
                  onClick={() => handleOpenDetail(disp)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1565C0] transition-colors">
                          {disp.title}
                        </h4>
                        {getStatusBadge(disp.status)}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                        {disp.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Pemberi: {disp.giverNames.join(', ')}</span>
                        <span>•</span>
                        <span>{disp.receiverNames.length} penerima</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(disp);
                        }}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(disp.id);
                        }}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Links */}
                  {(linkND || linkMeet) && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        {linkND && (
                          <a
                            href={linkND}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 px-2 py-1 rounded"
                          >
                            <Link className="w-3 h-3" />
                            Link ND
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {linkMeet && (
                          <a
                            href={linkMeet}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 hover:underline bg-green-50 px-2 py-1 rounded"
                          >
                            <Link className="w-3 h-3" />
                            Link Meet
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {getStatusIcon(disp.status)}
                        <span className="capitalize">{disp.status}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(disp);
                        }}
                        className="h-6 px-3 text-xs bg-gradient-to-r from-[#1565C0] to-[#0d47a1] hover:from-[#0d47a1] hover:to-[#1565C0]"
                      >
                        Buka Detail
                      </Button>
                    </div>
                  </div>

                  {/* Last Updated */}
                  {disp.lastEditedAt && (
                    <div className="text-xs text-gray-400 mt-2">
                      Update: {disp.lastEditedBy} •{' '}
                      {new Date(disp.lastEditedAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty State */}
            {filteredDispositions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada disposisi aktif'}
                </p>
                {canCreateDisposition && !searchQuery && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowManageModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Disposisi Pertama
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manage Modal */}
      {showManageModal && (
        <ManageDispositionModalEnhanced
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Disposisi</DialogTitle>
            <DialogDescription>
              Ubah detail tugas disposisi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul Tugas</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pemberi Tugas (pisahkan dengan koma)</label>
              <Input
                value={formData.giverNames.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  giverNames: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                })}
                placeholder="Contoh: Kepala Balai, Koordinator"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Penerima Disposisi (Pilih satu atau lebih)</Label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3 mt-1">
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
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.receiverIds.length} penerima dipilih
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Link ND (Nota Dinas)</label>
                <Input
                  value={formData.linkND}
                  onChange={(e) => setFormData({ ...formData, linkND: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Link Meet (Rapat Online)</label>
                <Input
                  value={formData.linkMeet}
                  onChange={(e) => setFormData({ ...formData, linkMeet: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="mt-1"
                />
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

      {/* Detail Modal */}
      {selectedDisposition && showDetailModal && (
        <DispositionEditModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          disposition={selectedDisposition}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Disposisi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Disposisi akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}