
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métodos</h1>
          <p className="text-gray-600">Gestiona los métodos del sistema</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Método
        </Button>
      </div>

      {/* Create Method */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Método</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Nombre del método" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Clase asociada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UserRepository">UserRepository</SelectItem>
                <SelectItem value="BaseEntity">BaseEntity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Tipo de retorno" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Parámetros</label>
            <div className="flex gap-2">
              <Input placeholder="Tipo" />
              <Input placeholder="Nombre" />
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button>Crear Método</Button>
        </CardContent>
      </Card>

      {/* Methods List */}
      <div className="grid gap-4">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-6">
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

export default Methods;
