import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Target, Award, Download, FileText, Image } from 'lucide-react';
import { GameAction, ActionType, Player } from '@/types/football';

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions: GameAction[];
  actionTypes: ActionType[];
  players: { A: Player[]; B: Player[] };
  teamColors: { A: string; B: string };
  teamNames: { A: string; B: string };
}

export const StatsDialog: React.FC<StatsDialogProps> = ({
  isOpen,
  onClose,
  actions,
  actionTypes,
  players,
  teamColors,
  teamNames,
}) => {
  const stats = useMemo(() => {
    const teamAActions = actions.filter(a => a.team === 'A');
    const teamBActions = actions.filter(a => a.team === 'B');
    const totalActions = actions.length;

    const getActionTypeName = (id: string) => {
      return actionTypes.find(at => at.id === id)?.name || id;
    };

    // Calculate possession based on total actions
    const possessionA = totalActions > 0 ? (teamAActions.length / totalActions) * 100 : 0;
    const possessionB = totalActions > 0 ? (teamBActions.length / totalActions) * 100 : 0;

    const getPlayerStats = (teamActions: GameAction[], teamPlayers: Player[]) => {
      const playerStats: Record<string, { player: Player; count: number; actions: string[] }> = {};
      
      teamActions.forEach(action => {
        if (action.player) {
          const key = `${action.player.number}`;
          if (!playerStats[key]) {
            playerStats[key] = {
              player: action.player,
              count: 0,
              actions: [],
            };
          }
          playerStats[key].count++;
          const actionName = getActionTypeName(action.actionType);
          if (!playerStats[key].actions.includes(actionName)) {
            playerStats[key].actions.push(actionName);
          }
        }
      });

      return Object.values(playerStats).sort((a, b) => b.count - a.count);
    };

    const getActionTypeStats = (teamActions: GameAction[]) => {
      const actionStats: Record<string, number> = {};
      
      teamActions.forEach(action => {
        const actionName = getActionTypeName(action.actionType);
        actionStats[actionName] = (actionStats[actionName] || 0) + 1;
      });

      return Object.entries(actionStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);
    };

    return {
      teamA: {
        totalActions: teamAActions.length,
        playerStats: getPlayerStats(teamAActions, players.A),
        actionTypeStats: getActionTypeStats(teamAActions),
        possession: possessionA,
      },
      teamB: {
        totalActions: teamBActions.length,
        playerStats: getPlayerStats(teamBActions, players.B),
        actionTypeStats: getActionTypeStats(teamBActions),
        possession: possessionB,
      },
      total: totalActions,
    };
  }, [actions, actionTypes, players]);

  const exportToText = () => {
    const content = `RELATÓRIO DE ESTATÍSTICAS DA PARTIDA
${teamNames.A} vs ${teamNames.B}
Total de Ações: ${stats.total}

POSSE DE BOLA:
${teamNames.A}: ${stats.teamA.possession.toFixed(1)}%
${teamNames.B}: ${stats.teamB.possession.toFixed(1)}%

ESTATÍSTICAS DETALHADAS:

${teamNames.A} (${stats.teamA.totalActions} ações):
${stats.teamA.actionTypeStats.map(([action, count]) => `  ${action}: ${count}`).join('\n')}

${teamNames.B} (${stats.teamB.totalActions} ações):
${stats.teamB.actionTypeStats.map(([action, count]) => `  ${action}: ${count}`).join('\n')}

ÚLTIMAS 10 AÇÕES:
${actions.slice(0, 10).map(action => {
  const actionName = actionTypes.find(at => at.id === action.actionType)?.name || action.actionType;
  const playerInfo = action.player ? ` (${action.player.name} #${action.player.number})` : '';
  return `${action.gameTime} - ${teamNames[action.team]} - ${actionName}${playerInfo}`;
}).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estatisticas_${teamNames.A}_vs_${teamNames.B}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToImage = async () => {
    // This would require html2canvas or similar library
    // For now, we'll show an alert
    alert('Funcionalidade de exportação de imagem será implementada em breve!');
  };

  const TeamStats: React.FC<{ 
    teamId: 'A' | 'B';
    teamStats: typeof stats.teamA;
  }> = ({ teamId, teamStats }) => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${teamColors[teamId]}20`, color: teamColors[teamId] }}
              >
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Ações</p>
                <p className="text-2xl font-bold">{teamStats.totalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${teamColors[teamId]}20`, color: teamColors[teamId] }}
              >
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jogadores Ativos</p>
                <p className="text-2xl font-bold">{teamStats.playerStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${teamColors[teamId]}20`, color: teamColors[teamId] }}
              >
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipos de Ação</p>
                <p className="text-2xl font-bold">{teamStats.actionTypeStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Statistics */}
      {teamStats.playerStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Estatísticas por Jogador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {teamStats.playerStats.slice(0, 10).map((playerStat, index) => (
                <div
                  key={playerStat.player.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <Badge 
                        variant="outline"
                        className="font-bold"
                        style={{
                          borderColor: teamColors[teamId],
                          color: teamColors[teamId],
                        }}
                      >
                        #{playerStat.player.number}
                      </Badge>
                      {index < 3 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{playerStat.player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {playerStat.player.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStat.count}</div>
                    <div className="text-xs text-muted-foreground">ações</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Type Statistics */}
      {teamStats.actionTypeStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ações Mais Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamStats.actionTypeStats.map(([actionName, count], index) => (
                <div key={actionName} className="flex items-center gap-3">
                  <div className="text-sm font-medium text-muted-foreground w-6">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{actionName}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: teamColors[teamId],
                          width: `${(count / Math.max(...teamStats.actionTypeStats.map(([, c]) => c))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Relatório de Estatísticas
          </DialogTitle>
        </DialogHeader>

        {actions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma ação registrada</p>
            <p className="text-sm mt-1">
              Registre algumas ações no campo para ver as estatísticas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Buttons */}
            <div className="flex gap-2 justify-center">
              <Button onClick={exportToText} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Exportar Resumo
              </Button>
              <Button onClick={exportToImage} variant="outline" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Exportar Detalhado
              </Button>
            </div>

            {/* Possession */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Posse de Bola</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <div 
                      className="text-4xl font-bold mb-2"
                      style={{ color: teamColors.A }}
                    >
                      {stats.teamA.possession.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">{teamNames.A}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                  <div className="text-center flex-1">
                    <div 
                      className="text-4xl font-bold mb-2"
                      style={{ color: teamColors.B }}
                    >
                      {stats.teamB.possession.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">{teamNames.B}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    Intensidade de ações por zona do campo
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          backgroundColor: teamColors.A,
                          width: `${stats.teamA.possession}%`
                        }}
                      />
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          backgroundColor: teamColors.B,
                          width: `${stats.teamB.possession}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Estatísticas Detalhadas</h3>
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                  <p className="text-muted-foreground">ações registradas no total</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: teamColors.A }}
                      >
                        {stats.teamA.totalActions}
                      </div>
                      <div className="text-sm text-muted-foreground">{teamNames.A}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-muted-foreground">
                        ESTATÍSTICAS
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: teamColors.B }}
                      >
                        {stats.teamB.totalActions}
                      </div>
                      <div className="text-sm text-muted-foreground">{teamNames.B}</div>
                    </div>
                  </div>

                  {/* Action type comparison */}
                  <div className="mt-6">
                    {actionTypes.slice(0, 10).map(actionType => {
                      const countA = stats.teamA.actionTypeStats.find(([name]) => name === actionType.name)?.[1] || 0;
                      const countB = stats.teamB.actionTypeStats.find(([name]) => name === actionType.name)?.[1] || 0;
                      
                      return (
                        <div key={actionType.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="text-sm font-medium text-center w-16" style={{ color: teamColors.A }}>
                            {countA}
                          </div>
                          <div className="text-sm font-medium flex-1 text-center">
                            {actionType.name}
                          </div>
                          <div className="text-sm font-medium text-center w-16" style={{ color: teamColors.B }}>
                            {countB}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Statistics */}
            <Tabs defaultValue="A">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="A"
                  className="flex items-center gap-2"
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
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: teamColors.B }}
                  />
                  {teamNames.B}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="A" className="mt-6">
                <TeamStats teamId="A" teamStats={stats.teamA} />
              </TabsContent>

              <TabsContent value="B" className="mt-6">
                <TeamStats teamId="B" teamStats={stats.teamB} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};