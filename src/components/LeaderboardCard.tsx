import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, Medal, Award, Crown, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export function LeaderboardCard() {
  const { users, tasks } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Calculate user scores based on completed tasks
  const userScores = users
    .filter((u) => u.role === 'user' && u.isActive)
    .map((user) => {
      const userTasks = tasks.filter((t) => t.receiverId === user.id);
      const completedTasks = userTasks.filter((t) => t.status === 'completed');
      const inProgressTasks = userTasks.filter((t) => t.status === 'in-progress');

      const score = completedTasks.length * 100 + inProgressTasks.length * 50;
      const completionRate =
        userTasks.length > 0
          ? Math.round((completedTasks.length / userTasks.length) * 100)
          : 0;

      return {
        user,
        score,
        completedTasks: completedTasks.length,
        totalTasks: userTasks.length,
        completionRate,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-300';
    }
  };

  const getRankTextColor = (rank: number) => {
    return rank <= 3 ? 'text-white' : 'text-gray-600';
  };

  return (
    <>
      <Card className="border-2 border-[#FFC72C]/30 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#2E4B7C] to-[#1e3555] rounded-xl shadow-md">
                <Trophy className="w-5 h-5 text-[#FFC72C]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2E4B7C]">Leaderboard</h3>
                <p className="text-xs text-muted-foreground">Top Performers Minggu Ini</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#2E4B7C] hover:bg-[#FFC72C]/20"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            {userScores.map((item, index) => {
              const rank = index + 1;
              return (
                <div
                  key={item.user.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-[#FFC72C]/50 transition-all cursor-pointer bg-white hover:shadow-md"
                  onClick={() => setSelectedUserId(item.user.id)}
                >
                  {/* Gradient Background for Top 3 */}
                  {rank <= 3 && (
                    <div
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                      style={{
                        background:
                          rank === 1
                            ? 'linear-gradient(135deg, #FFC72C 0%, #FFB700 100%)'
                            : rank === 2
                            ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                            : 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-3 p-3">
                    {/* Rank Badge */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full ${getRankBgColor(
                        rank
                      )} flex items-center justify-center shadow-md ${
                        rank <= 3 ? 'ring-2 ring-white ring-offset-2' : ''
                      }`}
                    >
                      {rank <= 3 ? (
                        getRankIcon(rank)
                      ) : (
                        <span className={`font-bold ${getRankTextColor(rank)}`}>
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-11 w-11 border-2 border-white shadow-md">
                      <AvatarFallback
                        className="text-sm font-semibold"
                        style={{
                          background:
                            rank === 1
                              ? 'linear-gradient(135deg, #2E4B7C 0%, #1e3555 100%)'
                              : rank === 2
                              ? 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
                              : rank === 3
                              ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                              : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                          color: 'white',
                        }}
                      >
                        {item.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {item.user.name}
                        </p>
                        {item.user.isOnline && (
                          <div className="h-2 w-2 bg-green-500 rounded-full ring-2 ring-green-200" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {item.user.position}
                      </p>
                    </div>

                    {/* Score & Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                        <span className="font-bold text-[#2E4B7C]">
                          {item.score.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">PTS</span>
                      </div>
                      <Badge
                        className="text-xs"
                        style={{
                          background:
                            item.completionRate >= 80
                              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                              : item.completionRate >= 50
                              ? 'linear-gradient(135deg, #FFC72C 0%, #FFB700 100%)'
                              : 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        {item.completionRate}%
                      </Badge>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="relative px-3 pb-2 pt-1 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {item.completedTasks}/{item.totalTasks} task selesai
                      </span>
                      {rank === 1 && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                          🏆 Top Performer
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {userScores.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada data leaderboard</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUserId && (
        <ProfileModal
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          userId={selectedUserId}
        />
      )}
    </>
  );
}
