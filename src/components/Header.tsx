import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import LinkedInStatus from './LinkedInStatus';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Korev AI</h1>
            <p className="text-xs text-slate-500">Social Intelligence</p>
          </div>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600 text-sm font-medium">Kora en ligne</span>
        </div>
        
        <LinkedInStatus />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-slate-900"
          onClick={() => navigate('/settings')}
        >
          Paramètres
        </Button>
        
        <Avatar className="w-8 h-8">
          <AvatarImage src="" alt="Utilisateur" />
          <AvatarFallback className="bg-blue-500 text-white text-sm font-semibold">
            F
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
