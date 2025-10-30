import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

import {
  User,
  Task,
  GlobalStatus,
  Notification,
  RainfallPrediction,
  FloodAlert,
  DamSafetyAlert,
  DispositionTask,
  ActivityLog,
  Meeting,
} from "../types";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  floodAlerts: FloodAlert[];
  damSafetyAlerts: DamSafetyAlert[];
  rainfallPredictions: RainfallPrediction[];
  dispositionTasks: DispositionTask[];
  activityLogs: ActivityLog[];
  meetings: Meeting[];
  globalStatus: GlobalStatus;
  notifications: Notification[];
  theme: "light" | "dark";

  // auth
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // CRUD
  createTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addFloodAlert: (alert: Omit<FloodAlert, "id" | "createdAt">) => Promise<void>;
  updateFloodAlert: (id: string, updates: Partial<FloodAlert>) => Promise<void>;
  removeFloodAlert: (id: string) => Promise<void>;

  addDamSafetyAlert: (alert: Omit<DamSafetyAlert, "id" | "createdAt">) => Promise<void>;
  updateDamSafetyAlert: (id: string, updates: Partial<DamSafetyAlert>) => Promise<void>;
  removeDamSafetyAlert: (id: string) => Promise<void>;

  addRainfallPrediction: (prediction: Omit<RainfallPrediction, "id" | "createdAt">) => Promise<void>;
  removeRainfallPrediction: (id: string) => Promise<void>;

  addDispositionTask: (task: Omit<DispositionTask, "id" | "createdAt">) => Promise<void>;
  updateDispositionTask: (id: string, updates: Partial<DispositionTask>) => Promise<void>;
  removeDispositionTask: (id: string) => Promise<void>;

  addActivityLog: (log: Omit<ActivityLog, "id" | "timestamp">) => Promise<void>;

  addMeeting: (meeting: Omit<Meeting, "id" | "createdAt">) => Promise<void>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;

  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default users (admin & sample)
const defaultUsers: User[] = [
  {
    id: "1",
    name: "Verifikator PMB",
    email: "admin@pmb.go.id",
    username: "admin",
    password: "admin123",
    role: "admin",
    department: "IT",
    position: "Administrator",
    workStatus: "relaxed",
    isActive: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Arif Setiawan",
    email: "arif.setiawan@pmb.go.id",
    username: "arif",
    password: "arif123",
    role: "user",
    department: "GIS",
    position: "PIC GIS",
    workStatus: "busy",
    isActive: true,
    isOnline: true,
  },
];

