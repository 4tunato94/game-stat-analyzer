import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface LogoSelectorProps {
  currentLogo?: string;
  onLogoChange: (logo: string | undefined) => void;
  teamName: string;
}

// Predefined logos from Unsplash
const PREDEFINED_LOGOS = [
  {
    id: 'lion',
    url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=center',
    name: 'Leão'
  },
  {
    id: 'eagle',
    url: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=200&h=200&fit=crop&crop=center',
    name: 'Águia'
  },
  {
    id: 'bull',
    url: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop&crop=center',
    name: 'Touro'
  },
  {
    id: 'horse',
    url: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=200&h=200&fit=crop&crop=center',
    name: 'Cavalo'
  },
];

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  currentLogo,
  onLogoChange,
  teamName,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handlePredefinedLogo = (logoUrl: string) => {
    onLogoChange(logoUrl);
    setUploadedImage(null);
  };

  const handleRemoveLogo = () => {
    onLogoChange(undefined);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Logo do {teamName}</Label>
      
      {/* Current Logo Display */}
      {(currentLogo || uploadedImage) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentLogo || uploadedImage || ''}
                  alt={`Logo ${teamName}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <div className="font-medium">Logo Atual</div>
                <div className="text-sm text-muted-foreground">
                  {uploadedImage ? 'Imagem personalizada' : 'Imagem predefinida'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Custom Logo */}
      <div>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-12 border-dashed flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Fazer Upload de Logo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Predefined Logos */}
      <div>
        <Label className="text-sm">Ou escolha um logo predefinido:</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {PREDEFINED_LOGOS.map((logo) => (
            <Button
              key={logo.id}
              variant="outline"
              className="h-20 p-2 flex flex-col items-center gap-2"
              onClick={() => handlePredefinedLogo(logo.url)}
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xs">{logo.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};