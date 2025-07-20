import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, X } from 'lucide-react';
import { getZoneFromCoordinates, getZoneName } from '@/types/football';
import fieldImage from '@/assets/football-field.jpg';

interface FieldMapProps {
  onZoneClick: (zoneId: string) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({ onZoneClick }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Store click position for visual feedback
    setClickPosition({ x, y });

    // Calculate zone based on relative position
    const zoneId = getZoneFromCoordinates(x, y, rect.width, rect.height);
    
    onZoneClick(zoneId);

    // Clear click position after animation
    setTimeout(() => setClickPosition(null), 300);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoneId = getZoneFromCoordinates(x, y, rect.width, rect.height);
    setHoveredZone(zoneId);
  };

  const handleMouseLeave = () => {
    setHoveredZone(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="relative w-full h-full p-0">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-30 bg-black/70 hover:bg-black/90 text-white border border-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Zone overlays for visual feedback */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Click animation */}
            {clickPosition && (
              <div
                className="absolute w-16 h-16 bg-primary/40 rounded-lg animate-ping border-2 border-primary"
                style={{
                  left: clickPosition.x - 32,
                  top: clickPosition.y - 32,
                }}
              />
            )}
            
            {/* Zone representations */}
            <div className="w-full h-full relative">
              {/* Dynamic zone indicators based on click position */}
              {clickPosition && (
                <div
                  className="absolute bg-primary/20 border-2 border-primary rounded-lg backdrop-blur-sm transition-all duration-500"
                  style={{
                    left: `${Math.floor((clickPosition.x / (imageRef.current?.getBoundingClientRect().width || 1)) * 5) * 20}%`,
                    top: `${Math.floor((clickPosition.y / (imageRef.current?.getBoundingClientRect().height || 1)) * 5) * 20}%`,
                    width: '20%',
                    height: '20%',
                  }}
                />
              )}
            </div>
          </div>

          <div
            className="relative w-full h-full cursor-pointer select-none"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={imageRef}
              src={fieldImage}
              alt="Campo de Futebol"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Instructions only */}
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-6 py-3 rounded-lg text-base font-medium z-20 backdrop-blur-sm border border-white/20">
            Toque em qualquer zona do campo para registrar uma ação
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="field-container relative field-mobile-optimized">
      <Button
        onClick={toggleFullscreen}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
      >
        <Maximize className="h-4 w-4" />
      </Button>

      {/* Zone overlay for visual feedback */}
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
        {/* Click animation with zone representation */}
        {clickPosition && (
          <>
            <div
              className="absolute w-12 h-12 bg-primary/30 rounded-full animate-ping border-2 border-primary"
              style={{
                left: clickPosition.x - 24,
                top: clickPosition.y - 24,
              }}
            />
            <div
              className="absolute bg-primary/10 border-2 border-primary/50 rounded-lg backdrop-blur-sm transition-all duration-300"
              style={{
                left: `${Math.floor((clickPosition.x / (imageRef.current?.getBoundingClientRect().width || 1)) * 5) * 20}%`,
                top: `${Math.floor((clickPosition.y / (imageRef.current?.getBoundingClientRect().height || 1)) * 5) * 20}%`,
                width: '20%',
                height: '20%',
              }}
            />
          </>
        )}
      </div>

      {/* Field image container */}
      <div
        className="relative cursor-pointer select-none transition-transform duration-200 hover:scale-[1.02]"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={fieldImage}
          alt="Campo de Futebol"
          className="w-full h-full object-cover rounded-xl shadow-lg"
          draggable={false}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Instructions only */}
      <div className="mt-2 md:mt-4 text-center text-muted-foreground text-xs md:text-sm">
        Toque em qualquer zona do campo para registrar uma ação
      </div>
    </div>
  );
};