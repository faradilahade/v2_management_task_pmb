import { SeasonInfoCardEditable } from './SeasonInfoCardEditable';
import { WeatherPredictionCardEditable } from './WeatherPredictionCardEditable';
import { FloodAlertCardEditable } from './FloodAlertCardEditable';
import { DamSafetyCardEditable } from './DamSafetyCardEditable';
import { TaskSummaryCard } from './TaskSummaryCard';
import { AnnouncementSummaryCard } from './AnnouncementSummaryCard';

export function InfoSection() {
  return (
    <div>
      {/* 5 Cards Horizontal - Grid 12 Kolom */}
      <div className="grid grid-cols-12 gap-4">
        {/* Musim Sekarang */}
        <div className="col-span-2">
          <SeasonInfoCardEditable compact />
        </div>
        
        {/* Alert Banjir */}
        <div className="col-span-2">
          <FloodAlertCardEditable compact />
        </div>
        
        {/* Keamanan Bendungan */}
        <div className="col-span-3">
          <DamSafetyCardEditable compact />
        </div>
        
        {/* Tugas Bersama Minggu Ini */}
        <div className="col-span-2">
          <TaskSummaryCard />
        </div>
        
        {/* Pengumuman Penting */}
        <div className="col-span-3">
          <AnnouncementSummaryCard />
        </div>
      </div>
    </div>
  );
}
