const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const getClients = async () => {
  const response = await fetch(`${API_URL}/api/clients`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
};

export const createClient = async (data: { name: string; email: string }) => {
  const response = await fetch(`${API_URL}/api/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  return response.json();
};

export const deleteClient = async (id: number) => {
  const response = await fetch(`${API_URL}/api/clients/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete client');
  }
};

export const getClientById = async (id: number) => {
  const response = await fetch(`${API_URL}/api/clients/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  return response.json();
};