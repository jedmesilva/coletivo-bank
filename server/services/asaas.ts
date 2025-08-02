import axios from 'axios';

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  description?: string;
  status: string;
}

export class AsaasService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || '';
    this.baseURL = process.env.ASAAS_ENVIRONMENT === 'production' 
      ? 'https://api.asaas.com/v3' 
      : 'https://sandbox.asaas.com/api/v3';
    
    if (!this.apiKey) {
      throw new Error('ASAAS_API_KEY environment variable is required');
    }
  }

  private getHeaders() {
    return {
      'access_token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
  }): Promise<AsaasCustomer> {
    try {
      const response = await axios.post(
        `${this.baseURL}/customers`,
        customerData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente no Asaas:', error);
      throw new Error('Falha ao criar subconta no Asaas');
    }
  }

  async createPayment(paymentData: {
    customer: string;
    value: number;
    dueDate: string;
    description?: string;
    billingType?: string;
  }): Promise<AsaasPayment> {
    try {
      const response = await axios.post(
        `${this.baseURL}/payments`,
        {
          ...paymentData,
          billingType: paymentData.billingType || 'PIX',
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cobrança no Asaas:', error);
      throw new Error('Falha ao criar cobrança no Asaas');
    }
  }

  async getPayment(paymentId: string): Promise<AsaasPayment> {
    try {
      const response = await axios.get(
        `${this.baseURL}/payments/${paymentId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cobrança no Asaas:', error);
      throw new Error('Falha ao buscar cobrança no Asaas');
    }
  }

  async getCustomer(customerId: string): Promise<AsaasCustomer> {
    try {
      const response = await axios.get(
        `${this.baseURL}/customers/${customerId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente no Asaas:', error);
      throw new Error('Falha ao buscar cliente no Asaas');
    }
  }

  async updateCustomer(customerId: string, customerData: Partial<AsaasCustomer>): Promise<AsaasCustomer> {
    try {
      const response = await axios.put(
        `${this.baseURL}/customers/${customerId}`,
        customerData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente no Asaas:', error);
      throw new Error('Falha ao atualizar cliente no Asaas');
    }
  }

  async deletePayment(paymentId: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseURL}/payments/${paymentId}`,
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Erro ao cancelar cobrança no Asaas:', error);
      throw new Error('Falha ao cancelar cobrança no Asaas');
    }
  }
}

export const asaasService = new AsaasService();