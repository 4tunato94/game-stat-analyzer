import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Target, User } from 'lucide-react';
import { ActionType, Player, formatGameTime, getZoneName } from '@/types/football';

type PopupStep = 'team' | 'action' | 'player';

interface ActionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: string | null;
  currentTime: number;
  actionTypes: ActionType[];
  players: { A: Player[]; B: Player[] };
  teamColors: { A: string; B: string };
  onActionSubmit: (data: {
    team: 'A' | 'B';
    actionTypeId: string;
    playerNumber?: number;
  }) => void;
  onActionCompleted?: () => void;
}

export const ActionPopup: React.FC<ActionPopupProps> = ({
  isOpen,
  onClose,
  zoneId,
  currentTime,
  actionTypes,
  players,
  teamColors,
  onActionSubmit,
  onActionCompleted,
}) => {
  const [step, setStep] = useState<PopupStep>('team');
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
  const [selectedActionType, setSelectedActionType] = useState<ActionType | null>(null);
  const [playerNumber, setPlayerNumber] = useState<string>('');

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('team');
      setSelectedTeam(null);
      setSelectedActionType(null);
      setPlayerNumber('');
    }
  }, [isOpen]);

  const handleTeamSelect = (team: 'A' | 'B') => {
    setSelectedTeam(team);
    setStep('action');
  };

  const handleActionSelect = (actionType: ActionType) => {
    setSelectedActionType(actionType);
    
    if (actionType.requiresPlayer) {
      setStep('player');
    } else {
      // Submit immediately for team actions
      handleSubmit(actionType, undefined);
    }
  };

  const handlePlayerSubmit = () => {
    if (!selectedActionType || !playerNumber) return;
    
    const num = parseInt(playerNumber);
    if (isNaN(num) || num < 1 || num > 99) {
      alert('Por favor, insira um número válido de camisa (1-99)');
      return;
    }

    handleSubmit(selectedActionType, num);
  };

  const handleSubmit = (actionType: ActionType, playerNum?: number) => {
    if (!selectedTeam || !zoneId) return;

    onActionSubmit({
      team: selectedTeam,
      actionTypeId: actionType.id,
      playerNumber: playerNum,
    });

    onClose();
    onActionCompleted?.();
  };

  const handleBack = () => {
    if (step === 'action') {
      setStep('team');
      setSelectedTeam(null);
    } else if (step === 'player') {
      setStep('action');
      setSelectedActionType(null);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 'team': return <Users className="h-5 w-5" />;
      case 'action': return <Target className="h-5 w-5" />;
      case 'player': return <User className="h-5 w-5" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'team': return 'Selecionar Time';
      case 'action': return 'Tipo de Ação';
      case 'player': return 'Número do Jogador';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step !== 'team' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            {getStepIcon()}
            
            <div className="flex-1">
              <DialogTitle className="text-lg">{getStepTitle()}</DialogTitle>
              {zoneId && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getZoneName(zoneId)} • {formatGameTime(currentTime)}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {/* Team Selection Step */}
          {step === 'team' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Qual time realizou a ação?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleTeamSelect('A')}
                  className="team-a-btn h-16 text-lg font-semibold"
                  style={{ background: `linear-gradient(135deg, ${teamColors.A}, ${teamColors.A}dd)` }}
                >
                  Time A
                </Button>
                
                <Button
                  onClick={() => handleTeamSelect('B')}
                  className="team-b-btn h-16 text-lg font-semibold"
                  style={{ background: `linear-gradient(135deg, ${teamColors.B}, ${teamColors.B}dd)` }}
                >
                  Time B
                </Button>
              </div>
            </div>
          )}

          {/* Action Selection Step */}
          {step === 'action' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Que tipo de ação foi realizada?
              </p>
              
              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                {actionTypes.map((actionType) => (
                  <Button
                    key={actionType.id}
                    onClick={() => handleActionSelect(actionType)}
                    variant="outline"
                    className="justify-start h-12 text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{actionType.name}</span>
                      {actionType.requiresPlayer && (
                        <span className="text-xs text-muted-foreground">
                          Requer jogador
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Player Selection Step */}
          {step === 'player' && selectedTeam && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {selectedActionType?.name} - Número da camisa:
              </p>
              
              <div className="space-y-3">
                <Label htmlFor="playerNumber">Número do Jogador (1-99)</Label>
                <Input
                  id="playerNumber"
                  type="number"
                  min="1"
                  max="99"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  placeholder="Ex: 10"
                  className="text-center text-lg font-semibold"
                  autoFocus
                />
                
                {/* Show existing players for reference */}
                {players[selectedTeam].length > 0 && (
                  <div className="mt-4">
                    <Label className="text-xs text-muted-foreground">
                      Jogadores cadastrados:
                    </Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {players[selectedTeam]
                        .sort((a, b) => a.number - b.number)
                        .map((player) => (
                          <Button
                            key={player.id}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setPlayerNumber(player.number.toString())}
                          >
                            #{player.number}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handlePlayerSubmit}
                  className="w-full action-btn"
                  disabled={!playerNumber || isNaN(parseInt(playerNumber))}
                >
                  Registrar Ação
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};