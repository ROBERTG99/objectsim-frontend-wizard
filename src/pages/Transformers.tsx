
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download } from 'lucide-react';

const Transformers = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [availableFormats, setAvailableFormats] = useState(['JSON', 'XML', 'CSV', 'PDF']);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [transformResult, setTransformResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleTransform = () => {
    // Simulate transformation
    setTransformResult({
      format: selectedFormat,
      mimeType: 'application/json',
      content: JSON.stringify({ 
        transformed: true, 
        format: selectedFormat,
        timestamp: new Date().toISOString() 
      }, null, 2)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transformadores</h1>
        <p className="text-gray-600">Gestiona DLLs y transforma resultados de ejecución</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload and Transform */}
        <div className="space-y-6">
          {/* DLL Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir DLL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="file"
                  accept=".dll"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
              <Button disabled={!selectedFile} className="w-full">
                Subir DLL
              </Button>
            </CardContent>
          </Card>

          {/* Transform Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configurar Transformación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Formato de salida</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((format) => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleTransform}
                disabled={!selectedFormat}
                className="w-full"
              >
                Ejecutar Transformación
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Resultado Transformado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transformResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium">{transformResult.format}</span>
                  <span className="text-sm text-gray-600">MIME:</span>
                  <span className="text-sm font-medium">{transformResult.mimeType}</span>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contenido transformado:</label>
                  <Textarea
                    value={transformResult.content}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Resultado
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Configura y ejecuta una transformación para ver los resultados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Uploaded DLLs */}
      <Card>
        <CardHeader>
          <CardTitle>DLLs Cargadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            No hay DLLs cargadas actualmente
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transformers;
