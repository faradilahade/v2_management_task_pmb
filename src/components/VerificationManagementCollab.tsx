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
import { CheckCircle2, XCircle, Clock, FileText, AlertCircle, Edit3 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CollaborationTask {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  givenBy: string;
  members: string[];
  status: 'active' | 'completed';
  urgency: 'urgent' | 'not-urgent';
  verificationStatus?: 'pending' | 'verified' | 'revision';
  revisionNote?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  completedAt?: string;
}

export function VerificationManagementCollab() {
  const [collaborations, setCollaborations] = useState<CollaborationTask[]>([
    {
      id: '1',
      title: 'Proyek Infrastruktur Q4',
      description: 'Koordinasi pembangunan jembatan zona rawan banjir',
      createdBy: 'Verifikator PMB',
      givenBy: 'Kepala Balai PMB',
      members: ['Arif Setiawan', 'Siti Nurhaliza'],
      status: 'completed',
      urgency: 'urgent',
      verificationStatus: 'pending',
      createdAt: '2025-10-20',
      completedAt: '2025-10-28',
    },
    {
      id: '2',
      title: 'Survey Lapangan Oktober',
      description: 'Pemetaan area rawan longsor',
      createdBy: 'Arif Setiawan',
      givenBy: 'Koordinator Survei',
      members: ['Budi Santoso'],
      status: 'completed',
      urgency: 'not-urgent',
      verificationStatus: 'verified',
      verifiedBy: 'Verifikator PMB',
      verifiedAt: '2025-10-25',
      createdAt: '2025-10-15',
      completedAt: '2025-10-24',
    },
    {
      id: '3',
      title: 'Analisis Data Curah Hujan',
      description: 'Menganalisis data curah hujan bulanan untuk prediksi banjir',
      createdBy: 'Verifikator PMB',
      givenBy: 'Kepala PMB',
      members: ['Ahmad Wijaya', 'Dewi Lestari'],
      status: 'completed',
      urgency: 'urgent',
      verificationStatus: 'revision',
      revisionNote: 'Data bulan September perlu dilengkapi',
      createdAt: '2025-10-18',
      completedAt: '2025-10-27',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<CollaborationTask | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [requestRevision, setRequestRevision] = useState(false);
  const [updatedTaskId, setUpdatedTaskId] = useState<string | null>(null);

  const pendingTasks = collaborations.filter(c => !c.verificationStatus || c.verificationStatus === 'pending');
  const verifiedTasks = collaborations.filter(c => c.verificationStatus === 'verified');
  const revisionTasks = collaborations.filter(c => c.verificationStatus === 'revision');

  const handleOpenVerify = (task: CollaborationTask) => {
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
      setCollaborations(collaborations.map(c => 
        c.id === selectedTask.id 
          ? { 
              ...c, 
              verificationStatus: 'revision' as const,
              revisionNote: revisionNote,
              verifiedBy: undefined,
              verifiedAt: undefined
            } 
          : c
      ));
      setUpdatedTaskId(selectedTask.id);
      setTimeout(() => setUpdatedTaskId(null), 1500);
      toast.warning(`Tugas "${selectedTask.title}" memerlukan revisi`, {
        description: revisionNote
      });
    } else {
      // Setujui & Verifikasi
      setCollaborations(collaborations.map(c => 
        c.id === selectedTask.id 
          ? { 
              ...c, 
              verificationStatus: 'verified' as const,
              verifiedBy: 'Verifikator PMB',
              verifiedAt: new Date().toISOString(),
              revisionNote: undefined
            } 
          : c
      ));
      setUpdatedTaskId(selectedTask.id);
      setTimeout(() => setUpdatedTaskId(null), 1500);
      toast.success(`✅ Tugas "${selectedTask.title}" telah diverifikasi`);
    }

    setShowVerifyModal(false);
    setSelectedTask(null);
    setRevisionNote('');
    setRequestRevision(false);
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
              Manajemen Verifikasi - Kolaborasi Tim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Judul Tugas</TableHead>
                    <TableHead className="font-semibold">Pemberi Tugas</TableHead>
                    <TableHead className="font-semibold">Tim</TableHead>
                    <TableHead className="font-semibold">Selesai Pada</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborations
                    .filter(c => c.status === 'completed')
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
                          <div>
                            <p className="text-sm font-medium">{task.givenBy}</p>
                            <p className="text-xs text-gray-500">oleh {task.createdBy}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.members.map((member, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{task.completedAt ? new Date(task.completedAt).toLocaleDateString('id-ID') : '-'}</p>
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

            {collaborations.filter(c => c.status === 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada tugas kolaborasi yang selesai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verification Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verifikasi Tugas Kolaborasi</DialogTitle>
            <DialogDescription>
              Verifikasi atau minta revisi untuk tugas yang telah diselesaikan
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h3 className="font-semibold text-lg mb-2">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedTask.description}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Pemberi: {selectedTask.givenBy}</span>
                  <span>•</span>
                  <span>Tim: {selectedTask.members.join(', ')}</span>
                </div>
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