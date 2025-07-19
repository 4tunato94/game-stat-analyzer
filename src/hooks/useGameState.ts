// Game state management hook
import { useState, useEffect, useCallback } from 'react';
import { GameState, GameAction, ActionType, Player, DEFAULT_ACTION_TYPES } from '@/types/football';

const STORAGE_KEY = 'futebol-stats-game';
const ACTION_TYPES_KEY = 'futebol-stats-action-types';

const initialGameState: GameState = {
  isRunning: false,
  currentTime: 0,
  actions: [],
  teams: {
    A: { id: 'A', name: 'Time A', color: '#2563eb' },
    B: { id: 'B', name: 'Time B', color: '#dc2626' },
  },
  players: {
    A: [],
    B: [],
  },
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [actionTypes, setActionTypes] = useState<ActionType[]>(DEFAULT_ACTION_TYPES);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved game state:', error);
      }
    }

    const savedActionTypes = localStorage.getItem(ACTION_TYPES_KEY);
    if (savedActionTypes) {
      try {
        setActionTypes(JSON.parse(savedActionTypes));
      } catch (error) {
        console.error('Error loading saved action types:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(ACTION_TYPES_KEY, JSON.stringify(actionTypes));
  }, [actionTypes]);

  // Timer management
  const startTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const stopTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isRunning: false, currentTime: 0 }));
  }, []);

  const updateTime = useCallback((time: number) => {
    setGameState(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Team management
  const updateTeam = useCallback((teamId: 'A' | 'B', name: string, color: string) => {
    setGameState(prev => ({
      ...prev,
      teams: {
        ...prev.teams,
        [teamId]: { id: teamId, name, color },
      },
    }));
  }, []);

  // Player management
  const addPlayer = useCallback((teamId: 'A' | 'B', player: Omit<Player, 'id' | 'team'>) => {
    const newPlayer: Player = {
      ...player,
      id: `${teamId}-${player.number}`,
      team: teamId,
    };

    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [teamId]: [...prev.players[teamId].filter(p => p.number !== player.number), newPlayer],
      },
    }));
  }, []);

  const removePlayer = useCallback((teamId: 'A' | 'B', playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [teamId]: prev.players[teamId].filter(p => p.id !== playerId),
      },
    }));
  }, []);

  // Action management
  const addAction = useCallback((action: Omit<GameAction, 'id' | 'timestamp'>) => {
    const newAction: GameAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setGameState(prev => ({
      ...prev,
      actions: [newAction, ...prev.actions],
    }));
  }, []);

  const updateAction = useCallback((actionId: string, updates: Partial<GameAction>) => {
    setGameState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      ),
    }));
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setGameState(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== actionId),
    }));
  }, []);

  // Action type management
  const addActionType = useCallback((actionType: ActionType) => {
    setActionTypes(prev => [...prev, actionType]);
  }, []);

  const updateActionType = useCallback((actionTypeId: string, updates: Partial<ActionType>) => {
    setActionTypes(prev =>
      prev.map(type =>
        type.id === actionTypeId ? { ...type, ...updates } : type
      )
    );
  }, []);

  const removeActionType = useCallback((actionTypeId: string) => {
    setActionTypes(prev => prev.filter(type => type.id !== actionTypeId));
  }, []);

  const clearAllData = useCallback(() => {
    setGameState(initialGameState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    gameState,
    actionTypes,
    
    // Timer controls
    startTimer,
    stopTimer,
    resetTimer,
    updateTime,
    
    // Team management
    updateTeam,
    
    // Player management
    addPlayer,
    removePlayer,
    
    // Action management
    addAction,
    updateAction,
    removeAction,
    
    // Action type management
    addActionType,
    updateActionType,
    removeActionType,
    
    // Utility
    clearAllData,
  };
};