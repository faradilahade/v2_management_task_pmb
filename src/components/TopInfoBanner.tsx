import { useApp } from '../contexts/AppContext';
import { CloudRain, AlertCircle, Target, Edit2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';
import { UpdateGlobalStatusModal } from './UpdateGlobalStatusModal';

export function TopInfoBanner() {
  const { globalStatus, currentUser } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);

  const getSeasonIcon = () => {
    return globalStatus.season === 'hujan' ? '🌧️' : '☀️';
  };

  const getSeasonColor = () => {
    return globalStatus.season === 'hujan'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  // Format date range
  const formatDateRange = () => {
    const start = new Date(globalStatus.weekStartDate);
    const end = new Date(globalStatus.weekEndDate);
    return `${start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-3 gap-6 flex-1">
              {/* Season */}
              <div className="flex items-center gap-3">
                <Badge className={`text-lg px-3 py-1 ${getSeasonColor()}`}>
                  {getSeasonIcon()} Musim {globalStatus.season.charAt(0).toUpperCase() + globalStatus.season.slice(1)}
                </Badge>
              </div>

              {/* Current Issue */}
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Masalah Saat Ini</p>
                  <p className="text-sm font-medium truncate">{globalStatus.currentIssue}</p>
                </div>
              </div>

              {/* Weekly Focus */}
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Fokus Minggu Ini ({formatDateRange()})
                  </p>
                  <p className="text-sm font-medium truncate">{globalStatus.weeklyFocus}</p>
                </div>
              </div>
            </div>

            {/* Edit Button - Only for Admin */}
            {currentUser?.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(true)}
                className="ml-4"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showEditModal && (
        <UpdateGlobalStatusModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}