import React, { useState, useRef } from 'react';
import { getZoneFromCoordinates, getZoneName } from '@/types/football';
import fieldImage from '@/assets/football-field.jpg';

interface FieldMapProps {
  onZoneClick: (zoneId: string) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({ onZoneClick }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
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

  return (
    <div className="field-container relative field-mobile-optimized">
      {/* Zone overlay for visual feedback */}
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
        {/* Grid visualization for development - remove in production */}
        <div className="absolute inset-0 grid grid-cols-5 border border-white/20">
          {Array.from({ length: 23 }, (_, i) => (
            <div
              key={i}
              className="border border-white/10 flex items-center justify-center text-xs text-white/50"
            />
          ))}
        </div>
        
        {/* Click animation */}
        {clickPosition && (
          <div
            className="absolute w-8 h-8 bg-white/30 rounded-full animate-ping"
            style={{
              left: clickPosition.x - 16,
              top: clickPosition.y - 16,
            }}
          />
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

      {/* Zone info display */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium z-20">
          {getZoneName(hoveredZone)}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-2 md:mt-4 text-center text-muted-foreground text-xs md:text-sm">
        Toque em qualquer zona do campo para registrar uma ação
      </div>
    </div>
  );
};