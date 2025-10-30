import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, Plus, Edit } from 'lucide-react';
import { ManageDispositionModal } from './ManageDispositionModal';

export function DispositionTaskCard() {
  const { dispositionTasks, currentUser } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);

  const todayDispositions = dispositionTasks.filter(d => d.period === 'harian' && d.isActive);
  const weeklyDispositions = dispositionTasks.filter(d => d.period === 'mingguan' && d.isActive);
  const monthlyDispositions = dispositionTasks.filter(d => d.period === 'bulanan' && d.isActive);

  const canManage = currentUser?.role === 'admin';

  const getPeriodBadge = (period: string) => {
    const config: Record<string, { variant: any; label: string; emoji: string }> = {
      'harian': { variant: 'default', label: 'Harian', emoji: '📅' },
      'mingguan': { variant: 'secondary', label: 'Mingguan', emoji: '📆' },
      'bulanan': { variant: 'outline', label: 'Bulanan', emoji: '🗓️' },
    };
    const c = config[period] || config['harian'];
    return <Badge variant={c.variant}>{c.emoji} {c.label}</Badge>;
  };

  const renderDispositionSection = (title: string, dispositions: any[]) => {
    if (dispositions.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="space-y-2">
          {dispositions.map(disp => (
            <div key={disp.id} className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{disp.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{disp.description}</p>
                </div>
                {getPeriodBadge(disp.period)}
              </div>
              <div className="flex items-center gap-4 text-xs mt-2 pt-2 border-t">
                <div>
                  <span className="text-muted-foreground">Pemberi:</span>{' '}
                  <span className="font-medium">{disp.giverName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Penerima:</span>{' '}
                  <span className="font-medium">{disp.receiverName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Tugas Disposisi</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {todayDispositions.length + weeklyDispositions.length + monthlyDispositions.length} Disposisi Aktif
                </p>
              </div>
            </div>
            {canManage && (
              <Button onClick={() => setShowManageModal(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Kelola
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayDispositions.length === 0 && weeklyDispositions.length === 0 && monthlyDispositions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada disposisi aktif</p>
            </div>
          ) : (
            <>
              {renderDispositionSection('Disposisi Harian', todayDispositions)}
              {renderDispositionSection('Disposisi Mingguan', weeklyDispositions)}
              {renderDispositionSection('Disposisi Bulanan', monthlyDispositions)}
            </>
          )}
        </CardContent>
      </Card>

      {showManageModal && (
        <ManageDispositionModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
        />
      )}
    </>
  );
}
