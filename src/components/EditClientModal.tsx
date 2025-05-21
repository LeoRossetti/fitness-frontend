// src/components/EditClientModal.tsx
"use client";

import { useEffect, useState } from "react";
import { getClientById } from "@/utils/api/api";
import { Client } from "@/types/types";
import ClientForm from "./ClientForm";

type Props = {
  clientId: number;
  onClose: () => void;
  onUpdated?: (client: Client) => void;
};

export default function EditClientModal({ clientId, onClose, onUpdated }: Props) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) return <div className="modal">Loading...</div>;
  if (!client) return <div className="modal">Client not found</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Client</h2>
        <ClientForm
          initialData={client}
          isEditMode
          onSubmit={(updated) => {
            onUpdated?.(updated);
            onClose();
          }}
        />
        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
