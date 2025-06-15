
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, ChevronDown, ChevronRight } from 'lucide-react';
import CreateNamespaceModal from '@/components/modals/CreateNamespaceModal';
import EditNamespaceModal from '@/components/modals/EditNamespaceModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { NamespaceFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Namespaces = () => {
  const [namespaces, setNamespaces] = useState([
    { id: 1, name: 'System.Core', classes: 3, interfaces: 2, description: 'Core system components' },
    { id: 2, name: 'Business.Logic', classes: 5, interfaces: 1, description: 'Business logic layer' },
  ]);
  
  const [newNamespace, setNewNamespace] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState<any>(null);
  const [expandedNamespaces, setExpandedNamespaces] = useState<Set<number>>(new Set());
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

  const handleEditNamespace = (namespace: any) => {
    setSelectedNamespace(namespace);
    setIsEditModalOpen(true);
  };

  const handleUpdateNamespace = (data: NamespaceFormData) => {
    if (selectedNamespace) {
      setNamespaces(namespaces.map(ns => 
        ns.id === selectedNamespace.id 
          ? { ...ns, name: data.name, description: data.description || '' }
          : ns
      ));
      toast({
        title: "Namespace actualizado",
        description: `El namespace "${data.name}" ha sido actualizado exitosamente.`,
      });
      setIsEditModalOpen(false);
      setSelectedNamespace(null);
    }
  };

  const handleDeleteNamespace = (namespace: any) => {
    setSelectedNamespace(namespace);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteNamespace = () => {
    if (selectedNamespace) {
      setNamespaces(namespaces.filter(ns => ns.id !== selectedNamespace.id));
      toast({
        title: "Namespace eliminado",
        description: `El namespace "${selectedNamespace.name}" ha sido eliminado.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedNamespace(null);
    }
  };

  const toggleNamespaceExpansion = (namespaceId: number) => {
    const newExpanded = new Set(expandedNamespaces);
    if (newExpanded.has(namespaceId)) {
      newExpanded.delete(namespaceId);
    } else {
      newExpanded.add(namespaceId);
    }
    setExpandedNamespaces(newExpanded);
  };

  const mockClasses = [
    { name: 'UserRepository', type: 'class' },
    { name: 'BaseEntity', type: 'class' },
  ];

  const mockInterfaces = [
    { name: 'IRepository', type: 'interface' },
    { name: 'IService', type: 'interface' },
  ];

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
              <div className="space-y-4">
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleNamespaceExpansion(namespace.id)}
                    >
                      {expandedNamespaces.has(namespace.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditNamespace(namespace)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteNamespace(namespace)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Collapsible open={expandedNamespaces.has(namespace.id)}>
                  <CollapsibleContent>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Contenido del namespace</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Clase
                          </Button>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Interfaz
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Clases</h5>
                          <div className="space-y-2">
                            {mockClasses.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <span className="text-sm">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Interfaces</h5>
                          <div className="space-y-2">
                            {mockInterfaces.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <span className="text-sm">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
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

      <EditNamespaceModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateNamespace}
        namespace={selectedNamespace}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteNamespace}
        title="Eliminar Namespace"
        description="¿Estás seguro de que querés eliminar este namespace?"
        itemName={selectedNamespace?.name || ''}
        warningMessage={selectedNamespace?.classes > 0 || selectedNamespace?.interfaces > 0 
          ? "Este namespace contiene clases o interfaces. Se eliminarán en cascada." 
          : undefined}
      />
    </div>
  );
};

export default Namespaces;
