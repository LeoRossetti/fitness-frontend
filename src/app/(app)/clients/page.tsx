"use client";

import { useEffect, useState } from 'react';
import ClientCard from '@/components/ClientCard';
import AddClientModal from '@/components/AddClientModal';
import EditClientModal from '@/components/EditClientModal';
import { Client } from '@/types/types';
import { getClients, deleteClient } from '@/utils/api/api';
import { Search, Users, Calendar, Dumbbell, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Subscription' | 'Single Session'>('All');

  const [editingClientId, setEditingClientId] = useState<number | null>(null);

  const router = useRouter();

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const applyFilters = (query: string, filterType: typeof filter) => {
    let result = clients;
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(client =>
        
        client.User?.name?.toLowerCase().includes(lowerQuery) ||
        client.User?.email?.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterType !== 'All') {
      result = result.filter(client =>
        filterType === 'Subscription'
          ? client.plan === 'Premium Monthly' || client.plan === 'Standard Weekly'
          : client.plan === 'Single Session'
      );
    }

    setFilteredClients(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, filter);
  };

  const handleFilterChange = (filterType: typeof filter) => {
    setFilter(filterType);
    applyFilters(searchQuery, filterType);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilter('All');
    applyFilters('', 'All');
  };

  const handleAddClient = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      // Сначала пробуем удалить клиента напрямую
      try {
        await deleteClient(id);
        setClients(prev => prev.filter(client => client.id !== id));
        setFilteredClients(prev => prev.filter(client => client.id !== id));
        toast.success('Client has been deleted');
        return;
      } catch (deleteError) {
        console.log('Direct client deletion failed, trying to delete sessions first');
      }

      // Если не получилось удалить клиента, пробуем найти сессии через календарь
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      
      // Получаем сессии за текущий месяц
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions?month=${year}-${String(month).padStart(2, '0')}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to fetch sessions:', response.status, response.statusText);
        toast.error('Failed to delete client');
        return;
      }

      const allSessions = await response.json();
      
      // Фильтруем сессии только для этого клиента
      const clientSessions = allSessions.filter((session: any) => session.Client?.id === id);
      
      if (clientSessions.length > 0) {
        // Удаляем каждую сессию клиента
        const deletePromises = clientSessions.map((session: any) => 
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${session.id}`, {
            method: 'DELETE',
            credentials: 'include',
          })
        );

        // Ждем удаления всех сессий
        const deleteResults = await Promise.allSettled(deletePromises);
        
        // Проверяем, были ли ошибки при удалении сессий
        const failedDeletes = deleteResults.filter(result => result.status === 'rejected');
        if (failedDeletes.length > 0) {
          console.error('Some sessions failed to delete:', failedDeletes);
          toast.error('Failed to delete some sessions');
          return;
        }
      }

      // После успешного удаления всех сессий пробуем снова удалить клиента
      await deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
      setFilteredClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client and all their sessions have been deleted');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (clientId: number) => {
    router.push(`/clients/${clientId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44] mb-2">Clients</h1>
            <p className="text-sm text-[#6B7280]">Manage your client list and details</p>
          </div>
          <Button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
            variant="success"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </Button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          </div>

          <div className="flex gap-2">
            {(['All', 'Subscription', 'Single Session'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  filter === type
                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                    : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
                }`}
              >
                {type === 'All' && <Users className="h-5 w-5" />}
                {type === 'Subscription' && <Calendar className="h-5 w-5" />}
                {type === 'Single Session' && <Dumbbell className="h-5 w-5" />}
                {type}
              </button>
            ))}
            <button
              onClick={handleResetFilters}
              className="p-2 bg-gray-200 text-[#1F2A44] rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={() => handleDeleteClient(client.id)}
              onEdit={() => handleEdit(client.id)}
            />
          ))}
        </div>
      </div>

      {/* Добавление клиента */}
      <AddClientModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onClientAdded={handleAddClient}
      />

      {/* Модалка редактирования клиента */}
      {editingClientId !== null && (
        <EditClientModal
          clientId={editingClientId}
          onClose={() => setEditingClientId(null)}
          onUpdated={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </main>
  );
}
