
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interfaceSchema, InterfaceFormData, MethodSignatureFormData } from '@/schemas/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import DynamicParameterList from '@/components/forms/DynamicParameterList';

interface CreateInterfaceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InterfaceFormData) => void;
  availableNamespaces?: string[];
}

const CreateInterfaceModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  availableNamespaces = ['System.Core', 'Business.Logic', 'Data.Access']
}: CreateInterfaceModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterfaceFormData>({
    resolver: zodResolver(interfaceSchema),
    defaultValues: {
      name: '',
      namespace: '',
      methodSignatures: [],
    },
  });

  const handleSubmit = async (data: InterfaceFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const addMethodSignature = () => {
    const currentSignatures = form.getValues('methodSignatures');
    form.setValue('methodSignatures', [
      ...currentSignatures,
      { name: '', returnType: '', parameters: [] }
    ]);
  };

  const removeMethodSignature = (index: number) => {
    const currentSignatures = form.getValues('methodSignatures');
    form.setValue('methodSignatures', currentSignatures.filter((_, i) => i !== index));
  };

  const updateMethodSignature = (index: number, field: keyof MethodSignatureFormData, value: any) => {
    const currentSignatures = form.getValues('methodSignatures');
    const updated = currentSignatures.map((sig, i) => 
      i === index ? { ...sig, [field]: value } : sig
    );
    form.setValue('methodSignatures', updated);
  };

  const methodSignatures = form.watch('methodSignatures');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nueva interfaz</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la interfaz *</FormLabel>
                    <FormControl>
                      <Input placeholder="IRepository" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="namespace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Namespace *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar namespace" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableNamespaces.map((ns) => (
                          <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Firmas de métodos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMethodSignature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar firma
                </Button>
              </div>
              
              {methodSignatures.length > 0 && (
                <div className="space-y-4">
                  {methodSignatures.map((signature, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Método {index + 1}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMethodSignature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`method-name-${index}`} className="text-xs">Nombre *</Label>
                          <Input
                            id={`method-name-${index}`}
                            placeholder="GetById"
                            value={signature.name}
                            onChange={(e) => updateMethodSignature(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`method-return-${index}`} className="text-xs">Tipo de retorno *</Label>
                          <Input
                            id={`method-return-${index}`}
                            placeholder="void, string, etc."
                            value={signature.returnType}
                            onChange={(e) => updateMethodSignature(index, 'returnType', e.target.value)}
                          />
                        </div>
                      </div>

                      <DynamicParameterList
                        parameters={signature.parameters}
                        onParametersChange={(parameters) => updateMethodSignature(index, 'parameters', parameters)}
                        title="Parámetros del método"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {methodSignatures.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No hay firmas de métodos agregadas</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear interfaz'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterfaceModal;
