"use client";

import { useEffect, useState } from 'react';
import ClientCard from '@/components/ClientCard';
import ClientForm from '@/components/ClientForm';
import Modal from '@/components/Modal';
import { Client } from '@/types/types';
import { getClients, deleteClient } from '@/utils/api/api';
import { Search, Users, Calendar, Dumbbell, Plus, Filter } from 'lucide-react';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  // Состояние для хранения отфильтрованного списка клиентов
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Состояние для хранения поискового запроса
  const [searchQuery, setSearchQuery] = useState('');
  // Состояние для хранения текущего фильтра ("All", "Subscription", "Single Session")
  const [filter, setFilter] = useState<'All' | 'Subscription' | 'Single Session'>('All');

  const fetchClients = async () => {
    try {
      const data = await getClients();
      console.log('Fetched clients:', data);
      setClients(data);
      // Изначально отображаем всех клиентов
      setFilteredClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  // Функция для применения фильтров и поиска
  const applyFilters = (query: string, filterType: 'All' | 'Subscription' | 'Single Session') => {
    // Начинаем с полного списка клиентов
    let result = clients;

    // Если есть поисковый запрос, фильтруем клиентов по имени и email
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((client: Client) =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery)
      );
    }

    // Фильтрация по plan
    if (filterType !== 'All') {
      if (filterType === 'Subscription') {
        // Показываем клиентов с plan: "Premium Monthly" или "Standard Weekly"
        result = result.filter((client: Client) =>
          client.plan === 'Premium Monthly' || client.plan === 'Standard Weekly'
        );
      } else if (filterType === 'Single Session') {
        // Показываем клиентов с plan: "Single Session"
        result = result.filter((client: Client) => client.plan === 'Single Session');
      }
    }

    // Обновляем отфильтрованный список клиентов
    setFilteredClients(result);
  };

  // Обработчик изменения текста в поле поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Применяем фильтры с новым поисковым запросом
    applyFilters(query, filter);
  };

  // Обработчик нажатия на кнопки фильтрации (All, Subscription, Single Session)
  const handleFilterChange = (filterType: 'All' | 'Subscription' | 'Single Session') => {
    setFilter(filterType);
    // Применяем фильтры с новым типом
    applyFilters(searchQuery, filterType);
  };

  // Обработчик сброса фильтров и поиска
  const handleResetFilters = () => {
    setSearchQuery(''); // Очищаем поле поиска
    setFilter('All'); // Сбрасываем фильтр на "All"
    applyFilters('', 'All'); // Применяем сброс фильтров
  };

  const handleAddClient = (newClient: Client) => {
    console.log('Adding new client:', newClient);
    setClients((prev) => {
      if (prev.some(client => client.id === newClient.id)) {
        console.log('Client already exists in list, skipping duplicate');
        return prev;
      }
      return [...prev, newClient];
    });
    setIsOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
      setFilteredClients(filteredClients.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Error deleting client');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44] mb-2">Clients</h1>
            <p className="text-sm text-[#6B7280]">Manage your client list and details</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#059669] transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </button>
        </div>
        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Поле поиска */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          </div>

          {/* Кнопки фильтрации */}
          <div className="flex gap-2">

            {/* Кнопка "All" */}
            <button
              onClick={() => handleFilterChange('All')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                filter === 'All'
                  ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                  : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              All
            </button>
            
            {/* Кнопка "Subscription" */}
            <button
              onClick={() => handleFilterChange('Subscription')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                filter === 'Subscription'
                  ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                  : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Subscription
            </button>

            {/* Кнопка "Single Session" (ранее "One-time") */}
            <button
              onClick={() => handleFilterChange('Single Session')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                filter === 'Single Session'
                  ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                  : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
              }`}
            >
              <Dumbbell className="h-5 w-5" />
              Single Session
            </button>

            {/* Кнопка сброса фильтров */}
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
            />
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ClientForm onSubmit={handleAddClient} />
      </Modal>
    </main>
  );
}