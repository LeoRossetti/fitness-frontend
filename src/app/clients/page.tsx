"use client";

import { useEffect, useState } from 'react';
import ClientCard from '@/components/ClientCard';
import ClientForm from '@/components/ClientForm';
import Modal from '@/components/Modal';
import { Client } from '@/types/types';
import { getClients, deleteClient } from '@/utils/api';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Добавляем триггер для обновления списка

  const fetchClients = async () => {
    try {
      const data = await getClients();
      console.log('Fetched clients:', data);
      setClients(data);
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
  }, [refreshTrigger]); // Зависимость от refreshTrigger

  const handleAddClient = (newClient: Client) => {
    console.log('Adding new client:', newClient);
    // Обновляем список клиентов без добавления дубликата
    setClients((prev) => {
      // Проверяем, нет ли уже клиента с таким id
      if (prev.some(client => client.id === newClient.id)) {
        console.log('Client already exists in list, skipping duplicate');
        return prev;
      }
      return [...prev, newClient];
    });
    setIsOpen(false);
    // Триггерим обновление списка клиентов
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Error deleting client');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Clients</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage your client list and details</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
              <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button className="bg-[#8B5CF6] text-white px-4 py-1 rounded-lg">ALL</button>
            <button className="border border-gray-300 text-gray-600 px-4 py-1 rounded-lg">Subscription</button>
            <button className="border border-gray-300 text-gray-600 px-4 py-1 rounded-lg">
              <span className="inline-block align-middle mr-1">%</span> One-time
            </button>
            <button className="border border-gray-300 text-gray-600 px-2 py-1 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 8h18M3 12h18"></path>
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="border border-[#10B981] text-[#10B981] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#10B981] hover:text-white transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Client
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {clients.map(client => (
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