
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classSchema, ClassFormData } from '@/schemas/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DynamicAttributeList from '@/components/forms/DynamicAttributeList';

interface EditClassModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  class_: {
    id: number;
    name: string;
    namespace?: string;
    isAbstract: boolean;
    isSealed: boolean;
    parentClass?: string;
    attributes?: any[];
  } | null;
  availableNamespaces?: string[];
  availableClasses?: string[];
}

const EditClassModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  class_,
  availableNamespaces = ['System.Core', 'Business.Logic', 'Data.Access'],
  availableClasses = ['BaseEntity', 'Entity', 'Model']
}: EditClassModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      namespace: '',
      inheritsFrom: '',
      isAbstract: false,
      isSealed: false,
      attributes: [],
    },
  });

  useEffect(() => {
    if (class_ && open) {
      form.reset({
        name: class_.name,
        namespace: class_.namespace || '',
        inheritsFrom: class_.parentClass || '',
        isAbstract: class_.isAbstract,
        isSealed: class_.isSealed,
        attributes: class_.attributes || [],
      });
    }
  }, [class_, open, form]);

  const handleSubmit = async (data: ClassFormData) => {
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
          <DialogTitle>Editar clase</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la clase *</FormLabel>
                    <FormControl>
                      <Input placeholder="MiClase" {...field} />
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
                    <FormLabel>Namespace</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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

            <FormField
              control={form.control}
              name="inheritsFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hereda de</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar clase padre (opcional)" />
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

            <div className="space-y-3">
              <FormLabel>Modificadores</FormLabel>
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isAbstract"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Abstracta
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isSealed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Sellada (sealed)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="attributes"
              render={({ field }) => (
                <FormItem>
                  <DynamicAttributeList
                    attributes={field.value}
                    onAttributesChange={field.onChange}
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

export default EditClassModal;
