"use client";

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getClientById } from '@/utils/api';
import { Client } from '@/types/types';

export default function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params); //launch params with React.use

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(Number(id)); 
        setClient(data);
      } catch (error) {
        console.error('Failed to fetch client:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id, router]);

  if (loading) return <p>Loading...</p>;
  if (!client) return <p>Client not found</p>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-screen-md mx-auto">
        <div className="text-center">
          <div className="section-classname bg-white/80 rounded-2xl shadow-sm p-4 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Client Details</h1>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p><strong>Name:</strong> {client.name}</p>
              <p><strong>Email:</strong> {client.email}</p>
              {client.goal && <p><strong>Goal:</strong> {client.goal}</p>}
              {client.phone && <p><strong>Phone:</strong> {client.phone}</p>}
              {client.address && <p><strong>Address:</strong> {client.address}</p>}
              {client.notes && <p><strong>Notes:</strong> {client.notes}</p>}
              {client.profile && <p><strong>Profile:</strong> {client.profile}</p>}
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Clients
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}