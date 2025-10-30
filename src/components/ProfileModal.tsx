import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export function ProfileModal({ isOpen, onClose, userId }: ProfileModalProps) {
  const { users, currentUser, updateUser, tasks } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const user = userId ? users.find((u) => u.id === userId) : currentUser;
  const isOwnProfile = user?.id === currentUser?.id;

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    position: user?.position || '',
    department: user?.department || '',
    phone: '',
    location: '',
  });

  if (!user) return null;

  // User statistics
  const userTasks = tasks.filter(
    (t) => t.senderId === user.id || t.receiverId === user.id
  );
  const assignedTasks = tasks.filter((t) => t.receiverId === user.id);
  const completedTasks = assignedTasks.filter((t) => t.status === 'completed');
  const inProgressTasks = assignedTasks.filter((t) => t.status === 'in-progress');
  const completionRate =
    assignedTasks.length > 0
      ? Math.round((completedTasks.length / assignedTasks.length) * 100)
      : 0;

  const handleSave = () => {
    if (!isOwnProfile) return;

    updateUser(user.id, {
      name: editForm.name,
      email: editForm.email,
      position: editForm.position,
      department: editForm.department as any,
    });

    setIsEditing(false);
    toast.success('Profil berhasil diupdate!');
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      position: user.position,
      department: user.department,
      phone: '',
      location: '',
    });
    setIsEditing(false);
  };

  const getWorkStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; emoji: string }> = {
      busy: { label: 'Sibuk', color: 'bg-red-500', emoji: '🔴' },
      relaxed: { label: 'Santai', color: 'bg-green-500', emoji: '🟢' },
      meeting: { label: 'Rapat', color: 'bg-blue-500', emoji: '🔵' },
      field: { label: 'Lapangan', color: 'bg-purple-500', emoji: '🟣' },
      leave: { label: 'Cuti', color: 'bg-gray-500', emoji: '⚪' },
    };
    return configs[status] || configs.relaxed;
  };

  const statusConfig = getWorkStatusConfig(user.workStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2E4B7C]">
            <User className="w-5 h-5" />
            {isOwnProfile ? 'Profil Saya' : `Profil ${user.name}`}
          </DialogTitle>
          <DialogDescription>
            {isOwnProfile
              ? 'Kelola informasi profil dan lihat statistik Anda'
              : 'Informasi profil dan statistik anggota'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Header */}
          <Card className="border-[#2E4B7C]/20 bg-gradient-to-br from-[#2E4B7C]/5 to-[#FFC72C]/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-4 border-[#2E4B7C]">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-[#2E4B7C] to-[#1e3555] text-white">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-[#2E4B7C]">{user.name}</h3>
                    {user.isOnline && (
                      <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#2E4B7C] text-white">
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </Badge>
                    <Badge className={`${statusConfig.color} text-white`}>
                      {statusConfig.emoji} {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.position}</span>
                    <span>•</span>
                    <Building className="w-4 h-4" />
                    <span>{user.department}</span>
                  </div>
                </div>

                {isOwnProfile && (
                  <Button
                    size="sm"
                    variant={isEditing ? 'outline' : 'default'}
                    onClick={() => setIsEditing(!isEditing)}
                    className={
                      isEditing
                        ? ''
                        : 'bg-[#FFC72C] text-[#2E4B7C] hover:bg-[#ffb700]'
                    }
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informasi</TabsTrigger>
              <TabsTrigger value="stats">Statistik</TabsTrigger>
            </TabsList>

            {/* Information Tab */}
            <TabsContent value="info" className="space-y-4">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Edit Profil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs">
                          Nama Lengkap
                        </Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-xs">
                          Jabatan
                        </Label>
                        <Input
                          id="position"
                          value={editForm.position}
                          onChange={(e) =>
                            setEditForm({ ...editForm, position: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-xs">
                          Departemen
                        </Label>
                        <Select
                          value={editForm.department}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, department: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GIS">GIS</SelectItem>
                            <SelectItem value="Weather">Weather</SelectItem>
                            <SelectItem value="Hydrology">Hydrology</SelectItem>
                            <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                            <SelectItem value="Dam Safety">Dam Safety</SelectItem>
                            <SelectItem value="Instrumentasi">Instrumentasi</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Data">Data</SelectItem>
                            <SelectItem value="Public Relation">Public Relation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-[#2E4B7C] hover:bg-[#1e3555]"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Informasi Kontak</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Mail className="w-4 h-4 text-[#2E4B7C]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Briefcase className="w-4 h-4 text-[#2E4B7C]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Jabatan</p>
                        <p className="text-sm font-medium">{user.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Building className="w-4 h-4 text-[#2E4B7C]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Departemen</p>
                        <p className="text-sm font-medium">{user.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Phone className="w-4 h-4 text-[#2E4B7C]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Telepon</p>
                        <p className="text-sm font-medium">+62 812-3456-7890</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <MapPin className="w-4 h-4 text-[#2E4B7C]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Lokasi</p>
                        <p className="text-sm font-medium">Jakarta, Indonesia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-[#2E4B7C]/20">
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 p-3 bg-[#2E4B7C]/10 rounded-full inline-block">
                      <CheckCircle2 className="w-6 h-6 text-[#2E4B7C]" />
                    </div>
                    <p className="text-2xl font-bold text-[#2E4B7C]">
                      {completedTasks.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Task Selesai</p>
                  </CardContent>
                </Card>

                <Card className="border-[#FFC72C]/20">
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 p-3 bg-[#FFC72C]/10 rounded-full inline-block">
                      <Clock className="w-6 h-6 text-[#FFC72C]" />
                    </div>
                    <p className="text-2xl font-bold text-[#FFC72C]">
                      {inProgressTasks.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Sedang Dikerjakan</p>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 p-3 bg-green-500/10 rounded-full inline-block">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FFC72C]" />
                    Pencapaian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {completedTasks.length >= 5 && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/5">
                      <div className="p-2 bg-[#FFC72C] rounded-full">
                        <Award className="w-4 h-4 text-[#2E4B7C]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Task Master</p>
                        <p className="text-xs text-muted-foreground">
                          Menyelesaikan {completedTasks.length} task
                        </p>
                      </div>
                    </div>
                  )}

                  {completionRate >= 80 && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/5">
                      <div className="p-2 bg-[#2E4B7C] rounded-full">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Performer</p>
                        <p className="text-xs text-muted-foreground">
                          Completion rate di atas 80%
                        </p>
                      </div>
                    </div>
                  )}

                  {user.isActive && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/5">
                      <div className="p-2 bg-green-500 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Active Member</p>
                        <p className="text-xs text-muted-foreground">
                          Anggota aktif tim PMB
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
