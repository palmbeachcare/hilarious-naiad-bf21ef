export type Persona = 'senior' | 'caregiver' | 'provider' | 'partner';

export interface Category {
  id: string;
  name: string;
  icon: string;
  group: 'Medical' | 'Mobile' | 'Tech' | 'Living' | 'Support' | 'Professional' | 'Products' | 'Future';
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'idle';
  description: string;
  icon: string;
  color: string;
  actions: number;
  patients: number;
}

export interface Product {
  name: string;
  brand: string;
  price: string;
  category: string;
  icon: string;
  commission: string;
  rating: number;
  interactive: boolean;
  description: string;
}

export interface FeedEvent {
  time: string;
  event: string;
  detail: string;
  type: 'agent' | 'community' | 'service' | 'api';
  icon: string;
}
