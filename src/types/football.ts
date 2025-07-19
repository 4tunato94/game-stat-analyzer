// FutebolStats - Core data structures and types

export interface Team {
  id: 'A' | 'B';
  name: string;
  color: string; // hex color
}

export interface Player {
  id: string;
  number: number;
  name: string;
  position: string;
  team: 'A' | 'B';
}

export interface GameAction {
  id: string;
  timestamp: number;
  gameTime: string; // Format: "MM:SS"
  team: 'A' | 'B';
  zone: string; // Zone ID
  actionType: string; // Action type ID
  player?: Player; // Optional - depends on requiresPlayer
}

export interface ActionType {
  id: string;
  name: string;
  requiresPlayer: boolean;
}

export interface Zone {
  id: string;
  name: string;
}

// Game state interface
export interface GameState {
  isRunning: boolean;
  currentTime: number; // seconds
  actions: GameAction[];
  teams: {
    A: Team;
    B: Team;
  };
  players: {
    A: Player[];
    B: Player[];
  };
}

// Statistics interface
export interface TeamStats {
  totalActions: number;
  actionsByType: Record<string, number>;
  actionsByZone: Record<string, number>;
  playerStats: Record<string, number>;
}

export interface GameStats {
  teamA: TeamStats;
  teamB: TeamStats;
  totalActions: number;
  actionsByTime: Array<{ time: string; count: number }>;
}

// Predefined zones data
export const ZONES: Zone[] = [
  // Z1 - Left goal area
  { id: 'Z1_LINE_TOP', name: 'Z1 Linha de Fundo Sup. Esq.' },
  { id: 'Z1_GOAL', name: 'Z1 Gol Esq.' },
  { id: 'Z1_LINE_BOTTOM', name: 'Z1 Linha de Fundo Inf. Esq.' },

  // Z2 - Left progression
  { id: 'Z2_PROG_TOP', name: 'Z2 Progressão Sup.' },
  { id: 'Z2_PROG_CENTRAL_TOP', name: 'Z2 Progressão Central Sup.' },
  { id: 'Z2_PROG_CENTRAL_MID', name: 'Z2 Progressão Central Meio' },
  { id: 'Z2_PROG_CENTRAL_BOTTOM', name: 'Z2 Progressão Central Inf.' },
  { id: 'Z2_PROG_BOTTOM', name: 'Z2 Progressão Inf.' },

  // Z3 - Center field
  { id: 'Z3_MID_TOP', name: 'Z3 Meio Sup.' },
  { id: 'Z3_MID_CENTRAL_TOP', name: 'Z3 Meio Central Sup.' },
  { id: 'Z3_MID_CENTRAL', name: 'Z3 Meio Central' },
  { id: 'Z3_MID_CENTRAL_BOTTOM', name: 'Z3 Meio Central Inf.' },
  { id: 'Z3_MID_BOTTOM', name: 'Z3 Meio Inf.' },

  // Z4 - Right progression
  { id: 'Z4_PROG_TOP', name: 'Z4 Progressão Sup.' },
  { id: 'Z4_PROG_CENTRAL_TOP', name: 'Z4 Progressão Central Sup.' },
  { id: 'Z4_PROG_CENTRAL_MID', name: 'Z4 Progressão Central Meio' },
  { id: 'Z4_PROG_CENTRAL_BOTTOM', name: 'Z4 Progressão Central Inf.' },
  { id: 'Z4_PROG_BOTTOM', name: 'Z4 Progressão Inf.' },

  // Z5 - Right goal area
  { id: 'Z5_LINE_TOP', name: 'Z5 Linha de Fundo Sup. Dir.' },
  { id: 'Z5_GOAL', name: 'Z5 Gol Dir.' },
  { id: 'Z5_LINE_BOTTOM', name: 'Z5 Linha de Fundo Inf. Dir.' },
];

// Default action types - will be managed as state for customization
export const DEFAULT_ACTION_TYPES: ActionType[] = [
  // General actions
  { id: 'defensive', name: 'Ação Defensiva', requiresPlayer: false },
  { id: 'offensive', name: 'Ação Ofensiva', requiresPlayer: false },

  // Shooting actions
  { id: 'shot_on_target', name: 'Chutes no Alvo', requiresPlayer: true },
  { id: 'shot_off_target', name: 'Chutes Fora do Alvo', requiresPlayer: true },
  { id: 'goal', name: 'Gols', requiresPlayer: true },

  // Fouls
  { id: 'foul', name: 'Faltas Cometidas', requiresPlayer: true },
  { id: 'foul_suffered', name: 'Faltas Sofridas', requiresPlayer: true },

  // Cards
  { id: 'yellow_card', name: 'Cartões Amarelos', requiresPlayer: true },
  { id: 'red_card', name: 'Cartão Vermelho Direto', requiresPlayer: true },

  // Other actions
  { id: 'assist', name: 'Assistências', requiresPlayer: true },
  { id: 'offside', name: 'Impedimentos', requiresPlayer: true },

  // Set pieces
  { id: 'corner', name: 'Escanteios', requiresPlayer: true },
  { id: 'throw_in', name: 'Lateral', requiresPlayer: true },
  { id: 'goal_kick', name: 'Tiro de Meta', requiresPlayer: true },
];

// Utility function to get zone name by ID
export const getZoneName = (zoneId: string): string => {
  const zone = ZONES.find(z => z.id === zoneId);
  return zone?.name || zoneId;
};

// Utility function to format game time
export const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Zone detection utility - converts click coordinates to zone ID
export const getZoneFromCoordinates = (
  x: number, 
  y: number, 
  fieldWidth: number, 
  fieldHeight: number
): string => {
  // Calculate relative positions (0-1)
  const relativeX = x / fieldWidth;
  const relativeY = y / fieldHeight;

  // Determine column (5 columns total)
  let column: number;
  if (relativeX < 0.2) column = 1; // Z1
  else if (relativeX < 0.4) column = 2; // Z2
  else if (relativeX < 0.6) column = 3; // Z3
  else if (relativeX < 0.8) column = 4; // Z4
  else column = 5; // Z5

  // Determine row based on column
  let zoneId: string;
  
  if (column === 1 || column === 5) {
    // Z1 and Z5 have 3 zones each
    const prefix = column === 1 ? 'Z1' : 'Z5';
    if (relativeY < 0.33) {
      zoneId = `${prefix}_LINE_TOP`;
    } else if (relativeY < 0.67) {
      zoneId = `${prefix}_GOAL`;
    } else {
      zoneId = `${prefix}_LINE_BOTTOM`;
    }
  } else {
    // Z2, Z3, Z4 have 5 zones each
    const prefix = `Z${column}`;
    const isZ3 = column === 3;
    
    if (relativeY < 0.2) {
      zoneId = isZ3 ? `${prefix}_MID_TOP` : `${prefix}_PROG_TOP`;
    } else if (relativeY < 0.4) {
      zoneId = isZ3 ? `${prefix}_MID_CENTRAL_TOP` : `${prefix}_PROG_CENTRAL_TOP`;
    } else if (relativeY < 0.6) {
      zoneId = isZ3 ? `${prefix}_MID_CENTRAL` : `${prefix}_PROG_CENTRAL_MID`;
    } else if (relativeY < 0.8) {
      zoneId = isZ3 ? `${prefix}_MID_CENTRAL_BOTTOM` : `${prefix}_PROG_CENTRAL_BOTTOM`;
    } else {
      zoneId = isZ3 ? `${prefix}_MID_BOTTOM` : `${prefix}_PROG_BOTTOM`;
    }
  }

  return zoneId;
};
