
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { AttributeFormData } from '@/schemas/formSchemas';

interface DynamicAttributeListProps {
  attributes: AttributeFormData[];
  onAttributesChange: (attributes: AttributeFormData[]) => void;
}

const DynamicAttributeList = ({ attributes, onAttributesChange }: DynamicAttributeListProps) => {
  const addAttribute = () => {
    onAttributesChange([...attributes, { 
      name: '', 
      type: '', 
      accessModifier: 'public' as const,
      defaultValue: '' 
    }]);
  };

  const removeAttribute = (index: number) => {
    onAttributesChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof AttributeFormData, value: any) => {
    const updated = attributes.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    );
    onAttributesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Atributos</Label>
        <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar atributo
        </Button>
      </div>
      
      {attributes.length > 0 && (
        <div className="space-y-4">
          {attributes.map((attribute, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Atributo {index + 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAttribute(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`attr-name-${index}`} className="text-xs">Nombre *</Label>
                  <Input
                    id={`attr-name-${index}`}
                    placeholder="nombreAtributo"
                    value={attribute.name}
                    onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`attr-type-${index}`} className="text-xs">Tipo *</Label>
                  <Select 
                    value={attribute.type} 
                    onValueChange={(value) => updateAttribute(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="int">int</SelectItem>
                      <SelectItem value="float">float</SelectItem>
                      <SelectItem value="bool">bool</SelectItem>
                      <SelectItem value="double">double</SelectItem>
                      <SelectItem value="decimal">decimal</SelectItem>
                      <SelectItem value="DateTime">DateTime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Modificador de acceso</Label>
                  <Select 
                    value={attribute.accessModifier} 
                    onValueChange={(value: 'public' | 'private' | 'protected') => updateAttribute(index, 'accessModifier', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">public</SelectItem>
                      <SelectItem value="private">private</SelectItem>
                      <SelectItem value="protected">protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`attr-default-${index}`} className="text-xs">Valor por defecto</Label>
                  <Input
                    id={`attr-default-${index}`}
                    placeholder="valor inicial (opcional)"
                    value={attribute.defaultValue || ''}
                    onChange={(e) => updateAttribute(index, 'defaultValue', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {attributes.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No hay atributos agregados</p>
      )}
    </div>
  );
};

export default DynamicAttributeList;
