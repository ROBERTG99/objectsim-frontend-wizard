
import { DllFile, SimulationConfig, SimulationResult, ApiResponse } from '@/types/objectsim';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ObjectSimApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async uploadDll(file: File): Promise<ApiResponse<DllFile>> {
    const formData = new FormData();
    formData.append('dll', file);

    return this.request<DllFile>('/dlls/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set boundary for FormData
    });
  }

  async getDlls(): Promise<ApiResponse<DllFile[]>> {
    return this.request<DllFile[]>('/dlls');
  }

  async loadDll(dllId: string): Promise<ApiResponse<{ methods: string[] }>> {
    return this.request<{ methods: string[] }>(`/dlls/${dllId}/load`, {
      method: 'POST',
    });
  }

  async runSimulation(config: SimulationConfig): Promise<ApiResponse<SimulationResult>> {
    return this.request<SimulationResult>('/simulations/run', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getSimulationResult(simulationId: string): Promise<ApiResponse<SimulationResult>> {
    return this.request<SimulationResult>(`/simulations/${simulationId}`);
  }

  async getSimulations(): Promise<ApiResponse<SimulationResult[]>> {
    return this.request<SimulationResult[]>('/simulations');
  }
}

export const objectSimApi = new ObjectSimApi();
