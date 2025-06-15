
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings, ChevronDown, ChevronRight, Copy, Play } from 'lucide-react';
import CreateMethodModal from '@/components/modals/CreateMethodModal';
import EditMethodModal from '@/components/modals/EditMethodModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { MethodFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';

const Methods = () => {
  const [methods, setMethods] = useState([
    { 
      id: 1, 
      name: 'GetUserById', 
      class: 'UserRepository',
      returnType: 'User',
      parameters: 2,
      localVars: 1
    },
    { 
      id: 2, 
      name: 'SaveUser', 
      class: 'UserRepository',
      returnType: 'bool',
      parameters: 1,
      localVars: 0
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [expandedMethods, setExpandedMethods] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateMethod = (data: MethodFormData) => {
    const newMethod = {
      id: methods.length + 1,
      name: data.name,
      class: data.belongsToClass,
      returnType: data.returnType,
      parameters: data.parameters.length,
      localVars: 0
    };
    setMethods([...methods, newMethod]);
    toast({
      title: "Método creado",
      description: `El método "${data.name}" ha sido creado exitosamente.`,
    });
  };

  const handleEditMethod = (method: any) => {
    setSelectedMethod(method);
    setIsEditModalOpen(true);
  };

  const handleUpdateMethod = (data: MethodFormData) => {
    if (selectedMethod) {
      setMethods(methods.map(method => 
        method.id === selectedMethod.id 
          ? { 
              ...method, 
              name: data.name,
              class: data.belongsToClass,
              returnType: data.returnType,
              parameters: data.parameters.length
            }
          : method
      ));
      toast({
        title: "Método actualizado",
        description: `El método "${data.name}" ha sido actualizado exitosamente.`,
      });
      setIsEditModalOpen(false);
      setSelectedMethod(null);
    }
  };

  const handleDeleteMethod = (method: any) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMethod = () => {
    if (selectedMethod) {
      setMethods(methods.filter(method => method.id !== selectedMethod.id));
      toast({
        title: "Método eliminado",
        description: `El método "${selectedMethod.name}" ha sido eliminado.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedMethod(null);
    }
  };

  const handleDuplicateMethod = (method: any) => {
    const duplicatedMethod = {
      ...method,
      id: methods.length + 1,
      name: `${method.name}_Copy`
    };
    setMethods([...methods, duplicatedMethod]);
    toast({
      title: "Método duplicado",
      description: `El método "${method.name}" ha sido duplicado como "${duplicatedMethod.name}".`,
    });
  };

  const handleExecuteMethod = (method: any) => {
    navigate('/execution', { state: { selectedMethod: method } });
  };

  const toggleMethodExpansion = (methodId: number) => {
    const newExpanded = new Set(expandedMethods);
    if (newExpanded.has(methodId)) {
      newExpanded.delete(methodId);
    } else {
      newExpanded.add(methodId);
    }
    setExpandedMethods(newExpanded);
  };

  const mockParameters = [
    { name: 'userId', type: 'int' },
    { name: 'includeDetails', type: 'bool' },
  ];

  const mockLocalVars = [
    { name: 'user', type: 'User' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métodos</h1>
          <p className="text-gray-600">Gestiona los métodos del sistema</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo Método
        </Button>
      </div>

      {/* Methods List */}
      <div className="grid gap-4">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-orange-500" />
                    <div>
                      <h3 className="text-lg font-semibold">{method.name}</h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{method.class}</Badge>
                        <Badge>{method.returnType}</Badge>
                        <Badge variant="secondary">{method.parameters} parámetros</Badge>
                        <Badge variant="secondary">{method.localVars} vars locales</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleMethodExpansion(method.id)}
                    >
                      {expandedMethods.has(method.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateMethod(method)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExecuteMethod(method)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMethod(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteMethod(method)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Collapsible open={expandedMethods.has(method.id)}>
                  <CollapsibleContent>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Detalles del método</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleExecuteMethod(method)}>
                            <Play className="h-4 w-4 mr-2" />
                            Ejecutar prueba
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Parámetros</h5>
                          <div className="space-y-2">
                            {mockParameters.map((param, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{param.name}</span>
                                <Badge variant="outline" className="text-xs">{param.type}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Variables locales</h5>
                          <div className="space-y-2">
                            {mockLocalVars.map((variable, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{variable.name}</span>
                                <Badge variant="outline" className="text-xs">{variable.type}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Clase:</strong> {method.class} | 
                          <strong> Tipo de retorno:</strong> {method.returnType}
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateMethodModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMethod}
        availableClasses={['UserRepository', 'BaseEntity', 'Service', 'Controller']}
      />

      <EditMethodModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateMethod}
        method={selectedMethod}
        availableClasses={['UserRepository', 'BaseEntity', 'Service', 'Controller']}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteMethod}
        title="Eliminar Método"
        description="¿Estás seguro de que querés eliminar este método?"
        itemName={selectedMethod?.name || ''}
        warningMessage={selectedMethod?.class 
          ? `Este método pertenece a la clase "${selectedMethod.class}" y puede afectar su funcionalidad.` 
          : undefined}
      />
    </div>
  );
};

export default Methods;
