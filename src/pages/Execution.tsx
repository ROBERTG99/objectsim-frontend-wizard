
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

const Execution = () => {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [parameterValues, setParameterValues] = useState<{[key: string]: string}>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const location = useLocation();

  // Mock methods data
  const availableMethods = [
    { 
      id: 1, 
      name: 'GetUserById', 
      class: 'UserRepository',
      returnType: 'User',
      parameters: [
        { name: 'userId', type: 'int' },
        { name: 'includeDetails', type: 'bool' }
      ]
    },
    { 
      id: 2, 
      name: 'SaveUser', 
      class: 'UserRepository',
      returnType: 'bool',
      parameters: [
        { name: 'user', type: 'User' }
      ]
    },
    { 
      id: 3, 
      name: 'CalculateTotal', 
      class: 'OrderService',
      returnType: 'decimal',
      parameters: [
        { name: 'orderId', type: 'int' },
        { name: 'includeDiscount', type: 'bool' }
      ]
    }
  ];

  // Check if a method was passed from the Methods page
  useEffect(() => {
    if (location.state?.selectedMethod) {
      const methodFromState = location.state.selectedMethod;
      const foundMethod = availableMethods.find(m => m.name === methodFromState.name);
      if (foundMethod) {
        setSelectedMethod(foundMethod);
        // Initialize parameter values
        const initialValues: {[key: string]: string} = {};
        foundMethod.parameters.forEach(param => {
          initialValues[param.name] = '';
        });
        setParameterValues(initialValues);
      }
    }
  }, [location.state]);

  const handleMethodChange = (methodId: string) => {
    const method = availableMethods.find(m => m.id === parseInt(methodId));
    setSelectedMethod(method || null);
    
    if (method) {
      // Initialize parameter values
      const initialValues: {[key: string]: string} = {};
      method.parameters.forEach(param => {
        initialValues[param.name] = '';
      });
      setParameterValues(initialValues);
    }
    
    // Clear previous results
    setExecutionResult(null);
    setExecutionError(null);
    setExecutionLogs([]);
  };

  const handleParameterChange = (paramName: string, value: string) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleExecute = async () => {
    if (!selectedMethod) return;

    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResult(null);
    setExecutionLogs([]);

    try {
      // Simulate method execution
      const logs = [
        `[${new Date().toLocaleTimeString()}] Iniciando ejecución del método ${selectedMethod.name}`,
        `[${new Date().toLocaleTimeString()}] Validando parámetros...`,
      ];

      // Validate parameters
      for (const param of selectedMethod.parameters) {
        const value = parameterValues[param.name];
        if (!value || value.trim() === '') {
          throw new Error(`El parámetro "${param.name}" es obligatorio`);
        }
        logs.push(`[${new Date().toLocaleTimeString()}] Parámetro ${param.name}: ${value}`);
      }

      setExecutionLogs([...logs]);

      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result based on method
      let result;
      switch (selectedMethod.name) {
        case 'GetUserById':
          result = {
            id: parseInt(parameterValues.userId),
            name: "Juan Pérez",
            email: "juan@example.com",
            isActive: parameterValues.includeDetails === 'true'
          };
          break;
        case 'SaveUser':
          result = true;
          break;
        case 'CalculateTotal':
          result = parameterValues.includeDiscount === 'true' ? 85.50 : 95.00;
          break;
        default:
          result = "Execution completed successfully";
      }

      const finalLogs = [
        ...logs,
        `[${new Date().toLocaleTimeString()}] Ejecutando método...`,
        `[${new Date().toLocaleTimeString()}] Ejecución completada exitosamente`
      ];

      setExecutionLogs(finalLogs);
      setExecutionResult(result);
      
      toast({
        title: "Ejecución exitosa",
        description: `El método ${selectedMethod.name} se ejecutó correctamente.`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setExecutionError(errorMessage);
      setExecutionLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ERROR: ${errorMessage}`
      ]);
      
      toast({
        title: "Error en la ejecución",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setExecutionResult(null);
    setExecutionError(null);
    setExecutionLogs([]);
    if (selectedMethod) {
      const initialValues: {[key: string]: string} = {};
      selectedMethod.parameters.forEach(param => {
        initialValues[param.name] = '';
      });
      setParameterValues(initialValues);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ejecución de Métodos</h1>
          <p className="text-gray-600">Ejecuta métodos y visualiza los resultados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isExecuting}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Ejecución</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="method-select">Seleccionar método *</Label>
                <Select 
                  value={selectedMethod?.id?.toString() || ''} 
                  onValueChange={handleMethodChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método a ejecutar" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.class}.{method.name}() : {method.returnType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMethod && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Información del método</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{selectedMethod.class}</Badge>
                      <Badge>{selectedMethod.returnType}</Badge>
                      <Badge variant="secondary">{selectedMethod.parameters.length} parámetros</Badge>
                    </div>
                  </div>

                  {selectedMethod.parameters.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Parámetros</h4>
                      <div className="space-y-3">
                        {selectedMethod.parameters.map((param: any) => (
                          <div key={param.name}>
                            <Label htmlFor={`param-${param.name}`}>
                              {param.name} ({param.type}) *
                            </Label>
                            <Input
                              id={`param-${param.name}`}
                              placeholder={`Ingrese valor para ${param.name}`}
                              value={parameterValues[param.name] || ''}
                              onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleExecute} 
                    disabled={isExecuting || !selectedMethod}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isExecuting ? 'Ejecutando...' : 'Ejecutar método'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execution Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Ejecución</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 overflow-y-auto bg-gray-50 p-3 rounded font-mono text-sm">
                {executionLogs.length === 0 ? (
                  <p className="text-gray-500 italic">No hay logs disponibles</p>
                ) : (
                  executionLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Execution Status */}
          {(executionResult || executionError) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {executionError ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Error de Ejecución
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Ejecución Exitosa
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {executionError ? (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive font-medium">Error:</p>
                    <p className="text-destructive">{executionError}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      El método se ejecutó correctamente y retornó un resultado.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Result Output */}
          {executionResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Valor de retorno</Label>
                  <Textarea
                    value={JSON.stringify(executionResult, null, 2)}
                    readOnly
                    className="mt-2 font-mono text-sm h-48"
                  />
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tipo de retorno:</strong> {selectedMethod?.returnType}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Execution Info */}
          {selectedMethod && !isExecuting && !executionResult && !executionError && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Ejecución</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Método:</strong> {selectedMethod.name}
                  </div>
                  <div>
                    <strong>Clase:</strong> {selectedMethod.class}
                  </div>
                  <div>
                    <strong>Tipo de retorno:</strong> {selectedMethod.returnType}
                  </div>
                  <div>
                    <strong>Parámetros requeridos:</strong> {selectedMethod.parameters.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Execution;
