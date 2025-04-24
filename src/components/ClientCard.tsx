import Link from 'next/link';
import { Client } from '../types/types';

interface ClientCardProps {
  client: Client;
  onDelete: () => void;
}

export default function ClientCard({ client, onDelete }: ClientCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
      <p className="text-gray-600">{client.email}</p>
      {client.goal && <p className="text-gray-600">Goal: {client.goal}</p>}
      {client.phone && <p className="text-gray-600">Phone: {client.phone}</p>}
      <div className="flex gap-2 mt-2">
        <Link href={`/client/${client.id}`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            View
          </button>
        </Link>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}