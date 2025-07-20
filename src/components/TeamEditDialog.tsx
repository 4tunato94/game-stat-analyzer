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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, ImageIcon } from 'lucide-react';
import { Team } from '@/types/football';
import { LogoSelector } from './LogoSelector';
import { ColorPalette } from './ColorPalette';

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
  const [teamA, setTeamA] = useState({
    ...teams.A,
    colors: teams.A.colors || { primary: teams.A.color, secondary: teams.A.color, accent: teams.A.color, background: '#f8f9fa' }
  });
  const [teamB, setTeamB] = useState({
    ...teams.B,
    colors: teams.B.colors || { primary: teams.B.color, secondary: teams.B.color, accent: teams.B.color, background: '#f8f9fa' }
  });

  const handleSave = () => {
    // Update primary color to match the primary from colors palette
    const updatedTeamA = { ...teamA, color: teamA.colors?.primary || teamA.color };
    const updatedTeamB = { ...teamB, color: teamB.colors?.primary || teamB.color };
    
    onUpdateTeam('A', updatedTeamA);
    onUpdateTeam('B', updatedTeamB);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Personalizar Times
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="teamA" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teamA" className="flex items-center gap-2">
              {teamA.logo && (
                <img src={teamA.logo} alt="Logo A" className="w-4 h-4 rounded-full object-cover" />
              )}
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: teamA.colors?.primary || teamA.color }}
              />
              {teamA.name}
            </TabsTrigger>
            <TabsTrigger value="teamB" className="flex items-center gap-2">
              {teamB.logo && (
                <img src={teamB.logo} alt="Logo B" className="w-4 h-4 rounded-full object-cover" />
              )}
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: teamB.colors?.primary || teamB.color }}
              />
              {teamB.name}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teamA" className="mt-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="nameA">Nome do Time</Label>
                    <Input
                      id="nameA"
                      value={teamA.name}
                      onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                      placeholder="Digite o nome do time"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Logo */}
              <LogoSelector
                currentLogo={teamA.logo}
                onLogoChange={(logo) => setTeamA({ ...teamA, logo })}
                teamName={teamA.name}
              />

              {/* Colors */}
              <ColorPalette
                colors={teamA.colors || { primary: teamA.color, secondary: teamA.color, accent: teamA.color, background: '#f8f9fa' }}
                onColorsChange={(colors) => setTeamA({ ...teamA, colors })}
                teamName={teamA.name}
              />
            </div>
          </TabsContent>

          <TabsContent value="teamB" className="mt-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="nameB">Nome do Time</Label>
                    <Input
                      id="nameB"
                      value={teamB.name}
                      onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                      placeholder="Digite o nome do time"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Logo */}
              <LogoSelector
                currentLogo={teamB.logo}
                onLogoChange={(logo) => setTeamB({ ...teamB, logo })}
                teamName={teamB.name}
              />

              {/* Colors */}
              <ColorPalette
                colors={teamB.colors || { primary: teamB.color, secondary: teamB.color, accent: teamB.color, background: '#f8f9fa' }}
                onColorsChange={(colors) => setTeamB({ ...teamB, colors })}
                teamName={teamB.name}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 action-btn">
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};