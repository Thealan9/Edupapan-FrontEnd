export interface Service {
  id: number;
  name: string;
  description?: string;
  base_price: number;
  active: boolean;

  user_id: number;
  created_at?: string;
}
