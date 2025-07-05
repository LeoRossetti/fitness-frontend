'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, TrendingUp, Calendar, Target, Scale, Dumbbell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress, ProgressStats } from '@/types/types';
import { getClientProgress, getClientProgressStats, createProgress } from '@/lib/api';
import ProgressChart from '@/components/progress/ProgressChart';
import AddProgressModal from '@/components/progress/AddProgressModal';
import { toast } from 'react-hot-toast';

export default function ClientProgressPage() {
  const params = useParams();
  const clientId = Number(params.id);
  
  const [progress, setProgress] = useState<Progress[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadProgress();
    }
  }, [clientId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const [progressData, statsData] = await Promise.all([
        getClientProgress(clientId),
        getClientProgressStats(clientId)
      ]);
      setProgress(progressData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgress = async (data: any) => {
    setIsCreating(true);
    try {
      await createProgress(data);
      toast.success('Progress entry added successfully');
      setIsAddModalOpen(false);
      loadProgress(); // Перезагружаем данные
    } catch (error) {
      console.error('Failed to create progress:', error);
      toast.error('Failed to add progress entry');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44]">Client Progress</h1>
            <p className="text-sm text-[#6B7280] mt-1">Track and analyze client progress</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
            variant="success"
          >
            <Plus className="h-5 w-5" />
            Add Progress Entry
          </Button>
        </div>

        {/* Статистика посещаемости */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.completedSessions}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</div>
                  <div className="text-sm text-gray-500">Attendance Rate</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Scale className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.weightChange ? (stats.weightChange > 0 ? '+' : '') + stats.weightChange.toFixed(1) : '—'}
                  </div>
                  <div className="text-sm text-gray-500">Weight Change (kg)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Графики прогресса */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Вес */}
          <ProgressChart
            data={progress}
            type="weight"
            category="weight"
            title="Weight Progress"
          />

          {/* Измерения тела */}
          <ProgressChart
            data={progress}
            type="measurements"
            category="waist"
            title="Body Measurements"
          />

          {/* Силовые показатели */}
          <ProgressChart
            data={progress}
            type="strength"
            category="bench_press"
            title="Strength Progress"
          />

          {/* Кардио */}
          <ProgressChart
            data={progress}
            type="cardio"
            category="running_5k"
            title="Cardio Performance"
          />
        </div>

        {/* Дополнительные графики */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <ProgressChart
            data={progress}
            type="body_composition"
            category="body_fat_percentage"
            title="Body Fat Percentage"
          />
          
          <ProgressChart
            data={progress}
            type="measurements"
            category="hips"
            title="Hip Measurements"
          />
          
          <ProgressChart
            data={progress}
            type="measurements"
            category="biceps"
            title="Bicep Measurements"
          />
        </div>
      </div>

      {/* Модалка добавления прогресса */}
      <AddProgressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        clientId={clientId}
        onProgressAdded={loadProgress}
      />
    </div>
  );
} 