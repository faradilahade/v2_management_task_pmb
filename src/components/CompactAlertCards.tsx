import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CloudRain, AlertTriangle, Shield, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function CompactAlertCards() {
  const { rainfallPredictions, floodAlerts, damSafetyAlerts } = useApp();
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [showFloodDetail, setShowFloodDetail] = useState(false);
  const [showDamDetail, setShowDamDetail] = useState(false);

  const activeFloodAlerts = floodAlerts.filter((a) => a.isActive);
  const activeDamAlerts = damSafetyAlerts.filter((a) => a.isActive);
  const upcomingPredictions = rainfallPredictions.slice(0, 3);

  const getIntensityColor = (intensity: string) => {
    const colors: Record<string, string> = {
      ringan: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sedang: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      lebat: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'sangat-lebat':
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[intensity] || colors.sedang;
  };

  const getAlertLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-green-100 text-green-800',
      waspada: 'bg-yellow-100 text-yellow-800',
      siaga: 'bg-orange-100 text-orange-800',
      awas: 'bg-red-100 text-red-800',
    };
    return colors[level] || colors.normal;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || colors.low;
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {/* Weather Prediction */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowWeatherDetail(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-sm">Prediksi Hujan</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {upcomingPredictions.length > 0 ? (
              <div className="space-y-2">
                {upcomingPredictions.slice(0, 2).map((pred) => (
                  <div key={pred.id} className="text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {new Date(pred.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <Badge
                        className={`text-xs ${getIntensityColor(pred.rainfallIntensity)}`}
                      >
                        {pred.amount}mm
                      </Badge>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  +{upcomingPredictions.length - 2} lainnya
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Tidak ada data</p>
            )}
          </CardContent>
        </Card>

        {/* Flood Alert */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowFloodDetail(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-sm">Alert Banjir</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {activeFloodAlerts.length > 0 ? (
              <div className="space-y-2">
                {activeFloodAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="text-xs">
                    <p className="font-medium truncate">{alert.damName}</p>
                    <Badge
                      className={`text-xs ${getAlertLevelColor(alert.alertLevel)}`}
                    >
                      {alert.alertLevel.toUpperCase()}
                    </Badge>
                  </div>
                ))}
                {activeFloodAlerts.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{activeFloodAlerts.length - 2} lainnya
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-green-600">✓ Semua Normal</p>
            )}
          </CardContent>
        </Card>

        {/* Dam Safety */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowDamDetail(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-sm">Dam Safety</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {activeDamAlerts.length > 0 ? (
              <div className="space-y-2">
                {activeDamAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="text-xs">
                    <p className="font-medium truncate">{alert.damName}</p>
                    <Badge
                      className={`text-xs ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.alertType}
                    </Badge>
                  </div>
                ))}
                {activeDamAlerts.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{activeDamAlerts.length - 2} lainnya
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-green-600">✓ Semua Aman</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weather Detail Modal */}
      <Dialog open={showWeatherDetail} onOpenChange={setShowWeatherDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-600" />
              Prediksi Curah Hujan
            </DialogTitle>
            <DialogDescription>
              Data prediksi curah hujan 3 hari ke depan dari Tim Weather
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3">
              {upcomingPredictions.map((pred) => (
                <div key={pred.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{pred.damName}</h4>
                      <p className="text-sm text-muted-foreground">{pred.balaiName}</p>
                    </div>
                    <Badge className={getIntensityColor(pred.rainfallIntensity)}>
                      {pred.rainfallIntensity.toUpperCase()} - {pred.amount}mm
                    </Badge>
                  </div>
                  <p className="text-sm">
                    📅 {new Date(pred.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Flood Detail Modal */}
      <Dialog open={showFloodDetail} onOpenChange={setShowFloodDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alert Siaga Banjir
            </DialogTitle>
            <DialogDescription>
              Status siaga banjir untuk semua bendungan yang dipantau
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3">
              {activeFloodAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{alert.damName}</h4>
                    <Badge className={getAlertLevelColor(alert.alertLevel)}>
                      {alert.alertLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{alert.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Tinggi Muka Air: {alert.waterLevel} m
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dam Safety Detail Modal */}
      <Dialog open={showDamDetail} onOpenChange={setShowDamDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Dam Safety & Instrumentasi
            </DialogTitle>
            <DialogDescription>
              Status keamanan bendungan dan instrumentasi terkini
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3">
              {activeDamAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{alert.damName}</h4>
                      <Badge variant="outline" className="mt-1">
                        {alert.alertType}
                      </Badge>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm">{alert.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}