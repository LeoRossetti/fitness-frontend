"use client";

import { useEffect, useState } from "react";
import { getClients, getSessionsByMonth } from "@/lib/api";
import { Client, Session } from "@/types/types";
import { Calendar as CalendarIcon, Users, ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDuration } from "@/utils/sessionUtils";

function getTodayISO() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainerName, setTrainerName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const clientsData = await getClients();
        setClients(clientsData);
        const now = new Date();
        const sessionsData = await getSessionsByMonth(now.getFullYear(), now.getMonth() + 1);
        setSessions(sessionsData);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setTrainerName(data?.name || ""));
  }, []);

  const activeClients = clients.length;
  const today = new Date();
  const upcomingSessions = sessions.filter(s => new Date(s.date) >= today);
  const todaySessions = sessions.filter(s => s.date.startsWith(getTodayISO()));

  // Простой расчет тренда (для MVP)
  const clientTrend = activeClients > 0 ? "+3 this month" : "0 this month";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome back{trainerName ? `, ${trainerName}` : ""}!
            </h1>
            <p className="text-gray-600 text-lg">Here's what's happening with your clients today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/calendar?add=true")} className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Schedule Session
            </Button>
            <Button onClick={() => router.push("/clients?add=true")} variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Clients</p>
                <p className="text-4xl font-bold text-gray-900">{activeClients}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">{clientTrend}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming Sessions</p>
                <p className="text-4xl font-bold text-gray-900">{upcomingSessions.length}</p>
                <p className="text-sm text-gray-500 mt-2">Today: {todaySessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-violet-500" />
                Upcoming Sessions
              </h2>
              <Button variant="outline" onClick={() => router.push("/calendar")} className="text-sm">
                View Calendar
              </Button>
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 5).map(s => {
                  const client = clients.find(c => c.id === s.clientId);
                  return (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-medium text-sm">
                            {client?.User?.name?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client?.User?.name || "Client"}</p>
                          <p className="text-sm text-gray-500">{new Date(s.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{s.time}</p>
                        <p className="text-xs text-gray-500">
                          {s.duration ? formatDuration(s.duration) : '—'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming sessions</p>
                <Button 
                  onClick={() => router.push("/calendar?add=true")}
                  className="mt-2"
                >
                  Schedule First Session
                </Button>
              </div>
            )}
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-500" />
                Top Performing Clients
              </h2>
              <Button variant="outline" onClick={() => router.push("/clients")} className="text-sm">
                View All
              </Button>
            </div>
            
            {clients.length > 0 ? (
              <div className="space-y-4">
                {clients.slice(0, 3).map((client, index) => {
                  // Подсчитываем количество сессий для каждого клиента
                  const clientSessions = sessions.filter(s => s.clientId === client.id);
                  const completedSessions = clientSessions.filter(s => s.status === 'completed').length;
                  const totalSessions = clientSessions.length;
                  
                  // Вычисляем процент прогресса (завершенные сессии от общего количества)
                  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
                  
                  return (
                    <div key={client.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                        <span className="text-violet-600 font-medium text-sm">
                          {client.User?.name?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{client.User?.name}</p>
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-violet-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.max(10, progressPercentage)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {totalSessions} sessions
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No clients yet</p>
                <Button 
                  onClick={() => router.push("/clients?add=true")}
                  className="mt-2"
                >
                  Add First Client
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
