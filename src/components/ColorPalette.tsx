import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, RefreshCw } from 'lucide-react';

interface ColorPaletteProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  onColorsChange: (colors: { primary: string; secondary: string; accent: string; background: string }) => void;
  teamName: string;
}

const COLOR_PRESETS = [
  {
    name: 'Azul Clássico',
    colors: { primary: '#0066CC', secondary: '#004499', accent: '#3399FF', background: '#E6F3FF' }
  },
  {
    name: 'Vermelho Intenso',
    colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F87171', background: '#FEE2E2' }
  },
  {
    name: 'Verde Floresta',
    colors: { primary: '#059669', secondary: '#047857', accent: '#34D399', background: '#D1FAE5' }
  },
  {
    name: 'Roxo Real',
    colors: { primary: '#7C3AED', secondary: '#5B21B6', accent: '#A78BFA', background: '#EDE9FE' }
  },
  {
    name: 'Laranja Energia',
    colors: { primary: '#EA580C', secondary: '#C2410C', accent: '#FB923C', background: '#FED7AA' }
  },
  {
    name: 'Rosa Moderno',
    colors: { primary: '#DB2777', secondary: '#BE185D', accent: '#F472B6', background: '#FCE7F3' }
  },
  {
    name: 'Amarelo Dourado',
    colors: { primary: '#D97706', secondary: '#92400E', accent: '#FBBF24', background: '#FEF3C7' }
  },
  {
    name: 'Ciano Oceano',
    colors: { primary: '#0891B2', secondary: '#0E7490', accent: '#22D3EE', background: '#CFFAFE' }
  },
  {
    name: 'Turquesa',
    colors: { primary: '#0D9488', secondary: '#115E59', accent: '#2DD4BF', background: '#CCFBF1' }
  },
  {
    name: 'Índigo',
    colors: { primary: '#4F46E5', secondary: '#3730A3', accent: '#818CF8', background: '#E0E7FF' }
  },
  {
    name: 'Cinza Elegante',
    colors: { primary: '#374151', secondary: '#1F2937', accent: '#9CA3AF', background: '#F9FAFB' }
  },
  {
    name: 'Marrom Terra',
    colors: { primary: '#92400E', secondary: '#78350F', accent: '#D97706', background: '#FEF3C7' }
  },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  onColorsChange,
  teamName,
}) => {
  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    onColorsChange({
      ...colors,
      [colorKey]: value,
    });
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onColorsChange(preset.colors);
  };

  const generateRandomColors = () => {
    const hue = Math.floor(Math.random() * 360);
    const primary = `hsl(${hue}, 70%, 50%)`;
    const secondary = `hsl(${hue}, 70%, 35%)`;
    const accent = `hsl(${hue}, 60%, 70%)`;
    const background = `hsl(${hue}, 30%, 95%)`;
    
    onColorsChange({ primary, secondary, accent, background });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Paleta de Cores - {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Preview */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.background }}>
          <div className="flex gap-2 mb-2">
            <div 
              className="w-6 h-6 rounded-full border border-white"
              style={{ backgroundColor: colors.primary }}
            />
            <div 
              className="w-6 h-6 rounded-full border border-white"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="w-6 h-6 rounded-full border border-white"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
          <div className="text-sm" style={{ color: colors.primary }}>
            Preview das cores do {teamName}
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <Label className="text-sm">Paletas Predefinidas (12 opções):</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
            {COLOR_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="h-auto p-2 flex flex-col items-start hover:scale-105 transition-transform"
              >
                <div className="flex gap-1 mb-1">
                  {Object.values(preset.colors).slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded border border-white/50 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};