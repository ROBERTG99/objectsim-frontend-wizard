
export interface DllFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: 'uploaded' | 'loading' | 'loaded' | 'error';
  methods?: string[];
}

export interface SimulationConfig {
  dllId: string;
  method: string;
  parameters: Record<string, any>;
  iterations?: number;
  timeout?: number;
}

export interface SimulationResult {
  id: string;
  configId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
