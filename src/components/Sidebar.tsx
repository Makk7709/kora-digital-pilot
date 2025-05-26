
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'inspiration',
      icon: '✨',
      label: 'Inspiration IA',
      description: 'Générer du contenu'
    },
    {
      id: 'planning',
      icon: '📅',
      label: 'Planning éditorial',
      description: 'Organiser les publications'
    },
    {
      id: 'analytics',
      icon: '📈',
      label: 'Analyse',
      description: 'Performance des posts'
    },
    {
      id: 'library',
      icon: '📚',
      label: 'Bibliothèque',
      description: 'Contenu sauvegardé'
    }
  ];

  return (
    <aside className={cn(
      "h-full glass-effect border-r border-white/10 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="text-korev-gray-400">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>

      <nav className="px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              activeSection === item.id
                ? "korev-gradient text-white shadow-lg shadow-korev-blue/20"
                : "text-korev-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs opacity-60">{item.description}</p>
              </div>
            )}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-korev-gold/10 to-korev-gold/5 border border-korev-gold/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 gold-gradient rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-korev-dark">K</span>
              </div>
              <span className="text-korev-gold font-medium text-sm">Kora</span>
            </div>
            <p className="text-xs text-korev-gray-400 leading-relaxed">
              Votre assistante IA pour une communication digitale d'excellence
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
