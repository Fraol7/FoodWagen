// API configuration
const API_BASE_URL = 'http://localhost:3000/foods';

export interface FoodItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  restaurant: string;
  status: 'Open' | 'Closed';
  logo: string;
  category?: string;
  deliveryType?: 'Delivery' | 'Pickup' | 'Both';
  createdAt?: string;
  updatedAt?: string;
}

export const getFoods = async (): Promise<FoodItem[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch foods');
  }
  return response.json();
};

export const getFood = async (id: string): Promise<FoodItem> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch food');
  }
  return response.json();
};

export const createFood = async (food: Omit<FoodItem, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<FoodItem> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(food),
  });
  if (!response.ok) {
    throw new Error('Failed to create food');
  }
  return response.json();
};

export const updateFood = async (id: string, food: Partial<FoodItem>): Promise<FoodItem> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(food),
  });
  if (!response.ok) {
    throw new Error('Failed to update food');
  }
  return response.json();
};

export const deleteFood = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete food');
  }
};
