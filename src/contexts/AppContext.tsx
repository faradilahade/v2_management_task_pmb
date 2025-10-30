import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Task, 
  GlobalStatus, 
  Notification, 
  WorkStatus, 
  TaskStatus, 
  TodoItem,
  RainfallPrediction,
  FloodAlert,
  DamSafetyAlert,
  WeeklyFocus,
  DispositionTask,
  ActivityLog,
  Meeting
} from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  globalStatus: GlobalStatus;
  notifications: Notification[];
  todoItems: TodoItem[];
  rainfallPredictions: RainfallPrediction[];
  floodAlerts: FloodAlert[];
  damSafetyAlerts: DamSafetyAlert[];
  weeklyFocuses: WeeklyFocus[];
  dispositionTasks: DispositionTask[];
  activityLogs: ActivityLog[];
  meetings: Meeting[];
  collaborations?: any[]; // Added for collaboration tasks
  theme: 'light' | 'dark';
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUserWorkStatus: (userId: string, status: WorkStatus) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  acceptTask: (taskId: string) => void;
  declineTask: (taskId: string) => void;
  requestRevision: (taskId: string, reason: string) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  updateGlobalStatus: (status: Partial<GlobalStatus>) => void;
  toggleTheme: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser?: (userId: string) => void;
  toggleTodoItem: (todoId: string) => void;
  addTodoItem: (taskId: string, text: string) => void;
  addRainfallPrediction: (prediction: Omit<RainfallPrediction, 'id' | 'createdAt'>) => void;
  removeRainfallPrediction: (id: string) => void;
  addFloodAlert: (alert: Omit<FloodAlert, 'id' | 'createdAt'>) => void;
  removeFloodAlert: (id: string) => void;
  updateFloodAlert: (id: string, updates: Partial<FloodAlert>) => void;
  toggleFloodAlert: (id: string) => void;
  addDamSafetyAlert: (alert: Omit<DamSafetyAlert, 'id' | 'createdAt'>) => void;
  removeDamSafetyAlert: (id: string) => void;
  updateDamSafetyAlert: (id: string, updates: Partial<DamSafetyAlert>) => void;
  toggleDamSafetyAlert: (id: string) => void;
  updateWeatherPrediction: (id: string, updates: Partial<any>) => void;
  setWeeklyFocus: (userId: string, focus: string) => void;
  addDispositionTask: (task: Omit<DispositionTask, 'id' | 'createdAt'>) => void;
  updateDispositionTask: (id: string, updates: Partial<DispositionTask>) => void;
  removeDispositionTask: (id: string) => void;
  toggleDispositionTask: (id: string) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const initialUsers: User[] = [
  { id: '1', name: 'Verifikator PMB', email: 'admin@pmb.go.id', username: 'admin', password: 'admin123', role: 'admin', department: 'IT', position: 'Administrator', workStatus: 'relaxed', isActive: true, isOnline: true },
  { id: '2', name: 'Arif Setiawan', email: 'arif.setiawan@pmb.go.id', username: 'arif', password: 'arif123', role: 'user', department: 'GIS', position: 'PIC GIS', workStatus: 'busy', isActive: true, isOnline: true },
  { id: '3', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@pmb.go.id', username: 'siti', password: 'siti123', role: 'user', department: 'Weather', position: 'Staff Weather', workStatus: 'relaxed', isActive: true, isOnline: true },
  { id: '4', name: 'Budi Santoso', email: 'budi.santoso@pmb.go.id', username: 'budi', password: 'budi123', role: 'user', department: 'Hydrology', position: 'PIC Hydrology', workStatus: 'meeting', isActive: true, isOnline: false },
  { id: '5', name: 'Dewi Lestari', email: 'dewi.lestari@pmb.go.id', username: 'dewi', password: 'dewi123', role: 'user', department: 'Public Relation', position: 'PIC PR', workStatus: 'relaxed', isActive: true, isOnline: true },
  { id: '6', name: 'Ahmad Wijaya', email: 'ahmad.wijaya@pmb.go.id', username: 'ahmad', password: 'ahmad123', role: 'user', department: 'Dam Safety', position: 'Staff Dam Safety', workStatus: 'field', isActive: true, isOnline: false },
  { id: '7', name: 'Rina Kartika', email: 'rina.kartika@pmb.go.id', username: 'rina', password: 'rina123', role: 'user', department: 'Instrumentasi', position: 'PIC Instrumentasi', workStatus: 'busy', isActive: true, isOnline: true },
  { id: '8', name: 'Bambang Hermawan', email: 'bambang.hermawan@pmb.go.id', username: 'bambang', password: 'bambang123', role: 'user', department: 'Hydraulic', position: 'Staff Hydraulic', workStatus: 'relaxed', isActive: true, isOnline: true },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Mapping Zona Rawan Banjir',
    description: 'Membuat peta zona rawan banjir untuk wilayah hilir bendungan',
    senderId: '1',
    receiverId: '2',
    deadline: '2025-10-25',
    priority: 'high',
    status: 'in-progress',
    progress: 60,
    createdAt: '2025-10-20T08:00:00',
  },
  {
    id: '2',
    title: 'Analisis Curah Hujan Mingguan',
    description: 'Menganalisis data curah hujan untuk minggu ini dan membuat prediksi',
    senderId: '1',
    receiverId: '3',
    deadline: '2025-10-23',
    priority: 'medium',
    status: 'in-progress',
    progress: 30,
    createdAt: '2025-10-21T09:00:00',
  },
  {
    id: '3',
    title: 'Request Siaran Pers',
    description: 'Membuat siaran pers tentang kondisi bendungan terkini',
    senderId: '5',
    receiverId: '2',
    deadline: '2025-10-24',
    priority: 'urgent',
    status: 'pending',
    progress: 0,
    createdAt: '2025-10-22T10:00:00',
  },
];

