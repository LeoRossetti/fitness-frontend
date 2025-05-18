export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // в продакшене должен быть хеширован
  role: "Client" | "Trainer";
}

export interface Client extends Omit<User, "role"> {
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
  plan?: "Premium Monthly" | "Standard Weekly" | "Single Session";
  type: "Subscription" | "One-time";
  nextSession?: string;
  role: "Client";
  User?: {
    name: string;
    email: string;
  };
}

export interface Trainer extends Omit<User, "role"> {
  role: "Trainer";
}

export type ClientFormData = Omit<Client, "id" | "password">;
