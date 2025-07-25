import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { formatGameTime } from '@/types/football';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Components
import { AppSidebar } from '@/components/AppSidebar';
import { FieldMap } from '@/components/FieldMap';
import { ActionPopup } from '@/components/ActionPopup';
import { RecentActions } from '@/components/RecentActions';
import { PlayersDialog } from '@/components/PlayersDialog';
import { StatsDialog } from '@/components/StatsDialog';
import { HeatmapDialog } from '@/components/HeatmapDialog';
import { ActionTypesDialog } from '@/components/ActionTypesDialog';
import { TeamEditDialog } from '@/components/TeamEditDialog';
import { TeamColorProvider } from '@/components/TeamColorProvider';

const Index = () => {
  const {
    gameState,
    actionTypes,
    startTimer,
    stopTimer,
    resetTimer,
    updateTime,
    updateTeam,
    addPlayer,
    removePlayer,
    addAction,
    updateAction,
    removeAction,
    addActionType,
    updateActionType,
    removeActionType,
  } = useGameState();

  // Dialog states
  const [actionPopupOpen, setActionPopupOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [playersDialogOpen, setPlayersDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [heatmapDialogOpen, setHeatmapDialogOpen] = useState(false);
  const [actionTypesDialogOpen, setActionTypesDialogOpen] = useState(false);
  const [teamEditDialogOpen, setTeamEditDialogOpen] = useState(false);
  
  // Header visibility for mobile
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle zone click from field
  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setActionPopupOpen(true);
  };

  // Handle action submission
  const handleActionSubmit = (data: {
    team: 'A' | 'B';
    actionTypeId: string;
    playerNumber?: number;
  }) => {
    if (!selectedZone) return;

    let player = undefined;
    if (data.playerNumber) {
      // Find or create player
      const existingPlayer = gameState.players[data.team].find(p => p.number === data.playerNumber);
      if (existingPlayer) {
        player = existingPlayer;
      } else {
        // Create a basic player record
        const newPlayer = {
          number: data.playerNumber,
          name: `Jogador #${data.playerNumber}`,
          position: 'Posição não definida',
        };
        addPlayer(data.team, newPlayer);
        
        // Get the created player
        player = {
          id: `${data.team}-${data.playerNumber}`,
          team: data.team,
          ...newPlayer,
        };
      }
    }

    addAction({
      team: data.team,
      zone: selectedZone,
      actionType: data.actionTypeId,
      gameTime: formatGameTime(gameState.currentTime),
      player,
    });

    // Clear the action popup but don't clear zone selection yet
    setActionPopupOpen(false);
  };

  // Handle action completion (to clear persistent markings)
  const handleActionCompleted = () => {
    setSelectedZone(null);
  };

  return (
    <TeamColorProvider teams={gameState.teams}>
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar
          isRunning={gameState.isRunning}
          currentTime={gameState.currentTime}
          onStart={startTimer}
          onStop={stopTimer}
          onReset={resetTimer}
          onTimeUpdate={updateTime}
          onOpenPlayersDialog={() => setPlayersDialogOpen(true)}
          onOpenStatsDialog={() => setStatsDialogOpen(true)}
          onOpenHeatmapDialog={() => setHeatmapDialogOpen(true)}
          onOpenActionTypesDialog={() => setActionTypesDialogOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header - Hidden on mobile when field is in focus */}
          <header className={`h-14 md:h-16 border-b flex items-center px-2 md:px-4 gap-2 md:gap-4 sticky top-0 z-40 transition-all duration-300 md:bg-card/80 md:backdrop-blur-md md:opacity-95 ${
            headerVisible 
              ? 'bg-card/40 backdrop-blur-sm opacity-70 md:bg-card/80 md:opacity-95' 
              : 'bg-transparent opacity-0 pointer-events-none md:bg-card/80 md:opacity-95 md:pointer-events-auto'
          }`}>
            
            <div className="flex-1 flex items-center justify-center">
              {/* Mobile Layout */}
              <div className="flex md:hidden items-center gap-2">
                {gameState.teams.A.logo ? (
                  <img 
                    src={gameState.teams.A.logo} 
                    alt={`Logo ${gameState.teams.A.name}`}
                    className="w-5 h-5 rounded-full object-cover border border-white shadow-sm"
                  />
                ) : (
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: gameState.teams.A.color }}
                  />
                )}
                <div className="text-xs font-medium">{gameState.teams.A.name}</div>
                <div className="text-lg font-bold text-primary mx-2">VS</div>
                <div className="text-xs font-medium">{gameState.teams.B.name}</div>
                {gameState.teams.B.logo ? (
                  <img 
                    src={gameState.teams.B.logo} 
                    alt={`Logo ${gameState.teams.B.name}`}
                    className="w-5 h-5 rounded-full object-cover border border-white shadow-sm"
                  />
                ) : (
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: gameState.teams.B.color }}
                  />
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-center gap-8">
                {/* Team A */}
                <div className="flex items-center gap-3">
                  {gameState.teams.A.logo ? (
                    <img 
                      src={gameState.teams.A.logo} 
                      alt={`Logo ${gameState.teams.A.name}`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: gameState.teams.A.color }}
                    />
                  )}
                  <div className="text-center">
                    <div className="font-bold text-lg">{gameState.teams.A.name}</div>
                  </div>
                </div>

                <div className="text-center px-6">
                  <div className="text-2xl font-bold text-primary">VS</div>
                  <div className="text-xs text-muted-foreground">
                    {formatGameTime(gameState.currentTime)}
                  </div>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-bold text-lg">{gameState.teams.B.name}</div>
                  </div>
                  {gameState.teams.B.logo ? (
                    <img 
                      src={gameState.teams.B.logo} 
                      alt={`Logo ${gameState.teams.B.name}`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: gameState.teams.B.color }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Timer and Edit Teams Button */}
            <div className={`flex items-center gap-1 md:gap-2 transition-opacity duration-300 ${headerVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-30'}`}>
              <div className="text-xs md:text-sm font-mono">
                {formatGameTime(gameState.currentTime)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTeamEditDialogOpen(true)}
                className="h-8 w-8 p-0 md:h-auto md:w-auto md:px-2 hover:bg-white/10"
              >
                <span className="hidden md:inline">Editar Times</span>
                <span className="md:hidden text-xs">⚙️</span>
              </Button>
              <ThemeToggle />
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Field Section - Full screen on mobile */}
            <div className="flex-1 p-1 md:p-6">
              <Card className="h-full">
                <CardContent className="p-2 md:p-6 h-full">
                  <FieldMap onZoneClick={handleZoneClick} onActionCompleted={handleActionCompleted} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Actions - Always visible */}
            <div className="p-2 md:p-6 pt-0">
              <RecentActions
                actions={gameState.actions}
                actionTypes={actionTypes}
                teamColors={{
                  A: gameState.teams.A.color,
                  B: gameState.teams.B.color,
                }}
                onEditAction={(action) => {
                  // TODO: Implement edit action
                  console.log('Edit action:', action);
                }}
                onDeleteAction={removeAction}
              />
            </div>
          </div>
        </main>

        {/* Dialogs */}
        <ActionPopup
          isOpen={actionPopupOpen}
          onClose={() => setActionPopupOpen(false)}
          zoneId={selectedZone}
          currentTime={gameState.currentTime}
          actionTypes={actionTypes}
          players={gameState.players}
          teamColors={{
            A: gameState.teams.A.color,
            B: gameState.teams.B.color,
          }}
          onActionSubmit={handleActionSubmit}
          onActionCompleted={handleActionCompleted}
        />

        <PlayersDialog
          isOpen={playersDialogOpen}
          onClose={() => setPlayersDialogOpen(false)}
          players={gameState.players}
          teamColors={{
            A: gameState.teams.A.color,
            B: gameState.teams.B.color,
          }}
          teamNames={{
            A: gameState.teams.A.name,
            B: gameState.teams.B.name,
          }}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
        />

        <StatsDialog
          isOpen={statsDialogOpen}
          onClose={() => setStatsDialogOpen(false)}
          actions={gameState.actions}
          actionTypes={actionTypes}
          players={gameState.players}
          teamColors={{
            A: gameState.teams.A.color,
            B: gameState.teams.B.color,
          }}
          teamNames={{
            A: gameState.teams.A.name,
            B: gameState.teams.B.name,
          }}
          teamLogos={{
            A: gameState.teams.A.logo,
            B: gameState.teams.B.logo,
          }}
        />

        <HeatmapDialog
          isOpen={heatmapDialogOpen}
          onClose={() => setHeatmapDialogOpen(false)}
          actions={gameState.actions}
          actionTypes={actionTypes}
          teamColors={{
            A: gameState.teams.A.color,
            B: gameState.teams.B.color,
          }}
          teamNames={{
            A: gameState.teams.A.name,
            B: gameState.teams.B.name,
          }}
        />

        <ActionTypesDialog
          isOpen={actionTypesDialogOpen}
          onClose={() => setActionTypesDialogOpen(false)}
          actionTypes={actionTypes}
          onAddActionType={addActionType}
          onUpdateActionType={updateActionType}
          onRemoveActionType={removeActionType}
        />

        <TeamEditDialog
          isOpen={teamEditDialogOpen}
          onClose={() => setTeamEditDialogOpen(false)}
          teams={gameState.teams}
          onUpdateTeam={updateTeam}
        />
      </div>
    </SidebarProvider>
    </TeamColorProvider>
  );
};

export default Index;
