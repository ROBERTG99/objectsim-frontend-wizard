
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import CreateClassModal from '@/components/modals/CreateClassModal';
import EditClassModal from '@/components/modals/EditClassModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { ClassFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

const Classes = () => {
  const [classes, setClasses] = useState([
    { 
      id: 1, 
      name: 'UserRepository', 
      namespace: 'Data.Access', 
      isAbstract: false, 
      isSealed: false,
      parentClass: null,
      attributes: 2,
      methods: 5
    },
    { 
      id: 2, 
      name: 'BaseEntity', 
      namespace: 'Domain.Models', 
      isAbstract: true, 
      isSealed: false,
      parentClass: null,
      attributes: 3,
      methods: 2
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleCreateClass = (data: ClassFormData) => {
    const newClass = {
      id: classes.length + 1,
      name: data.name,
      namespace: data.namespace || 'Default',
      isAbstract: data.isAbstract,
      isSealed: data.isSealed,
      parentClass: data.inheritsFrom || null,
      attributes: data.attributes.length,
      methods: 0
    };
    setClasses([...classes, newClass]);
    toast({
      title: "Clase creada",
      description: `La clase "${data.name}" ha sido creada exitosamente.`,
    });
  };

  const handleEditClass = (class_: any) => {
    setSelectedClass(class_);
    setIsEditModalOpen(true);
  };

  const handleUpdateClass = (data: ClassFormData) => {
    if (selectedClass) {
      setClasses(classes.map(cls => 
        cls.id === selectedClass.id 
          ? { 
              ...cls, 
              name: data.name,
              namespace: data.namespace || 'Default',
              isAbstract: data.isAbstract,
              isSealed: data.isSealed,
              parentClass: data.inheritsFrom || null,
              attributes: data.attributes.length
            }
          : cls
      ));
      toast({
        title: "Clase actualizada",
        description: `La clase "${data.name}" ha sido actualizada exitosamente.`,
      });
      setIsEditModalOpen(false);
      setSelectedClass(null);
    }
  };

  const handleDeleteClass = (class_: any) => {
    setSelectedClass(class_);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClass = () => {
    if (selectedClass) {
      setClasses(classes.filter(cls => cls.id !== selectedClass.id));
      toast({
        title: "Clase eliminada",
        description: `La clase "${selectedClass.name}" ha sido eliminada.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedClass(null);
    }
  };

  const toggleClassExpansion = (classId: number) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  const mockMethods = [
    { name: 'GetById', returnType: 'User', parameters: 1 },
    { name: 'Save', returnType: 'bool', parameters: 1 },
  ];

  const mockAttributes = [
    { name: 'Id', type: 'int', accessModifier: 'public' },
    { name: 'Name', type: 'string', accessModifier: 'public' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clases</h1>
          <p className="text-gray-600">Gestiona las clases del sistema</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      {/* Classes List */}
      <div className="grid gap-4">
        {classes.map((class_) => (
          <Card key={class_.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                    <div>
                      <h3 className="text-lg font-semibold">{class_.name}</h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{class_.namespace}</Badge>
                        {class_.isAbstract && <Badge>Abstracta</Badge>}
                        {class_.isSealed && <Badge>Sellada</Badge>}
                        {class_.parentClass && <Badge variant="secondary">Hereda de {class_.parentClass}</Badge>}
                        <Badge variant="secondary">{class_.attributes} atributos</Badge>
                        <Badge variant="secondary">{class_.methods} métodos</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleClassExpansion(class_.id)}
                    >
                      {expandedClasses.has(class_.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClass(class_)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteClass(class_)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Collapsible open={expandedClasses.has(class_.id)}>
                  <CollapsibleContent>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Detalles de la clase</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Método
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar Clase
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Atributos</h5>
                          <div className="space-y-2">
                            {mockAttributes.map((attr, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{attr.name}: {attr.type}</span>
                                <Badge variant="outline" className="text-xs">{attr.accessModifier}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Métodos</h5>
                          <div className="space-y-2">
                            {mockMethods.map((method, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{method.name}(): {method.returnType}</span>
                                <Badge variant="outline" className="text-xs">{method.parameters} params</Badge>
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

      <CreateClassModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
        availableNamespaces={['System.Core', 'Business.Logic', 'Data.Access', 'Domain.Models']}
        availableClasses={['BaseEntity', 'Entity', 'Model']}
      />

      <EditClassModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateClass}
        class_={selectedClass}
        availableNamespaces={['System.Core', 'Business.Logic', 'Data.Access', 'Domain.Models']}
        availableClasses={['BaseEntity', 'Entity', 'Model']}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteClass}
        title="Eliminar Clase"
        description="¿Estás seguro de que querés eliminar esta clase?"
        itemName={selectedClass?.name || ''}
        warningMessage={selectedClass?.methods > 0 || selectedClass?.attributes > 0 
          ? "Esta clase contiene métodos y/o atributos que también serán eliminados." 
          : undefined}
      />
    </div>
  );
};

export default Classes;
