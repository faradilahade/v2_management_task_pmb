import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { Header } from "./Header";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Users,
  ClipboardList,
  PlusCircle,
  UserPlus,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  TrendingUp,
  Calendar,
  UsersIcon,
  Home,
  AlertTriangle,
} from "lucide-react";
import { CreateTaskModal } from "./CreateTaskModal";
import { ManageUsersModal } from "./ManageUsersModal";
import { VerificationManagementCollab } from "./VerificationManagementCollab";
import { VerificationManagementDisposition } from "./VerificationManagementDisposition";

export function AdminDashboard() {
  const {
    users,
    tasks,
    meetings,
    createTask,
    addMeeting,
    currentUser,
  } = useApp();

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("collab");
  const [currentMeetings, setCurrentMeetings] = useState<any[]>([]);

  // === Fetch realtime meetings dari Firestore ===
  useEffect(() => {
    if (meetings && meetings.length > 0) {
      setCurrentMeetings(meetings);
    }
  }, [meetings]);

  const activeUsers = users.filter((u) => u.isActive && u.role === "user");
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status === "in-progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const handleBackToDashboard = () => {
    window.location.reload();
  };

  const handleAddMeeting = async () => {
    await addMeeting({
      title: "Rapat Koordinasi Mingguan",
      description: "Pembahasan progres PMB dan tugas tim minggu ini.",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      participants: ["1", "2", "3"],
      location: "Ruang Meeting PMB",
      meetingLink: "https://meet.google.com/new",
      createdBy: currentUser?.id || "1",
      emailNotificationSent: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">
              Dashboard Verifikator PMB
            </h1>
            <p className="text-sm text-muted-foreground">
              Kelola tugas, jadwal meeting, dan verifikasi tim secara realtime
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
            <Badge className="bg-gradient-to-r from-[#1E3A8A] to-[#1565C0] text-white px-4 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Verifikator PMB
            </Badge>
          </div>
        </div>

        {/* Tabs: Create Task / Manage Users */}
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
              <CardContent className="pt-6 flex gap-3">
                <Button
                  onClick={() => setShowCreateTask(true)}
                  className="bg-gradient-to-r from-[#1E3A8A] to-[#1565C0] hover:from-[#1565C0] hover:to-[#1E3A8A]"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Buat Tugas Baru
                </Button>

                <Button
                  onClick={handleAddMeeting}
                  className="bg-gradient-to-r from-[#0EA5E9] to-[#0369A1] hover:from-[#0369A1] hover:to-[#0EA5E9]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Tambah Jadwal Meeting
                </Button>
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

        {/* Statistik Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={<UsersIcon className="text-blue-600" />}
            title="User Aktif"
            value={activeUsers.length}
            color="blue"
          />
          <StatCard
            icon={<FileText className="text-purple-600" />}
            title="Total Tugas"
            value={totalTasks}
            color="purple"
          />
          <StatCard
            icon={<Clock className="text-amber-600" />}
            title="Tugas Pending"
            value={pendingTasks}
            color="amber"
          />
          <StatCard
            icon={<TrendingUp className="text-sky-600" />}
            title="Sedang Dikerjakan"
            value={activeTasks}
            color="sky"
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-600" />}
            title="Selesai"
            value={completedTasks}
            color="green"
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collab">
              <Users className="w-4 h-4 mr-2" />
              Kolaborasi Tim
            </TabsTrigger>
            <TabsTrigger value="disposition">
              <ClipboardList className="w-4 h-4 mr-2" />
              Disposisi
            </TabsTrigger>
            <TabsTrigger value="meeting">
              <Calendar className="w-4 h-4 mr-2" />
              Jadwal Meeting
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
          </TabsList>

          {/* Kolaborasi */}
          <TabsContent value="collab">
            <VerificationManagementCollab />
          </TabsContent>

          {/* Disposisi */}
          <TabsContent value="disposition">
            <VerificationManagementDisposition />
          </TabsContent>

          {/* Jadwal Meeting Realtime */}
          <TabsContent value="meeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📅 Jadwal Meeting PMB</CardTitle>
              </CardHeader>
              <CardContent>
                {currentMeetings.length > 0 ? (
                  <ul className="space-y-3">
                    {currentMeetings.map((m) => (
                      <li
                        key={m.id}
                        className="border p-3 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-[#1E3A8A]">{m.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(m.startTime).toLocaleString()} –{" "}
                            {new Date(m.endTime).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Lokasi: {m.location || "-"} | Link:{" "}
                            <a
                              href={m.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {m.meetingLink}
                            </a>
                          </p>
                        </div>
                        <Badge className="bg-blue-600 text-white">
                          {m.participants?.length || 0} Peserta
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Belum ada jadwal meeting yang terdaftar.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analitik */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>📈 Ringkasan Produktivitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AnalyticsBox
                    color="blue"
                    value={totalTasks}
                    label="Total Tugas"
                  />
                  <AnalyticsBox
                    color="amber"
                    value={pendingTasks}
                    label="Pending"
                  />
                  <AnalyticsBox
                    color="sky"
                    value={activeTasks}
                    label="Dikerjakan"
                  />
                  <AnalyticsBox
                    color="green"
                    value={completedTasks}
                    label="Selesai"
                  />
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

// === COMPONENTS ===

function StatCard({ icon, title, value, color }: any) {
  return (
    <Card className={`border-2 border-${color}-200 hover:shadow-md transition-shadow`}>
      <CardContent className="pt-6 flex items-center gap-3">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsBox({ color, value, label }: any) {
  return (
    <div
      className={`text-center p-4 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}
    >
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
