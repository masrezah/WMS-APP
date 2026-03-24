import { api } from '@/lib/api';

export const WmsService = {
  // --- INBOUND ---
  async receiving(data: any) {
    const response = await api.post('/receiving', data);
    return response.data;
  },
  async putAway(data: any) {
    const response = await api.post('/put-away', data);
    return response.data;
  },

  // --- INVENTORY ---
  async getStock(tenantId: string) {
    const response = await api.get('/stock', { params: { tenant_id: tenantId } });
    return response.data;
  },
  async stockOpname(data: any) {
    const response = await api.post('/opname', data);
    return response.data;
  },

  // --- OUTBOUND ---
  async checkOrder(tenantId: string, productId: string) {
    const response = await api.get('/order/check', { params: { tenant_id: tenantId, product_id: productId } });
    return response.data;
  },
  async pickOrder(data: any) {
    const response = await api.post('/order/pick', data);
    return response.data;
  },
  async shipment(data: any) {
    const response = await api.post('/shipment', data);
    return response.data;
  },

  // --- LOGS & DASHBOARD ---
  async getTransactionLogs(tenantId: string) {
    const response = await api.get('/logs', { params: { tenant_id: tenantId } });
    return response.data;
  },

  // --- WAREHOUSE ---
  async listWarehouses(tenantId: string) {
    const response = await api.get('/warehouses', { params: { tenant_id: tenantId } });
    return response.data;
  },
  async createWarehouse(data: any) {
    const response = await api.post('/warehouses', data);
    return response.data;
  },
  async generateLocations(data: any) {
    const response = await api.post('/locations/generate', data);
    return response.data;
  }
};
