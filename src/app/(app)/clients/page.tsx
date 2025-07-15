"use client";

import { useEffect, useState } from 'react';
import ClientCard from './ClientCard';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import { Client } from '@/types/types';
import { getClients, deleteClient } from '@/lib/api';
import { Search, Users, Calendar, Dumbbell, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Subscription' | 'Single Session'>('All');

  const [editingClientId, setEditingClientId] = useState<number | null>(null);

  // Состояние для подтверждения удаления клиента
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    clientId: number | null;
    clientName: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    clientId: null,
    clientName: '',
    isLoading: false
  });

  const router = useRouter();

  const fetchClients = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error: unknown) {
      console.error('Failed to fetch clients:', error);
      
      let errorMessage = 'Failed to load clients. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorMessage = 'Server error. The backend service might be temporarily unavailable. Please try again later.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Please log in to access this page';
          toast.error(errorMessage);
          window.location.href = '/';
          return;
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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

  const handleDeleteClient = (clientId: number, clientName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      clientId,
      clientName,
      isLoading: false
    });
  };

  const confirmDeleteClient = async () => {
    if (!deleteConfirmation.clientId) return;

    setDeleteConfirmation(prev => ({ ...prev, isLoading: true }));

    try {
      // Сначала пробуем удалить клиента напрямую
      try {
        await deleteClient(deleteConfirmation.clientId);
        setClients(prev => prev.filter(client => client.id !== deleteConfirmation.clientId));
        setFilteredClients(prev => prev.filter(client => client.id !== deleteConfirmation.clientId));
        toast.success('Client has been deleted');
        setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
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
        setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
        return;
      }

      const allSessions = await response.json();
      
      // Фильтруем сессии только для этого клиента
      const clientSessions = allSessions.filter((session: any) => session.Client?.id === deleteConfirmation.clientId);
      
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
          setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
          return;
        }
      }

      // После успешного удаления всех сессий пробуем снова удалить клиента
      await deleteClient(deleteConfirmation.clientId);
      setClients(prev => prev.filter(client => client.id !== deleteConfirmation.clientId));
      setFilteredClients(prev => prev.filter(client => client.id !== deleteConfirmation.clientId));
      toast.success('Client and all their sessions have been deleted');
      setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Failed to delete client');
      setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
    }
  };

  const cancelDeleteClient = () => {
    setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '', isLoading: false });
  };

  const handleEdit = (clientId: number) => {
    setEditingClientId(clientId);
  };

  const handleProgress = (clientId: number) => {
    router.push(`/clients/${clientId}/progress`);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A44] mb-1">Clients</h1>
            <p className="text-sm text-[#6B7280]">Manage your client list and details</p>
          </div>
          <Button
            type="button"
            className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
            variant="success"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </Button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col gap-3 mb-6">
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

          <div className="flex flex-wrap gap-2">
            {(['All', 'Subscription', 'Single Session'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                  filter === type
                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                    : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
                }`}
              >
                {type === 'All' && <Users className="h-4 w-4 sm:h-5 sm:w-5" />}
                {type === 'Subscription' && <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
                {type === 'Single Session' && <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5" />}
                <span className="hidden sm:inline">{type}</span>
                <span className="sm:hidden">
                  {type === 'All' ? 'All' : type === 'Subscription' ? 'Sub' : 'Single'}
                </span>
              </button>
            ))}
            <button
              onClick={handleResetFilters}
              className="p-2 bg-gray-200 text-[#1F2A44] rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Отображение ошибки */}
        {error && (
          <div className="text-center py-6">
            <div className="text-red-600 mb-4">{error}</div>
            <Button 
              onClick={fetchClients}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {!error && filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filter !== 'All' ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filter !== 'All' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first client'
                }
              </p>
              {!searchQuery && filter === 'All' && (
                <Button
                  onClick={() => setIsOpen(true)}
                  variant="success"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Client
                </Button>
              )}
            </div>
          ) : (
            !error && filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
                onEdit={() => handleEdit(client.id)}
                onProgress={() => handleProgress(client.id)}
                onClick={() => router.push(`/clients/${client.id}`)}
              />
            ))
          )}
        </div>

        {/* Модальные окна */}
        <AddClientModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onClientAdded={handleAddClient}
        />

        {editingClientId && (
          <EditClientModal
            clientId={editingClientId}
            onClose={() => setEditingClientId(null)}
            onUpdated={() => {
              setEditingClientId(null);
              setRefreshTrigger(prev => prev + 1);
            }}
          />
        )}

        {/* Модалка подтверждения удаления клиента */}
        <Modal
          isOpen={deleteConfirmation.isOpen}
          onClose={cancelDeleteClient}
          title="Delete Client"
        >
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{deleteConfirmation.clientName}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action will permanently delete the client and all associated sessions. This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                onClick={cancelDeleteClient}
                variant="outline"
                disabled={deleteConfirmation.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteClient}
                variant="danger"
                disabled={deleteConfirmation.isLoading}
                className="flex items-center gap-2"
              >
                {deleteConfirmation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Client'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}