
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';

const Interfaces = () => {
  const [interfaces, setInterfaces] = useState([
    { id: 1, name: 'IRepository', namespace: 'Data.Access', methods: 4 },
    { id: 2, name: 'IService', namespace: 'Business.Logic', methods: 2 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interfaces</h1>
          <p className="text-gray-600">Gestiona las interfaces del sistema</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Interface
        </Button>
      </div>

      {/* Create Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Nombre de la interface" />
            <Input placeholder="Namespace asociado" />
          </div>
          <Button className="mt-4">Crear Interface</Button>
        </CardContent>
      </Card>

      {/* Interfaces List */}
      <div className="grid gap-4">
        {interfaces.map((interface_) => (
          <Card key={interface_.id}>
            <CardContent className="p-6">
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

export default Interfaces;
