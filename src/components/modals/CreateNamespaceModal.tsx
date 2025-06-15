
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { namespaceSchema, NamespaceFormData } from '@/schemas/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CreateNamespaceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NamespaceFormData) => void;
}

const CreateNamespaceModal = ({ open, onClose, onSubmit }: CreateNamespaceModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NamespaceFormData>({
    resolver: zodResolver(namespaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = async (data: NamespaceFormData) => {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo namespace</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del namespace *</FormLabel>
                  <FormControl>
                    <Input placeholder="System.Core" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del namespace (opcional)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear namespace'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNamespaceModal;
