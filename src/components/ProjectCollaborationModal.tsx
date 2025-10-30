import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card } from './ui/card';
import {
  Plus,
  Trash2,
  Edit2,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Check,
  X,
  UserPlus,
  UserMinus,
  Pencil,
  Link as LinkIcon,
  ShieldCheck,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TaskDetailModal } from './TaskDetailModal';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignees: string[];
  status: 'todo' | 'in-progress' | 'done';
  urgency?: 'urgent' | 'not-urgent';
  createdBy: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface Collaboration {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  givenBy?: string;
  members: string[];
  status: 'active' | 'completed';
  urgency?: 'urgent' | 'not-urgent';
  tasks?: ProjectTask[];
  createdAt: string;
  progress?: number; // Manual progress override
  verifiedBy?: string;
  verifiedAt?: string;
  workLink?: string;
}

interface ProjectCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaboration: Collaboration;
  onDelete?: (id: string) => void;
}

export function ProjectCollaborationModal({
  isOpen,
  onClose,
  collaboration,
  onDelete,
}: ProjectCollaborationModalProps) {
  const { currentUser, users } = useApp();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tasks, setTasks] = useState<ProjectTask[]>([
    {
      id: '1',
      title: 'Survey lokasi bendungan',
      description: 'Melakukan survey keamanan bendungan untuk Q4 2025\nPeriksa:\n1. Kondisi struktur bendungan\n2. Kualitas air\n3. Sistem drainase\n4. Alat monitoring',
      assignees: ['user-1'],
      status: 'in-progress',
      urgency: 'urgent',
      createdBy: 'Admin PMB',
      labels: ['Survey', 'Bendungan'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      checklists: [
        {
          id: 'cl1',
          title: 'Yang mau dituju',
          items: [
            { id: 'cli1', text: 'Bendungan Jatiluhur', completed: true },
            { id: 'cli2', text: 'Bendungan Saguling', completed: false },
            { id: 'cli3', text: 'Bendungan Cirata', completed: false },
          ],
        },
      ],
      activities: [
        {
          id: 'act1',
          user: 'Admin PMB',
          action: 'created this card',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: '2',
      title: 'Analisis data curah hujan',
      description: 'Menganalisis data curah hujan bulan Oktober untuk perkiraan musim hujan',
      assignees: [],
      status: 'todo',
      urgency: 'not-urgent',
      createdBy: 'Admin PMB',
      labels: ['Musim', 'Lama Hujan'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      activities: [
        {
          id: 'act2',
          user: 'Admin PMB',
          action: 'created this card',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ]);

  const [members, setMembers] = useState<string[]>(collaboration.members);
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [viewingTask, setViewingTask] = useState<ProjectTask | null>(null);
  const [showEditProgress, setShowEditProgress] = useState(false);
  const [verificationData, setVerificationData] = useState({
    verifiedBy: collaboration.verifiedBy || '',
    verifiedAt: collaboration.verifiedAt || '',
    workLink: collaboration.workLink || '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'done',
    urgency: 'not-urgent' as 'urgent' | 'not-urgent',
  });

  const activeUsers = users.filter((u) => u.role === 'user' && u.isActive);
  const availableUsers = activeUsers.filter((u) => !members.includes(u.id));

  // Calculate completion percentage early (before using in state)
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const totalTasks = tasks.length;
  const completedTasks = doneTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const [manualProgress, setManualProgress] = useState(collaboration.progress || completionPercentage);

  const handleAddTask = () => {
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      assignees: [],
      status: taskForm.status,
      urgency: taskForm.urgency,
      createdBy: currentUser?.name || 'Unknown',
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
    setTaskForm({ title: '', description: '', status: 'todo', urgency: 'not-urgent' });
    toast.success('Task berhasil ditambahkan');
  };

  const handleEditTask = (task: ProjectTask) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      urgency: task.urgency || 'not-urgent',
    });
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    
    setTasks(
      tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: taskForm.title,
              description: taskForm.description,
              status: taskForm.status,
              urgency: taskForm.urgency,
              updatedBy: currentUser?.name || 'Unknown',
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setEditingTask(null);
    toast.success('Task berhasil diupdate');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast.success('Task berhasil dihapus');
  };

  const handleInviteMember = (userId: string) => {
    setPendingInvites([...pendingInvites, userId]);
    toast.success('Undangan kolaborasi terkirim');
  };

  const handleAcceptInvite = (userId: string) => {
    setMembers([...members, userId]);
    setPendingInvites(pendingInvites.filter((id) => id !== userId));
    toast.success('Undangan diterima');
  };

  const handleDeclineInvite = (userId: string) => {
    setPendingInvites(pendingInvites.filter((id) => id !== userId));
    toast.info('Undangan ditolak');
  };

  const handleRemoveMember = (userId: string) => {
    setMembers(members.filter((id) => id !== userId));
    toast.success('Anggota dihapus dari kolaborasi');
  };

  const handleMoveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              updatedBy: currentUser?.name || 'Unknown',
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleUpdateTask = (updatedTask: ProjectTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTaskFromDetail = () => {
    if (viewingTask) {
      handleDeleteTask(viewingTask.id);
      setViewingTask(null);
    }
  };

  const isInvited = currentUser && pendingInvites.includes(currentUser.id);
  const isMember = currentUser && members.includes(currentUser.id);

  // Find the last updated task
  const lastUpdatedTask = tasks.reduce((prev, current) => {
    if (!prev.updatedAt || (current.updatedAt && new Date(current.updatedAt) > new Date(prev.updatedAt))) {
      return current;
    }
    return prev;
  }, { updatedAt: '' } as ProjectTask);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] w-[95vw] max-h-[90vh] h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{collaboration.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mb-3">
                {collaboration.description}
              </DialogDescription>
              
              {/* Additional Info Row */}
              <div className="flex items-center gap-4 text-sm">
                {collaboration.givenBy && (
                  <div className="text-gray-600">
                    <span className="font-medium">Pemberi Kolaborasi:</span> {collaboration.givenBy}
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 text-[#1565C0]" />
                  <span className="font-medium text-[#1565C0]">Anggota Tim ({members.length})</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress Kolaborasi</span>
                  <span className="font-bold text-[#1565C0]">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#1565C0] to-[#0d47a1] h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {tasks.filter(t => t.status === 'done').length} dari {tasks.length} tugas selesai
                  {lastUpdatedTask.updatedAt && (
                    <span className="ml-2">
                      • Update terakhir: <span className="font-medium">{lastUpdatedTask.updatedBy}</span> pada{' '}
                      {new Date(lastUpdatedTask.updatedAt!).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-green-500 text-white">Aktif</Badge>
              {isMember && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Invitation Notice */}
          {isInvited && (
            <div className="mx-6 mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">
                    Anda diundang untuk bergabung dalam kolaborasi ini
                  </p>
                  <p className="text-sm text-blue-700">
                    Terima undangan untuk mulai berkolaborasi dengan tim
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => currentUser && handleAcceptInvite(currentUser.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Terima
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => currentUser && handleDeclineInvite(currentUser.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Tolak
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Members Section */}
          <div className="px-6 pt-4 pb-3 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-semibold">Anggota Tim ({members.length})</span>
              </div>
              {isMember && availableUsers.length > 0 && (
                <Select onValueChange={handleInviteMember}>
                  <SelectTrigger className="w-[200px] h-8">
                    <SelectValue placeholder="Undang anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {members.map((memberId) => {
                const user = users.find((u) => u.id === memberId);
                if (!user) return null;
                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg group"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#2E4B7C] to-[#1e3555] text-white">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    {isMember && (
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    )}
                  </div>
                );
              })}
              {pendingInvites.map((inviteId) => {
                const user = users.find((u) => u.id === inviteId);
                if (!user) return null;
                return (
                  <div
                    key={inviteId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded-lg"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-yellow-500 text-white">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    <Badge className="bg-yellow-500 text-white text-xs">Pending</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="h-full grid grid-cols-3 gap-4">
              {/* TO DO Column */}
              <div className="flex flex-col bg-gray-50 rounded-lg p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold">To Do</h3>
                    <Badge variant="secondary">{todoTasks.length}</Badge>
                  </div>
                  {isMember && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setTaskForm({ title: '', description: '', status: 'todo' });
                        setShowAddTask(true);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      users={users}
                      onEdit={isMember ? () => handleEditTask(task) : undefined}
                      onDelete={isMember ? () => handleDeleteTask(task.id) : undefined}
                      onMove={isMember ? handleMoveTask : undefined}
                      onOpenDetail={() => setViewingTask(task)}
                    />
                  ))}
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex flex-col bg-blue-50 rounded-lg p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">In Progress</h3>
                    <Badge className="bg-blue-500 text-white">{inProgressTasks.length}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      users={users}
                      onEdit={isMember ? () => handleEditTask(task) : undefined}
                      onDelete={isMember ? () => handleDeleteTask(task.id) : undefined}
                      onMove={isMember ? handleMoveTask : undefined}
                      onOpenDetail={() => setViewingTask(task)}
                    />
                  ))}
                </div>
              </div>

              {/* DONE Column */}
              <div className="flex flex-col bg-green-50 rounded-lg p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold text-green-900">Done</h3>
                    <Badge className="bg-green-500 text-white">{doneTasks.length}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      users={users}
                      onEdit={isMember ? () => handleEditTask(task) : undefined}
                      onDelete={isMember ? () => handleDeleteTask(task.id) : undefined}
                      onMove={isMember ? handleMoveTask : undefined}
                      onOpenDetail={() => setViewingTask(task)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Dialog */}
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Task Baru</DialogTitle>
              <DialogDescription>
                Masukkan detail task yang akan ditambahkan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Judul Task</label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Masukkan judul task"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  placeholder="Jelaskan task"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={taskForm.urgency}
                  onValueChange={(value: 'urgent' | 'not-urgent') => setTaskForm({ ...taskForm, urgency: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Urgent</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="not-urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Not Urgent</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTask} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Ubah detail task sesuai kebutuhan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Judul Task</label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status Progres</label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value: any) => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status Urgency</label>
                <Select
                  value={taskForm.urgency}
                  onValueChange={(value: 'urgent' | 'not-urgent') => setTaskForm({ ...taskForm, urgency: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Urgent</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="not-urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Not Urgent</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Collaboration Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kolaborasi</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kolaborasi ini? Tindakan ini tidak dapat diurungkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (onDelete) onDelete(collaboration.id);
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Task Detail Modal */}
        {viewingTask && (
          <TaskDetailModal
            isOpen={!!viewingTask}
            onClose={() => setViewingTask(null)}
            task={viewingTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTaskFromDetail}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Task Card Component
function TaskCard({
  task,
  users,
  onEdit,
  onDelete,
  onMove,
  onOpenDetail,
}: {
  task: ProjectTask;
  users: any[];
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
  onOpenDetail?: () => void;
}) {
  return (
    <Card className="group hover:shadow-md transition-all border-2 cursor-pointer" onClick={onOpenDetail}>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm hover:text-[#1565C0]">{task.title}</h4>
              {task.urgency && (
                <Badge className={task.urgency === 'urgent' ? 'bg-red-500 text-white text-xs h-4 px-1.5' : 'bg-green-500 text-white text-xs h-4 px-1.5'}>
                  {task.urgency === 'urgent' ? 'Urgent' : 'Not Urgent'}
                </Badge>
              )}
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button onClick={onEdit}>
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete}>
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-3">{task.description}</p>

        {/* Move buttons */}
        {onMove && (
          <div className="flex gap-1 mb-2" onClick={(e) => e.stopPropagation()}>
            {task.status !== 'todo' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMove(task.id, 'todo')}
                className="h-6 px-2 text-xs"
              >
                → To Do
              </Button>
            )}
            {task.status !== 'in-progress' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMove(task.id, 'in-progress')}
                className="h-6 px-2 text-xs"
              >
                → In Progress
              </Button>
            )}
            {task.status !== 'done' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMove(task.id, 'done')}
                className="h-6 px-2 text-xs"
              >
                → Done
              </Button>
            )}
          </div>
        )}

        {task.updatedAt && (
          <div className="text-xs text-gray-400 pt-2 border-t">
            Update: {task.updatedBy} •{' '}
            {new Date(task.updatedAt).toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </Card>
  );
}