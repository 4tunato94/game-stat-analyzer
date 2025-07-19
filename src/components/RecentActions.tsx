import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Edit2, Trash2, Clock, MapPin, User } from 'lucide-react';
import { GameAction, ActionType, getZoneName } from '@/types/football';

interface RecentActionsProps {
  actions: GameAction[];
  actionTypes: ActionType[];
  teamColors: { A: string; B: string };
  onEditAction: (action: GameAction) => void;
  onDeleteAction: (actionId: string) => void;
}

export const RecentActions: React.FC<RecentActionsProps> = ({
  actions,
  actionTypes,
  teamColors,
  onEditAction,
  onDeleteAction,
}) => {
  const getActionTypeName = (actionTypeId: string) => {
    const actionType = actionTypes.find(at => at.id === actionTypeId);
    return actionType?.name || actionTypeId;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma ação registrada ainda</p>
            <p className="text-sm mt-1">
              Toque no campo para registrar a primeira ação
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Ações Recentes ({actions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {actions.slice(0, 20).map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              {/* Team Color Indicator */}
              <div
                className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: teamColors[action.team] }}
              />

              {/* Action Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {getActionTypeName(action.actionType)}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Time {action.team}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {action.gameTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {getZoneName(action.zone)}
                  </span>
                  {action.player && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      #{action.player.number} {action.player.name}
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mt-1">
                  {formatTime(action.timestamp)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditAction(action)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Ação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta ação? Esta operação não pode ser desfeita.
                        <br /><br />
                        <strong>Ação:</strong> {getActionTypeName(action.actionType)}<br />
                        <strong>Time:</strong> {action.team}<br />
                        <strong>Tempo:</strong> {action.gameTime}<br />
                        {action.player && (
                          <>
                            <strong>Jogador:</strong> #{action.player.number} {action.player.name}
                          </>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteAction(action.id)}
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
      </CardContent>
    </Card>
  );
};