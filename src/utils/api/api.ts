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
    credentials: 'include', // <-- это критически важно
  });
  if (!response.ok) {
    throw new Error('Failed to delete client');
  }
};

export const getClientById = async (id: number) => {
  const response = await fetch(`${API_URL}/api/clients/${id}`, {
    credentials: 'include', // ← обязательно, чтобы передать токен с cookie
  });
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  return response.json();
};

export const getSessionsByDate = async (date: string) => {
  const response = await fetch(`${API_URL}/api/sessions?date=${date}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

export const createSession = async (data: {
  clientId: number;
  type: string;
  time: string;
  note: string;
  date: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const getSessionsByMonth = async (year: number, month: number) => {
  const monthStr = String(month).padStart(2, '0');
  const response = await fetch(`${API_URL}/api/sessions?month=${year}-${monthStr}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

export const deleteSession = async (id: number) => {
  const response = await fetch(`${API_URL}/api/sessions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete session');
};