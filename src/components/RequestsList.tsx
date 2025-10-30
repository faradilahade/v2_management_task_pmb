import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';
import { RequestTask } from '../types';
import { toast } from 'sonner@2.0.3';

interface RequestsListProps {
  userId: string;
}

export function RequestsList({ userId }: RequestsListProps) {
  const { addNotification, currentUser } = useApp();
  const [requests, setRequests] = useState<RequestTask[]>([]);

  // Load requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const stored = localStorage.getItem('requests');
      if (stored) {
        const allRequests: RequestTask[] = JSON.parse(stored);
        // Filter requests where this user is assigned
        const userRequests = allRequests.filter(r => 
          r.assignedToIds.includes(userId)
        );
        setRequests(userRequests);
      }
    };

    loadRequests();
    
    // Listen for storage changes
    window.addEventListener('storage', loadRequests);
    return () => window.removeEventListener('storage', loadRequests);
  }, [userId]);

  const handleResponse = (requestId: string, response: 'accepted' | 'declined') => {
    if (!currentUser) return;

    const updatedRequests = requests.map(req => {
      if (req.id !== requestId) return req;

      // Update the user's response
      const updatedResponses = req.responses.map(res => 
        res.userId === userId 
          ? { ...res, response, respondedAt: new Date().toISOString() }
          : res
      );

      // Check if all users have responded
      const allResponded = updatedResponses.every(res => res.response !== 'pending');
      const allAccepted = updatedResponses.every(res => res.response === 'accepted');
      const anyDeclined = updatedResponses.some(res => res.response === 'declined');

      let newStatus = req.status;
      if (anyDeclined) {
        newStatus = 'declined';
      } else if (allAccepted) {
        newStatus = 'accepted';
      }

      return {
        ...req,
        responses: updatedResponses,
        status: newStatus,
        acceptedAt: allAccepted && !req.acceptedAt ? new Date().toISOString() : req.acceptedAt,
      };
    });

    // Save to localStorage
    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updated = allRequests.map((r: RequestTask) => {
      const found = updatedRequests.find(ur => ur.id === r.id);
      return found || r;
    });
    localStorage.setItem('requests', JSON.stringify(updated));
    
    setRequests(updatedRequests);

    // Send notification to requester
    const request = requests.find(r => r.id === requestId);
    if (request) {
      addNotification({
        userId: request.requesterId,
        type: response === 'accepted' ? 'request-accepted' : 'request-declined',
        message: `${currentUser.name} ${response === 'accepted' ? 'menerima' : 'menolak'} request: ${request.title}`,
        requestId: request.id,
        isRead: false,
      });
    }

    toast.success(`Request ${response === 'accepted' ? 'diterima' : 'ditolak'}`);
  };

  const handleUpdateProgress = (requestId: string, progress: number) => {
    const updatedRequests = requests.map(req => {
      if (req.id !== requestId) return req;

      let newStatus = req.status;
      if (progress === 100 && req.status === 'in-progress') {
        newStatus = 'completed';
      } else if (progress > 0 && req.status === 'accepted') {
        newStatus = 'in-progress';
      }

      return {
        ...req,
        progress,
        status: newStatus,
        completedAt: progress === 100 ? new Date().toISOString() : req.completedAt,
      };
    });

    // Save to localStorage
    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updated = allRequests.map((r: RequestTask) => {
      const found = updatedRequests.find(ur => ur.id === r.id);
      return found || r;
    });
    localStorage.setItem('requests', JSON.stringify(updated));
    
    setRequests(updatedRequests);

    // Notify requester if completed
    if (progress === 100) {
      const request = requests.find(r => r.id === requestId);
      if (request && currentUser) {
        addNotification({
          userId: request.requesterId,
          type: 'request-completed',
          message: `${currentUser.name} telah menyelesaikan request: ${request.title}`,
          requestId: request.id,
          isRead: false,
        });
      }
      toast.success('Request selesai! Requester telah dinotifikasi');
    } else {
      toast.success('Progress berhasil diupdate');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Menunggu Respon</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500 text-white">Diterima</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 text-white">Ditolak</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-500 text-white">Sedang Dikerjakan</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white">Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Belum ada request</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const userResponse = request.responses.find(r => r.userId === userId);
        const canRespond = request.status === 'pending' && userResponse?.response === 'pending';
        const canUpdateProgress = request.status === 'accepted' || request.status === 'in-progress';

        return (
          <Card key={request.id} className="overflow-hidden border-2">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{request.title}</h4>
                    {request.priority && (
                      <Badge variant="outline" className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Dari: {request.requesterName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(request.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>

            <CardContent className="p-3 space-y-3">
              {/* Responses from all assignees */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Respon Anggota:</p>
                <div className="grid grid-cols-2 gap-2">
                  {request.responses.map((resp) => (
                    <div 
                      key={resp.userId}
                      className={`flex items-center gap-2 p-2 rounded border ${
                        resp.userId === userId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium">{resp.userName}</p>
                        {resp.respondedAt && (
                          <p className="text-xs text-gray-400">
                            {new Date(resp.respondedAt).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                      {resp.response === 'pending' && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      {resp.response === 'accepted' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {resp.response === 'declined' && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {(request.status === 'in-progress' || request.status === 'completed') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{request.progress}%</span>
                  </div>
                  <Progress value={request.progress} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              {canRespond && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleResponse(request.id, 'accepted')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Terima
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleResponse(request.id, 'declined')}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Tolak
                  </Button>
                </div>
              )}

              {/* Progress Update Buttons */}
              {canUpdateProgress && userResponse?.response === 'accepted' && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-600 mb-2">Update Progress:</p>
                  <div className="grid grid-cols-5 gap-1">
                    {[25, 50, 75, 100].map((value) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={request.progress === value ? 'default' : 'outline'}
                        onClick={() => handleUpdateProgress(request.id, value)}
                        disabled={request.progress >= value && value !== 100}
                        className="text-xs"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {request.notes && (
                <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded border">
                  <p className="font-medium mb-1">Catatan:</p>
                  <p>{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
