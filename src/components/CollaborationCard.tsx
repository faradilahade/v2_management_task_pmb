import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, Plus, Edit2, Trash2, Check, X, UserPlus, CheckCircle2, Clock, Circle, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ProjectCollaborationModal } from './ProjectCollaborationModal';
import { AddCollaborationModal } from './AddCollaborationModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface CollaborationTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  urgency?: 'urgent' | 'not-urgent';
}

interface Collaboration {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  givenBy: string; // Pemberi kolaborasi (text)
  members: string[];
  status: 'active' | 'completed';
  urgency: 'urgent' | 'not-urgent';
  tasks: CollaborationTask[];
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  progress?: number; // Manual progress percentage
  verifiedBy?: string;
  verifiedAt?: string;
  workLink?: string;
  verificationStatus?: 'pending' | 'verified' | 'revision'; // Status verifikasi
  revisionNote?: string; // Catatan revisi
}

export function CollaborationCard() {
  const { currentUser, users } = useApp();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: '1',
      title: 'Proyek Infrastruktur Q4',
      description: 'Koordinasi pembangunan jembatan zona rawan banjir',
      createdBy: 'Admin PMB',
      givenBy: 'Kepala Balai PMB',
      members: ['user-1', 'user-2'],
      status: 'active',
      urgency: 'urgent',
      tasks: [
        { id: 't1', title: 'Analisis data curah hujan', description: 'Menganalisis data curah hujan bulan Oktober', status: 'done', urgency: 'urgent' },
        { id: 't2', title: 'Survey lokasi bendungan', description: 'Melakukan survey keamanan bendungan', status: 'in-progress', urgency: 'urgent' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Survey Lapangan Oktober',
      description: 'Pemetaan area rawan longsor',
      createdBy: 'Arif Setiawan',
      givenBy: 'Koordinator Survei',
      members: ['user-3'],
      status: 'active',
      urgency: 'not-urgent',
      tasks: [
        { id: 't3', title: 'Persiapan alat survey', description: 'Menyiapkan peralatan survey lapangan', status: 'done', urgency: 'not-urgent' },
        { id: 't4', title: 'Pemetaan lokasi', description: 'Melakukan pemetaan area target', status: 'todo', urgency: 'not-urgent' },
        { id: 't5', title: 'Laporan survey', description: 'Membuat laporan hasil survey', status: 'todo', urgency: 'not-urgent' },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    givenBy: '',
  });

  const handleAdd = () => {
    setShowAddDialog(true);
  };
  
  const handleAddCollaboration = (collaboration: Omit<Collaboration, 'id' | 'createdAt' | 'status'>) => {
    const newCollab: Collaboration = {
      ...collaboration,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setCollaborations([...collaborations, newCollab]);
    toast.success('Kolaborasi berhasil ditambahkan');
  };

  const handleEdit = (collab: Collaboration) => {
    setFormData({ title: collab.title, description: collab.description, givenBy: collab.givenBy });
    setSelectedCollab(collab);
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    setCollaborations(collaborations.filter((c) => c.id !== id));
    toast.success('Kolaborasi berhasil dihapus');
  };



  const handleSaveEdit = () => {
    if (!selectedCollab) return;
    
    setCollaborations(
      collaborations.map((c) =>
        c.id === selectedCollab.id
          ? {
              ...c,
              title: formData.title,
              description: formData.description,
              givenBy: formData.givenBy,
              updatedBy: currentUser?.name || 'Unknown',
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    setShowEditDialog(false);
    toast.success('Kolaborasi berhasil diupdate');
  };

  const handleOpenDetail = (collab: Collaboration) => {
    setSelectedCollab(collab);
    setShowDetailModal(true);
  };

  // Filter collaborations based on search query
  const filteredCollaborations = collaborations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.givenBy.toLowerCase().includes(query)
    );
  });

  // Calculate statistics
  const totalUrgent = collaborations.filter(c => c.urgency === 'urgent').length;
  const totalPending = collaborations.filter(c => !c.verificationStatus || c.verificationStatus === 'pending').length; // Belum Diverifikasi
  const allTasks = collaborations.flatMap(c => c.tasks);
  const totalOnProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const totalVerified = collaborations.filter(c => c.verificationStatus === 'verified').length; // Terverifikasi

  return (
    <>
      <Card className="border-2 border-[#FFC72C]/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#FFC72C] to-[#FFB700] rounded-xl shadow-md">
                <Users className="w-5 h-5 text-[#2E4B7C]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2E4B7C]">Kolaborasi Tim</h3>
                <p className="text-xs text-muted-foreground">
                  {collaborations.length} proyek aktif
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAdd}
              className="bg-gradient-to-r from-[#2E4B7C] to-[#1e3555] hover:from-[#1e3555] hover:to-[#2E4B7C]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>

          {/* Statistics Rekapitulasi - Grid 4 Kolom Sejajar */}
          <div className="mt-3 pt-3 border-t border-[#FFC72C]/20">
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/50 rounded-lg p-2 border border-red-500/20">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1">Urgent</span>
                  <Badge className="bg-red-500 text-white h-5 px-2 text-xs">{totalUrgent}</Badge>
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
                  <Badge className="bg-[#FFB74D] text-white h-5 px-2 text-xs">{totalOnProgress}</Badge>
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
                placeholder="Cari kolaborasi tim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-white border-gray-200 focus:border-[#1565C0]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-1">
            {filteredCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-[#1565C0]/40 transition-all hover:shadow-lg bg-white p-3 cursor-pointer"
                onClick={() => handleOpenDetail(collab)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1565C0] transition-colors">
                        {collab.title}
                      </h4>
                      <Badge 
                        className={collab.urgency === 'urgent' ? 'bg-red-500 text-white text-xs h-5 px-2' : 'bg-green-500 text-white text-xs h-5 px-2'}
                      >
                        {collab.urgency === 'urgent' ? 'Urgent' : 'Not Urgent'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                      {collab.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Pemberi: {collab.givenBy}</span>
                      <span>•</span>
                      <span>{collab.members.length} anggota</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(collab);
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
                        handleDelete(collab.id);
                      }}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Task Progress */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  {/* Task status badges */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                      <Circle className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">{collab.tasks.filter(t => t.status === 'todo').length} To Do</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-600">{collab.tasks.filter(t => t.status === 'in-progress').length} Progress</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">{collab.tasks.filter(t => t.status === 'done').length} Done</span>
                    </div>
                  </div>

                  {/* Verification Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Verifikasi:</span>
                    {!collab.verificationStatus || collab.verificationStatus === 'pending' ? (
                      <Badge className="bg-amber-500 text-white text-xs h-5 px-2">
                        Belum Diverifikasi 🔴
                      </Badge>
                    ) : collab.verificationStatus === 'revision' ? (
                      <div className="flex items-center gap-1">
                        <Badge className="bg-orange-500 text-white text-xs h-5 px-2">
                          Revisi 🔄
                        </Badge>
                        {collab.revisionNote && (
                          <span className="text-xs text-orange-600 italic">({collab.revisionNote})</span>
                        )}
                      </div>
                    ) : (
                      <Badge className="bg-green-500 text-white text-xs h-5 px-2">
                        Terverifikasi ✅ {collab.verifiedBy && `oleh ${collab.verifiedBy}`}
                      </Badge>
                    )}
                  </div>

                  {/* Progress bar and button */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1">
                      <div className="text-xs text-gray-500">
                        {collab.tasks.filter(t => t.status === 'done').length}/{collab.tasks.length} selesai
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 ml-2">
                        <div 
                          className="bg-gradient-to-r from-[#1565C0] to-[#0d47a1] h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${collab.tasks.length > 0 ? (collab.tasks.filter(t => t.status === 'done').length / collab.tasks.length * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(collab);
                      }}
                      className="h-6 px-3 text-xs bg-gradient-to-r from-[#1565C0] to-[#0d47a1] hover:from-[#0d47a1] hover:to-[#1565C0]"
                    >
                      Buka Detail
                    </Button>
                  </div>
                </div>

                {/* Last Updated */}
                {collab.updatedAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    Update: {collab.updatedBy} •{' '}
                    {new Date(collab.updatedAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredCollaborations.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada kolaborasi'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Collaboration Modal */}
      <AddCollaborationModal
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddCollaboration}
      />

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Kolaborasi</DialogTitle>
            <DialogDescription>
              Ubah detail proyek kolaborasi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul Proyek</label>
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
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pemberi Kolaborasi</label>
              <Input
                value={formData.givenBy}
                onChange={(e) => setFormData({ ...formData, givenBy: e.target.value })}
                placeholder="Masukkan nama pemberi kolaborasi"
                className="mt-1"
              />
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
      {selectedCollab && showDetailModal && (
        <ProjectCollaborationModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          collaboration={selectedCollab}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}