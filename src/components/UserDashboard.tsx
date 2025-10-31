import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { RunningText } from './RunningText';
import { CalendarWidget } from './CalendarWidget';
import { DispositionTaskCardEnhanced } from './DispositionTaskCardEnhanced';
import { CollaborationCard } from './CollaborationCard';
import { SeasonInfoCardEditableV2 } from './SeasonInfoCardEditableV2';
import { FloodAlertCardEditable } from './FloodAlertCardEditable';
import { DamSafetyCardEditable } from './DamSafetyCardEditable';
import { TaskSummaryCard } from './TaskSummaryCard';
import { AnnouncementSummaryCard } from './AnnouncementSummaryCard';
import { AnnouncementActivityFeed } from './AnnouncementActivityFeed';
import { ImportantLinksManager } from './ImportantLinksManager';
import { TimPMBCard } from './TimPMBCard';

export function UserDashboard() {
  const { users, currentUser } = useApp();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🕓 Tunggu data Firestore siap
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // timeout safety
    return () => clearTimeout(timer);
  }, [users]);

  // 🔒 Jika belum login, tampilkan pesan aman
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        🔒 Anda belum login. Silakan login kembali.
      </div>
    );
  }

  // ⏳ Loading tampilan awal
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Memuat dashboard pengguna...
      </div>
    );
  }

  // 🧍 Filter user aktif
  const activeUsers = users?.filter((u) => u?.role === 'user' && u?.isActive) || [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 🔹 Running Text */}
      <div className="flex-shrink-0">
        <RunningText />
      </div>

      {/* 🔹 Kartu Ringkasan */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="h-[160px]"><SeasonInfoCardEditableV2 compact /></div>
          <div className="h-[160px]"><FloodAlertCardEditable compact /></div>
          <div className="h-[160px]"><DamSafetyCardEditable compact /></div>
          <div className="h-[160px]"><TaskSummaryCard /></div>
          <div className="h-[160px]"><AnnouncementSummaryCard /></div>
        </div>
      </div>

      {/* 🔹 Grid Konten Utama */}
      <div className="flex-1 overflow-hidden px-5 pb-5">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kolaborasi Tim */}
          <div className="col-span-1 overflow-hidden">
            <CollaborationCard />
          </div>

          {/* Disposisi */}
          <div className="col-span-1 overflow-hidden">
            <DispositionTaskCardEnhanced />
          </div>

          {/* Tim PMB */}
          <div className="col-span-1 overflow-hidden">
            <TimPMBCard />
          </div>

          {/* Kalender + Aktivitas */}
          <div className="col-span-1 overflow-hidden flex flex-col gap-3">
            <CalendarWidget />
            <AnnouncementActivityFeed />
            <ImportantLinksManager />
          </div>
        </div>
      </div>

      {/* 🔹 Modal Detail User */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Detail Pengguna</h3>
            <p>{selectedUser}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setSelectedUser(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
