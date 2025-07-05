'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Users, Calendar, Target, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client, ProgressStats } from '@/types/types';
import { getClients, getClientProgressStats } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ProgressPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<Record<number, ProgressStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientsAndStats();
  }, []);

  const loadClientsAndStats = async () => {
    try {
      setLoading(true);
      const clientsData = await getClients();
      setClients(clientsData);

      // Загружаем статистику для каждого клиента
      const statsPromises = clientsData.map(async (client: Client) => {
        try {
          const stats = await getClientProgressStats(client.id);
          return { clientId: client.id, stats };
        } catch (error) {
          console.error(`Failed to load stats for client ${client.id}:`, error);
          return { clientId: client.id, stats: null };
        }
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap: Record<number, ProgressStats> = {};
      
      statsResults.forEach(({ clientId, stats }) => {
        if (stats) {
          statsMap[clientId] = stats;
        }
      });

      setClientStats(statsMap);
    } catch (error) {
      console.error('Failed to load clients:', error);
      toast.error('Failed to load clients data');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (attendanceRate: number) => {
    if (attendanceRate >= 80) return 'text-green-600';
    if (attendanceRate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWeightChangeColor = (change?: number) => {
    if (!change) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
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
            <h1 className="text-3xl font-bold text-[#1F2A44]">Progress Overview</h1>
            <p className="text-sm text-[#6B7280] mt-1">Track progress across all clients</p>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-500 mb-6">
              Add clients to start tracking their progress
            </p>
            <Button
              onClick={() => router.push('/clients')}
              variant="success"
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Add Clients
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => {
              const stats = clientStats[client.id];
              
              return (
                <div
                  key={client.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/clients/${client.id}/progress`)}
                >
                  {/* Заголовок клиента */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {client.User?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.User?.name || 'Unknown Client'}</h3>
                      <p className="text-sm text-gray-500">{client.plan || 'No plan'}</p>
                    </div>
                  </div>

                  {/* Статистика */}
                  {stats ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{stats.totalSessions}</div>
                          <div className="text-xs text-gray-500">Total Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getProgressColor(stats.attendanceRate)}`}>
                            {stats.attendanceRate}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{stats.completedSessions}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getWeightChangeColor(stats.weightChange)}`}>
                            {stats.weightChange ? (stats.weightChange > 0 ? '+' : '') + stats.weightChange.toFixed(1) : '—'}
                          </div>
                          <div className="text-xs text-gray-500">Weight Δ (kg)</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No progress data available</p>
                    </div>
                  )}

                  {/* Кнопка просмотра деталей */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/clients/${client.id}/progress`);
                      }}
                    >
                      View Progress
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 