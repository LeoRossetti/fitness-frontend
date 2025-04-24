export interface Client {
    id: number;
    name: string;
    email: string;
    goal?: string;
    phone?: string;
    address?: string;
    notes?: string;
    profile?: string;
  }

  export type ClientFormData = Omit<Client, 'id'>;