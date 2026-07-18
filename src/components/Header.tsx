import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import LinkedInStatus from './LinkedInStatus';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-background border-b border-border">
      <button
        onClick={() => navigate('/')}
        className="flex items-baseline gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="font-display text-2xl tracking-tight text-primary">Korev</span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Atelier éditorial
        </span>
      </button>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            En ligne
          </span>
        </div>

        <LinkedInStatus />

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary text-xs uppercase tracking-[0.2em] rounded-none"
          onClick={() => navigate('/settings')}
        >
          Paramètres
        </Button>

        <Avatar className="w-8 h-8 rounded-none border border-primary/40">
          <AvatarImage src="" alt="Utilisateur" />
          <AvatarFallback className="bg-transparent text-primary font-display text-sm rounded-none">
            K
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
