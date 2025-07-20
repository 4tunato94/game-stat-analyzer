import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Users,
  BarChart3,
  Flame,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Menu,
} from 'lucide-react';
import { GameTimer } from './GameTimer';

interface AppSidebarProps {
  isRunning: boolean;
  currentTime: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onTimeUpdate: (time: number) => void;
  onOpenPlayersDialog: () => void;
  onOpenStatsDialog: () => void;
  onOpenHeatmapDialog: () => void;
  onOpenActionTypesDialog: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isRunning,
  currentTime,
  onStart,
  onStop,
  onReset,
  onTimeUpdate,
  onOpenPlayersDialog,
  onOpenStatsDialog,
  onOpenHeatmapDialog,
  onOpenActionTypesDialog,
}) => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    {
      title: 'Gerenciar Jogadores',
      icon: Users,
      onClick: onOpenPlayersDialog,
    },
    {
      title: 'Relatório de Estatísticas',
      icon: BarChart3,
      onClick: onOpenStatsDialog,
    },
    {
      title: 'Mapa de Calor',
      icon: Flame,
      onClick: onOpenHeatmapDialog,
    },
    {
      title: 'Gerenciar Tipos de Ação',
      icon: Settings,
      onClick: onOpenActionTypesDialog,
    },
  ];

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-80'}>
      {/* Persistent Toggle Button - Center of screen */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 transition-all duration-300" style={{ left: collapsed ? '4px' : '320px' }}>
        <button
          onClick={toggleSidebar}
          className="h-10 w-10 rounded-full bg-primary/80 hover:bg-primary backdrop-blur-sm border border-primary/30 p-0 transition-all duration-300 flex items-center justify-center shadow-lg"
        >
          <span className="text-primary-foreground text-lg font-bold">{collapsed ? '›' : '‹'}</span>
        </button>
      </div>
      
      <SidebarContent className="p-4">
        {/* Timer Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Cronômetro da Partida
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed ? (
              <GameTimer
                isRunning={isRunning}
                currentTime={currentTime}
                onStart={onStart}
                onStop={onStop}
                onReset={onReset}
                onTimeUpdate={onTimeUpdate}
              />
            ) : (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
                    {(currentTime % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!isRunning ? (
                    <Button
                      onClick={onStart}
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={onStop}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={onReset}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Ferramentas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className="w-full justify-start hover:bg-sidebar-accent"
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Info Section */}
        {!collapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="text-xs text-muted-foreground text-center p-4">
                <div className="font-semibold text-primary mb-1">
                  FutebolStats
                </div>
                <div>Análise Tática Profissional</div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};