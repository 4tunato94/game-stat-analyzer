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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Player } from '@/types/football';

interface AddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (teamId: 'A' | 'B', player: Omit<Player, 'id' | 'team'>) => void;
  existingPlayers: { A: Player[]; B: Player[] };
  teamNames: { A: string; B: string };
}

export const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({
  isOpen,
  onClose,
  onAddPlayer,
  existingPlayers,
  teamNames,
}) => {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    position: '',
    team: 'A' as 'A' | 'B',
  });

  const handleSubmit = () => {
    const number = parseInt(formData.number);
    
    if (!formData.name.trim() || !formData.position.trim() || isNaN(number) || number < 1 || number > 99) {
      alert('Por favor, preencha todos os campos corretamente');
      return;
    }

    // Check if number already exists
    const existingPlayer = existingPlayers[formData.team].find(p => p.number === number);
    if (existingPlayer) {
      alert(`Jogador com número ${number} já existe no ${teamNames[formData.team]}`);
      return;
    }

    onAddPlayer(formData.team, {
      number,
      name: formData.name.trim(),
      position: formData.position.trim(),
    });

    setFormData({ number: '', name: '', position: '', team: 'A' });
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Novo Jogador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                type="number"
                min="1"
                max="99"
                placeholder="10"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div>
              <Label htmlFor="team">Time</Label>
              <Select value={formData.team} onValueChange={(value: 'A' | 'B') => setFormData(prev => ({ ...prev, team: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">{teamNames.A}</SelectItem>
                  <SelectItem value="B">{teamNames.B}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome do Jogador</Label>
            <Input
              id="name"
              placeholder="Digite o nome do jogador"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div>
            <Label htmlFor="position">Posição</Label>
            <Input
              id="position"
              placeholder="Ex: Atacante, Meio-campo, Defensor..."
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1 action-btn">
              Adicionar Jogador
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};