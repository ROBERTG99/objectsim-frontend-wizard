
import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { objectSimApi } from '@/services/objectsimApi';
import { SimulationResult } from '@/types/objectsim';

interface SimulationResultsProps {
  refreshTrigger?: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ refreshTrigger }) => {
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<SimulationResult | null>(null);
  const { toast } = useToast();

  const fetchResults = async () => {
    try {
      const response = await objectSimApi.getSimulations();
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch results');
      }
    } catch (error) {
      toast({
        title: "Failed to load results",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [refreshTrigger]);

  const getStatusIcon = (status: SimulationResult['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: SimulationResult['status']) => {
    const colors = {
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const duration = endTime.getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Simulation Results ({results.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchResults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No simulation results yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium font-mono text-sm">
                        {result.id}
                      </span>
                      {getStatusBadge(result.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Started: {result.startTime.toLocaleString()}</p>
                      <p>Duration: {formatDuration(result.startTime, result.endTime)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResult(result)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle>Result Details - {selectedResult.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Status:</strong> {selectedResult.status}
              </div>
              <div>
                <strong>Start Time:</strong> {selectedResult.startTime.toLocaleString()}
              </div>
              {selectedResult.endTime && (
                <div>
                  <strong>End Time:</strong> {selectedResult.endTime.toLocaleString()}
                </div>
              )}
              <div>
                <strong>Duration:</strong> {formatDuration(selectedResult.startTime, selectedResult.endTime)}
              </div>
            </div>

            {selectedResult.output && (
              <div>
                <strong className="block mb-2">Output:</strong>
                <Textarea
                  value={JSON.stringify(selectedResult.output, null, 2)}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {selectedResult.error && (
              <div>
                <strong className="block mb-2 text-red-600">Error:</strong>
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {selectedResult.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationResults;
