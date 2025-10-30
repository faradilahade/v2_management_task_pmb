import { Card, CardContent, CardHeader } from './ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';

export function CurrentIssuesCard() {
  const { damSafetyAlerts, floodAlerts } = useApp();

  // Get critical issues
  const criticalDamIssues = damSafetyAlerts.filter(
    (alert) => alert.status === 'open' && (alert.severity === 'high' || alert.severity === 'critical')
  );

  const criticalFloodAlerts = floodAlerts.filter(
    (alert) => alert.alertLevel === 'siaga-1' || alert.alertLevel === 'siaga-2' || alert.alertLevel === 'awas'
  );

  const totalCriticalIssues = criticalDamIssues.length + criticalFloodAlerts.length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'awas':
        return 'bg-red-500 text-white';
      case 'high':
      case 'siaga-1':
        return 'bg-orange-500 text-white';
      case 'medium':
      case 'siaga-2':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500 rounded-lg text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">
              Masalah Saat Ini
            </h3>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              {totalCriticalIssues} masalah kritis
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-700">
        {totalCriticalIssues === 0 ? (
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center py-4">
            ✅ Tidak ada masalah kritis
          </p>
        ) : (
          <>
            {/* Dam Safety Issues */}
            {criticalDamIssues.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-medium text-orange-900 dark:text-orange-100 flex-1">
                    {alert.damName}
                  </span>
                </div>
                <p className="text-xs text-orange-800 dark:text-orange-200 line-clamp-2">
                  {alert.issue}
                </p>
                {alert.assignedTo && (
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-orange-600 dark:text-orange-400">
                    <Clock className="w-3 h-3" />
                    <span>PIC: {alert.assignedTo}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Flood Alerts */}
            {criticalFloodAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <Badge className={`${getSeverityColor(alert.alertLevel)} text-xs`}>
                    {alert.alertLevel.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-medium text-orange-900 dark:text-orange-100 flex-1">
                    {alert.damName}
                  </span>
                </div>
                <p className="text-xs text-orange-800 dark:text-orange-200">
                  TMA: {alert.waterLevel}m (Normal: {alert.normalLevel}m)
                </p>
                {alert.notes && (
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 line-clamp-1">
                    {alert.notes}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
