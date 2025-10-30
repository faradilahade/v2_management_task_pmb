import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { IndividualCardDetail } from './IndividualCardDetail';
import { CreateRequestModal } from './CreateRequestModal';
import { Users, CheckCircle2, Clock, Star, Calendar, Mail, UserPlus } from 'lucide-react';

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamMembersModal({ isOpen, onClose }: TeamMembersModalProps) {
  const { users, tasks, meetings, dispositionTasks } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  
  const activeUsers = users.filter(u => u.isActive && u.role === 'user');

  // Sort by work status (busy first)
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'busy':
        return { label: 'Sibuk', color: 'bg-red-500', emoji: '🔴' };
      case 'relaxed':
        return { label: 'Santai', color: 'bg-green-500', emoji: '🟢' };
      case 'meeting':
        return { label: 'Meeting', color: 'bg-blue-500', emoji: '🟦' };
      case 'field':
        return { label: 'Dinas Luar', color: 'bg-orange-500', emoji: '🟧' };
      case 'leave':
        return { label: 'Izin', color: 'bg-yellow-500', emoji: '🟨' };
      case 'sick':
        return { label: 'Sakit', color: 'bg-purple-500', emoji: '🟪' };
      case 'vacation':
        return { label: 'Cuti', color: 'bg-gray-400', emoji: '⚪' };
      default:
        return { label: status, color: 'bg-gray-500', emoji: '⚫' };
    }
  };

  const handleCardClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleDetailClose = () => {
    setSelectedUserId(null);
  };

  return (
    <>
      <Dialog open={isOpen && !selectedUserId} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] w-[1400px] max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Tim PMB</DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {activeUsers.length} anggota aktif · Klik card untuk melihat detail
                  </DialogDescription>
                </div>
              </div>
              <Button
                onClick={() => setShowCreateRequest(true)}
                className="bg-gradient-to-r from-[#FFB74D] to-[#FF9800] hover:from-[#FF9800] hover:to-[#FFB74D] text-white shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Buat Request Baru
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-120px)] px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedUsers.map(user => {
                const userTasks = tasks.filter(t => t.receiverId === user.id);
                const activeTasks = userTasks.filter(t => t.status === 'in-progress');
                const completedTasks = userTasks.filter(t => t.status === 'completed');
                const pendingRequests = userTasks.filter(t => t.status === 'pending');
                const userMeetings = meetings.filter(m => m.participants.includes(user.id));
                const upcomingMeetings = userMeetings.filter(m => new Date(m.startTime) >= new Date());
                const userDispositions = dispositionTasks.filter(d => d.receiverIds.includes(user.id) && d.isActive);
                
                const userScore = completedTasks.length * 100 + activeTasks.length * 50;
                const status = getStatusConfig(user.workStatus);
                
                const totalNotifications = pendingRequests.length + upcomingMeetings.length + userDispositions.length;

                return (
                  <Card 
                    key={user.id}
                    className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-[#1565C0]/50 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden"
                    onClick={() => handleCardClick(user.id)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3 pb-3 border-b">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-14 w-14 border-2 border-white shadow-md ring-2 ring-gray-100 group-hover:ring-[#1565C0]/30 transition-all">
                            <AvatarFallback className="text-base font-bold bg-gradient-to-br from-[#1565C0] to-[#0d47a1] text-white">
                              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 truncate leading-tight">
                              {user.name}
                            </h4>
                            {totalNotifications > 0 && (
                              <Badge className="bg-red-500 text-white text-xs h-5 px-1.5 shadow-sm shrink-0">
                                {totalNotifications}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1.5">{user.position}</p>
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 h-6 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300"
                          >
                            <span className="mr-1.5">{status.emoji}</span>
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-lg p-2 border border-yellow-200">
                            <div className="flex items-center justify-between">
                              <Star className="w-4 h-4 text-yellow-600 fill-yellow-500" />
                              <span className="font-bold text-yellow-900">{userScore}</span>
                            </div>
                            <p className="text-xs text-yellow-700 mt-1">Score</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-2 border border-green-200">
                            <div className="flex items-center justify-between">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-900">{completedTasks.length}</span>
                            </div>
                            <p className="text-xs text-green-700 mt-1">Selesai</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-2 border border-blue-200">
                            <div className="flex flex-col items-center">
                              <Clock className="w-4 h-4 text-blue-600 mb-1" />
                              <span className="font-bold text-blue-900">{activeTasks.length}</span>
                              <p className="text-xs text-blue-700">Aktif</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-2 border border-purple-200">
                            <div className="flex flex-col items-center">
                              <Calendar className="w-4 h-4 text-purple-600 mb-1" />
                              <span className="font-bold text-purple-900">{upcomingMeetings.length}</span>
                              <p className="text-xs text-purple-700">Meeting</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-2 border border-orange-200">
                            <div className="flex flex-col items-center">
                              <Mail className="w-4 h-4 text-orange-600 mb-1" />
                              <span className="font-bold text-orange-900">{userDispositions.length}</span>
                              <p className="text-xs text-orange-700">Disposisi</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Individual Detail Modal - Opens replacing TeamMembers modal */}
      {selectedUserId && (
        <IndividualCardDetail
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={handleDetailClose}
        />
      )}

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={showCreateRequest}
        onClose={() => setShowCreateRequest(false)}
      />
    </>
  );
}
