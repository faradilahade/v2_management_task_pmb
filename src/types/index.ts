export type UserRole = 'admin' | 'user';

export type WorkStatus = 'busy' | 'relaxed' | 'meeting' | 'field' | 'leave' | 'sick' | 'vacation';

export type TaskStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'declined' | 'revision-requested';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Department = 'GIS' | 'Weather' | 'Hydrology' | 'Hydraulic' | 'Dam Safety' | 'Instrumentasi' | 'IT' | 'Data' | 'Public Relation' | 'OP Bendung' | 'Katim PMB' | 'Lainnya';

export type Season = 'kemarau' | 'hujan';

export type AlertLevel = 'normal' | 'waspada' | 'siaga' | 'awas';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  department: Department;
  position: string;
  workStatus: WorkStatus;
  isActive: boolean;
  isOnline: boolean;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  senderId: string;
  receiverId: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
  revisionReason?: string;
}

export interface TodoItem {
  id: string;
  taskId: string;
  text: string;
  completed: boolean;
}

export interface WeeklyFocus {
  userId: string;
  weekStart: string;
  focus: string;
  updatedAt?: string;
}

export interface RainfallPrediction {
  id: string;
  date: string;
  damName: string;
  balaiName: string;
  rainfallIntensity: 'ringan' | 'sedang' | 'lebat' | 'sangat-lebat';
  amount: number; // mm
  createdBy: string;
  createdAt: string;
}

export interface WeatherPrediction {
  id: string;
  date: string;
  rainfall: number;
  condition: 'cerah' | 'berawan' | 'hujan-ringan' | 'hujan-sedang' | 'hujan-lebat';
  location: string;
  lastUpdated: string;
  updatedBy?: string;
  updatedByName?: string;
}

export interface FloodAlert {
  id: string;
  damName: string;
  waterLevel: number;
  normalLevel: number;
  alertLevel: 'normal' | 'siaga-3' | 'siaga-2' | 'siaga-1' | 'awas';
  inflow: number;
  outflow: number;
  lastUpdated: string;
  notes?: string;
  updatedBy?: string;
  updatedByName?: string;
}

export interface DamSafetyAlert {
  id: string;
  damName: string;
  category: 'struktur' | 'instrumentasi' | 'operasional';
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  status: 'open' | 'in-progress' | 'resolved';
  reportedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
  notes?: string;
  lastUpdated: string;
  updatedBy?: string;
  updatedByName?: string;
}

export interface DispositionTask {
  id: string;
  title: string;
  description: string;
  giverIds: string[];
  giverNames: string[];
  receiverIds: string[];
  receiverNames: string[];
  period?: 'harian' | 'mingguan' | 'bulanan'; // Made optional since we're removing period-based view
  status: 'active' | 'pending' | 'completed';
  link?: string; // Can contain multiple links separated by |
  notes?: string;
  createdAt: string;
  receivedDate?: string; // Tanggal terima disposisi
  isActive: boolean;
  filledBy?: {
    userId: string;
    userName: string;
    filledAt: string;
    content?: string;
  }[];
  dueDate?: string;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'task' | 'disposition' | 'meeting' | 'alert' | 'system';
  relatedId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  participants: string[]; // user IDs
  location?: string;
  meetingLink?: string;
  googleCalendarId?: string;
  createdBy: string;
  createdAt: string;
  emailNotificationSent: boolean;
}

export interface GlobalStatus {
  season: Season;
  currentIssue: string;
  weeklyFocus: string;
  weekStartDate: string;
  weekEndDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task-request' | 'task-accepted' | 'task-declined' | 'task-completed' | 'task-revision' | 'request-created' | 'request-accepted' | 'request-declined' | 'request-completed';
  message: string;
  taskId?: string;
  requestId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface RequestTask {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  assignedToIds: string[];
  assignedToNames: string[];
  status: 'pending' | 'accepted' | 'declined' | 'in-progress' | 'completed';
  responses: {
    userId: string;
    userName: string;
    response: 'pending' | 'accepted' | 'declined';
    respondedAt?: string;
  }[];
  progress: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}