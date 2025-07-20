import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText } from 'lucide-react';
import { Player } from '@/types/football';

interface ImportPlayersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPlayers: (teamId: 'A' | 'B', players: Omit<Player, 'id' | 'team'>[]) => void;
  teamNames: { A: string; B: string };
}

export const ImportPlayersDialog: React.FC<ImportPlayersDialogProps> = ({
  isOpen,
  onClose,
  onImportPlayers,
  teamNames,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      parsePlayerData(content);
    };
    reader.readAsText(file);
  };

  const parsePlayerData = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      const players: Omit<Player, 'id' | 'team'>[] = [];

      for (const line of lines) {
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length >= 3) {
          const number = parseInt(parts[0]);
          const name = parts[1];
          const position = parts[2];

          if (!isNaN(number) && number >= 1 && number <= 99 && name && position) {
            players.push({ number, name, position });
          }
        }
      }

      if (players.length > 0) {
        onImportPlayers(selectedTeam, players);
        setFileName('');
        onClose();
      } else {
        alert('Nenhum jogador válido encontrado no arquivo. Verifique o formato.');
      }
    } catch (error) {
      alert('Erro ao processar o arquivo. Verifique o formato.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Jogadores via TXT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Formato:</strong> Número,Nome,Posição (um jogador por linha)</p>
            <p className="mt-1">Exemplo:</p>
            <code className="block text-xs bg-muted p-2 rounded mt-1">
              10,Pelé,Atacante<br/>
              7,Ronaldinho,Meio-campo<br/>
              1,Taffarel,Goleiro
            </code>
          </div>

          <div>
            <Label htmlFor="team">Time de Destino</Label>
            <Select value={selectedTeam} onValueChange={(value: 'A' | 'B') => setSelectedTeam(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{teamNames.A}</SelectItem>
                <SelectItem value="B">{teamNames.B}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Arquivo TXT</Label>
            <Button
              variant="outline"
              onClick={handleFileSelect}
              className="w-full mt-2 h-12 border-dashed"
            >
              <FileText className="h-4 w-4 mr-2" />
              {fileName || 'Escolher Arquivo'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName && (
              <p className="text-xs text-muted-foreground mt-1">
                Arquivo selecionado: {fileName}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleFileSelect} 
              className="flex-1 action-btn"
              disabled={!fileName}
            >
              {fileName ? 'Importar' : 'Escolher Arquivo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};