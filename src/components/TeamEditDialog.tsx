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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette } from 'lucide-react';
import { Team } from '@/types/football';

interface TeamEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teams: { A: Team; B: Team };
  onUpdateTeam: (teamId: 'A' | 'B', teamData: Partial<Team>) => void;
}

export const TeamEditDialog: React.FC<TeamEditDialogProps> = ({
  isOpen,
  onClose,
  teams,
  onUpdateTeam,
}) => {
  const [teamA, setTeamA] = useState(teams.A);
  const [teamB, setTeamB] = useState(teams.B);

  const handleSave = () => {
    onUpdateTeam('A', teamA);
    onUpdateTeam('B', teamB);
    onClose();
  };

  const predefinedColors = [
    '#0066CC', '#FF4444', '#00AA44', '#FF8800', 
    '#8844CC', '#00CCCC', '#CC4488', '#CCAA00'
  ];

  const TeamEditor: React.FC<{ 
    team: Team; 
    onChange: (team: Team) => void; 
    label: string 
  }> = ({ team, onChange, label }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-white"
            style={{ backgroundColor: team.color }}
          />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`name-${team.id}`}>Nome do Time</Label>
          <Input
            id={`name-${team.id}`}
            value={team.name}
            onChange={(e) => onChange({ ...team, name: e.target.value })}
            placeholder="Digite o nome do time"
          />
        </div>
        
        <div>
          <Label>Cor do Time</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              type="color"
              value={team.color}
              onChange={(e) => onChange({ ...team, color: e.target.value })}
              className="w-16 h-10 p-1 rounded"
            />
            <div className="flex gap-1 flex-wrap">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-white/30 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ ...team, color })}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editar Nomes dos Times
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <TeamEditor
            team={teamA}
            onChange={setTeamA}
            label="Time A"
          />
          
          <TeamEditor
            team={teamB}
            onChange={setTeamB}
            label="Time B"
          />

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 action-btn">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};