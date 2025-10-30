import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CalendarIcon, Clock, Plus, MapPin, Edit, Trash2, Mail, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ManageMeetingModal } from './ManageMeetingModal';
import { SendEmailModal } from './SendEmailModal';
import { toast } from 'sonner@2.0.3';

interface CalendarWidgetProps {
  isLarge?: boolean;
}

export function CalendarWidget({ isLarge = false }: CalendarWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedMeetingForEmail, setSelectedMeetingForEmail] = useState<string | null>(null);
  const { meetings, deleteMeeting } = useApp();

  // Get meetings for selected date
  const selectedDateMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.startTime);
    return (
      date &&
      meetingDate.toDateString() === date.toDateString()
    );
  }).sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Get today's meetings
  const todayMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.startTime);
    const today = new Date();
    return meetingDate.toDateString() === today.toDateString();
  });

  // Get this week's meetings
  const getThisWeekMeetings = () => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate >= now && meetingDate <= weekEnd;
    });
  };

  const thisWeekMeetings = getThisWeekMeetings();

  // Get upcoming meetings (next 5)
  const upcomingMeetings = meetings
    .filter((meeting) => new Date(meeting.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  // Check for meetings within next 2 hours (warning)
  const urgentMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.startTime);
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return meetingDate >= now && meetingDate <= twoHoursLater;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteMeeting(meetingId);
      toast.success('Jadwal berhasil dihapus');
    }
  };

  const handleEditMeeting = (meetingId: string) => {
    setEditingMeeting(meetingId);
    setShowMeetingModal(true);
  };

  const handleSendEmail = (meetingId: string) => {
    setSelectedMeetingForEmail(meetingId);
    setShowEmailModal(true);
  };

  const getTimeUntilMeeting = (startTime: string) => {
    const now = new Date();
    const meetingTime = new Date(startTime);
    const diffMs = meetingTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins} menit lagi`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lagi`;
    } else {
      return formatFullDate(startTime);
    }
  };

  return (
    <>
      <Card className="border-2 border-[#1565C0]/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#1565C0]/10 to-[#0d47a1]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-xl shadow-md">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1565C0]">Jadwal PMB</h3>
                <p className="text-xs text-muted-foreground">
                  Kalender integrasi tugas & rapat
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingMeeting(null);
                setShowMeetingModal(true);
              }}
              className="bg-[#1565C0] hover:bg-[#0d47a1] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>

          {/* Rekapitulasi Meeting */}
          <div className="mt-3 pt-3 border-t border-[#1565C0]/20">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{meetings.length}</div>
                  <div className="text-xs text-blue-600 mt-0.5">Total Meeting</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 border border-green-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{thisWeekMeetings.length}</div>
                  <div className="text-xs text-green-600 mt-0.5">Minggu Ini</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 border border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{todayMeetings.length}</div>
                  <div className="text-xs text-orange-600 mt-0.5">Hari Ini</div>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Notifications */}
          {urgentMeetings.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#1565C0]/20">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-2.5 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-red-800 mb-1">
                      ⚠️ Meeting Segera Dimulai!
                    </h4>
                    {urgentMeetings.map((meeting) => (
                      <div key={meeting.id} className="text-xs text-red-700 mb-1">
                        <span className="font-semibold">{meeting.title}</span>
                        <span className="text-red-600"> - {getTimeUntilMeeting(meeting.startTime)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      
        <CardContent className="p-4">
          {/* Layout 2 Kolom: Calendar dan Jadwal Mendatang */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Calendar - Kolom Kiri */}
            <div className="bg-white rounded-lg border border-gray-200">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 p-2"
              />
            </div>

            {/* Jadwal Mendatang - Kolom Kanan */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[#1565C0] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Jadwal Mendatang
                </h4>
                <Badge className="bg-[#1565C0] text-white text-xs h-5 px-2">
                  {upcomingMeetings.length}
                </Badge>
              </div>

              <div className="space-y-2 max-h-[310px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {upcomingMeetings.length === 0 ? (
                  <div className="text-center py-12 text-gray-300">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs text-gray-400">Tidak ada jadwal</p>
                  </div>
                ) : (
                  upcomingMeetings.map((meeting, index) => {
                    const meetingDate = new Date(meeting.startTime);
                    const isToday = meetingDate.toDateString() === new Date().toDateString();
                    const isUrgent = urgentMeetings.some(m => m.id === meeting.id);
                    
                    return (
                      <div
                        key={meeting.id}
                        className="group relative"
                      >
                        {/* Date Separator */}
                        {(index === 0 || 
                          formatDate(meeting.startTime) !== formatDate(upcomingMeetings[index - 1].startTime)) && (
                          <div className="flex items-center gap-2 mb-2 mt-3 first:mt-0">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1565C0]/30 to-transparent" />
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              isToday 
                                ? 'text-orange-700 bg-orange-100 border border-orange-300' 
                                : 'text-[#1565C0] bg-[#1565C0]/10'
                            }`}>
                              {isToday ? '📌 Hari Ini' : formatDate(meeting.startTime)}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1565C0]/30 to-transparent" />
                          </div>
                        )}

                        {/* Meeting Item */}
                        <div className={`flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-blue-50 transition-colors border ${
                          isUrgent 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-gray-100 hover:border-[#1565C0]/30'
                        }`}>
                          {/* Time */}
                          <div className={`flex-shrink-0 text-center min-w-[60px] text-white rounded-md p-2 ${
                            isUrgent ? 'bg-red-500' : 'bg-[#1565C0]'
                          }`}>
                            <div className="text-xs font-semibold leading-tight">
                              {formatTime(meeting.startTime)}
                            </div>
                            <div className="text-xs opacity-80 leading-tight mt-0.5">
                              {formatTime(meeting.endTime)}
                            </div>
                          </div>

                          {/* Meeting Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <h5 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {meeting.title}
                              </h5>
                              {isUrgent && (
                                <Badge className="bg-red-500 text-white text-xs h-4 px-1.5 flex-shrink-0">
                                  URGENT
                                </Badge>
                              )}
                            </div>
                            
                            {meeting.description && (
                              <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">
                                {meeting.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2.5 text-xs text-gray-400 flex-wrap">
                              {meeting.participants && meeting.participants.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{meeting.participants.length}</span>
                                </div>
                              )}
                              {meeting.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="line-clamp-1">{meeting.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendEmail(meeting.id);
                              }}
                              className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                              title="Kirim Email"
                            >
                              <Mail className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMeeting(meeting.id);
                              }}
                              className="p-1.5 bg-[#FFB74D] hover:bg-[#FFA726] text-white rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMeeting(meeting.id);
                              }}
                              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showMeetingModal && (
        <ManageMeetingModal
          isOpen={showMeetingModal}
          onClose={() => {
            setShowMeetingModal(false);
            setEditingMeeting(null);
          }}
          meetingId={editingMeeting || undefined}
        />
      )}

      {showEmailModal && selectedMeetingForEmail && (
        <SendEmailModal
          isOpen={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedMeetingForEmail(null);
          }}
          meetingId={selectedMeetingForEmail}
        />
      )}
    </>
  );
}