import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users } from 'lucide-react';
import { Player } from '@/types/football';

interface PlayersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  players: { A: Player[]; B: Player[] };
  teamColors: { A: string; B: string };
  teamNames: { A: string; B: string };
  onAddPlayer: (teamId: 'A' | 'B', player: Omit<Player, 'id' | 'team'>) => void;
  onRemovePlayer: (teamId: 'A' | 'B', playerId: string) => void;
}

export const PlayersDialog: React.FC<PlayersDialogProps> = ({
  isOpen,
  onClose,
  players,
  teamColors,
  teamNames,
  onAddPlayer,
  onRemovePlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [newPlayer, setNewPlayer] = useState({
    number: '',
    name: '',
    position: '',
  });

  const handleAddPlayer = () => {
    const number = parseInt(newPlayer.number);
    
    if (!newPlayer.name.trim() || !newPlayer.position.trim() || isNaN(number) || number < 1 || number > 99) {
      alert('Por favor, preencha todos os campos corretamente');
      return;
    }

    // Check if number already exists
    const existingPlayer = players[activeTab].find(p => p.number === number);
    if (existingPlayer) {
      alert(`Jogador com número ${number} já existe no ${teamNames[activeTab]}`);
      return;
    }

    onAddPlayer(activeTab, {
      number,
      name: newPlayer.name.trim(),
      position: newPlayer.position.trim(),
    });

    setNewPlayer({ number: '', name: '', position: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const TeamPlayerList: React.FC<{ teamId: 'A' | 'B' }> = ({ teamId }) => {
    const teamPlayers = players[teamId].sort((a, b) => a.number - b.number);

    return (
      <div className="space-y-4">
        {/* Add Player Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Jogador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`number-${teamId}`}>Número</Label>
                <Input
                  id={`number-${teamId}`}
                  type="number"
                  min="1"
                  max="99"
                  placeholder="10"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, number: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`name-${teamId}`}>Nome</Label>
                <Input
                  id={`name-${teamId}`}
                  placeholder="Nome do jogador"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor={`position-${teamId}`}>Posição</Label>
                <Input
                  id={`position-${teamId}`}
                  placeholder="Ex: Atacante, Meio-campo..."
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, position: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddPlayer}
                  className="w-full action-btn"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Elenco ({teamPlayers.length} jogadores)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamPlayers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum jogador cadastrado</p>
                <p className="text-sm mt-1">Adicione o primeiro jogador acima</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teamPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="font-bold"
                        style={{
                          borderColor: teamColors[teamId],
                          color: teamColors[teamId],
                        }}
                      >
                        #{player.number}
                      </Badge>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.position}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePlayer(teamId, player.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gerenciar Jogadores
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'A' | 'B')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="A" 
              className="flex items-center gap-2"
              style={{ '--tw-ring-color': teamColors.A } as React.CSSProperties}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: teamColors.A }}
              />
              {teamNames.A}
            </TabsTrigger>
            <TabsTrigger 
              value="B" 
              className="flex items-center gap-2"
              style={{ '--tw-ring-color': teamColors.B } as React.CSSProperties}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: teamColors.B }}
              />
              {teamNames.B}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="A" className="mt-6">
            <TeamPlayerList teamId="A" />
          </TabsContent>

          <TabsContent value="B" className="mt-6">
            <TeamPlayerList teamId="B" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};