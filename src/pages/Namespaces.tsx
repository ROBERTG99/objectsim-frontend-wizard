
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const Namespaces = () => {
  const [namespaces, setNamespaces] = useState([
    { id: 1, name: 'System.Core', classes: 3, interfaces: 2 },
    { id: 2, name: 'Business.Logic', classes: 5, interfaces: 1 },
  ]);
  
  const [newNamespace, setNewNamespace] = useState('');

  const handleCreateNamespace = () => {
    if (newNamespace.trim()) {
      const newNs = {
        id: namespaces.length + 1,
        name: newNamespace,
        classes: 0,
        interfaces: 0
      };
      setNamespaces([...namespaces, newNs]);
      setNewNamespace('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Namespaces</h1>
          <p className="text-gray-600">Gestiona los namespaces del sistema</p>
        </div>
        <Button className="flex items-center gap-2">
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
                    <div className="flex gap-2 mt-1">
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
    </div>
  );
};

export default Namespaces;
