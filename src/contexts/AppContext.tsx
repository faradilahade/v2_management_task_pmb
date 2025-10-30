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
  WorkStatus,
  TaskStatus,
  TodoItem,
  RainfallPrediction,
  FloodAlert,
  DamSafetyAlert,
  WeeklyFocus,
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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addFloodAlert: (alert: Omit<FloodAlert, "id" | "createdAt">) => void;
  updateFloodAlert: (id: string, updates: Partial<FloodAlert>) => void;
  removeFloodAlert: (id: string) => void;
  addDamSafetyAlert: (alert: Omit<DamSafetyAlert, "id" | "createdAt">) => void;
  updateDamSafetyAlert: (id: string, updates: Partial<DamSafetyAlert>) => void;
  removeDamSafetyAlert: (id: string) => void;
  addMeeting: (meeting: Omit<Meeting, "id" | "createdAt">) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  addRainfallPrediction: (prediction: Omit<RainfallPrediction, "id" | "createdAt">) => void;
  removeRainfallPrediction: (id: string) => void;
  addDispositionTask: (task: Omit<DispositionTask, "id" | "createdAt">) => void;
  updateDispositionTask: (id: string, updates: Partial<DispositionTask>) => void;
  removeDispositionTask: (id: string) => void;
  addActivityLog: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Users (login)
const initialUsers: User[] = [
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

// Default Global Status
const initialGlobalStatus: GlobalStatus = {
  season: "hujan",
  currentIssue: "Curah hujan tinggi di wilayah hulu",
  weeklyFocus: "Monitoring debit air dan kesiapan spillway",
  weekStartDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay()))
    .toISOString()
    .split("T")[0],
  weekEndDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6))
    .toISOString()
    .split("T")[0],
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [floodAlerts, setFloodAlerts] = useState<FloodAlert[]>([]);
  const [damSafetyAlerts, setDamSafetyAlerts] = useState<DamSafetyAlert[]>([]);
  const [rainfallPredictions, setRainfallPredictions] = useState<RainfallPrediction[]>([]);
  const [dispositionTasks, setDispositionTasks] = useState<DispositionTask[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus>(initialGlobalStatus);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 🌈 Mode Tema
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 🔥 Real-time Listeners untuk semua koleksi
  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snap) => {
      setTasks(snap.docs.map((d) => d.data() as Task));
    });
    const unsubFlood = onSnapshot(collection(db, "floodAlerts"), (snap) => {
      setFloodAlerts(snap.docs.map((d) => d.data() as FloodAlert));
    });
    const unsubDam = onSnapshot(collection(db, "damSafetyAlerts"), (snap) => {
      setDamSafetyAlerts(snap.docs.map((d) => d.data() as DamSafetyAlert));
    });
    const unsubRain = onSnapshot(collection(db, "rainfallPredictions"), (snap) => {
      setRainfallPredictions(snap.docs.map((d) => d.data() as RainfallPrediction));
    });
    const unsubDisp = onSnapshot(collection(db, "dispositionTasks"), (snap) => {
      setDispositionTasks(snap.docs.map((d) => d.data() as DispositionTask));
    });
    const unsubAct = onSnapshot(collection(db, "activityLogs"), (snap) => {
      setActivityLogs(snap.docs.map((d) => d.data() as ActivityLog));
    });
    const unsubMeet = onSnapshot(collection(db, "meetings"), (snap) => {
      setMeetings(snap.docs.map((d) => d.data() as Meeting));
    });

    return () => {
      unsubTasks();
      unsubFlood();
      unsubDam();
      unsubRain();
      unsubDisp();
      unsubAct();
      unsubMeet();
    };
  }, []);

  // 🔐 LOGIN / LOGOUT
  const login = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  const logout = () => setCurrentUser(null);

  // 🧱 TASK CRUD
  const createTask = async (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "tasks", newTask.id), newTask);
  };
  const updateTask = async (id: string, updates: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", id), updates);
  };
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // 💧 FLOOD ALERT CRUD
  const addFloodAlert = async (alert: Omit<FloodAlert, "id" | "createdAt">) => {
    const newAlert = { ...alert, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "floodAlerts", newAlert.id), newAlert);
  };
  const updateFloodAlert = async (id: string, updates: Partial<FloodAlert>) =>
    await updateDoc(doc(db, "floodAlerts", id), updates);
  const removeFloodAlert = async (id: string) => await deleteDoc(doc(db, "floodAlerts", id));

  // 🧱 DAM SAFETY ALERT CRUD
  const addDamSafetyAlert = async (alert: Omit<DamSafetyAlert, "id" | "createdAt">) => {
    const newAlert = { ...alert, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "damSafetyAlerts", newAlert.id), newAlert);
  };
  const updateDamSafetyAlert = async (id: string, updates: Partial<DamSafetyAlert>) =>
    await updateDoc(doc(db, "damSafetyAlerts", id), updates);
  const removeDamSafetyAlert = async (id: string) =>
    await deleteDoc(doc(db, "damSafetyAlerts", id));

  // 🌧️ RAINFALL PREDICTIONS CRUD
  const addRainfallPrediction = async (prediction: Omit<RainfallPrediction, "id" | "createdAt">) => {
    const newPred = { ...prediction, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "rainfallPredictions", newPred.id), newPred);
  };
  const removeRainfallPrediction = async (id: string) =>
    await deleteDoc(doc(db, "rainfallPredictions", id));

  // 🗂️ DISPOSITION CRUD
  const addDispositionTask = async (task: Omit<DispositionTask, "id" | "createdAt">) => {
    const newTask = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "dispositionTasks", newTask.id), newTask);
  };
  const updateDispositionTask = async (id: string, updates: Partial<DispositionTask>) =>
    await updateDoc(doc(db, "dispositionTasks", id), updates);
  const removeDispositionTask = async (id: string) =>
    await deleteDoc(doc(db, "dispositionTasks", id));

  // 🧾 ACTIVITY LOG
  const addActivityLog = async (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const newLog = { ...log, id: Date.now().toString(), timestamp: new Date().toISOString() };
    await setDoc(doc(db, "activityLogs", newLog.id), newLog);
  };

  // 📅 MEETINGS CRUD
  const addMeeting = async (meeting: Omit<Meeting, "id" | "createdAt">) => {
    const newMeeting = { ...meeting, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, "meetings", newMeeting.id), newMeeting);
  };
  const updateMeeting = async (id: string, updates: Partial<Meeting>) =>
    await updateDoc(doc(db, "meetings", id), updates);
  const deleteMeeting = async (id: string) => await deleteDoc(doc(db, "meetings", id));

  // 🌓 TOGGLE THEME
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
