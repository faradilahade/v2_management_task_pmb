import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { CheckCircle2, XCircle, Clock, FileText, AlertCircle, Edit3, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DispositionTask {
  id: string;
  title: string;
  description: string;
  giverNames: string[];
  receiverNames: string[];
  status: 'active' | 'pending' | 'completed';
  verificationStatus?: 'pending' | 'verified' | 'revision';
  revisionNote?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  completedAt?: string;
  link?: string;
}

export function VerificationManagementDisposition() {
  const [dispositions, setDispositions] = useState<DispositionTask[]>([
    {
      id: '1',
      title: 'Laporan Monitoring Bendungan Bulan Oktober',
      description: 'Menyusun laporan monitoring kondisi bendungan untuk periode Oktober 2025',
      giverNames: ['Kepala Balai PMB'],
      receiverNames: ['Arif Setiawan', 'Ahmad Wijaya'],
      status: 'completed',
      verificationStatus: 'pending',
      createdAt: '2025-10-15',
      completedAt: '2025-10-28',
      link: 'https://drive.google.com/report-oct',
    },
    {
      id: '2',
      title: 'Update Data Curah Hujan Harian',
      description: 'Mengupdate database curah hujan harian untuk sistem early warning',
      giverNames: ['Koordinator Data'],
      receiverNames: ['Siti Nurhaliza'],
      status: 'completed',
      verificationStatus: 'verified',
      verifiedBy: 'Verifikator PMB',
      verifiedAt: '2025-10-27',
      createdAt: '2025-10-20',
      completedAt: '2025-10-26',
      link: 'https://drive.google.com/data-hujan',
    },
    {
      id: '3',
      title: 'Perbaikan Instrumentasi Bendungan A',
      description: 'Melakukan perbaikan dan kalibrasi alat monitoring di Bendungan A',
      giverNames: ['Kepala Bidang Instrumentasi'],
      receiverNames: ['Rina Kartika', 'Budi Santoso'],
      status: 'completed',
      verificationStatus: 'revision',
      revisionNote: 'Laporan kalibrasi belum lengkap, harap tambahkan hasil pengukuran',
      createdAt: '2025-10-18',
      completedAt: '2025-10-27',
    },
    {
      id: '4',
      title: 'Koordinasi Meeting dengan Dinas Terkait',
      description: 'Menghadiri dan membuat notulensi meeting koordinasi dengan Dinas PUPR',
      giverNames: ['Kepala PMB'],
      receiverNames: ['Dewi Lestari'],
      status: 'completed',
      verificationStatus: 'pending',
      createdAt: '2025-10-22',
      completedAt: '2025-10-29',
      link: 'https://meet.google.com/notes-meeting',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<DispositionTask | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [requestRevision, setRequestRevision] = useState(false);
  const [updatedTaskId, setUpdatedTaskId] = useState<string | null>(null);

  const pendingTasks = dispositions.filter(d => !d.verificationStatus || d.verificationStatus === 'pending');
  const verifiedTasks = dispositions.filter(d => d.verificationStatus === 'verified');
  const revisionTasks = dispositions.filter(d => d.verificationStatus === 'revision');

  const handleOpenVerify = (task: DispositionTask) => {
    setSelectedTask(task);
    setRevisionNote(task.revisionNote || '');
    setRequestRevision(false);
    setShowVerifyModal(true);
  };

  const handleVerify = () => {
    if (!selectedTask) return;

    if (requestRevision) {
      // Minta Revisi
      if (!revisionNote.trim()) {
        toast.error('Catatan revisi harus diisi');
        return;
      }
      setDispositions(dispositions.map(d => 
        d.id === selectedTask.id 
          ? { 
              ...d, 
              verificationStatus: 'revision' as const,
              revisionNote: revisionNote,
              verifiedBy: undefined,
              verifiedAt: undefined
            } 
          : d
      ));
      toast.warning(`Tugas "${selectedTask.title}" memerlukan revisi`, {
        description: revisionNote
      });
    } else {
      // Setujui & Verifikasi
      setDispositions(dispositions.map(d => 
        d.id === selectedTask.id 
          ? { 
              ...d, 
              verificationStatus: 'verified' as const,
              verifiedBy: 'Verifikator PMB',
              verifiedAt: new Date().toISOString(),
              revisionNote: undefined
            } 
          : d
      ));
      toast.success(`✅ Tugas "${selectedTask.title}" telah diverifikasi`);
    }

    setShowVerifyModal(false);
    setSelectedTask(null);
    setRevisionNote('');
    setRequestRevision(false);
    setUpdatedTaskId(selectedTask.id);
  };

  const getStatusBadge = (status?: 'pending' | 'verified' | 'revision') => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">✅ Terverifikasi</Badge>;
      case 'revision':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">🔄 Revisi</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600">⏳ Belum Diverifikasi</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Belum Diverifikasi</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-700">Revisi Diperlukan</p>
                  <p className="text-3xl font-bold text-orange-600">{revisionTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Sudah Diverifikasi</p>
                  <p className="text-3xl font-bold text-green-600">{verifiedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Manajemen Verifikasi - Tugas Disposisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Judul Tugas</TableHead>
                    <TableHead className="font-semibold">Pemberi</TableHead>
                    <TableHead className="font-semibold">Penerima</TableHead>
                    <TableHead className="font-semibold">Selesai Pada</TableHead>
                    <TableHead className="font-semibold text-center">Link</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispositions
                    .filter(d => d.status === 'completed')
                    .sort((a, b) => {
                      // Sort: pending first, then revision, then verified
                      const order = { pending: 0, revision: 1, verified: 2 };
                      const statusA = a.verificationStatus || 'pending';
                      const statusB = b.verificationStatus || 'pending';
                      return order[statusA] - order[statusB];
                    })
                    .map((task) => (
                      <TableRow key={task.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.giverNames.map((giver, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {giver}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.receiverNames.map((receiver, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                                {receiver}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{task.completedAt ? new Date(task.completedAt).toLocaleDateString('id-ID') : '-'}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          {task.link ? (
                            <a 
                              href={task.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Buka
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col gap-1 items-center">
                            {getStatusBadge(task.verificationStatus)}
                            {task.revisionNote && (
                              <p className="text-xs text-orange-600 italic mt-1">"{task.revisionNote}"</p>
                            )}
                            {task.verifiedBy && (
                              <p className="text-xs text-green-600 mt-1">oleh {task.verifiedBy}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleOpenVerify(task)}
                            className="bg-[#1565C0] hover:bg-[#0d47a1]"
                            disabled={task.verificationStatus === 'verified'}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            {task.verificationStatus === 'verified' ? 'Terverifikasi' : 'Verifikasi'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {dispositions.filter(d => d.status === 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada tugas disposisi yang selesai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verification Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verifikasi Tugas Disposisi</DialogTitle>
            <DialogDescription>
              Verifikasi atau minta revisi untuk tugas yang telah diselesaikan
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h3 className="font-semibold text-lg mb-2">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedTask.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Pemberi:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTask.giverNames.map((giver, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {giver}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Penerima:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTask.receiverNames.map((receiver, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                          {receiver}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedTask.link && (
                  <div className="mt-3">
                    <a 
                      href={selectedTask.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka Link Dokumen
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Catatan Revisi (opsional)</label>
                <Textarea
                  placeholder="Tambahkan catatan jika diperlukan revisi..."
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  rows={4}
                  className="border-gray-300"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setRequestRevision(false);
                    handleVerify();
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  ✅ Setujui & Verifikasi
                </Button>
                <Button
                  onClick={() => {
                    setRequestRevision(true);
                    handleVerify();
                  }}
                  variant="outline"
                  className="flex-1 border-orange-500 text-orange-700 hover:bg-orange-50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  🔄 Minta Revisi
                </Button>
                <Button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setSelectedTask(null);
                    setRevisionNote('');
                  }}
                  variant="ghost"
                >
                  Batal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}