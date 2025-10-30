import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShieldAlert, Activity, Edit } from 'lucide-react';
import { ManageDamSafetyAlertModal } from './ManageDamSafetyAlertModal';

export function DamSafetyAlertCard() {
  const { damSafetyAlerts, currentUser } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);

  const activeAlerts = damSafetyAlerts.filter(a => a.isActive);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const getSeverityBadge = (severity: string) => {
    const config: Record<string, { variant: any; label: string; emoji: string }> = {
      'low': { variant: 'secondary', label: 'Rendah', emoji: '🟢' },
      'medium': { variant: 'default', label: 'Sedang', emoji: '🟡' },
      'high': { variant: 'destructive', label: 'Tinggi', emoji: '🟠' },
      'critical': { variant: 'destructive', label: 'Kritis', emoji: '🔴' },
    };
    return config[severity] || config['low'];
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'instrumentasi': '📊 Instrumentasi',
      'struktur': '🏗️ Struktur',
      'operasional': '⚙️ Operasional',
    };
    return labels[type] || type;
  };

  const canEdit = 
    currentUser?.department === 'Dam Safety' || 
    currentUser?.department === 'Instrumentasi' || 
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
                  : 'bg-purple-100 dark:bg-purple-900'
              }`}>
                <ShieldAlert className={`w-6 h-6 ${
                  criticalAlerts.length > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-purple-600 dark:text-purple-400'
                }`} />
              </div>
              <div>
                <CardTitle>Alert Dam Safety & Instrumentasi</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeAlerts.length} Alert Aktif
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
              <p className="text-xs text-muted-foreground mt-1">Semua sistem berfungsi normal</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map(alert => {
                const severityConfig = getSeverityBadge(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'critical' || alert.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium">{alert.damName}</span>
                      </div>
                      <Badge variant={severityConfig.variant}>
                        {severityConfig.emoji} {severityConfig.label}
                      </Badge>
                    </div>
                    <div className="ml-7 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{getAlertTypeLabel(alert.alertType)}</span>
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
        <ManageDamSafetyAlertModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
        />
      )}
    </>
  );
}
