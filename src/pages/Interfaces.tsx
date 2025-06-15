
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import CreateInterfaceModal from '@/components/modals/CreateInterfaceModal';
import EditInterfaceModal from '@/components/modals/EditInterfaceModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { InterfaceFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

const Interfaces = () => {
  const [interfaces, setInterfaces] = useState([
    { id: 1, name: 'IRepository', namespace: 'Data.Access', methods: 4 },
    { id: 2, name: 'IService', namespace: 'Business.Logic', methods: 2 },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<any>(null);
  const [expandedInterfaces, setExpandedInterfaces] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleCreateInterface = (data: InterfaceFormData) => {
    const newInterface = {
      id: interfaces.length + 1,
      name: data.name,
      namespace: data.namespace,
      methods: data.methodSignatures.length
    };
    setInterfaces([...interfaces, newInterface]);
    toast({
      title: "Interfaz creada",
      description: `La interfaz "${data.name}" ha sido creada exitosamente.`,
    });
  };

  const handleEditInterface = (interface_: any) => {
    setSelectedInterface(interface_);
    setIsEditModalOpen(true);
  };

  const handleUpdateInterface = (data: InterfaceFormData) => {
    if (selectedInterface) {
      setInterfaces(interfaces.map(intf => 
        intf.id === selectedInterface.id 
          ? { 
              ...intf, 
              name: data.name,
              namespace: data.namespace,
              methods: data.methodSignatures.length
            }
          : intf
      ));
      toast({
        title: "Interfaz actualizada",
        description: `La interfaz "${data.name}" ha sido actualizada exitosamente.`,
      });
      setIsEditModalOpen(false);
      setSelectedInterface(null);
    }
  };

  const handleDeleteInterface = (interface_: any) => {
    setSelectedInterface(interface_);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteInterface = () => {
    if (selectedInterface) {
      setInterfaces(interfaces.filter(intf => intf.id !== selectedInterface.id));
      toast({
        title: "Interfaz eliminada",
        description: `La interfaz "${selectedInterface.name}" ha sido eliminada.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedInterface(null);
    }
  };

  const toggleInterfaceExpansion = (interfaceId: number) => {
    const newExpanded = new Set(expandedInterfaces);
    if (newExpanded.has(interfaceId)) {
      newExpanded.delete(interfaceId);
    } else {
      newExpanded.add(interfaceId);
    }
    setExpandedInterfaces(newExpanded);
  };

  const mockMethodSignatures = [
    { name: 'GetById', returnType: 'T', parameters: ['id: int'] },
    { name: 'Save', returnType: 'bool', parameters: ['entity: T'] },
  ];

  const mockImplementingClasses = [
    'UserRepository',
    'ProductRepository'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interfaces</h1>
          <p className="text-gray-600">Gestiona las interfaces del sistema</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nueva Interface
        </Button>
      </div>

      {/* Interfaces List */}
      <div className="grid gap-4">
        {interfaces.map((interface_) => (
          <Card key={interface_.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="text-lg font-semibold">{interface_.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{interface_.namespace}</Badge>
                        <Badge variant="secondary">{interface_.methods} métodos</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleInterfaceExpansion(interface_.id)}
                    >
                      {expandedInterfaces.has(interface_.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditInterface(interface_)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteInterface(interface_)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Collapsible open={expandedInterfaces.has(interface_.id)}>
                  <CollapsibleContent>
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-medium">Detalles de la interfaz</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Firmas de métodos</h5>
                          <div className="space-y-2">
                            {mockMethodSignatures.map((method, index) => (
                              <div key={index} className="p-2 bg-muted rounded">
                                <div className="text-sm font-medium">{method.name}(): {method.returnType}</div>
                                <div className="text-xs text-muted-foreground">
                                  Parámetros: {method.parameters.join(', ') || 'ninguno'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Clases que implementan</h5>
                          <div className="space-y-2">
                            {mockImplementingClasses.map((className, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{className}</span>
                                <Button variant="ghost" size="sm" className="text-xs">
                                  Ver clase
                                </Button>
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

      <CreateInterfaceModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInterface}
        availableNamespaces={['System.Core', 'Business.Logic', 'Data.Access', 'Domain.Models']}
      />

      <EditInterfaceModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateInterface}
        interface_={selectedInterface}
        availableNamespaces={['System.Core', 'Business.Logic', 'Data.Access', 'Domain.Models']}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteInterface}
        title="Eliminar Interfaz"
        description="¿Estás seguro de que querés eliminar esta interfaz?"
        itemName={selectedInterface?.name || ''}
        warningMessage="Las clases que implementan esta interfaz pueden verse afectadas."
      />
    </div>
  );
};

export default Interfaces;
