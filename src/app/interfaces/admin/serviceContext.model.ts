export interface ServiceContext {
  id: number;
  service_id: number;
  context: 'public' | 'local';
  local_id?: number;
  price_override?: number;
  active: boolean;
}
