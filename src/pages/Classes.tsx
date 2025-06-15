
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import CreateClassModal from '@/components/modals/CreateClassModal';
import { ClassFormData } from '@/schemas/formSchemas';
import { useToast } from '@/hooks/use-toast';

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

      <CreateClassModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
        availableNamespaces={['System.Core', 'Business.Logic', 'Data.Access', 'Domain.Models']}
        availableClasses={['BaseEntity', 'Entity', 'Model']}
      />
    </div>
  );
};

export default Classes;