const defaultGlobalStatus: GlobalStatus = {
  season: "hujan",
  currentIssue: "Curah hujan tinggi di wilayah hulu",
  weeklyFocus: "Monitoring debit air dan kesiapan spillway",
  weekStartDate: new Date().toISOString().split("T")[0],
  weekEndDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split("T")[0],
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [floodAlerts, setFloodAlerts] = useState<FloodAlert[]>([]);
  const [damSafetyAlerts, setDamSafetyAlerts] = useState<DamSafetyAlert[]>([]);
  const [rainfallPredictions, setRainfallPredictions] = useState<RainfallPrediction[]>([]);
  const [dispositionTasks, setDispositionTasks] = useState<DispositionTask[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus>(defaultGlobalStatus);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 🌓 Theme Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 🔥 Realtime Sync dari Firestore
  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, "tasks"), (snap) =>
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Task[])
      ),
      onSnapshot(collection(db, "floodAlerts"), (snap) =>
        setFloodAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FloodAlert[])
      ),
      onSnapshot(collection(db, "damSafetyAlerts"), (snap) =>
        setDamSafetyAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DamSafetyAlert[])
      ),
      onSnapshot(collection(db, "rainfallPredictions"), (snap) =>
        setRainfallPredictions(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as RainfallPrediction[])
      ),
      onSnapshot(collection(db, "dispositionTasks"), (snap) =>
        setDispositionTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DispositionTask[])
      ),
      onSnapshot(collection(db, "activityLogs"), (snap) =>
        setActivityLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ActivityLog[])
      ),
      onSnapshot(collection(db, "meetings"), (snap) =>
        setMeetings(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Meeting[])
      ),
    ];
    return () => unsubscribers.forEach((u) => u());
  }, []);

  // 🔐 Auth (Login / Logout)
  const login = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  const logout = () => setCurrentUser(null);

  // 📦 Task CRUD
  const createTask = async (task: Omit<Task, "id" | "createdAt">) =>
    await addDoc(collection(db, "tasks"), { ...task, createdAt: new Date().toISOString() });
  const updateTask = async (id: string, updates: Partial<Task>) =>
    await updateDoc(doc(db, "tasks", id), updates);
  const deleteTask = async (id: string) =>
    await deleteDoc(doc(db, "tasks", id));

  // 🌊 Flood Alert
  const addFloodAlert = async (alert: Omit<FloodAlert, "id" | "createdAt">) =>
    await addDoc(collection(db, "floodAlerts"), { ...alert, createdAt: new Date().toISOString() });
  const updateFloodAlert = async (id: string, updates: Partial<FloodAlert>) =>
    await updateDoc(doc(db, "floodAlerts", id), updates);
  const removeFloodAlert = async (id: string) =>
    await deleteDoc(doc(db, "floodAlerts", id));

  // 🧱 Dam Safety
  const addDamSafetyAlert = async (alert: Omit<DamSafetyAlert, "id" | "createdAt">) =>
    await addDoc(collection(db, "damSafetyAlerts"), { ...alert, createdAt: new Date().toISOString() });
  const updateDamSafetyAlert = async (id: string, updates: Partial<DamSafetyAlert>) =>
    await updateDoc(doc(db, "damSafetyAlerts", id), updates);
  const removeDamSafetyAlert = async (id: string) =>
    await deleteDoc(doc(db, "damSafetyAlerts", id));

  // 🌧️ Rainfall
  const addRainfallPrediction = async (prediction: Omit<RainfallPrediction, "id" | "createdAt">) =>
    await addDoc(collection(db, "rainfallPredictions"), { ...prediction, createdAt: new Date().toISOString() });
  const removeRainfallPrediction = async (id: string) =>
    await deleteDoc(doc(db, "rainfallPredictions", id));

  // 🗂️ Disposition Task
  const addDispositionTask = async (task: Omit<DispositionTask, "id" | "createdAt">) =>
    await addDoc(collection(db, "dispositionTasks"), { ...task, createdAt: new Date().toISOString() });
  const updateDispositionTask = async (id: string, updates: Partial<DispositionTask>) =>
    await updateDoc(doc(db, "dispositionTasks", id), updates);
  const removeDispositionTask = async (id: string) =>
    await deleteDoc(doc(db, "dispositionTasks", id));

  // 🧾 Activity Log
  const addActivityLog = async (log: Omit<ActivityLog, "id" | "timestamp">) =>
    await addDoc(collection(db, "activityLogs"), { ...log, timestamp: new Date().toISOString() });

  // 📅 Meeting CRUD
  const addMeeting = async (meeting: Omit<Meeting, "id" | "createdAt">) =>
    await addDoc(collection(db, "meetings"), { ...meeting, createdAt: new Date().toISOString() });
  const updateMeeting = async (id: string, updates: Partial<Meeting>) =>
    await updateDoc(doc(db, "meetings", id), updates);
  const deleteMeeting = async (id: string) =>
    await deleteDoc(doc(db, "meetings", id));

  // 🌓 Theme toggle
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        floodAlerts,
        damSafetyAlerts,
        rainfallPredictions,
        dispositionTasks,
        activityLogs,
        meetings,
        globalStatus,
        notifications,
        theme,
        login,
        logout,
        createTask,
        updateTask,
        deleteTask,
        addFloodAlert,
        updateFloodAlert,
        removeFloodAlert,
        addDamSafetyAlert,
        updateDamSafetyAlert,
        removeDamSafetyAlert,
        addRainfallPrediction,
        removeRainfallPrediction,
        addDispositionTask,
        updateDispositionTask,
        removeDispositionTask,
        addActivityLog,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
