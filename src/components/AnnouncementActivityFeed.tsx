import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Pin, 
  AlertCircle,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Activity {
  id: string;
  type: 'announcement' | 'message' | 'alert' | 'info';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  isPinned?: boolean;
  replies?: number;
}

interface AnnouncementActivityFeedProps {
  compact?: boolean;
}

export function AnnouncementActivityFeed({ compact = false }: AnnouncementActivityFeedProps) {
  const { currentUser } = useApp();
  const [message, setMessage] = useState('');
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'announcement',
      title: 'Rapat Koordinasi Bendungan',
      content: 'Rapat koordinasi evaluasi bendungan akan dilaksanakan besok pagi jam 09.00. Harap semua tim hadir tepat waktu.',
      author: 'Admin PMB',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isPinned: true,
      replies: 3,
    },
    {
      id: '2',
      type: 'alert',
      title: 'Peringatan Cuaca Ekstrem',
      content: 'BMKG memprediksi hujan lebat untuk 3 hari kedepan. Mohon tingkatkan monitoring water level di semua bendungan.',
      author: 'Tim Monitoring',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isPinned: true,
      replies: 7,
    },
    {
      id: '3',
      type: 'message',
      title: 'Laporan Survey Bendungan Cirata',
      content: 'Survey keamanan struktural sudah selesai. Hasil akan dikirim via email. Ada beberapa temuan yang perlu ditindaklanjuti.',
      author: 'Andi Pratama',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      replies: 5,
    },
    {
      id: '4',
      type: 'info',
      title: 'Update Sistem Dashboard',
      content: 'Fitur baru kolaborasi tim sudah aktif. Silakan explore dan berikan feedback untuk perbaikan.',
      author: 'IT Support',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      replies: 2,
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: 'message',
      title: 'Pesan Baru',
      content: message,
      author: currentUser?.name || 'User',
      timestamp: new Date().toISOString(),
      replies: 0,
    };

    setActivities([newActivity, ...activities]);
    setMessage('');
    toast.success('Pesan terkirim ke semua anggota');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-green-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      announcement: 'bg-blue-100 text-blue-800',
      alert: 'bg-red-100 text-red-800',
      info: 'bg-green-100 text-green-800',
      message: 'bg-gray-100 text-gray-800',
    };
    return styles[type] || styles.message;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  return (
    <Card className="border-2 border-[#1565C0]/30 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1565C0]">Aktivitas Tim</h3>
              <p className="text-xs text-muted-foreground">
                Pengumuman & pesan tim
              </p>
            </div>
          </div>
          <Badge className="bg-[#1565C0] text-white h-6 px-3">
            {activities.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Activities List - Compact */}
        <ScrollArea className="h-[260px] pr-2">
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-2.5 rounded-lg border transition-all hover:shadow-md hover:border-[#1565C0]/50 ${
                  activity.isPinned
                    ? 'bg-yellow-50/50 border-yellow-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Icon instead of Avatar for compact design */}
                  <div className={`flex-shrink-0 p-1.5 rounded-lg ${
                    activity.type === 'announcement' ? 'bg-blue-100' :
                    activity.type === 'alert' ? 'bg-red-100' :
                    activity.type === 'info' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getTypeIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-semibold text-sm truncate text-gray-900">
                            {activity.author}
                          </span>
                          {activity.isPinned && (
                            <Pin className="w-3 h-3 text-yellow-600 flex-shrink-0 fill-yellow-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-1.5 line-clamp-2 leading-tight">{activity.content}</p>

                    {activity.replies && activity.replies > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageSquare className="w-3 h-3" />
                        <span>{activity.replies} balasan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
