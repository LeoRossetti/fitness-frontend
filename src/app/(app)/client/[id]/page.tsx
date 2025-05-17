"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClientForm from '@/components/ClientForm';
import { Client } from '@/types/types';
import { getClientById } from '@/utils/api/api';

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(Number(id));
        setClient(data);
      } catch (error) {
        console.error('Failed to fetch client:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleUpdateClient = (updatedClient: Client) => {
    setClient(updatedClient);
    router.push('/clients'); // Перенаправляем обратно на страницу клиентов после сохранения
  };

  if (loading) return <p>Loading...</p>;
  if (!client) return <p>Client not found</p>;

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Client Details</h1>
        </div>
        <ClientForm
          initialData={client}
          isEditMode={true}
          onSubmit={handleUpdateClient}
        />
        <Link href="/clients">
          <button className="mt-4 bg-[#1F2A44] text-white px-6 py-2 rounded-lg hover:bg-[#2D3748] transition-colors">
            Back to Clients
          </button>
        </Link>
      </div>
    </main>
  );
}