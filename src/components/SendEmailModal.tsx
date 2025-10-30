import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Mail, Send, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

export function SendEmailModal({ isOpen, onClose, meetingId }: SendEmailModalProps) {
  const { meetings, users } = useApp();
  const meeting = meetings.find(m => m.id === meetingId);
  
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (meeting) {
      // Auto-select participants' emails
      const participantEmails = meeting.participants
        .map(userId => users.find(u => u.id === userId)?.email)
        .filter((email): email is string => !!email);
      
      setSelectedEmails(participantEmails);

      // Set default subject and body
      const meetingDate = new Date(meeting.startTime).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const meetingTime = new Date(meeting.startTime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setEmailSubject(`Undangan Meeting: ${meeting.title}`);
      setEmailBody(
        `Kepada Yth. Peserta Meeting,\n\n` +
        `Dengan hormat,\n\n` +
        `Kami mengundang Bapak/Ibu untuk menghadiri meeting dengan detail sebagai berikut:\n\n` +
        `Judul: ${meeting.title}\n` +
        `Waktu: ${meetingDate}, ${meetingTime}\n` +
        `Lokasi: ${meeting.location || '-'}\n` +
        `Deskripsi: ${meeting.description || '-'}\n\n` +
        `Mohon hadir tepat waktu.\n\n` +
        `Terima kasih.\n\n` +
        `Hormat kami,\n` +
        `Tim PMB`
      );
    }
  }, [meeting, users]);

  if (!meeting) return null;

  const allUsers = users.filter(u => u.isActive);
  const participantUsers = allUsers.filter(u => meeting.participants.includes(u.id));
  const otherUsers = allUsers.filter(u => !meeting.participants.includes(u.id));

  const handleToggleEmail = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleAddCustomEmail = () => {
    if (!customEmail.trim()) {
      toast.error('Email tidak boleh kosong');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customEmail)) {
      toast.error('Format email tidak valid');
      return;
    }

    if (customEmails.includes(customEmail) || selectedEmails.includes(customEmail)) {
      toast.error('Email sudah ditambahkan');
      return;
    }

    setCustomEmails([...customEmails, customEmail]);
    setSelectedEmails([...selectedEmails, customEmail]);
    setCustomEmail('');
    toast.success('Email berhasil ditambahkan');
  };

  const handleRemoveCustomEmail = (email: string) => {
    setCustomEmails(customEmails.filter(e => e !== email));
    setSelectedEmails(selectedEmails.filter(e => e !== email));
  };

  const handleSendEmail = async () => {
    if (selectedEmails.length === 0 && customEmails.length === 0) {
      toast.error('Pilih minimal satu penerima');
      return;
    }

    if (!emailSubject.trim()) {
      toast.error('Subjek email tidak boleh kosong');
      return;
    }

    if (!emailBody.trim()) {
      toast.error('Isi email tidak boleh kosong');
      return;
    }

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Email berhasil dikirim ke ${selectedEmails.length + customEmails.length} penerima!`);
      onClose();
    }, 2000);
  };

  const totalRecipients = selectedEmails.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl mb-1">Kirim Email Meeting</DialogTitle>
              <DialogDescription className="text-sm">
                Kirim undangan meeting ke peserta atau tambahkan penerima lain
              </DialogDescription>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="bg-blue-500 text-white">
                  {meeting.title}
                </Badge>
                <Badge variant="outline">
                  {totalRecipients} Penerima
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Email Recipients - Participants */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Peserta Meeting ({participantUsers.length})
              </h3>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border">
                {participantUsers.map(user => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedEmails.includes(user.email)}
                      onCheckedChange={() => handleToggleEmail(user.email)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Email Recipients - Other Users */}
            {otherUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Anggota Lainnya ({otherUsers.length})
                </h3>
                <ScrollArea className="h-[150px] bg-gray-50 p-3 rounded-lg border">
                  <div className="grid grid-cols-2 gap-2">
                    {otherUsers.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedEmails.includes(user.email)}
                          onCheckedChange={() => handleToggleEmail(user.email)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Custom Email Input */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Email Lainnya
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="contoh@email.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomEmail()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddCustomEmail}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>
              
              {/* Custom Emails List */}
              {customEmails.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customEmails.map(email => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="pr-1 bg-blue-100 text-blue-700 border border-blue-300"
                    >
                      {email}
                      <button
                        onClick={() => handleRemoveCustomEmail(email)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Email Subject */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Subjek Email
              </label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Masukkan subjek email"
                className="border-2"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Isi Email
              </label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Masukkan isi email"
                rows={10}
                className="border-2 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Penerima: <span className="font-bold text-blue-600">{totalRecipients}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
            >
              Batal
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
