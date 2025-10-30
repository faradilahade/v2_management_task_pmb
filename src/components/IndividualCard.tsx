import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, Task } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CheckCircle2, Circle, Clock, AlertCircle, Mail, Eye, MessageCircle, Star } from 'lucide-react';
import { TaskRequestModal } from './TaskRequestModal';
import { IndividualCardDetail } from './IndividualCardDetail';

interface IndividualCardProps {
  user: User;
  compact?: boolean;
}

const statusConfig = {
  busy: { emoji: '🔴', label: 'Sibuk', color: 'bg-red-500' },
  relaxed: { emoji: '🟢', label: 'Santai', color: 'bg-green-500' },
  meeting: { emoji: '🟦', label: 'Meeting', color: 'bg-blue-500' },
  field: { emoji: '🟧', label: 'Dinas Luar', color: 'bg-orange-500' },
  leave: { emoji: '🟨', label: 'Izin', color: 'bg-yellow-500' },
  sick: { emoji: '🟪', label: 'Sakit', color: 'bg-purple-500' },
  vacation: { emoji: '⚪', label: 'Cuti', color: 'bg-gray-400' },
};

export function IndividualCard({ user, compact = false }: IndividualCardProps) {
  const { tasks, currentUser, todoItems, toggleTodoItem, notifications, meetings, dispositionTasks } = useApp();
  const [showRequests, setShowRequests] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Get tasks for this user
  const userTasks = tasks.filter(t => t.receiverId === user.id);
  const activeTasks = userTasks.filter(t => t.status === 'in-progress');
  const completedTasks = userTasks.filter(t => t.status === 'completed');
  const pendingRequests = userTasks.filter(t => t.status === 'pending' || t.status === 'revision-requested');
  
  // Get user meetings
  const userMeetings = meetings.filter(m => m.participants.includes(user.id));
  const upcomingMeetings = userMeetings.filter(m => new Date(m.startTime) >= new Date());

  // Get user dispositions
  const userDispositions = dispositionTasks.filter(d => d.receiverIds.includes(user.id) && d.isActive);
  
  // Get todos for active tasks
  const userTodos = activeTasks.flatMap(task => 
    todoItems.filter(todo => todo.taskId === task.id)
  );

  // Calculate weekly progress (average of all active tasks)
  const weeklyProgress = activeTasks.length > 0 
    ? Math.round(activeTasks.reduce((sum, task) => sum + task.progress, 0) / activeTasks.length)
    : 0;

  // Unread notifications for this user
  const unreadCount = notifications.filter(n => n.userId === user.id && !n.isRead).length;

  const status = statusConfig[user.workStatus];

  // Check if viewing own card
  const isOwnCard = currentUser?.id === user.id;

  // Compact view
  if (compact) {
    const userScore = completedTasks.length * 100 + activeTasks.length * 50;
    
    return (
      <>
        <Card 
          className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[#FFC72C]/50 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white" 
          onClick={() => setShowDetail(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              {/* Avatar with Online Status */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-gray-100 group-hover:ring-[#FFC72C]/30 transition-all">
                  <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-[#2E4B7C] to-[#1e3555] text-white">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#2E4B7C] transition-colors">
                    {user.name}
                  </h4>
                  {(pendingRequests.length > 0 || upcomingMeetings.length > 0 || userDispositions.length > 0) && (
                    <Badge className="bg-red-500 text-white text-xs shadow-sm">
                      {pendingRequests.length + upcomingMeetings.length + userDispositions.length}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-1.5 truncate">{user.position}</p>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300"
                  >
                    <span className="mr-1">{status.emoji}</span>
                    {status.label}
                  </Badge>
                </div>

                {/* Mini Stats */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-gray-700">{userScore}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-600">{completedTasks.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-gray-600">{activeTasks.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {showDetail && (
          <IndividualCardDetail
            userId={user.id}
            isOpen={showDetail}
            onClose={() => setShowDetail(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowDetail(true)}>
        {/* Notification Badge */}
        {pendingRequests.length > 0 && (
          <Badge 
            className="absolute top-2 right-2 cursor-pointer z-10"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowRequests(true);
            }}
          >
            <Mail className="w-3 h-3 mr-1" />
            {pendingRequests.length}
          </Badge>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{user.name}</h3>
                {/* Online/Offline Status */}
                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              </div>
              <p className="text-sm text-muted-foreground">{user.position}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {user.department}
              </Badge>
            </div>
          </div>

          {/* Work Status */}
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
            <span className="text-lg">{status.emoji}</span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-medium">{status.label}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Today's Todolist */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Todolist Hari Ini</span>
            </div>
            <div className="space-y-2 ml-6">
              {userTodos.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tidak ada tugas</p>
              ) : (
                userTodos.slice(0, 3).map(todo => (
                  <div key={todo.id} className="flex items-center gap-2">
                    <Checkbox 
                      checked={todo.completed}
                      onCheckedChange={() => isOwnCard && toggleTodoItem(todo.id)}
                      disabled={!isOwnCard}
                    />
                    <span className={`text-xs ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                ))
              )}
              {userTodos.length > 3 && (
                <p className="text-xs text-muted-foreground">+{userTodos.length - 3} lainnya</p>
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Progress Mingguan</span>
              <span className="text-sm">{weeklyProgress}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Circle className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Aktif</span>
              </div>
              <p className="font-semibold">{activeTasks.length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Selesai</span>
              </div>
              <p className="font-semibold">{completedTasks.length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-muted-foreground">Request</span>
              </div>
              <p className="font-semibold">{pendingRequests.length}</p>
            </div>
          </div>

          {/* View Requests Button */}
          {pendingRequests.length > 0 && isOwnCard && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowRequests(true);
              }}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Lihat Request ({pendingRequests.length})
            </Button>
          )}

          {/* View Detail Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(true);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat Detail Pekerjaan
          </Button>
        </CardContent>
      </Card>

      {/* Task Request Modal */}
      {showRequests && (
        <TaskRequestModal
          tasks={pendingRequests}
          isOpen={showRequests}
          onClose={() => setShowRequests(false)}
        />
      )}

      {/* Detail Modal */}
      {showDetail && (
        <IndividualCardDetail
          user={user}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}