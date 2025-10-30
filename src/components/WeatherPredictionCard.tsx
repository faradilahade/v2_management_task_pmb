import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CloudRain, Calendar, Edit, Plus } from 'lucide-react';
import { ManageWeatherPredictionModal } from './ManageWeatherPredictionModal';

export function WeatherPredictionCard() {
  const { rainfallPredictions, currentUser } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);

  // Get predictions for next 3 days
  const today = new Date();
  const next3Days = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const predictions = next3Days.map(date => {
    const dayPredictions = rainfallPredictions.filter(p => p.date === date);
    return { date, predictions: dayPredictions };
  });

  const getIntensityBadge = (intensity: string) => {
    const config: Record<string, { variant: any; label: string; emoji: string }> = {
      'ringan': { variant: 'secondary', label: 'Ringan', emoji: '🌦️' },
      'sedang': { variant: 'default', label: 'Sedang', emoji: '🌧️' },
      'lebat': { variant: 'destructive', label: 'Lebat', emoji: '⛈️' },
      'sangat-lebat': { variant: 'destructive', label: 'Sangat Lebat', emoji: '🌩️' },
    };
    return config[intensity] || config['ringan'];
  };

  const canEdit = currentUser?.department === 'Weather' || currentUser?.role === 'admin';

  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Prediksi Curah Hujan Bendungan</CardTitle>
                <p className="text-sm text-muted-foreground">3 Hari Ke Depan</p>
              </div>
            </div>
            {canEdit && (
              <Button onClick={() => setShowManageModal(true)} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Kelola Prediksi
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map(({ date, predictions: dayPredictions }) => {
              const dateObj = new Date(date);
              const dateStr = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              });

              const heavyRainPredictions = dayPredictions.filter(
                p => p.rainfallIntensity === 'lebat' || p.rainfallIntensity === 'sangat-lebat'
              );

              return (
                <div key={date} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{dateStr}</span>
                    {heavyRainPredictions.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        ⚠️ {heavyRainPredictions.length} Alert Hujan Lebat
                      </Badge>
                    )}
                  </div>

                  {dayPredictions.length === 0 ? (
                    <p className="text-sm text-muted-foreground ml-6">Belum ada prediksi</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                      {dayPredictions.map(pred => {
                        const intensity = getIntensityBadge(pred.rainfallIntensity);
                        return (
                          <div
                            key={pred.id}
                            className={`p-3 rounded-lg border ${
                              pred.rainfallIntensity === 'lebat' || pred.rainfallIntensity === 'sangat-lebat'
                                ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                                : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{pred.damName}</p>
                                <p className="text-xs text-muted-foreground">{pred.balaiName}</p>
                              </div>
                              <Badge variant={intensity.variant} className="text-xs">
                                {intensity.emoji} {intensity.label}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-semibold">{pred.amount} mm</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showManageModal && (
        <ManageWeatherPredictionModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
        />
      )}
    </>
  );
}
