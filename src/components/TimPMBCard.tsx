import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, UserPlus, AlertTriangle } from 'lucide-react';
import { CreateRequestModal } from './CreateRequestModal';
import { IndividualCardDetail } from './IndividualCardDetail';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RequestTask } from '../types';

interface Collaboration {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  givenBy: string;
  members: string[];
  status: 'active' | 'completed';
  urgency: 'urgent' | 'not-urgent';
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    urgency?: 'urgent' | 'not-urgent';
  }>;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export function TimPMBCard() {
  const { users, tasks, meetings, dispositionTasks } = useApp();
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const activeUsers = users.filter((u) => u.role === 'user' && u.isActive);

  // Load collaborations and requests from localStorage
  const loadCollaborations = (): Collaboration[] => {
    try {
      const stored = localStorage.getItem('collaborations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const loadRequests = (): RequestTask[] => {
    try {
      const stored = localStorage.getItem('requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const collaborations = loadCollaborations();
  const requests = loadRequests();

  // Sort users: busy first, then others
  const sortedUsers = [...activeUsers].sort((a, b) => {
    const statusOrder = {
      busy: 0,
      meeting: 1,
      field: 2,
      relaxed: 3,
      leave: 4,
      sick: 5,
      vacation: 6,
    };
    
    return statusOrder[a.workStatus] - statusOrder[b.workStatus];
  });

  // Calculate statistics
  const busyCount = activeUsers.filter(u => u.workStatus === 'busy').length;
  const meetingCount = activeUsers.filter(u => u.workStatus === 'meeting').length;
  const fieldCount = activeUsers.filter(u => u.workStatus === 'field').length;
  const relaxedCount = activeUsers.filter(u => u.workStatus === 'relaxed').length;
  const leaveCount = activeUsers.filter(u => u.workStatus === 'leave' || u.workStatus === 'sick' || u.workStatus === 'vacation').length;

  const getStatusBadge = (status: string) => {
    const config = {
      busy: { emoji: '🔴', label: 'Sibuk', className: 'bg-red-500 text-white' },
      relaxed: { emoji: '🟢', label: 'Santai', className: 'bg-green-500 text-white' },
      meeting: { emoji: '🟦', label: 'Meeting', className: 'bg-blue-500 text-white' },
      field: { emoji: '🟧', label: 'Dinas Luar', className: 'bg-orange-500 text-white' },
      leave: { emoji: '🟨', label: 'Izin', className: 'bg-yellow-500 text-white' },
      sick: { emoji: '🟪', label: 'Sakit', className: 'bg-purple-500 text-white' },
      vacation: { emoji: '⚪', label: 'Cuti', className: 'bg-gray-400 text-white' },
    };
    return config[status as keyof typeof config] || config.relaxed;
  };

  return (
    <>
      <Card className="border-2 border-[#1565C0]/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1565C0]">TIM PMB</h3>
                <p className="text-xs text-muted-foreground">
                  {activeUsers.length} anggota aktif
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateRequest(true)}
              className="bg-gradient-to-r from-[#FFB74D] to-[#FF9800] hover:from-[#FF9800] hover:to-[#FFB74D] text-white shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Buat Request Baru
            </Button>
          </div>

          {/* Statistics */}
          <div className="mt-3 pt-3 border-t border-[#1565C0]/20">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/50 rounded-lg p-2 border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Sibuk</span>
                  <Badge className="bg-red-500 text-white h-5 px-2 text-xs">{busyCount}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Meeting</span>
                  <Badge className="bg-blue-500 text-white h-5 px-2 text-xs">{meetingCount}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Dinas Luar</span>
                  <Badge className="bg-orange-500 text-white h-5 px-2 text-xs">{fieldCount}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Santai</span>
                  <Badge className="bg-green-500 text-white h-5 px-2 text-xs">{relaxedCount}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Cuti/Sakit</span>
                  <Badge className="bg-gray-500 text-white h-5 px-2 text-xs">{leaveCount}</Badge>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-2 border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total</span>
                  <Badge className="bg-purple-500 text-white h-5 px-2 text-xs">{activeUsers.length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table with scroll */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="p-1.5 text-left text-xs font-semibold text-gray-600">Anggota</th>
                  <th className="p-1.5 text-center text-xs font-semibold text-gray-600 w-24">Status</th>
                  <th className="p-1.5 text-center text-xs font-semibold text-gray-600 w-20">Progress</th>
                  <th className="p-1.5 text-center text-xs font-semibold text-gray-600 w-16">Done</th>
                  <th className="p-1.5 text-center text-xs font-semibold text-gray-600 w-20">Disposisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedUsers.map((user) => {
                  // 1. Tugas Mandiri (Tasks)
                  const userTasks = tasks.filter(t => t.receiverId === user.id);
                  const activeTasksCount = userTasks.filter(t => 
                    t.status === 'in-progress' || t.status === 'accepted'
                  ).length;
                  const completedTasksCount = userTasks.filter(t => t.status === 'completed').length;

                  // 2. Tugas Disposisi
                  const userDispositions = dispositionTasks.filter(d => 
                    d.receiverIds.includes(user.id) && d.isActive
                  );
                  const activeDispositionsCount = userDispositions.filter(d => 
                    d.status === 'active' || d.status === 'pending'
                  ).length;
                  const completedDispositionsCount = userDispositions.filter(d => 
                    d.status === 'completed'
                  ).length;

                  // 3. Kolaborasi Tim
                  const userCollaborations = collaborations.filter(c => 
                    c.members.includes(user.id)
                  );
                  let activeCollabTasksCount = 0;
                  let completedCollabTasksCount = 0;
                  userCollaborations.forEach(collab => {
                    if (collab.status === 'active') {
                      activeCollabTasksCount += collab.tasks.filter(t => 
                        t.status === 'todo' || t.status === 'in-progress'
                      ).length;
                    }
                    completedCollabTasksCount += collab.tasks.filter(t => 
                      t.status === 'done'
                    ).length;
                  });

                  // 4. Request Tasks
                  const userRequests = requests.filter(r => 
                    r.assignedToIds.includes(user.id)
                  );
                  const activeRequestsCount = userRequests.filter(r => 
                    r.status === 'pending' || r.status === 'accepted' || r.status === 'in-progress'
                  ).length;
                  const completedRequestsCount = userRequests.filter(r => 
                    r.status === 'completed'
                  ).length;

                  // Total Progress & Done
                  const totalProgress = activeTasksCount + activeDispositionsCount + activeCollabTasksCount + activeRequestsCount;
                  const totalDone = completedTasksCount + completedDispositionsCount + completedCollabTasksCount + completedRequestsCount;

                  // Check for overdue tasks (> 1 day)
                  const now = new Date();
                  const oneDayMs = 24 * 60 * 60 * 1000;
                  
                  const overdueItems = [
                    ...userTasks.filter(t => {
                      if (t.status === 'completed') return false;
                      const deadline = new Date(t.deadline);
                      return (now.getTime() - deadline.getTime()) > oneDayMs;
                    }),
                    ...userDispositions.filter(d => {
                      if (d.status === 'completed' || !d.dueDate) return false;
                      const deadline = new Date(d.dueDate);
                      return (now.getTime() - deadline.getTime()) > oneDayMs;
                    }),
                  ];
                  
                  const hasOverdue = overdueItems.length > 0;

                  const status = getStatusBadge(user.workStatus);

                  return (
                    <tr 
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                              <AvatarFallback className="text-xs bg-gradient-to-br from-[#1565C0] to-[#0d47a1] text-white">
                                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {user.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <Badge className={`${status.className} text-xs px-2 h-6 whitespace-nowrap`}>
                          <span className="mr-1">{status.emoji}</span>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Badge 
                            className={`${
                              hasOverdue 
                                ? 'bg-red-500 animate-pulse' 
                                : totalProgress > 0 
                                ? 'bg-orange-500' 
                                : 'bg-gray-300'
                            } text-white h-6 min-w-[2rem] px-2 inline-flex items-center justify-center`}
                          >
                            {totalProgress}
                          </Badge>
                          {hasOverdue && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <Badge className="bg-green-500 text-white h-6 min-w-[2rem] px-2 inline-flex items-center justify-center">
                          {totalDone}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        {userDispositions.length > 0 ? (
                          <Badge className="bg-red-500 text-white h-6 min-w-[2rem] px-2 inline-flex items-center justify-center">
                            {userDispositions.length}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-300 text-white h-6 min-w-[2rem] px-2 inline-flex items-center justify-center">
                            0
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={showCreateRequest}
        onClose={() => setShowCreateRequest(false)}
      />

      {/* Individual Detail Modal */}
      {selectedUserId && (
        <IndividualCardDetail
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}