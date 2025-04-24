'use client';

import { useEffect, useState } from 'react';
import ClientCard from '@/components/ClientCard';
import ClientForm from '@/components/ClientForm';
import Modal from '@/components/Modal';
import { Client, ClientFormData } from '@/types/types';
import { getClients, createClient, deleteClient } from '@/utils/api';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = async (data: ClientFormData) => {
    try {
      const newClient = await createClient(data);
      setClients((prev) => [...prev, newClient]);
      setIsOpen(false);
    } catch (err) {
      console.error('Error adding client:', err);
      alert('Error adding client');
    }
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
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-screen-md mx-auto">
        <div className="text-center">
          <h1 className="section-classname bg-white/80 rounded-2xl shadow-sm p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 m-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Clients</h2>
              <button
                type="button"
                className="items-center justify-center gap-2 m-2 sm:m-auto bg-gray-900 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                Add New Client
              </button>
            </div>
            {clients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={() => handleDeleteClient(client.id)}
              />
            ))}
          </h1>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ClientForm onSubmit={handleAddClient} />
      </Modal>
    </main>
  );
}