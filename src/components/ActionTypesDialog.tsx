import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, Edit2, Trash2, User, Users } from 'lucide-react';
import { ActionType } from '@/types/football';

interface ActionTypesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionTypes: ActionType[];
  onAddActionType: (actionType: ActionType) => void;
  onUpdateActionType: (actionTypeId: string, updates: Partial<ActionType>) => void;
  onRemoveActionType: (actionTypeId: string) => void;
}

export const ActionTypesDialog: React.FC<ActionTypesDialogProps> = ({
  isOpen,
  onClose,
  actionTypes,
  onAddActionType,
  onUpdateActionType,
  onRemoveActionType,
}) => {
  const [newActionType, setNewActionType] = useState({
    id: '',
    name: '',
    requiresPlayer: false,
  });
  const [editingAction, setEditingAction] = useState<ActionType | null>(null);

  const generateId = (name: string): string => {
    return name.toLowerCase()
      .replace(/[áàâãä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleAddActionType = () => {
    if (!newActionType.name.trim()) {
      alert('Por favor, insira um nome para o tipo de ação');
      return;
    }

    const id = generateId(newActionType.name);
    
    // Check if ID already exists
    const existingAction = actionTypes.find(at => at.id === id);
    if (existingAction) {
      alert('Já existe um tipo de ação com este nome');
      return;
    }

    onAddActionType({
      id,
      name: newActionType.name.trim(),
      requiresPlayer: newActionType.requiresPlayer,
    });

    setNewActionType({ id: '', name: '', requiresPlayer: false });
  };

  const handleUpdateActionType = () => {
    if (!editingAction || !editingAction.name.trim()) {
      alert('Por favor, insira um nome válido');
      return;
    }

    onUpdateActionType(editingAction.id, {
      name: editingAction.name.trim(),
      requiresPlayer: editingAction.requiresPlayer,
    });

    setEditingAction(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingAction) {
        handleUpdateActionType();
      } else {
        handleAddActionType();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Gerenciar Tipos de Ação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Action Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingAction ? 'Editar Tipo de Ação' : 'Adicionar Novo Tipo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="actionName">Nome da Ação</Label>
                <Input
                  id="actionName"
                  placeholder="Ex: Passes Certos, Cruzamentos..."
                  value={editingAction ? editingAction.name : newActionType.name}
                  onChange={(e) => {
                    if (editingAction) {
                      setEditingAction(prev => prev ? { ...prev, name: e.target.value } : null);
                    } else {
                      setNewActionType(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="requiresPlayer">Requer Jogador Específico</Label>
                  <p className="text-sm text-muted-foreground">
                    Se ativado, será necessário informar o número do jogador
                  </p>
                </div>
                <Switch
                  id="requiresPlayer"
                  checked={editingAction ? editingAction.requiresPlayer : newActionType.requiresPlayer}
                  onCheckedChange={(checked) => {
                    if (editingAction) {
                      setEditingAction(prev => prev ? { ...prev, requiresPlayer: checked } : null);
                    } else {
                      setNewActionType(prev => ({ ...prev, requiresPlayer: checked }));
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                {editingAction ? (
                  <>
                    <Button onClick={handleUpdateActionType} className="action-btn flex-1">
                      Salvar Alterações
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingAction(null)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddActionType} className="action-btn w-full">
                    Adicionar Tipo de Ação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Existing Action Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tipos de Ação Configurados ({actionTypes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actionTypes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum tipo de ação configurado</p>
                  <p className="text-sm mt-1">Adicione o primeiro tipo acima</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {actionTypes.map((actionType) => (
                    <div
                      key={actionType.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {actionType.requiresPlayer ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : (
                            <Users className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{actionType.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {actionType.requiresPlayer ? 'Requer jogador específico' : 'Ação de time'}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAction(actionType)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Tipo de Ação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o tipo de ação "{actionType.name}"?
                                <br /><br />
                                <strong>Atenção:</strong> Todas as ações registradas deste tipo permanecerão no histórico, mas você não conseguirá criar novas ações deste tipo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onRemoveActionType(actionType.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
