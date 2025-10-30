import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ActivityFeedEnhanced() {
  const { activityLogs, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  // Get unique dates for filter
  const uniqueDates = useMemo(() => {
    const dates = activityLogs.map((log) => 
      new Date(log.timestamp).toLocaleDateString('id-ID')
    );
    return ['all', ...Array.from(new Set(dates))];
  }, [activityLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      // Search filter
      const matchesSearch = 
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase());

      // User filter
      const matchesUser = filterUser === 'all' || log.userId === filterUser;

      // Date filter
      const matchesDate = 
        filterDate === 'all' ||
        new Date(log.timestamp).toLocaleDateString('id-ID') === filterDate;

      return matchesSearch && matchesUser && matchesDate;
    });
  }, [activityLogs, searchQuery, filterUser, filterDate]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'disposition':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'alert':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '📋';
      case 'disposition':
        return '📌';
      case 'meeting':
        return '📅';
      case 'alert':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Activity Feed</h3>
          <Badge variant="secondary">{filteredLogs.length}</Badge>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Filter by User */}
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="h-8 text-xs">
                <User className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua User</SelectItem>
                {users.filter((u) => u.role === 'user').map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Date */}
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="h-8 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date === 'all' ? 'Semua Tanggal' : date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <AnimatePresence mode="popLayout">
            {filteredLogs.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground text-center py-8"
              >
                Tidak ada aktivitas
              </motion.p>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{getTypeIcon(log.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{log.userName}</span>
                        <Badge className={`text-xs ${getTypeColor(log.type)}`}>
                          {log.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {log.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
