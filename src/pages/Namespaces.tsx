
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import CreateNamespaceModal from '@/components/modals/CreateNamespaceModal';
import { NamespaceFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';

const Namespaces = () => {
  const [namespaces, setNamespaces] = useState([
    { id: 1, name: 'System.Core', classes: 3, interfaces: 2, description: 'Core system components' },
    { id: 2, name: 'Business.Logic', classes: 5, interfaces: 1, description: 'Business logic layer' },
  ]);
  
  const [newNamespace, setNewNamespace] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateNamespace = () => {
    if (newNamespace.trim()) {
      const newNs = {
        id: namespaces.length + 1,
        name: newNamespace,
        classes: 0,
        interfaces: 0,
        description: ''
      };
      setNamespaces([...namespaces, newNs]);
      setNewNamespace('');
      toast({
        title: "Namespace creado",
        description: `El namespace "${newNamespace}" ha sido creado exitosamente.`,
      });
    }
  };

  const handleCreateFromModal = (data: NamespaceFormData) => {
    const newNs = {
      id: namespaces.length + 1,
      name: data.name,
      classes: 0,
      interfaces: 0,
      description: data.description || ''
    };
    setNamespaces([...namespaces, newNs]);
    toast({
      title: "Namespace creado",
      description: `El namespace "${data.name}" ha sido creado exitosamente.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Namespaces</h1>
          <p className="text-gray-600">Gestiona los namespaces del sistema</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo Namespace
        </Button>
      </div>

      {/* Create Namespace */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Namespace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del namespace"
              value={newNamespace}
              onChange={(e) => setNewNamespace(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateNamespace}>
              Crear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Namespaces List */}
      <div className="grid gap-4">
        {namespaces.map((namespace) => (
          <Card key={namespace.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">{namespace.name}</h3>
                    {namespace.description && (
                      <p className="text-sm text-gray-600 mt-1">{namespace.description}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {namespace.classes} clases
                      </Badge>
                      <Badge variant="secondary">
                        {namespace.interfaces} interfaces
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateNamespaceModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFromModal}
      />
    </div>
  );
};

export default Namespaces;
