export interface Plant {
  _id: string;
  name: string;
  scientificName: string;
  category: 'Succulent' | 'Foliage' | 'Flowering' | 'Fern' | 'Palm' | 'Cactus' | 'Herb';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  light: 'Low' | 'Indirect' | 'Bright' | 'Direct Sun';
  water: string;
  wateringFrequencyDays: number;
  humidity: 'Low' | 'Medium' | 'High';
  temperature: string;
  description: string;
  images: string[];
  tags: string[];
  petFriendly: boolean;
  commonIssues?: { issue: string; solution: string }[];
  popularity?: number;
}

export interface CareLog {
  action: 'watered' | 'fertilized' | 'repotted' | 'pruned' | 'cleaned';
  date: string;
  notes?: string;
}

export interface UserPlant {
  _id: string;
  userId: string;
  plantId?: Plant | string;
  customName: string;
  scientificName?: string;
  category: string;
  images: string[];
  purchaseDate?: string;
  location?: string;
  currentHeightCm?: number;
  notes?: string;
  healthStatus: 'Healthy' | 'Needs Attention' | 'Recovering' | 'Critical';
  lastWatered?: string;
  lastFertilized?: string;
  wateringFrequencyDays: number;
  careLogs: CareLog[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
