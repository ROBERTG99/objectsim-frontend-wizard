
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Code } from 'lucide-react';

const Execution = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [parameters, setParameters] = useState({});
  const [result, setResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    // Simulate execution
    setTimeout(() => {
      setResult({
        success: true,
        data: { userId: 123, name: "Test User", email: "test@example.com" },
        executionTime: "45ms"
      });
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ejecución</h1>
        <p className="text-gray-600">Ejecuta métodos y visualiza resultados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Configurar Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Método a ejecutar</label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getUserById">GetUserById</SelectItem>
                  <SelectItem value="saveUser">SaveUser</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedMethod && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Parámetros</label>
                <div className="space-y-2">
                  <Input placeholder="id (int)" />
                  <Input placeholder="includeDetails (bool)" />
                </div>
              </div>
            )}

            <Button 
              onClick={handleExecute} 
              disabled={!selectedMethod || isExecuting}
              className="w-full"
            >
              {isExecuting ? 'Ejecutando...' : 'Ejecutar Método'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Éxito' : 'Error'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Datos de respuesta:</label>
                  <Textarea
                    value={JSON.stringify(result.data, null, 2)}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Tiempo de ejecución: {result.executionTime}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Ejecuta un método para ver los resultados
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Execution;
