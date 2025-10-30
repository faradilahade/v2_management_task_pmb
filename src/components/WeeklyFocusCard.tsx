import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Target, Edit2, Save, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function WeeklyFocusCard() {
  const { currentUser, weeklyFocuses, setWeeklyFocus } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [focusText, setFocusText] = useState('');

  const userFocus = weeklyFocuses.find((f) => f.userId === currentUser?.id);

  const handleSave = () => {
    if (!currentUser || !focusText.trim()) return;

    setWeeklyFocus(currentUser.id, focusText.trim());
    setIsEditing(false);
    setFocusText('');
    toast.success('Fokus minggu ini berhasil diupdate');
  };

  const handleEdit = () => {
    setFocusText(userFocus?.focus || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFocusText('');
  };

  // Get current week date range
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    };

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200/50 dark:border-green-800 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl text-white shadow-md">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-100">
                Fokus Minggu Ini
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300">
                {getCurrentWeekRange()}
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-7 w-7 p-0 text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={focusText}
              onChange={(e) => setFocusText(e.target.value)}
              placeholder="Tuliskan fokus minggu ini..."
              className="min-h-[80px] bg-white dark:bg-slate-800"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">
                <Save className="w-3.5 h-3.5 mr-1" />
                Simpan
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-3.5 h-3.5 mr-1" />
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {userFocus && userFocus.focus ? (
              <>
                <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">
                  {userFocus.focus}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-green-200 dark:border-green-800">
                  <Badge variant="secondary" className="text-xs">
                    Diupdate: {new Date(userFocus.updatedAt).toLocaleDateString('id-ID')}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Belum ada fokus minggu ini
                </p>
                <Button size="sm" onClick={handleEdit} variant="outline">
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Tambah Fokus
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}