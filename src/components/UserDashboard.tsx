import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { IndividualCard } from './IndividualCard';
import { IndividualCardDetail } from './IndividualCardDetail';
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
import { Users, Calendar } from 'lucide-react';

export function UserDashboard() {
  const { users } = useApp();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const activeUsers = users.filter((u) => u.role === 'user' && u.isActive);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Running Text - Dibawah Navbar */}
      <div className="flex-shrink-0">
        <RunningText />
      </div>

      {/* Top 5 Cards - Horizontal Layout */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2">
        <div className="grid grid-cols-5 gap-3">
          {/* 1. Musim Sekarang - Editable per Pulau */}
          <div className="h-[160px]">
            <SeasonInfoCardEditableV2 compact />
          </div>

          {/* 2. Alert Banjir - Editable dengan multiple bendungan */}
          <div className="h-[160px]">
            <FloodAlertCardEditable compact />
          </div>

          {/* 3. Status Keamanan Bendungan Hidrolis - Editable dengan multiple bendungan */}
          <div className="h-[160px]">
            <DamSafetyCardEditable compact />
          </div>

          {/* 4. Tugas Bersama Minggu Ini - Editable */}
          <div className="h-[160px]">
            <TaskSummaryCard />
          </div>

          {/* 5. Pengumuman Penting - Editable */}
          <div className="h-[160px]">
            <AnnouncementSummaryCard />
          </div>
        </div>
      </div>

      {/* Main Content Grid - 4 Columns */}
      <div className="flex-1 overflow-hidden px-5 pb-5">
        <div className="h-full grid grid-cols-12 gap-4">
          {/* LEFT - Kolaborasi Tim (3 cols) */}
          <div className="col-span-3 overflow-hidden">
            <CollaborationCard />
          </div>

          {/* CENTER - Disposisi (3 cols) */}
          <div className="col-span-3 overflow-hidden">
            <DispositionTaskCardEnhanced />
          </div>

          {/* CENTER RIGHT - TIM PMB (3 cols) */}
          <div className="col-span-3 overflow-hidden">
            <TimPMBCard />
          </div>

          {/* RIGHT SIDEBAR - Jadwal PMB, Aktivitas Tim & Link Penting (3 cols) */}
          <div className="col-span-3 overflow-hidden">
            <div className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1">
              {/* Jadwal PMB - Kalender */}
              <div className="flex-shrink-0">
                <CalendarWidget />
              </div>
              
              {/* Aktivitas Tim */}
              <div className="flex-shrink-0">
                <AnnouncementActivityFeed />
              </div>
              
              {/* Link Penting PMB */}
              <div className="flex-shrink-0">
                <ImportantLinksManager />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <IndividualCardDetail
          userId={selectedUser}
          isOpen={true}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
