import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Activity } from 'lucide-react';
import { GameAction, ZONES, getZoneName } from '@/types/football';
import fieldImage from '@/assets/football-field.jpg';

interface HeatmapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions: GameAction[];
  teamColors: { A: string; B: string };
  teamNames: { A: string; B: string };
}

export const HeatmapDialog: React.FC<HeatmapDialogProps> = ({
  isOpen,
  onClose,
  actions,
  teamColors,
  teamNames,
}) => {
  const heatmapData = useMemo(() => {
    const teamAActions = actions.filter(a => a.team === 'A');
    const teamBActions = actions.filter(a => a.team === 'B');

    const getZoneStats = (teamActions: GameAction[]) => {
      const zoneStats: Record<string, number> = {};
      teamActions.forEach(action => {
        zoneStats[action.zone] = (zoneStats[action.zone] || 0) + 1;
      });
      return zoneStats;
    };

    const teamAZones = getZoneStats(teamAActions);
    const teamBZones = getZoneStats(teamBActions);
    
    const maxTeamA = Math.max(...Object.values(teamAZones), 1);
    const maxTeamB = Math.max(...Object.values(teamBZones), 1);

    return {
      teamA: {
        zones: teamAZones,
        max: maxTeamA,
        total: teamAActions.length,
        topZones: Object.entries(teamAZones)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([zoneId, count]) => ({ zoneId, count, name: getZoneName(zoneId) })),
      },
      teamB: {
        zones: teamBZones,
        max: maxTeamB,
        total: teamBActions.length,
        topZones: Object.entries(teamBZones)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([zoneId, count]) => ({ zoneId, count, name: getZoneName(zoneId) })),
      },
    };
  }, [actions]);

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

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Mapa de Calor - {teamNames[teamId]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Field background */}
            <img
              src={fieldImage}
              alt="Campo de Futebol"
              className="w-full h-auto rounded-lg"
            />
            
            {/* Heat overlay */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              {ZONES.map((zone) => {
                const opacity = getZoneOpacity(zone.id, teamData);
                const position = getZonePosition(zone.id);
                
                if (opacity === 0) return null;
                
                return (
                  <div
                    key={zone.id}
                    className="absolute transition-all duration-300 border border-white/30"
                    style={{
                      ...position,
                      backgroundColor: `${teamColors[teamId]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                    }}
                    title={`${zone.name}: ${teamData.zones[zone.id] || 0} ações`}
                  />
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white p-2 rounded text-xs">
              <div className="flex items-center gap-2">
                <span>Intensidade:</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                    <div
                      key={opacity}
                      className="w-4 h-4 border border-white/30"
                      style={{
                        backgroundColor: `${teamColors[teamId]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                      }}
                    />
                  ))}
                </div>
                <span>Max</span>
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
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: teamColors[teamId],
                          width: `${(zone.count / teamData.max) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((zone.count / teamData.total) * 100).toFixed(1)}%
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