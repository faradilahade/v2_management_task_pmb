import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Users, 
  ClipboardList, 
  PlusCircle,
  UserPlus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileCheck,
  TrendingUp,
  Calendar,
  FileText,
  UsersIcon,
  Home,
  AlertTriangle
} from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';
import { ManageUsersModal } from './ManageUsersModal';
import { VerificationManagementCollab } from './VerificationManagementCollab';
import { VerificationManagementDisposition } from './VerificationManagementDisposition';

export function AdminDashboard() {
  const { users, tasks, currentUser, setCurrentUser } = useApp();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('collab');

  const activeUsers = users.filter(u => u.isActive && u.role === 'user');
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  // Mock data untuk status perubahan bulanan
  const monthlyStatusChanges = [
    { userId: '2', name: 'Arif Setiawan', department: 'GIS', position: 'PIC GIS', busy: 12, leave: 2, sick: 0, meeting: 5, field: 8, collabTasks: 5, dispTasks: 3, overdueCollab: 1, overdueDisp: 0 },
    { userId: '3', name: 'Siti Nurhaliza', department: 'Weather', position: 'Staff Weather', busy: 8, leave: 1, sick: 1, meeting: 3, field: 5, collabTasks: 4, dispTasks: 2, overdueCollab: 0, overdueDisp: 1 },
    { userId: '4', name: 'Budi Santoso', department: 'Hydrology', position: 'PIC Hydrology', busy: 10, leave: 0, sick: 0, meeting: 6, field: 10, collabTasks: 6, dispTasks: 4, overdueCollab: 0, overdueDisp: 0 },
    { userId: '5', name: 'Dewi Lestari', department: 'Public Relation', position: 'PIC PR', busy: 6, leave: 3, sick: 0, meeting: 4, field: 2, collabTasks: 3, dispTasks: 5, overdueCollab: 0, overdueDisp: 0 },
    { userId: '6', name: 'Ahmad Wijaya', department: 'Dam Safety', position: 'Staff Dam Safety', busy: 15, leave: 0, sick: 2, meeting: 2, field: 12, collabTasks: 7, dispTasks: 6, overdueCollab: 2, overdueDisp: 1 },
    { userId: '7', name: 'Rina Kartika', department: 'Instrumentasi', position: 'PIC Instrumentasi', busy: 11, leave: 1, sick: 0, meeting: 5, field: 9, collabTasks: 5, dispTasks: 4, overdueCollab: 0, overdueDisp: 0 },
    { userId: '8', name: 'Bambang Hermawan', department: 'Hydraulic', position: 'Staff Hydraulic', busy: 7, leave: 2, sick: 1, meeting: 3, field: 6, collabTasks: 4, dispTasks: 3, overdueCollab: 0, overdueDisp: 0 },
  ];

  const handleBackToDashboard = () => {
    // Navigate back to user dashboard
    window.location.reload(); // Simple reload or you can use proper navigation
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Header with Role Badge and Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">Dashboard Verifikator PMB</h1>
            <p className="text-sm text-muted-foreground">Kelola tugas, verifikasi, dan evaluasi tim</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Dashboard Utama
            </Button>
            <Badge className="bg-gradient-to-r from-[#1E3A8A] to-[#1565C0] text-white px-4 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Verifikator PMB
            </Badge>
          </div>
        </div>

        {/* Admin Actions Tabs */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Buat Tugas Baru
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Kelola User
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowCreateTask(true)}
                    className="bg-gradient-to-r from-[#1E3A8A] to-[#1565C0] hover:from-[#1565C0] hover:to-[#1E3A8A]"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Buat Tugas Baru
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowManageUsers(true)}
                  className="border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Kelola Akun User
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statistics Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-2 border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total User Aktif</p>
                  <p className="text-2xl font-bold text-blue-600">{activeUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tugas</p>
                  <p className="text-2xl font-bold text-purple-600">{totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tugas Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-sky-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sedang Dikerjakan</p>
                  <p className="text-2xl font-bold text-sky-600">{activeTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tugas Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collab">
              <Users className="w-4 h-4 mr-2" />
              Kolaborasi Tim
            </TabsTrigger>
            <TabsTrigger value="disposition">
              <FileText className="w-4 h-4 mr-2" />
              Tugas Disposisi
            </TabsTrigger>
            <TabsTrigger value="team">
              <UsersIcon className="w-4 h-4 mr-2" />
              Status Tim
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
          </TabsList>

          {/* Kolaborasi Tim Tab dengan Verifikasi */}
          <TabsContent value="collab" className="space-y-4">
            <VerificationManagementCollab />
          </TabsContent>

          {/* Tugas Disposisi Tab dengan Verifikasi */}
          <TabsContent value="disposition" className="space-y-4">
            <VerificationManagementDisposition />
          </TabsContent>

          {/* Status Tim Tab - Like Tim PMB Display */}
          <TabsContent value="team" className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-[#1E3A8A] flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                Status Tim PMB - Tracking Bulanan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyStatusChanges.map((member) => (
                  <Card key={member.userId} className="hover:shadow-lg transition-all border-2 border-gray-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#1565C0] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.position} - {member.department}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Status Changes in a Month */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Perubahan Status (Bulan Ini)</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Sibuk:</span>
                            <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">{member.busy}x</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Izin:</span>
                            <Badge variant="outline" className="bg-amber-50 border-amber-300 text-amber-700">{member.leave}x</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Sakit:</span>
                            <Badge variant="outline" className="bg-red-50 border-red-300 text-red-700">{member.sick}x</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Rapat:</span>
                            <Badge variant="outline" className="bg-purple-50 border-purple-300 text-purple-700">{member.meeting}x</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs col-span-2">
                            <span className="text-gray-600">Lapangan:</span>
                            <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">{member.field}x</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Tasks Summary */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-blue-600">{member.collabTasks}</p>
                          <p className="text-xs text-gray-600">Kolaborasi</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-purple-600">{member.dispTasks}</p>
                          <p className="text-xs text-gray-600">Disposisi</p>
                        </div>
                      </div>

                      {/* Overdue Tasks */}
                      {(member.overdueCollab > 0 || member.overdueDisp > 0) && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <p className="text-xs font-semibold text-red-700">Melewati Deadline</p>
                          </div>
                          <div className="flex gap-2 text-xs">
                            {member.overdueCollab > 0 && (
                              <Badge className="bg-red-600 text-white">{member.overdueCollab} Kolaborasi</Badge>
                            )}
                            {member.overdueDisp > 0 && (
                              <Badge className="bg-red-600 text-white">{member.overdueDisp} Disposisi</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Produktivitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
                    <p className="text-sm text-muted-foreground">Total Tugas</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">{pendingTasks}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-sky-50 dark:bg-sky-950 rounded-lg">
                    <p className="text-3xl font-bold text-sky-600">{activeTasks}</p>
                    <p className="text-sm text-muted-foreground">Dikerjakan</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={showCreateTask} 
        onClose={() => setShowCreateTask(false)} 
      />
      <ManageUsersModal 
        isOpen={showManageUsers} 
        onClose={() => setShowManageUsers(false)} 
      />
    </div>
  );
}