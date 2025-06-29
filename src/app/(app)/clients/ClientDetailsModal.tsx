"use client";

import { useState, useEffect } from 'react';
import { Client, Session } from '@/types/types';
import { getClientById, getSessionsByMonth } from '@/lib/api';
import { X, User, Mail, Phone, MapPin, Target, Calendar, Clock, Crown, TrendingUp, Activity, FileText, Edit, Ruler, Scale, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onEdit: (clientId: number) => void;
}

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

const getInitials = (name: string | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return 'Invalid date format';
  }
};

const formatSessionDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return 'Invalid date format';
  }
};

export default function ClientDetailsModal({ isOpen, onClose, clientId, onEdit }: ClientDetailsModalProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview');

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientData();
    }
  }, [isOpen, clientId]);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const [clientData, sessionsData] = await Promise.all([
        getClientById(clientId),
        getSessionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1)
      ]);
      
      setClient(clientData);
      // Фильтруем сессии только для этого клиента
      const clientSessions = sessionsData.filter(session => session.clientId === clientId);
      setSessions(clientSessions);
    } catch (error) {
      console.error('Failed to fetch client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit(clientId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="custom">
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          </div>
        ) : client ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                  {getInitials(client.User?.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{client.User?.name}</h2>
                  <p className="text-gray-600">{client.User?.email}</p>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getPlanColor(client.plan)}`}>
                {getPlanIcon(client.plan)}
                {client.plan}
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

                  {/* Goals and Notes */}
                  <section className="border border-gray-100 bg-white rounded-xl p-6">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-orange-500" />
                      Goals and Notes
                    </h3>
                    {client.goal && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-500 mb-1">Goal</p>
                        <p className="text-gray-700 break-words">{client.goal}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                        <p className="text-gray-700 break-words">{client.notes}</p>
                      </div>
                    )}
                  </section>

                  {/* Physical Parameters */}
                  {(client.age || client.height || client.weight) && (
                    <section className="border border-gray-100 bg-white rounded-xl p-6 md:col-span-2">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        Physical Parameters
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {client.age && (
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-indigo-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Age</p>
                              <p className="text-sm font-semibold text-gray-900">{client.age} years</p>
                            </div>
                          </div>
                        )}
                        {client.height && (
                          <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Height</p>
                              <p className="text-sm font-semibold text-gray-900">{client.height} cm</p>
                            </div>
                          </div>
                        )}
                        {client.weight && (
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Weight</p>
                              <p className="text-sm font-semibold text-gray-900">{client.weight} kg</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Statistics */}
                  <section className="border border-gray-100 bg-white rounded-xl p-6 md:col-span-2">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Statistics
                    </h3>
                    <div className="flex flex-row justify-between items-center gap-6">
                      <div className="flex flex-col items-center flex-1 min-w-[120px]">
                        <span className="text-xs text-gray-500 mb-1">Client Type</span>
                        <span className="font-semibold text-base text-gray-900 text-center break-words">{client.type}</span>
                      </div>
                      <div className="flex flex-col items-center flex-1 min-w-[140px]">
                        <span className="text-xs text-gray-500 mb-1">Next Session</span>
                        <span className="font-semibold text-base text-gray-900 text-center break-words whitespace-pre-line">
                          {client.nextSession ? formatDate(client.nextSession) : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center flex-1 min-w-[100px]">
                        <span className="text-xs text-gray-500 mb-1">Sessions this month</span>
                        <span className="font-semibold text-2xl text-violet-600">{sessions.length}</span>
                      </div>
                    </div>
                  </section>

                  {/* Recent Sessions */}
                  <section className="border border-gray-100 bg-white rounded-xl p-6 md:col-span-2">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Recent Sessions
                    </h3>
                    {sessions.length > 0 ? (
                      <div className="flex flex-row flex-wrap gap-2">
                        {sessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="flex flex-col items-center justify-center px-3 py-2 bg-gray-50 rounded text-sm">
                            <p className="font-medium break-words">{session.type}</p>
                            <p className="text-xs text-gray-500 break-words">{formatSessionDate(session.date)}</p>
                            <span className="text-xs text-gray-500 break-words">{session.time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No scheduled sessions</p>
                    )}
                  </section>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Session History</h3>
                    <span className="text-sm text-gray-500">Total: {sessions.length}</span>
                  </div>
                  {sessions.length > 0 ? (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{session.type}</h4>
                            <span className="text-sm text-gray-500">{formatDate(session.date)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Time: {session.time}</span>
                            {session.note && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Notes Exist
                              </span>
                            )}
                          </div>
                          {session.note && (
                            <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {session.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions</h3>
                      <p className="text-gray-500">This client has no scheduled or completed sessions yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'progress' && (
                <div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Client Progress
                    </h3>
                    <div className="flex flex-row flex-wrap justify-between items-center gap-6 mb-6">
                      <div className="flex flex-col items-center flex-1 min-w-[120px]">
                        <span className="text-xs text-gray-500 mb-1">Sessions this month</span>
                        <span className="font-semibold text-2xl text-violet-600">{sessions.length}</span>
                      </div>
                      <div className="flex flex-col items-center flex-1 min-w-[140px]">
                        <span className="text-xs text-gray-500 mb-1">Plan Type</span>
                        <span className="font-semibold text-base text-gray-900 text-center break-words">{client.plan}</span>
                      </div>
                      <div className="flex flex-col items-center flex-1 min-w-[100px]">
                        <span className="text-xs text-gray-500 mb-1">Status</span>
                        <span className="font-semibold text-base text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Client Goal</p>
                      <p className="text-gray-900">{client.goal || 'Goal not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Trainer Notes</p>
                      <p className="text-gray-900">{client.notes || 'Trainer notes not available'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Client Not Found</h3>
            <p className="text-gray-500">Failed to load client information</p>
          </div>
        )}
      </div>
    </Modal>
  );
} 