const initialGlobalStatus: GlobalStatus = {
  season: 'hujan',
  currentIssue: 'Curah hujan tinggi di wilayah hulu',
  weeklyFocus: 'Monitoring debit air dan kesiapan spillway',
  weekStartDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0],
  weekEndDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0],
};

const initialTodoItems: TodoItem[] = [
  { id: 't1', taskId: '1', text: 'Kumpulkan data elevasi terkini', completed: true },
  { id: 't2', taskId: '1', text: 'Analisis data dengan ArcGIS', completed: true },
  { id: 't3', taskId: '1', text: 'Buat visualisasi peta', completed: false },
  { id: 't4', taskId: '2', text: 'Download data dari AWS', completed: true },
  { id: 't5', taskId: '2', text: 'Proses data dengan Python', completed: false },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
const thirdDay = new Date();
thirdDay.setDate(thirdDay.getDate() + 3);

const initialRainfallPredictions: RainfallPrediction[] = [
  {
    id: 'r1',
    date: tomorrow.toISOString().split('T')[0],
    damName: 'BWS Sumatera I - Sinapo-anjo',
    balaiName: 'Balai Aceh',
    rainfallIntensity: 'lebat',
    amount: 85,
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r2',
    date: dayAfter.toISOString().split('T')[0],
    damName: 'BWS Citarum - Cibitung Cidadap',
    balaiName: 'Balai Citarum',
    rainfallIntensity: 'sangat-lebat',
    amount: 120,
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r3',
    date: thirdDay.toISOString().split('T')[0],
    damName: 'BWS Brantas - Selorejo',
    balaiName: 'Balai Brantas',
    rainfallIntensity: 'sedang',
    amount: 45,
    createdBy: '3',
    createdAt: new Date().toISOString(),
  },
];

const initialFloodAlerts: FloodAlert[] = [
  {
    id: 'f1',
    damName: 'Bendungan Cirata',
    waterLevel: 215.5,
    normalLevel: 210.0,
    alertLevel: 'siaga-2',
    inflow: 85.3,
    outflow: 62.1,
    lastUpdated: new Date().toISOString(),
    notes: 'Tinggi muka air mendekati batas aman. Peningkatan monitoring diperlukan.',
    updatedBy: '4',
    updatedByName: 'Budi Santoso',
  },
  {
    id: 'f2',
    damName: 'Bendungan Jatiluhur',
    waterLevel: 102.3,
    normalLevel: 107.0,
    alertLevel: 'normal',
    inflow: 45.2,
    outflow: 48.0,
    lastUpdated: new Date().toISOString(),
    notes: 'Kondisi normal, monitoring rutin',
    updatedBy: '8',
    updatedByName: 'Bambang Hermawan',
  },
  {
    id: 'f3',
    damName: 'Bendungan Saguling',
    waterLevel: 645.8,
    normalLevel: 640.0,
    alertLevel: 'siaga-3',
    inflow: 120.5,
    outflow: 95.0,
    lastUpdated: new Date().toISOString(),
    notes: 'Curah hujan tinggi di catchment area',
    updatedBy: '4',
    updatedByName: 'Budi Santoso',
  },
];

const initialDamSafetyAlerts: DamSafetyAlert[] = [
  {
    id: 'd1',
    damName: 'Bendungan Saguling',
    category: 'instrumentasi',
    severity: 'medium',
    issue: 'Sensor piezometer menunjukkan anomali pada reading point B-7',
    status: 'in-progress',
    reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    assignedTo: 'Rina Kartika',
    notes: 'Sedang dilakukan kalibrasi ulang sensor',
    updatedBy: '7',
    updatedByName: 'Rina Kartika',
  },
  {
    id: 'd2',
    damName: 'Bendungan Mrica',
    category: 'struktur',
    severity: 'high',
    issue: 'Ditemukan rembesan pada tubuh bendungan sektor D',
    status: 'open',
    reportedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    assignedTo: 'Ahmad Wijaya',
    notes: 'Perlu investigasi segera oleh tim struktur',
    updatedBy: '6',
    updatedByName: 'Ahmad Wijaya',
  },
  {
    id: 'd3',
    damName: 'Bendungan Cirata',
    category: 'operasional',
    severity: 'low',
    issue: 'Pintu air utama memerlukan maintenance rutin',
    status: 'open',
    reportedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    assignedTo: 'Ahmad Wijaya',
    updatedBy: '6',
    updatedByName: 'Ahmad Wijaya',
  },
];

const initialWeeklyFocuses: WeeklyFocus[] = [
  {
    userId: '2',
    weekStart: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0],
    focus: 'Menyelesaikan pemetaan zona rawan banjir dan koordinasi dengan tim lapangan',
  },
  {
    userId: '3',
    weekStart: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0],
    focus: 'Analisis prediksi curah hujan dan pembuatan early warning system',
  },
];

