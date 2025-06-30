'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClientById, getSessionsByMonth } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { User, Mail, Phone, MapPin, Crown, Calendar, Clock, TrendingUp, Activity, FileText } from 'lucide-react';

const getPlanColor = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'Standard Weekly':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'Single Session':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const getPlanIcon = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return <Crown className="h-4 w-4" />;
    case 'Standard Weekly':
      return <Calendar className="h-4 w-4" />;
    case 'Single Session':
      return <Clock className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const statusColorMap: Record<string, string> = {
  scheduled: 'bg-gray-300',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-yellow-400',
};
const statusLabelMap: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
};

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = Number(params.id);
  const [client, setClient] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview');

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      getClientById(clientId),
      getSessionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1)
    ])
      .then(([clientData, sessionsData]) => {
        setClient(clientData);
        setSessions(sessionsData.filter((s: any) => s.clientId === clientId));
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!client) return <div className="text-center py-10">Client not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar
          name={client.User?.name || 'No Name'}
          photoUrl={client.profile}
          size="w-20 h-20"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">{client.User?.name}</h2>
          <div className="text-gray-600 text-lg">{client.User?.email}</div>
        </div>
      </div>

      {/* Plan */}
      <div className="mb-8">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getPlanColor(client.plan)}`}>
            
          {getPlanIcon(client.plan)}
          {client.plan || 'No plan'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'sessions', label: 'Sessions', icon: Calendar },
          { id: 'progress', label: 'Progress', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <section className="border border-gray-100 bg-white rounded-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-violet-500" />
                Contact Information
              </h3>
              <div className="flex flex-col gap-2 text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="break-all">{client.User?.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="break-all">{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="break-all">{client.address}</span>
                  </div>
                )}
              </div>
            </section>
            {/* Main Info */}
            <section className="border border-gray-100 bg-white rounded-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Main Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div><span className="font-medium">Goal:</span> {client.goal || '—'}</div>
                <div><span className="font-medium">Type:</span> {client.type || '—'}</div>
                <div><span className="font-medium">Age:</span> {client.age || '—'}</div>
                <div><span className="font-medium">Height:</span> {client.height || '—'}</div>
                <div><span className="font-medium">Weight:</span> {client.weight || '—'}</div>
              </div>
            </section>
          </div>
        )}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-500" />
                Sessions
            </h3>
            {sessions.length === 0 ? (
              <div className="text-gray-500">No sessions found for this client.</div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <span className={`w-2 h-2 rounded-full ${statusColorMap[session.status || 'scheduled']}`}></span>
                      <span className="font-medium">{statusLabelMap[session.status || 'scheduled']}</span>
                      <span className="text-gray-500 text-sm">{session.date?.slice(0, 10)}</span>
                      {session.duration && <span className="text-gray-500 text-sm">{session.duration} min</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {session.WorkoutTemplate?.name && (
                        <span className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-medium">
                          {session.WorkoutTemplate.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-500" />
              Progress
            </h3>
            <div className="text-gray-500">Progress tracking coming soon.</div>
          </div>
        )}
      </div>
    </div>
  );
} 