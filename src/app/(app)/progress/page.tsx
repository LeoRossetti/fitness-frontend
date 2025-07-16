'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, User, Calendar, BarChart2, Target, Plus } from 'lucide-react';
import { WeightProgressChart } from './WeightProgressChart';
import { SessionAttendanceChart } from './SessionAttendanceChart';
import { GoalProgressCircle } from './GoalProgressCircle';
import { AddMeasurementModal } from './AddMeasurementModal';
import { MeasurementsTable } from './MeasurementsTable';
import { SessionsTable } from './SessionsTable';
import { getClients, getClientProgressMeasurements, getSessionsByMonth, getClientById, deleteProgressMeasurement } from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';



const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'measurements', label: 'Measurements' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'goals', label: 'Goals' },
];

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [clientsLoading, setClientsLoading] = useState(true);
  const [weightData, setWeightData] = useState<{ date: string; weight?: number; goal?: number }[]>([]);
  const [attendanceData, setAttendanceData] = useState<{ month: string; completed: number; canceled: number }[]>([]);
  const [goalPercent, setGoalPercent] = useState<number>(0);
  const [clientTargetWeight, setClientTargetWeight] = useState<number | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightChange, setWeightChange] = useState<number>(0);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [progressText, setProgressText] = useState<string>('');

  // Безопасное форматирование чисел
  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  // Восстанавливаем выбранного клиента из localStorage при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('progress-selected-client');
      if (saved) {
        setSelectedClientId(Number(saved));
      }
    }
  }, []);

  // Сохраняем выбранного клиента в localStorage
  useEffect(() => {
    if (selectedClientId && typeof window !== 'undefined') {
      localStorage.setItem('progress-selected-client', selectedClientId.toString());
    }
  }, [selectedClientId]);

  // Функция для создания профильного измерения
  const createProfileMeasurement = (client: any) => {
    if (!client?.weight) return null;
    
    return {
      id: 'profile',
      date: client.weightDate ? client.weightDate.split('T')[0] : new Date().toISOString().split('T')[0],
      weight: Number(client.weight),
      chest: null,
      waist: null,
      hips: null,
      biceps: null,
      notes: 'Initial weight from profile',
      isFromProfile: true
    };
  };

  // Функция для объединения профильного веса с реальными измерениями
  const combineProfileAndMeasurements = (profileMeasurement: any, realMeasurements: any[]) => {
    const allMeasurements = [...realMeasurements];
    
    if (profileMeasurement) {
      // Проверяем, нет ли уже измерения на эту дату
      const existingOnProfileDate = realMeasurements.find(m => m.date === profileMeasurement.date);
      if (!existingOnProfileDate) {
        allMeasurements.push(profileMeasurement);
      }
    }
    
    return allMeasurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };



  // Обновляем selectedClient из списка клиентов
  useEffect(() => {
    const client = clients.find(c => c.id === selectedClientId);
    setSelectedClient(client || null);
  }, [clients, selectedClientId]);

  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true);
      try {
        const data = await getClients();
        setClients(data || []);
        
        // Проверяем URL параметры для автоматического выбора клиента
        const clientParam = searchParams.get('client');
        const tabParam = searchParams.get('tab');
        const addParam = searchParams.get('add');
        
        if (clientParam) {
          const clientId = Number(clientParam);
          setSelectedClientId(clientId);
          
          if (tabParam) {
            setActiveTab(tabParam);
          }
          
          if (addParam === 'true') {
            setShowAddModal(true);
          }
        }
      } finally {
        setClientsLoading(false);
      }
    };
    fetchClients();
  }, [searchParams]);

  // Загружаем данные при изменении клиента
  useEffect(() => {
    if (!selectedClientId || !selectedClient) {
      setWeightData([]);
      setAttendanceData([]);
      setGoalPercent(0);
      setClientTargetWeight(null);
      setMeasurements([]);
      setSessions([]);
      return;
    }

    const loadData = async () => {
      try {
        console.log('🔄 Loading data for client:', selectedClientId);
        
        // 1. Создаём профильное измерение из карточки клиента
        const profileMeasurement = createProfileMeasurement(selectedClient);
        console.log('👤 Profile measurement:', profileMeasurement);
        
        // 2. Загружаем реальные измерения из БД
        const res = await getClientProgressMeasurements(selectedClientId);
        console.log('📊 Raw measurements response:', res);
        
        const realMeasurements = res.measurements || [];
        console.log('📊 Real measurements:', realMeasurements);
        
        // 3. Объединяем профильный вес с реальными измерениями
        const allMeasurements = combineProfileAndMeasurements(profileMeasurement, realMeasurements);
        console.log('📊 All measurements:', allMeasurements);
        setMeasurements(allMeasurements);
        
        // 4. Создаём данные для графика веса
        const weightDataForChart = allMeasurements
          .filter(m => m.weight)
          .map(m => ({ 
            date: m.date, 
            weight: Number(m.weight),
            isFromProfile: m.isFromProfile || false
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        console.log('📊 Weight data for chart:', weightDataForChart);
        setWeightData(weightDataForChart);

        // 5. Загружаем сессии для посещаемости
        const sessions = await getSessionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1);
        const clientSessions = sessions.filter(s => s.clientId === selectedClientId);
        setSessions(clientSessions);
        
        const byMonth: Record<string, { completed: number; canceled: number; scheduled: number }> = {};
        clientSessions.forEach(s => {
          const month = s.date.slice(0, 7);
          if (!byMonth[month]) byMonth[month] = { completed: 0, canceled: 0, scheduled: 0 };
          if (s.status === 'completed') byMonth[month].completed++;
          else if (s.status === 'cancelled' || s.status === 'no_show') byMonth[month].canceled++;
          else if (s.status === 'scheduled') byMonth[month].scheduled++;
        });
        
        setAttendanceData(Object.entries(byMonth).map(([month, v]) => ({ month, ...v })));

        // 6. Загружаем целевой вес клиента
        const client = await getClientById(selectedClientId);
        setClientTargetWeight(client.targetWeight || null);
        
      } catch (error) {
        console.error('Error loading progress data:', error);
        toast.error('Failed to load progress data');
      }
    };

    loadData();
  }, [selectedClientId, selectedClient]);

  // Пересчитываем прогресс к цели
  useEffect(() => {
    if (weightData.length > 0 && clientTargetWeight) {
      const firstWeight = weightData[0].weight;
      const lastWeight = weightData[weightData.length - 1].weight;
      
      setCurrentWeight(lastWeight || null);
      setWeightChange(firstWeight && lastWeight ? lastWeight - firstWeight : 0);
      
      if (firstWeight && lastWeight) {
        const startDistance = Math.abs(firstWeight - clientTargetWeight);
        const endDistance = Math.abs(lastWeight - clientTargetWeight);
        
        let progress = 0;
        if (startDistance === 0) {
          progress = 100;
        } else {
          progress = Math.max(0, Math.min(100, ((startDistance - endDistance) / startDistance) * 100));
        }
        
        // Если цель достигнута или перевыполнена
        if (endDistance === 0 || 
            (firstWeight > clientTargetWeight && lastWeight <= clientTargetWeight) || 
            (firstWeight < clientTargetWeight && lastWeight >= clientTargetWeight)) {
          progress = 100;
        }
        
        setGoalPercent(progress);
        setProgressText(`Period change: ${firstWeight} kg → ${lastWeight} kg (${(lastWeight - firstWeight).toFixed(1)} kg), goal progress: ${progress.toFixed(0)}%`);
      } else {
        setGoalPercent(0);
        setProgressText('Insufficient data to calculate progress for the period');
      }
    } else {
      setGoalPercent(0);
      setCurrentWeight(null);
      setWeightChange(0);
      setProgressText('No data for the selected period');
    }
  }, [weightData, clientTargetWeight]);

  const handleMeasurementAdded = () => {
    console.log('🔄 Measurement added, reloading data...');
    // Перезагружаем данные с учётом профильного веса
    if (selectedClientId && selectedClient) {
      getClientProgressMeasurements(selectedClientId).then(res => {
        console.log('📊 Reloaded measurements:', res);
        
        // Создаём профильное измерение
        const profileMeasurement = createProfileMeasurement(selectedClient);
        const realMeasurements = res.measurements || [];
        
        // Объединяем все измерения
        const allMeasurements = combineProfileAndMeasurements(profileMeasurement, realMeasurements);
        setMeasurements(allMeasurements);
        
        // Создаём данные для графика веса
        const weightDataForChart = allMeasurements
          .filter(m => m.weight)
          .map(m => ({ 
            date: m.date, 
            weight: Number(m.weight),
            isFromProfile: m.isFromProfile || false
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        console.log('📊 Updated weight data:', weightDataForChart);
        setWeightData(weightDataForChart);
      }).catch(error => {
        console.error('❌ Error reloading measurements:', error);
      });
    }
  };

  const handleMeasurementDeleted = async (id: number) => {
    if (!confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    try {
      await deleteProgressMeasurement(id);
      toast.success('Measurement deleted successfully!');
      handleMeasurementAdded(); // Перезагружаем данные
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error('Failed to delete measurement');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-500 text-base mt-1">Monitor your clients' fitness journey</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Client select */}
          <div className="w-full sm:min-w-[180px]">
            <Select
              value={selectedClientId || ''}
              onChange={e => setSelectedClientId(e.target.value ? Number(e.target.value) : null)}
              disabled={clientsLoading}
            >
              <option value="">Select client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.User?.name || 'No Name'}
                </option>
              ))}
            </Select>
          </div>

          {/* Add Measurement Button */}
          {selectedClientId && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Measurement
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600 bg-violet-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.id === 'overview' && <TrendingUp className="h-4 w-4" />}
            {tab.id === 'measurements' && <User className="h-4 w-4" />}
            {tab.id === 'attendance' && <BarChart2 className="h-4 w-4" />}
            {tab.id === 'goals' && <Target className="h-4 w-4" />}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">
              {tab.id === 'overview' ? 'Overview' : tab.id === 'measurements' ? 'Meas' : tab.id === 'attendance' ? 'Attend' : 'Goals'}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <WeightProgressChart data={weightData.map(d => ({ 
              ...d, 
              goal: clientTargetWeight !== null ? clientTargetWeight : undefined
            }))} />
            <SessionAttendanceChart data={attendanceData} />
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GoalProgressCircle 
              percent={goalPercent} 
              label="Weight" 
              currentValue={currentWeight || undefined}
              targetValue={clientTargetWeight !== null ? clientTargetWeight : undefined}
              change={weightChange}
              unit="kg"
            />
            {/* Можно добавить другие цели, если появятся данные */}
          </div>
        )}
        {activeTab === 'measurements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-violet-500" />
                Measurement History
              </h3>
              {selectedClientId && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Measurement
                </Button>
              )}
            </div>
            <MeasurementsTable
              measurements={measurements}
              onDelete={handleMeasurementDeleted}
            />
          </div>
        )}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                Training Sessions
              </h3>
            </div>
            <SessionsTable sessions={sessions} />
          </div>
        )}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {selectedClient && clientTargetWeight !== undefined ? (
              <>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-500" />
                    Weight Goal Progress
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(currentWeight)}</div>
                      <div className="text-sm text-gray-500">Current Weight (kg)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600">{formatNumber(clientTargetWeight !== null ? clientTargetWeight : undefined)}</div>
                      <div className="text-sm text-gray-500">Target Weight (kg)</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${weightChange > 0 ? 'text-green-600' : weightChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {weightChange > 0 ? '+' : ''}{formatNumber(weightChange)}
                      </div>
                      <div className="text-sm text-gray-500">Total Change (kg)</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress to goal</span>
                      <span>{Math.round(goalPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-violet-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${goalPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">{progressText}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GoalProgressCircle 
                    percent={goalPercent} 
                    label="Weight" 
                    currentValue={currentWeight || undefined}
                    targetValue={clientTargetWeight !== null ? clientTargetWeight : undefined}
                    change={weightChange}
                    unit="kg"
                  />
                  {/* Здесь можно добавить другие цели в будущем */}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Set</h3>
                <p className="text-gray-500">
                  {selectedClient 
                    ? "This client doesn't have a target weight set. Set a target weight in the client profile to track progress."
                    : "Select a client to view their goal progress."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Measurement Modal */}
      {selectedClient && (
        <AddMeasurementModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          clientId={selectedClientId!}
          clientName={selectedClient.User?.name || 'Unknown Client'}
          onMeasurementAdded={handleMeasurementAdded}
        />
      )}
      
    </div>
  );
} 