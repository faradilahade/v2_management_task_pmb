import { useApp } from '../contexts/AppContext';
import { Card } from './ui/card';
import { Cloud, CloudRain, AlertTriangle, Target } from 'lucide-react';
import { Badge } from './ui/badge';

export function GlobalStatusBanner() {
  const { globalStatus } = useApp();

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Season */}
        <div className="flex items-center gap-3">
          {globalStatus.season === 'hujan' ? (
            <CloudRain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          ) : (
            <Cloud className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Musim Saat Ini</p>
            <Badge variant={globalStatus.season === 'hujan' ? 'default' : 'secondary'}>
              {globalStatus.season === 'hujan' ? '🌧️ Musim Hujan' : '☀️ Musim Kemarau'}
            </Badge>
          </div>
        </div>

        {/* Current Issue */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-xs text-muted-foreground">Masalah Saat Ini</p>
            <p className="text-sm">{globalStatus.currentIssue}</p>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-xs text-muted-foreground">Fokus Hari Ini</p>
            <p className="text-sm">{globalStatus.todayFocus}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
