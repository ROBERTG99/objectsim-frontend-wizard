
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DllUpload from '@/components/DllUpload';
import DllManager from '@/components/DllManager';
import SimulationControls from '@/components/SimulationControls';
import SimulationResults from '@/components/SimulationResults';
import { objectSimApi } from '@/services/objectsimApi';
import { DllFile } from '@/types/objectsim';
import { FileCode, Settings, BarChart3, Upload } from 'lucide-react';

const Index = () => {
  const [dlls, setDlls] = useState<DllFile[]>([]);
  const [loadedDlls, setLoadedDlls] = useState<DllFile[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDlls = async () => {
    try {
      const response = await objectSimApi.getDlls();
      if (response.success && response.data) {
        setDlls(response.data);
        setLoadedDlls(response.data.filter(dll => dll.status === 'loaded'));
      }
    } catch (error) {
      console.error('Failed to fetch DLLs:', error);
    }
  };

  useEffect(() => {
    fetchDlls();
  }, []);

  const handleUploadSuccess = (newDll: DllFile) => {
    setDlls(prev => [...prev, newDll]);
  };

  const handleDllLoad = (loadedDll: DllFile) => {
    setDlls(prev => prev.map(dll => 
      dll.id === loadedDll.id ? loadedDll : dll
    ));
    setLoadedDlls(prev => {
      const existing = prev.find(dll => dll.id === loadedDll.id);
      if (existing) {
        return prev.map(dll => dll.id === loadedDll.id ? loadedDll : dll);
      }
      return [...prev, loadedDll];
    });
  };

  const handleSimulationStart = (simulationId: string) => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ObjectSim</h1>
          <p className="text-gray-600 text-lg">
            Dynamic Library Management and Simulation Platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total DLLs</p>
                  <p className="text-2xl font-bold">{dlls.length}</p>
                </div>
                <FileCode className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Loaded DLLs</p>
                  <p className="text-2xl font-bold">{loadedDlls.length}</p>
                </div>
                <Settings className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Methods</p>
                  <p className="text-2xl font-bold">
                    {loadedDlls.reduce((sum, dll) => sum + (dll.methods?.length || 0), 0)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">
                    Ready
                  </Badge>
                </div>
                <Upload className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Manage DLLs
            </TabsTrigger>
            <TabsTrigger value="simulate" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Simulate
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <DllUpload onUploadSuccess={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <DllManager 
              dlls={dlls} 
              onDllLoad={handleDllLoad}
              onRefresh={fetchDlls}
            />
          </TabsContent>

          <TabsContent value="simulate" className="space-y-6">
            <SimulationControls 
              loadedDlls={loadedDlls}
              onSimulationStart={handleSimulationStart}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <SimulationResults refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
