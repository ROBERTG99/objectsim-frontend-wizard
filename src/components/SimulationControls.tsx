
import React, { useState } from 'react';
import { Play, Settings, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { objectSimApi } from '@/services/objectsimApi';
import { DllFile, SimulationConfig } from '@/types/objectsim';

interface SimulationControlsProps {
  loadedDlls: DllFile[];
  onSimulationStart: (simulationId: string) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  loadedDlls,
  onSimulationStart,
}) => {
  const [selectedDll, setSelectedDll] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [parameters, setParameters] = useState<string>('{}');
  const [iterations, setIterations] = useState<number>(1);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const selectedDllObj = loadedDlls.find(dll => dll.id === selectedDll);
  const availableMethods = selectedDllObj?.methods || [];

  const handleRunSimulation = async () => {
    if (!selectedDll || !selectedMethod) {
      toast({
        title: "Configuration incomplete",
        description: "Please select a DLL and method",
        variant: "destructive",
      });
      return;
    }

    let parsedParameters;
    try {
      parsedParameters = JSON.parse(parameters);
    } catch {
      toast({
        title: "Invalid parameters",
        description: "Parameters must be valid JSON",
        variant: "destructive",
      });
      return;
    }

    const config: SimulationConfig = {
      dllId: selectedDll,
      method: selectedMethod,
      parameters: parsedParameters,
      iterations,
    };

    setRunning(true);
    try {
      const result = await objectSimApi.runSimulation(config);
      
      if (result.success && result.data) {
        toast({
          title: "Simulation started",
          description: `Simulation ${result.data.id} is now running`,
        });
        onSimulationStart(result.data.id);
      } else {
        throw new Error(result.error || 'Failed to start simulation');
      }
    } catch (error) {
      toast({
        title: "Failed to start simulation",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  if (loadedDlls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Load a DLL file to start configuring simulations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dll-select">Select DLL</Label>
            <Select value={selectedDll} onValueChange={setSelectedDll}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a loaded DLL" />
              </SelectTrigger>
              <SelectContent>
                {loadedDlls.map((dll) => (
                  <SelectItem key={dll.id} value={dll.id}>
                    {dll.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method-select">Select Method</Label>
            <Select 
              value={selectedMethod} 
              onValueChange={setSelectedMethod}
              disabled={!selectedDll}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a method" />
              </SelectTrigger>
              <SelectContent>
                {availableMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parameters">Parameters (JSON)</Label>
          <Textarea
            id="parameters"
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            placeholder="Enter method parameters as JSON..."
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iterations">Iterations</Label>
          <Input
            id="iterations"
            type="number"
            min="1"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value) || 1)}
            className="w-32"
          />
        </div>

        <Button 
          onClick={handleRunSimulation}
          disabled={running || !selectedDll || !selectedMethod}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {running ? 'Starting Simulation...' : 'Run Simulation'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
