
import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { objectSimApi } from '@/services/objectsimApi';
import { DllFile } from '@/types/objectsim';

interface DllUploadProps {
  onUploadSuccess: (dll: DllFile) => void;
}

const DllUpload: React.FC<DllUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.dll')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .dll file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const result = await objectSimApi.uploadDll(file);
      
      if (result.success && result.data) {
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully`,
        });
        onUploadSuccess(result.data);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload DLL File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <File className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium">Drop your DLL file here</p>
                <p className="text-sm text-gray-600">or click to browse</p>
              </div>
              <input
                type="file"
                accept=".dll"
                onChange={handleFileInput}
                className="hidden"
                id="dll-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="dll-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DllUpload;