const initialDispositionTasks: DispositionTask[] = [
  {
    id: 'dt1',
    title: 'Laporan Harian Monitoring Bendungan',
    description: 'Membuat laporan harian kondisi bendungan dan sistem',
    giverIds: ['1'],
    giverNames: ['Verifikator PMB'],
    receiverIds: ['2'],
    receiverNames: ['Arif Setiawan'],
    period: 'harian',
    status: 'active',
    createdAt: '2025-10-20T08:00:00',
    isActive: true,
  },
  {
    id: 'dt2',
    title: 'Analisis Data Curah Hujan Mingguan',
    description: 'Menganalisis data curah hujan untuk laporan mingguan',
    giverIds: ['1'],
    giverNames: ['Verifikator PMB'],
    receiverIds: ['3', '4'],
    receiverNames: ['Siti Nurhaliza', 'Budi Santoso'],
    period: 'mingguan',
    link: 'https://pmb.example.com/reports',
    notes: 'Prioritas tinggi untuk analisis periode musim hujan',
    status: 'active',
    createdAt: '2025-10-21T09:00:00',
    isActive: true,
  },
  {
    id: 'dt3',
    title: 'Laporan Bulanan Keamanan Bendungan',
    description: 'Menyusun laporan bulanan terkait keamanan struktur bendungan',
    giverIds: ['1'],
    giverNames: ['Verifikator PMB'],
    receiverIds: ['6', '7'],
    receiverNames: ['Ahmad Wijaya', 'Rina Kartika'],
    period: 'bulanan',
    status: 'active',
    createdAt: '2025-10-01T08:00:00',
    isActive: true,
  },
];

