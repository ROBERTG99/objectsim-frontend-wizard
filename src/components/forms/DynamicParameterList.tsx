
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { ParameterFormData } from '@/schemas/formSchemas';

interface DynamicParameterListProps {
  parameters: ParameterFormData[];
  onParametersChange: (parameters: ParameterFormData[]) => void;
  title?: string;
}

const DynamicParameterList = ({ parameters, onParametersChange, title = "Parámetros" }: DynamicParameterListProps) => {
  const addParameter = () => {
    onParametersChange([...parameters, { name: '', type: '' }]);
  };

  const removeParameter = (index: number) => {
    onParametersChange(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: keyof ParameterFormData, value: string) => {
    const updated = parameters.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    );
    onParametersChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{title}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addParameter}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
      
      {parameters.length > 0 && (
        <div className="space-y-3">
          {parameters.map((parameter, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`param-name-${index}`} className="text-xs">Nombre *</Label>
                <Input
                  id={`param-name-${index}`}
                  placeholder="nombre"
                  value={parameter.name}
                  onChange={(e) => updateParameter(index, 'name', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`param-type-${index}`} className="text-xs">Tipo *</Label>
                <Input
                  id={`param-type-${index}`}
                  placeholder="string, int, etc."
                  value={parameter.type}
                  onChange={(e) => updateParameter(index, 'type', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeParameter(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {parameters.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No hay parámetros agregados</p>
      )}
    </div>
  );
};

export default DynamicParameterList;
