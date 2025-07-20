import React, { useEffect } from 'react';
import { Team } from '@/types/football';

interface TeamColorProviderProps {
  teams: { A: Team; B: Team };
  children: React.ReactNode;
}

export const TeamColorProvider: React.FC<TeamColorProviderProps> = ({ teams, children }) => {
  useEffect(() => {
    // Create dynamic CSS variables for team colors
    const root = document.documentElement;
    
    // Team A colors
    const teamAColors = teams.A.colors || {
      primary: teams.A.color,
      secondary: teams.A.color,
      accent: teams.A.color,
      background: '#f8f9fa',
    };
    
    root.style.setProperty('--team-a-primary', teamAColors.primary);
    root.style.setProperty('--team-a-secondary', teamAColors.secondary);
    root.style.setProperty('--team-a-accent', teamAColors.accent);
    root.style.setProperty('--team-a-background', teamAColors.background);
    
    // Team B colors
    const teamBColors = teams.B.colors || {
      primary: teams.B.color,
      secondary: teams.B.color,
      accent: teams.B.color,
      background: '#f8f9fa',
    };
    
    root.style.setProperty('--team-b-primary', teamBColors.primary);
    root.style.setProperty('--team-b-secondary', teamBColors.secondary);
    root.style.setProperty('--team-b-accent', teamBColors.accent);
    root.style.setProperty('--team-b-background', teamBColors.background);
    
    // Create gradients
    root.style.setProperty('--team-a-gradient', `linear-gradient(135deg, ${teamAColors.primary}, ${teamAColors.secondary})`);
    root.style.setProperty('--team-b-gradient', `linear-gradient(135deg, ${teamBColors.primary}, ${teamBColors.secondary})`);
    
  }, [teams]);

  return <>{children}</>;
};