const initialActivityLogs: ActivityLog[] = [
  {
    id: 'a1',
    type: 'task',
    action: 'Progress Update',
    userId: '2',
    userName: 'Arif Setiawan',
    description: 'Memperbarui progress tugas Mapping Zona Rawan Banjir menjadi 60%',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'a2',
    type: 'alert',
    action: 'Alert Baru',
    userId: '4',
    userName: 'Budi Santoso',
    description: 'Menambahkan alert siaga banjir untuk Bendungan Cirata',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'a3',
    type: 'disposition',
    action: 'Disposisi Selesai',
    userId: '3',
    userName: 'Siti Nurhaliza',
    description: 'Menyelesaikan disposisi Analisis Data Curah Hujan Mingguan',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

const initialMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Rapat Koordinasi PMB Mingguan',
    description: 'Evaluasi kinerja mingguan dan pembahasan isu terkini',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60000).toISOString().replace(/\.\d{3}Z$/, ':00.000Z').replace('T', 'T09:00'),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60000).toISOString().replace(/\.\d{3}Z$/, ':00.000Z').replace('T', 'T11:00'),
    participants: ['1', '2', '3', '4', '5', '6', '7', '8'],
    location: 'Ruang Meeting PMB Lantai 3',
    meetingLink: 'https://meet.google.com/pmb-weekly',
    googleCalendarId: 'cal-12345',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    emailNotificationSent: true,
  },
  {
    id: 'm2',
    title: 'Diskusi Teknis: Sistem Early Warning',
    description: 'Pembahasan pengembangan sistem early warning terintegrasi',
    startTime: new Date(Date.now() + 24 * 60 * 60000).toISOString().replace(/\.\d{3}Z$/, ':00.000Z').replace('T', 'T14:00'),
    endTime: new Date(Date.now() + 24 * 60 * 60000).toISOString().replace(/\.\d{3}Z$/, ':00.000Z').replace('T', 'T15:30'),
    participants: ['3', '4', '7'],
    meetingLink: 'https://meet.google.com/tech-discussion',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    emailNotificationSent: true,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus>(initialGlobalStatus);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [todoItems, setTodoItems] = useState<TodoItem[]>(initialTodoItems);
  const [rainfallPredictions, setRainfallPredictions] = useState<RainfallPrediction[]>(initialRainfallPredictions);
  const [floodAlerts, setFloodAlerts] = useState<FloodAlert[]>(initialFloodAlerts);
  const [damSafetyAlerts, setDamSafetyAlerts] = useState<DamSafetyAlert[]>(initialDamSafetyAlerts);
  const [weeklyFocuses, setWeeklyFocuses] = useState<WeeklyFocus[]>(initialWeeklyFocuses);
  const [dispositionTasks, setDispositionTasks] = useState<DispositionTask[]>(initialDispositionTasks);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserWorkStatus = (userId: string, status: WorkStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, workStatus: status } : u));
  };

  const createTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    
    addNotification({
      userId: task.receiverId,
      type: 'task-request',
      message: `Tugas baru: ${task.title}`,
      taskId: newTask.id,
      isRead: false,
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, progress } : t));
  };

  const acceptTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'in-progress' } : t));
    
    addNotification({
      userId: task.senderId,
      type: 'task-accepted',
      message: `Tugas "${task.title}" telah diterima`,
      taskId,
      isRead: false,
    });
  };

  const declineTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'declined' } : t));
    
    addNotification({
      userId: task.senderId,
      type: 'task-declined',
      message: `Tugas "${task.title}" ditolak`,
      taskId,
      isRead: false,
    });
  };

  const requestRevision = (taskId: string, reason: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'revision-requested', revisionReason: reason } : t));
    
    addNotification({
      userId: task.senderId,
      type: 'task-revision',
      message: `Permintaan revisi untuk "${task.title}"`,
      taskId,
      isRead: false,
    });
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: 'completed', progress: 100, completedAt: new Date().toISOString() } 
        : t
    ));
    
    addNotification({
      userId: task.senderId,
      type: 'task-completed',
      message: `Tugas "${task.title}" telah diselesaikan`,
      taskId,
      isRead: false,
    });
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.filter(t => t.id !== taskId));
    
    addNotification({
      userId: task.senderId,
      type: 'task-deleted',
      message: `Tugas "${task.title}" telah dihapus`,
      taskId,
      isRead: false,
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const updateGlobalStatus = (status: Partial<GlobalStatus>) => {
    setGlobalStatus({ ...globalStatus, ...status });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const toggleTodoItem = (todoId: string) => {
    setTodoItems(todoItems.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t));
  };

  const addTodoItem = (taskId: string, text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      taskId,
      text,
      completed: false,
    };
    setTodoItems([...todoItems, newTodo]);
  };

  const addRainfallPrediction = (prediction: Omit<RainfallPrediction, 'id' | 'createdAt'>) => {
    const newPrediction: RainfallPrediction = {
      ...prediction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRainfallPredictions([...rainfallPredictions, newPrediction]);
  };

  const removeRainfallPrediction = (id: string) => {
    setRainfallPredictions(rainfallPredictions.filter(p => p.id !== id));
  };

  const addFloodAlert = (alert: Omit<FloodAlert, 'id' | 'createdAt'>) => {
    const newAlert: FloodAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFloodAlerts([...floodAlerts, newAlert]);
  };

  const removeFloodAlert = (id: string) => {
    setFloodAlerts(floodAlerts.filter(a => a.id !== id));
  };

  const updateFloodAlert = (id: string, updates: Partial<FloodAlert>) => {
    setFloodAlerts(floodAlerts.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const toggleFloodAlert = (id: string) => {
    setFloodAlerts(floodAlerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const addDamSafetyAlert = (alert: Omit<DamSafetyAlert, 'id' | 'createdAt'>) => {
    const newAlert: DamSafetyAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDamSafetyAlerts([...damSafetyAlerts, newAlert]);
  };

  const removeDamSafetyAlert = (id: string) => {
    setDamSafetyAlerts(damSafetyAlerts.filter(a => a.id !== id));
  };

  const updateDamSafetyAlert = (id: string, updates: Partial<DamSafetyAlert>) => {
    setDamSafetyAlerts(damSafetyAlerts.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const toggleDamSafetyAlert = (id: string) => {
    setDamSafetyAlerts(damSafetyAlerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const updateWeatherPrediction = (id: string, updates: Partial<any>) => {
    setRainfallPredictions(rainfallPredictions.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const setWeeklyFocus = (userId: string, focus: string) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekStart = startOfWeek.toISOString().split('T')[0];

    const existing = weeklyFocuses.find(f => f.userId === userId && f.weekStart === weekStart);
    
    if (existing) {
      setWeeklyFocuses(weeklyFocuses.map(f => 
        f.userId === userId && f.weekStart === weekStart 
          ? { ...f, focus, updatedAt: new Date().toISOString() } 
          : f
      ));
    } else {
      setWeeklyFocuses([...weeklyFocuses, { 
        userId, 
        weekStart, 
        focus,
        updatedAt: new Date().toISOString()
      }]);
    }
  };

  const addDispositionTask = (task: Omit<DispositionTask, 'id' | 'createdAt'>) => {
    const newTask: DispositionTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDispositionTasks([...dispositionTasks, newTask]);
    
    // Add activity log
    if (currentUser) {
      addActivityLog({
        type: 'disposition',
        action: 'Tambah Disposisi',
        userId: currentUser.id,
        userName: currentUser.name,
        description: `Menambahkan disposisi: ${task.title}`,
      });
    }
  };

  const updateDispositionTask = (id: string, updates: Partial<DispositionTask>) => {
    setDispositionTasks(dispositionTasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeDispositionTask = (id: string) => {
    setDispositionTasks(dispositionTasks.filter(t => t.id !== id));
  };

  const toggleDispositionTask = (id: string) => {
    setDispositionTasks(dispositionTasks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setActivityLogs([...activityLogs, newLog]);
  };

  const addMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMeetings([...meetings, newMeeting]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      tasks,
      globalStatus,
      notifications,
      todoItems,
      rainfallPredictions,
      floodAlerts,
      damSafetyAlerts,
      weeklyFocuses,
      dispositionTasks,
      activityLogs,
      meetings,
      collaborations: [], // Initialize collaborations as an empty array
      theme,
      login,
      logout,
      updateUserWorkStatus,
      createTask,
      updateTaskStatus,
      updateTaskProgress,
      acceptTask,
      declineTask,
      requestRevision,
      completeTask,
      deleteTask,
      addNotification,
      markNotificationAsRead,
      updateGlobalStatus,
      toggleTheme,
      addUser,
      updateUser,
      removeUser,
      toggleTodoItem,
      addTodoItem,
      addRainfallPrediction,
      removeRainfallPrediction,
      addFloodAlert,
      removeFloodAlert,
      updateFloodAlert,
      toggleFloodAlert,
      addDamSafetyAlert,
      removeDamSafetyAlert,
      updateDamSafetyAlert,
      toggleDamSafetyAlert,
      updateWeatherPrediction,
      setWeeklyFocus,
      addDispositionTask,
      updateDispositionTask,
      removeDispositionTask,
      toggleDispositionTask,
      addActivityLog,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      updateTask,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}