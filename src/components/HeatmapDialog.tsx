import React, { useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Activity, Download, Image } from 'lucide-react';
import { GameAction, ZONES, getZoneName, ActionType } from '@/types/football';
import fieldImage from '@/assets/football-field.jpg';

interface HeatmapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions: GameAction[];
  actionTypes: ActionType[];
  teamColors: { A: string; B: string };
  teamNames: { A: string; B: string };
}

export const HeatmapDialog: React.FC<HeatmapDialogProps> = ({
  isOpen,
  onClose,
  actions,
  actionTypes,
  teamColors,
  teamNames,
}) => {
  const heatmapRef = useRef<HTMLDivElement>(null);
  const heatmapData = useMemo(() => {
    const teamAActions = actions.filter(a => a.team === 'A');
    const teamBActions = actions.filter(a => a.team === 'B');

    const getZoneStats = (teamActions: GameAction[]) => {
      const zoneStats: Record<string, number> = {};
      const zoneActions: Record<string, GameAction[]> = {};
      
      teamActions.forEach(action => {
        zoneStats[action.zone] = (zoneStats[action.zone] || 0) + 1;
        if (!zoneActions[action.zone]) {
          zoneActions[action.zone] = [];
        }
        zoneActions[action.zone].push(action);
      });
      
      return { zoneStats, zoneActions };
    };

    const teamAData = getZoneStats(teamAActions);
    const teamBData = getZoneStats(teamBActions);
    
    const maxTeamA = Math.max(...Object.values(teamAData.zoneStats), 1);
    const maxTeamB = Math.max(...Object.values(teamBData.zoneStats), 1);

    const getTopActionsInZone = (zoneActions: Record<string, GameAction[]>, zoneId: string) => {
      const actionsInZone = zoneActions[zoneId] || [];
      const actionTypeCounts: Record<string, number> = {};
      
      actionsInZone.forEach(action => {
        const actionName = actionTypes.find(at => at.id === action.actionType)?.name || action.actionType;
        actionTypeCounts[actionName] = (actionTypeCounts[actionName] || 0) + 1;
      });
      
      return Object.entries(actionTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([actionName, count]) => ({ actionName, count }));
    };

    return {
      teamA: {
        zones: teamAData.zoneStats,
        max: maxTeamA,
        total: teamAActions.length,
        zoneActions: teamAData.zoneActions,
        topZones: Object.entries(teamAData.zoneStats)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([zoneId, count]) => ({ 
            zoneId, 
            count, 
            name: getZoneName(zoneId),
            topActions: getTopActionsInZone(teamAData.zoneActions, zoneId)
          })),
      },
      teamB: {
        zones: teamBData.zoneStats,
        max: maxTeamB,
        total: teamBActions.length,
        zoneActions: teamBData.zoneActions,
        topZones: Object.entries(teamBData.zoneStats)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([zoneId, count]) => ({ 
            zoneId, 
            count, 
            name: getZoneName(zoneId),
            topActions: getTopActionsInZone(teamBData.zoneActions, zoneId)
          })),
      },
    };
  }, [actions, actionTypes]);

  const getZoneOpacity = (zoneId: string, teamData: typeof heatmapData.teamA): number => {
    const count = teamData.zones[zoneId] || 0;
    if (count === 0) return 0;
    return Math.max(0.1, count / teamData.max);
  };

  const getZonePosition = (zoneId: string): { left: string; top: string; width: string; height: string } => {
    // Map zone IDs to grid positions
    const zonePositions: Record<string, { col: number; row: number; colSpan?: number; rowSpan?: number }> = {
      // Z1 - Left goal area (3 zones)
      'Z1_LINE_TOP': { col: 0, row: 0 },
      'Z1_GOAL': { col: 0, row: 1 },
      'Z1_LINE_BOTTOM': { col: 0, row: 2 },

      // Z2 - Left progression (5 zones)
      'Z2_PROG_TOP': { col: 1, row: 0 },
      'Z2_PROG_CENTRAL_TOP': { col: 1, row: 1 },
      'Z2_PROG_CENTRAL_MID': { col: 1, row: 2 },
      'Z2_PROG_CENTRAL_BOTTOM': { col: 1, row: 3 },
      'Z2_PROG_BOTTOM': { col: 1, row: 4 },

      // Z3 - Center field (5 zones)
      'Z3_MID_TOP': { col: 2, row: 0 },
      'Z3_MID_CENTRAL_TOP': { col: 2, row: 1 },
      'Z3_MID_CENTRAL': { col: 2, row: 2 },
      'Z3_MID_CENTRAL_BOTTOM': { col: 2, row: 3 },
      'Z3_MID_BOTTOM': { col: 2, row: 4 },

      // Z4 - Right progression (5 zones)
      'Z4_PROG_TOP': { col: 3, row: 0 },
      'Z4_PROG_CENTRAL_TOP': { col: 3, row: 1 },
      'Z4_PROG_CENTRAL_MID': { col: 3, row: 2 },
      'Z4_PROG_CENTRAL_BOTTOM': { col: 3, row: 3 },
      'Z4_PROG_BOTTOM': { col: 3, row: 4 },

      // Z5 - Right goal area (3 zones)
      'Z5_LINE_TOP': { col: 4, row: 0 },
      'Z5_GOAL': { col: 4, row: 1 },
      'Z5_LINE_BOTTOM': { col: 4, row: 2 },
    };

    const position = zonePositions[zoneId];
    if (!position) return { left: '0%', top: '0%', width: '20%', height: '20%' };

    // Calculate position based on 5x5 grid, but adjust for different row counts
    const colWidth = 20; // 100% / 5 columns
    const left = position.col * colWidth;

    let top: number, height: number;
    
    if (position.col === 0 || position.col === 4) {
      // Z1 and Z5 have 3 rows, but need to fill 5-row space
      const rowHeight = 100 / 3; // Distribute 3 rows across full height
      top = position.row * rowHeight;
      height = rowHeight;
    } else {
      // Z2, Z3, Z4 have 5 rows
      const rowHeight = 100 / 5;
      top = position.row * rowHeight;
      height = rowHeight;
    }

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${colWidth}%`,
      height: `${height}%`,
    };
  };

  const exportHeatmap = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = heatmapRef.current;
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `mapa_de_calor_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao exportar mapa de calor:', error);
      alert('Erro ao exportar mapa de calor. Tente novamente.');
    }
  };

  const getIntensityColor = (intensity: number) => {
    // Generate color from yellow to red based on intensity
    const hue = Math.max(0, 60 - (intensity * 60)); // 60 = yellow, 0 = red
    return `hsl(${hue}, 100%, 50%)`;
  };

  const TeamHeatmap: React.FC<{ 
    teamId: 'A' | 'B';
    teamData: typeof heatmapData.teamA;
  }> = ({ teamId, teamData }) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${teamColors[teamId]}20`, color: teamColors[teamId] }}
              >
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Ações</p>
                <p className="text-2xl font-bold">{teamData.total}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Zonas Ativas</p>
              <p className="text-2xl font-bold">{Object.keys(teamData.zones).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button onClick={exportHeatmap} variant="outline" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Exportar Mapa Selecionado
        </Button>
      </div>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Mapa de Calor - {teamNames[teamId]}
            <div className="text-sm text-muted-foreground ml-auto">
              Intensidade de ações por zona do campo
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative" ref={heatmapRef}>
            {/* Field background */}
            <img
              src={fieldImage}
              alt="Campo de Futebol"
              className="w-full h-auto rounded-lg"
            />
            
      {/* Heat overlay with improved colors and percentage display */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              {ZONES.map((zone) => {
                const count = teamData.zones[zone.id] || 0;
                const intensity = count > 0 ? count / teamData.max : 0;
                const percentage = teamData.total > 0 ? ((count / teamData.total) * 100).toFixed(1) : '0.0';
                const position = getZonePosition(zone.id);
                
                return (
                  <div
                    key={zone.id}
                    className="absolute transition-all duration-300 border border-white/30 flex flex-col items-center justify-center text-center p-1"
                    style={{
                      ...position,
                      backgroundColor: count > 0 
                        ? `${getIntensityColor(intensity)}${Math.round(intensity * 0.8 * 255).toString(16).padStart(2, '0')}` 
                        : 'rgba(255, 255, 255, 0.1)',
                    }}
                    title={`${zone.name}: ${count} ações (${percentage}%)`}
                  >
                    {count > 0 ? (
                      <>
                        <div className="text-white text-sm font-bold drop-shadow-lg">
                          {percentage}%
                        </div>
                        <div className="text-white text-xs drop-shadow-lg">
                          {count}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-xs">
                        0.0%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Enhanced Legend */}
            <div className="absolute bottom-2 left-2 bg-black/80 text-white p-3 rounded text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Intensidade:</span>
                  <div className="flex gap-1">
                    {[0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                      <div
                        key={intensity}
                        className="w-4 h-4 border border-white/30 flex items-center justify-center text-[10px]"
                        style={{
                          backgroundColor: `${getIntensityColor(intensity)}${Math.round(intensity * 0.7 * 255).toString(16).padStart(2, '0')}`,
                        }}
                      >
                        {Math.round(intensity * teamData.max)}
                      </div>
                    ))}
                  </div>
                  <span>Baixa → Alta</span>
                </div>
                <div className="text-[10px] text-gray-300">
                  Total: {teamData.total} ações • Máx por zona: {teamData.max}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Zones */}
      {teamData.topZones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Zonas Mais Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamData.topZones.map((zone, index) => (
                <div key={zone.zoneId} className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="font-bold"
                    style={{
                      borderColor: teamColors[teamId],
                      color: teamColors[teamId],
                    }}
                  >
                    #{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{zone.name}</span>
                      <span className="text-sm font-bold">{zone.count} ações</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: getIntensityColor(zone.count / teamData.max),
                          width: `${(zone.count / teamData.max) * 100}%`,
                        }}
                      />
                    </div>
                    {/* Top actions in this zone */}
                    {zone.topActions && zone.topActions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">Ações principais:</div>
                        {zone.topActions.map((action, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{action.actionName}</span>
                            <span>{action.count}x</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{((zone.count / teamData.total) * 100).toFixed(1)}%</div>
                    <div className="text-[10px] mt-1">do total</div>
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
            <Flame className="h-6 w-6" />
            Mapa de Calor das Ações
          </DialogTitle>
        </DialogHeader>

        {actions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Flame className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma ação registrada</p>
            <p className="text-sm mt-1">
              Registre algumas ações no campo para ver o mapa de calor
            </p>
          </div>
        ) : (
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
              <TeamHeatmap teamId="A" teamData={heatmapData.teamA} />
            </TabsContent>

            <TabsContent value="B" className="mt-6">
              <TeamHeatmap teamId="B" teamData={heatmapData.teamB} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};