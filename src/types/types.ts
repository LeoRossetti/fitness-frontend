export interface Client {
  id: number;
  name: string;
  email: string;
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
  plan?: 'Premium Monthly' | 'Standard Weekly' | 'Single Session';
  nextSession?: string;
}

export type ClientFormData = Omit<Client, 'id'>;