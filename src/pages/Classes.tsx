
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clases</h1>
          <p className="text-gray-600">Gestiona las clases del sistema</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      {/* Create Class */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Clase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Nombre de la clase" />
            <Input placeholder="Namespace asociado" />
          </div>
          <Input placeholder="Clase padre (opcional)" />
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="abstract" />
              <label htmlFor="abstract">Abstracta</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sealed" />
              <label htmlFor="sealed">Sellada</label>
            </div>
          </div>
          <Button>Crear Clase</Button>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Classes;
