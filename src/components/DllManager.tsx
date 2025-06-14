
import React, { useState, useEffect } from 'react';
import { Trash2, Play, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { objectSimApi } from '@/services/objectsimApi';
import { DllFile } from '@/types/objectsim';

interface DllManagerProps {
  dlls: DllFile[];
  onDllLoad: (dll: DllFile) => void;
  onRefresh: () => void;
}

const DllManager: React.FC<DllManagerProps> = ({ dlls, onDllLoad, onRefresh }) => {
  const [loadingDlls, setLoadingDlls] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleLoadDll = async (dll: DllFile) => {
    setLoadingDlls(prev => new Set([...prev, dll.id]));
    
    try {
      const result = await objectSimApi.loadDll(dll.id);
      
      if (result.success && result.data) {
        const updatedDll = {
          ...dll,
          status: 'loaded' as const,
          methods: result.data.methods,
        };
        
        toast({
          title: "DLL loaded successfully",
          description: `Found ${result.data.methods.length} methods`,
        });
        
        onDllLoad(updatedDll);
      } else {
        throw new Error(result.error || 'Failed to load DLL');
      }
    } catch (error) {
      toast({
        title: "Failed to load DLL",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoadingDlls(prev => {
        const newSet = new Set(prev);
        newSet.delete(dll.id);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: DllFile['status']) => {
    const variants = {
      uploaded: 'secondary',
      loading: 'default',
      loaded: 'default',
      error: 'destructive',
    } as const;

    const colors = {
      uploaded: 'bg-gray-100 text-gray-800',
      loading: 'bg-blue-100 text-blue-800',
      loaded: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (dlls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>DLL Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No DLL files uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>DLL Files ({dlls.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dlls.map((dll) => (
            <div
              key={dll.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{dll.name}</span>
                  {getStatusBadge(dll.status)}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Size: {formatFileSize(dll.size)}</p>
                  <p>Uploaded: {dll.uploadDate.toLocaleDateString()}</p>
                  {dll.methods && (
                    <p>Methods: {dll.methods.length} available</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dll.status === 'uploaded' && (
                  <Button
                    onClick={() => handleLoadDll(dll)}
                    disabled={loadingDlls.has(dll.id)}
                    size="sm"
                  >
                    {loadingDlls.has(dll.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Load
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DllManager;
