
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { methodSchema, MethodFormData } from '@/schemas/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DynamicParameterList from '@/components/forms/DynamicParameterList';

interface EditMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MethodFormData) => void;
  method: {
    id: number;
    name: string;
    returnType: string;
    class: string;
    parameters?: any[];
  } | null;
  availableClasses?: string[];
}

const EditMethodModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  method,
  availableClasses = ['UserRepository', 'BaseEntity', 'Service']
}: EditMethodModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MethodFormData>({
    resolver: zodResolver(methodSchema),
    defaultValues: {
      name: '',
      returnType: '',
      parameters: [],
      belongsToClass: '',
    },
  });

  useEffect(() => {
    if (method && open) {
      form.reset({
        name: method.name,
        returnType: method.returnType,
        parameters: method.parameters || [],
        belongsToClass: method.class,
      });
    }
  }, [method, open, form]);

  const handleSubmit = async (data: MethodFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar método</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del método *</FormLabel>
                    <FormControl>
                      <Input placeholder="GetUser" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de retorno *</FormLabel>
                    <FormControl>
                      <Input placeholder="void, string, User, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="belongsToClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pertenece a clase *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar clase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parameters"
              render={({ field }) => (
                <FormItem>
                  <DynamicParameterList
                    parameters={field.value}
                    onParametersChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMethodModal;
