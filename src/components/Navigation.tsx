
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Plus, FileCode2, Database, Settings, Layers } from 'lucide-react';

const Navigation = () => {
  const handleCreateClass = () => {
    console.log('Create class clicked');
    // TODO: Implement class creation functionality
  };

  const handleCreateInterface = () => {
    console.log('Create interface clicked');
    // TODO: Implement interface creation functionality
  };

  const handleCreateEnum = () => {
    console.log('Create enum clicked');
    // TODO: Implement enum creation functionality
  };

  const handleCreateStruct = () => {
    console.log('Create struct clicked');
    // TODO: Implement struct creation functionality
  };

  const handleCreateMethod = () => {
    console.log('Create method clicked');
    // TODO: Implement method creation functionality
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">ObjectSim</h1>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-64">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateClass}
                        >
                          <FileCode2 className="h-4 w-4 mr-2" />
                          Class
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateInterface}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Interface
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateEnum}
                        >
                          <Layers className="h-4 w-4 mr-2" />
                          Enum
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateStruct}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Struct
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateMethod}
                        >
                          <FileCode2 className="h-4 w-4 mr-2" />
                          Method
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Documentation
            </Button>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
