import { useMemo } from 'react';
import { Team } from '@/types/football';

interface TeamColors {
  A: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  B: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const useTeamColors = (teams: { A: Team; B: Team }): TeamColors => {
  return useMemo(() => {
    const getTeamColors = (team: Team) => {
      if (team.colors) {
        return team.colors;
      }
      
      // Fallback to default colors based on the main color
      return {
        primary: team.color,
        secondary: team.color,
        accent: team.color,
        background: '#f8f9fa',
      };
    };

    return {
      A: getTeamColors(teams.A),
      B: getTeamColors(teams.B),
    };
  }, [teams]);
};

export const getTeamColorStyle = (teamId: 'A' | 'B', colors: TeamColors, colorType: 'primary' | 'secondary' | 'accent' | 'background' = 'primary') => {
  return colors[teamId][colorType];
};

export const getTeamGradient = (teamId: 'A' | 'B', colors: TeamColors) => {
  const teamColors = colors[teamId];
  return `linear-gradient(135deg, ${teamColors.primary}, ${teamColors.secondary})`;
};