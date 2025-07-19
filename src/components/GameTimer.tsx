import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatGameTime } from '@/types/football';

interface GameTimerProps {
  isRunning: boolean;
  currentTime: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onTimeUpdate: (time: number) => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  isRunning,
  currentTime,
  onStart,
  onStop,
  onReset,
  onTimeUpdate,
}) => {
  const [localTime, setLocalTime] = useState(currentTime);

  useEffect(() => {
    setLocalTime(currentTime);
  }, [currentTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setLocalTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const handleReset = () => {
    setLocalTime(0);
    onReset();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          {/* Timer Display */}
          <div className="text-4xl font-bold font-mono text-primary">
            {formatGameTime(localTime)}
          </div>
          
          {/* Controls */}
          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button
                onClick={onStart}
                className="action-btn flex items-center gap-2"
                size="sm"
              >
                <Play className="h-4 w-4" />
                Iniciar
              </Button>
            ) : (
              <Button
                onClick={onStop}
                variant="outline"
                className="flex items-center gap-2"
                size="sm"
              >
                <Pause className="h-4 w-4" />
                Pausar
              </Button>
            )}
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {/* Game Status */}
          <div className="text-sm text-muted-foreground">
            {isRunning ? 'Jogo em andamento' : 'Jogo pausado'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};