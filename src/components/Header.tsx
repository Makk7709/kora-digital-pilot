
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-6 glass-effect border-b border-white/10">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 korev-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Korev AI</h1>
            <p className="text-xs text-korev-gray-400">Social Intelligence</p>
          </div>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-korev-blue/10 border border-korev-blue/20">
          <div className="w-2 h-2 bg-korev-blue rounded-full animate-pulse"></div>
          <span className="text-korev-blue text-sm font-medium">Kora en ligne</span>
        </div>
        
        <Button variant="ghost" size="sm" className="text-korev-gray-300 hover:text-white">
          Paramètres
        </Button>
        
        <Avatar className="w-8 h-8">
          <AvatarImage src="" alt="Franck" />
          <AvatarFallback className="bg-korev-gold text-korev-dark text-sm font-semibold">
            F
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
