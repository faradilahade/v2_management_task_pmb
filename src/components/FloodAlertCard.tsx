import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Waves, Edit } from 'lucide-react';
import { ManageFloodAlertModal } from './ManageFloodAlertModal';

export function FloodAlertCard() {
  const { floodAlerts, currentUser } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);

  const activeAlerts = floodAlerts.filter(a => a.isActive);
  const criticalAlerts = activeAlerts.filter(a => a.alertLevel === 'awas' || a.alertLevel === 'siaga');

  const getAlertBadge = (level: string) => {
    const config: Record<string, { variant: any; label: string; emoji: string; color: string }> = {
      'normal': { variant: 'secondary', label: 'Normal', emoji: '🟢', color: 'text-green-600' },
      'waspada': { variant: 'default', label: 'Waspada', emoji: '🟡', color: 'text-yellow-600' },
      'siaga': { variant: 'destructive', label: 'Siaga', emoji: '🟠', color: 'text-orange-600' },
      'awas': { variant: 'destructive', label: 'Awas', emoji: '🔴', color: 'text-red-600' },
    };
    return config[level] || config['normal'];
  };

  const canEdit = 
    currentUser?.department === 'Hydrology' || 
    currentUser?.department === 'Hydraulic' || 
    currentUser?.role === 'admin';

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                criticalAlerts.length > 0 
                  ? 'bg-red-100 dark:bg-red-900' 
                  : 'bg-amber-100 dark:bg-amber-900'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  criticalAlerts.length > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <div>
                <CardTitle>Status Siaga Banjir</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeAlerts.length} Bendungan Dipantau
                </p>
              </div>
            </div>
            {canEdit && (
              <Button onClick={() => setShowManageModal(true)} size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Kelola
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada alert aktif</p>
              <p className="text-xs text-muted-foreground mt-1">Semua bendungan dalam kondisi normal</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map(alert => {
                const alertConfig = getAlertBadge(alert.alertLevel);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.alertLevel === 'awas' || alert.alertLevel === 'siaga'
                        ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{alert.damName}</span>
                      </div>
                      <Badge variant={alertConfig.variant}>
                        {alertConfig.emoji} {alertConfig.label}
                      </Badge>
                    </div>
                    <div className="ml-7 space-y-1">
                      <p className="text-sm">
                        Tinggi Muka Air: <span className="font-semibold">{alert.waterLevel} m</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Update: {new Date(alert.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showManageModal && (
        <ManageFloodAlertModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
        />
      )}
    </>
  );
}
