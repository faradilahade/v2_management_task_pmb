import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import {
  Calendar,
  FileText,
  Users,
  Edit2,
  Clock,
  Mail,
  Briefcase,
  CheckCircle2,
  Inbox,
  Plus,
  Pencil,
  Trash2,
  Camera,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import { RequestsList } from './RequestsList';
import { CreateTaskModal } from './CreateTaskModal';

interface IndividualCardDetailProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function IndividualCardDetail({
  userId,
  isOpen,
  onClose,
}: IndividualCardDetailProps) {
  const { users, tasks, meetings, dispositionTasks, currentUser, updateUser, deleteTask, updateTask } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  // Load request count
  useEffect(() => {
    const loadRequestCount = () => {
      const stored = localStorage.getItem('requests');
      if (stored) {
        const allRequests = JSON.parse(stored);
        const userRequests = allRequests.filter((r: any) => r.assignedToIds.includes(userId));
        setRequestCount(userRequests.length);
      }
    };

    loadRequestCount();
    window.addEventListener('storage', loadRequestCount);
    return () => window.removeEventListener('storage', loadRequestCount);
  }, [userId]);

  const isOwnCard = currentUser?.id === userId || currentUser?.role === 'admin';

  // Get user-related data
  const userTasks = tasks.filter((t) => t.receiverId === user.id);
  const activeTasks = userTasks.filter((t) => t.status === 'in-progress');
  const completedTasks = userTasks.filter((t) => t.status === 'completed');
  const pendingTasks = userTasks.filter((t) => t.status === 'pending');

  // Get user meetings
  const userMeetings = meetings.filter((m) => m.participants.includes(user.id));
  const upcomingMeetings = userMeetings.filter((m) => new Date(m.startTime) >= new Date());
  const pastMeetings = userMeetings.filter((m) => new Date(m.startTime) < new Date());

  // Get user dispositions
  const userDispositions = dispositionTasks.filter(
    (d) => d.receiverIds.includes(user.id) && d.isActive
  );

  // Calculate overall progress
  const overallProgress = activeTasks.length > 0
    ? Math.round(activeTasks.reduce((sum, task) => sum + task.progress, 0) / activeTasks.length)
    : 0;

  const handleStatusChange = (newStatus: any) => {
    updateUser(userId, { workStatus: newStatus });
    toast.success('Status kerja berhasil diupdate');
  };

  const getStatusEmoji = (status: string) => {
    const map: Record<string, string> = {
      busy: '🔴',
      relaxed: '🟢',
      meeting: '🟦',
      field: '🟧',
      leave: '🟨',
      sick: '🟪',
      vacation: '⚪',
    };
    return map[status] || '⚫';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      busy: 'Sibuk',
      relaxed: 'Santai',
      meeting: 'Meeting',
      field: 'Dinas Luar',
      leave: 'Izin',
      sick: 'Sakit',
      vacation: 'Cuti',
    };
    return map[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Yakin ingin menghapus tugas ini?')) {
      deleteTask(taskId);
      toast.success('Tugas berhasil dihapus');
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let progress = task.progress;
    if (newStatus === 'completed') {
      progress = 100;
    } else if (newStatus === 'in-progress' && progress === 0) {
      progress = 10;
    }

    updateTask(taskId, { 
      status: newStatus as any,
      progress,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
    toast.success(`Status tugas diubah menjadi ${newStatus === 'in-progress' ? 'In Progress' : newStatus === 'completed' ? 'Completed' : 'Pending'}`);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      updateUser(userId, { avatarUrl: imageUrl });
      toast.success('Foto profil berhasil diupdate');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] w-[1000px] max-h-[95vh] p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
            <div className="flex items-start gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-[#1565C0]/20">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#1565C0] to-[#0d47a1] text-white">
                    {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                )}
                {isOwnCard && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{user.name}</DialogTitle>
                    <DialogDescription className="text-base mb-3">
                      Detail profil dan aktivitas
                    </DialogDescription>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-[#1565C0] text-white h-7 px-3">
                        {user.position}
                      </Badge>
                      <Badge variant="outline" className="h-7 px-3">
                        {user.department}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.department}</span>
                      </div>
                    </div>
                  </div>

                  {isOwnCard && (
                    <Button
                      variant={isEditing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="ml-2"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Selesai' : 'Edit'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status Kerja
              </label>
              <Select
                value={user.workStatus}
                onValueChange={handleStatusChange}
                disabled={!isOwnCard || !isEditing}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue>
                    <span className="flex items-center gap-2 text-base">
                      <span>{getStatusEmoji(user.workStatus)}</span>
                      <span>{getStatusLabel(user.workStatus)}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="busy">🔴 Sibuk / Busy</SelectItem>
                  <SelectItem value="relaxed">🟢 Santai / Idle</SelectItem>
                  <SelectItem value="meeting">🟦 On Meeting</SelectItem>
                  <SelectItem value="field">🟧 Dinas Luar / Field Duty</SelectItem>
                  <SelectItem value="leave">🟨 Izin / Permission</SelectItem>
                  <SelectItem value="sick">🟪 Sakit / Sick</SelectItem>
                  <SelectItem value="vacation">⚪ Cuti / On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Total Tugas</div>
                <div className="text-2xl font-bold text-blue-600">{userTasks.length}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                <div className="text-sm text-gray-600 mb-1">Selesai</div>
                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border-2 border-orange-200">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
                <div className="text-2xl font-bold text-orange-600">{overallProgress}%</div>
              </div>
              <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Meeting</div>
                <div className="text-2xl font-bold text-purple-600">{upcomingMeetings.length}</div>
              </div>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <div className="px-6 py-4">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12 bg-gray-100">
                <TabsTrigger value="tasks" className="text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Tugas
                </TabsTrigger>
                <TabsTrigger value="requests" className="text-sm">
                  <Inbox className="w-4 h-4 mr-2" />
                  Request
                </TabsTrigger>
                <TabsTrigger value="meetings" className="text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Meeting
                </TabsTrigger>
                <TabsTrigger value="dispositions" className="text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Disposisi
                </TabsTrigger>
                <TabsTrigger value="teamwork" className="text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Teamwork
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <ScrollArea className="h-[calc(95vh-480px)] mt-4 pr-4">
                {/* Tasks Tab */}
                <TabsContent value="tasks" className="space-y-3 mt-0">
                  {/* Add Task Button */}
                  {isOwnCard && (
                    <Button
                      onClick={() => setShowCreateTask(true)}
                      className="w-full bg-gradient-to-r from-[#1565C0] to-[#0d47a1] hover:from-[#0d47a1] hover:to-[#1565C0]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Tugas Mandiri
                    </Button>
                  )}

                  {userTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Tidak ada tugas</p>
                    </div>
                  ) : (
                    userTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="border-2 hover:border-[#1565C0]/30 transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h4 className="font-bold text-base">{task.title}</h4>
                                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                  {task.priority}
                                </Badge>
                                {isOwnCard ? (
                                  <Select
                                    value={task.status}
                                    onValueChange={(value: any) => handleTaskStatusChange(task.id, value)}
                                  >
                                    <SelectTrigger className="w-[140px] h-7">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">
                                        <Badge className="bg-yellow-500 text-white">Pending</Badge>
                                      </SelectItem>
                                      <SelectItem value="in-progress">
                                        <Badge className="bg-blue-500 text-white">In Progress</Badge>
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        <Badge className="bg-green-500 text-white">Completed</Badge>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  getTaskStatusBadge(task.status)
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                            </div>

                            {isOwnCard && (
                              <div className="flex gap-1 ml-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingTaskId(task.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(task.deadline).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(task.createdAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Requests Tab */}
                <TabsContent value="requests" className="space-y-3 mt-0">
                  <RequestsList userId={userId} />
                </TabsContent>

                {/* Meetings Tab */}
                <TabsContent value="meetings" className="space-y-3 mt-0">
                  {userMeetings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Tidak ada meeting</p>
                    </div>
                  ) : (
                    <>
                      {upcomingMeetings.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Meeting Mendatang</h4>
                          {upcomingMeetings.map((meeting) => (
                            <Card key={meeting.id} className="mb-3">
                              <CardContent className="p-4">
                                <h5 className="font-bold mb-2">{meeting.title}</h5>
                                <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(meeting.startTime).toLocaleDateString('id-ID')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {new Date(meeting.startTime).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {pastMeetings.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Meeting Sebelumnya</h4>
                          {pastMeetings.slice(0, 3).map((meeting) => (
                            <Card key={meeting.id} className="mb-3 opacity-60">
                              <CardContent className="p-4">
                                <h5 className="font-bold mb-2">{meeting.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(meeting.startTime).toLocaleDateString('id-ID')}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Dispositions Tab */}
                <TabsContent value="dispositions" className="space-y-3 mt-0">
                  {userDispositions.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Tidak ada disposisi</p>
                    </div>
                  ) : (
                    userDispositions.map((disposition) => (
                      <Card key={disposition.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-bold text-base flex-1">{disposition.title}</h5>
                            <Badge className={
                              disposition.status === 'active' ? 'bg-green-500 text-white' :
                              disposition.status === 'pending' ? 'bg-yellow-500 text-white' :
                              'bg-gray-500 text-white'
                            }>
                              {disposition.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{disposition.description}</p>
                          <div className="text-xs text-gray-500">
                            Dari: {disposition.giverNames.join(', ')}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Teamwork Tab */}
                <TabsContent value="teamwork" className="space-y-3 mt-0">
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Fitur teamwork akan segera hadir</p>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          preselectedReceiverId={userId}
        />
      )}
    </>
  );
}
