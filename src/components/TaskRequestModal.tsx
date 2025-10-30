import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Task } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CheckCircle, XCircle, Edit3, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskRequestModalProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

const priorityConfig = {
  low: { label: 'Rendah', variant: 'secondary' as const, icon: '🟢' },
  medium: { label: 'Sedang', variant: 'default' as const, icon: '🟡' },
  high: { label: 'Tinggi', variant: 'destructive' as const, icon: '🟠' },
  urgent: { label: 'Mendesak', variant: 'destructive' as const, icon: '🔴' },
};

export function TaskRequestModal({ tasks, isOpen, onClose }: TaskRequestModalProps) {
  const { acceptTask, declineTask, requestRevision, users } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0] || null);
  const [revisionReason, setRevisionReason] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  if (!selectedTask) return null;

  const sender = users.find(u => u.id === selectedTask.senderId);
  const priority = priorityConfig[selectedTask.priority];

  const handleAccept = () => {
    acceptTask(selectedTask.id);
    toast.success('Tugas diterima dan ditambahkan ke todolist');
    onClose();
  };

  const handleDecline = () => {
    declineTask(selectedTask.id);
    toast.success('Tugas ditolak');
    onClose();
  };

  const handleRequestRevision = () => {
    if (!revisionReason.trim()) {
      toast.error('Harap isi alasan revisi');
      return;
    }
    requestRevision(selectedTask.id, revisionReason);
    toast.success('Permintaan revisi dikirim');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Tugas Masuk</DialogTitle>
          <DialogDescription>
            Anda memiliki {tasks.length} request yang perlu ditindaklanjuti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Selector */}
          {tasks.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tasks.map((task, index) => (
                <Button
                  key={task.id}
                  variant={selectedTask.id === task.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTask(task)}
                >
                  Request {index + 1}
                </Button>
              ))}
            </div>
          )}

          {/* Task Details */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-semibold mb-1">{selectedTask.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dari</p>
                <p className="text-sm">{sender?.name}</p>
                <p className="text-xs text-muted-foreground">{sender?.position}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">
                    {new Date(selectedTask.deadline).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Prioritas</p>
              <Badge variant={priority.variant}>
                {priority.icon} {priority.label}
              </Badge>
            </div>

            {selectedTask.status === 'revision-requested' && selectedTask.revisionReason && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Alasan Revisi Sebelumnya</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.revisionReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Revision Input */}
            {showRevisionInput && (
              <div className="space-y-2">
                <label className="text-sm">Alasan Permintaan Revisi</label>
                <Textarea
                  placeholder="Jelaskan perubahan yang diperlukan..."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            {!showRevisionInput ? (
              <>
                <Button variant="outline" onClick={onClose}>
                  Tutup
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRevisionInput(true)}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Minta Revisi
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDecline}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
                <Button onClick={handleAccept}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Terima
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setShowRevisionInput(false);
                  setRevisionReason('');
                }}>
                  Batal
                </Button>
                <Button onClick={handleRequestRevision}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Kirim Permintaan Revisi
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
