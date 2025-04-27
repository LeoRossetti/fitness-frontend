"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Client } from '../types/types';

interface ClientCardProps {
  client: Client;
  onDelete: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export default function ClientCard({ client, onDelete }: ClientCardProps) {
  const isSubscription = client.plan === 'Premium Monthly' || client.plan === 'Standard Weekly';

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
          {client.profile ? (
            <Image
              src={`${API_URL}${client.profile}`} // Полный URL для изображения
              alt={client.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-500 text-xl">👤</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-black">{client.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isSubscription ? 'bg-[#8B5CF6] text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isSubscription ? 'Subscription' : 'One-time'}
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">{client.email}</p>
          <div className="flex gap-2 mt-1">
            <p className="text-sm text-[#6B7280]">
              <span className="font-bold">PLAN </span>
              {client.plan || 'Not Specified'}
            </p>
            <p className="text-sm text-[#6B7280]">
              <span className="font-bold">GOAL </span>
              {client.goal || 'Not Specified'}
            </p>
            <p className="text-sm text-[#6B7280]">
              <span className="font-bold">NEXT SESSION </span>
              {client.nextSession || 'Not Scheduled'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/client/${client.id}`}>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
            </svg>
          </button>
        </Link>
        <button onClick={onDelete} className="text-[#EF4444] hover:text-[#DC2626]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}