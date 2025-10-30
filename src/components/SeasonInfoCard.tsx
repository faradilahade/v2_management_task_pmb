import { Card, CardContent } from './ui/card';
import { Cloud, Droplets, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

export function SeasonInfoCard() {
  const currentSeason = {
    type: 'Musim Hujan',
    icon: '🌧️',
    startDate: 'Oktober 2025',
    endDate: 'Maret 2026',
    status: 'peak', // peak, early, late
    rainfallIntensity: 'Tinggi',
    description: 'Periode puncak musim hujan dengan curah hujan tinggi',
  };

  const getStatusColor = () => {
    switch (currentSeason.status) {
      case 'peak':
        return 'bg-blue-500 text-white';
      case 'early':
        return 'bg-cyan-500 text-white';
      case 'late':
        return 'bg-indigo-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2.5 bg-blue-500 rounded-lg text-white">
            <Cloud className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{currentSeason.icon}</span>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                {currentSeason.type}
              </h3>
            </div>

            <div className="space-y-2">
              {/* Period */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200">
                  {currentSeason.startDate} - {currentSeason.endDate}
                </span>
              </div>

              {/* Intensity */}
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200">
                  Intensitas: {currentSeason.rainfallIntensity}
                </span>
              </div>

              {/* Status Badge */}
              <Badge className={`${getStatusColor()} text-xs`}>
                Puncak Musim Hujan
              </Badge>

              {/* Description */}
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                {currentSeason.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
