import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Target, Zap, Users, Calendar, Play, Clock, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'team';
  reward: number;
  deadline: string;
  progress: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}

export function MiniChallengesCard() {
  const { currentUser, tasks } = useApp();

  const userTasks = tasks.filter((t) => t.receiverId === currentUser?.id);
  const completedToday = userTasks.filter(
    (t) =>
      t.status === 'completed' &&
      new Date(t.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Task Sprint',
      description: 'Selesaikan 3 task hari ini',
      type: 'daily',
      reward: 150,
      deadline: 'Hari ini',
      progress: Math.min(completedToday, 3),
      total: 3,
      color: 'from-pink-500 to-rose-500',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'Team Player',
      description: 'Kolaborasi di 2 project',
      type: 'weekly',
      reward: 300,
      deadline: 'Minggu ini',
      progress: 0,
      total: 2,
      color: 'from-orange-500 to-amber-500',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: '3',
      title: 'Early Bird',
      description: 'Submit task sebelum deadline',
      type: 'daily',
      reward: 200,
      deadline: 'Hari ini',
      progress: 1,
      total: 1,
      color: 'from-blue-500 to-cyan-500',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: '4',
      title: 'Quality Master',
      description: 'Dapatkan 5 approval sempurna',
      type: 'weekly',
      reward: 500,
      deadline: 'Minggu ini',
      progress: 2,
      total: 5,
      color: 'from-purple-500 to-fuchsia-500',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  const handlePlayChallenge = (challenge: Challenge) => {
    toast.success(`Challenge "${challenge.title}" dimulai! 🎯`);
  };

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.min((progress / total) * 100, 100);
  };

  return (
    <Card className="border-2 border-[#FFC72C]/30 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#2E4B7C]/5 to-[#FFC72C]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#FFC72C] to-[#FFB700] rounded-xl shadow-md">
              <Target className="w-5 h-5 text-[#2E4B7C]" />
            </div>
            <div>
              <h3 className="font-bold text-[#2E4B7C]">Daily Challenges</h3>
              <p className="text-xs text-muted-foreground">Raih poin & naik ranking!</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {challenges.map((challenge) => {
            const progressPercentage = getProgressPercentage(
              challenge.progress,
              challenge.total
            );
            const isCompleted = challenge.progress >= challenge.total;

            return (
              <div
                key={challenge.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-[#FFC72C]/50 transition-all hover:shadow-md bg-white"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                <div className="relative p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${challenge.color} text-white shadow-md`}
                    >
                      {challenge.icon}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold bg-[#FFC72C]/20 text-[#2E4B7C]"
                    >
                      +{challenge.reward} PTS
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">
                        {challenge.progress}/{challenge.total}
                      </span>
                      <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${challenge.color} transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{challenge.deadline}</span>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-green-500 text-white text-xs">
                        ✓ Selesai
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handlePlayChallenge(challenge)}
                        className="h-6 px-2 text-xs bg-gradient-to-r from-[#2E4B7C] to-[#1e3555] hover:from-[#1e3555] hover:to-[#2E4B7C]"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Main
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
