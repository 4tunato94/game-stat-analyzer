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
          Cores do {teamName}
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

        {/* Individual Color Selectors */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor={`primary-${teamName}`} className="text-sm font-medium">Cor Principal</Label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  id={`primary-${teamName}`}
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`secondary-${teamName}`} className="text-sm font-medium">Cor Secundária</Label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  id={`secondary-${teamName}`}
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`accent-${teamName}`} className="text-sm font-medium">Cor de Destaque</Label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  id={`accent-${teamName}`}
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Random Colors Button */}
          <Button
            onClick={generateRandomColors}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Gerar Cores Aleatórias
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};