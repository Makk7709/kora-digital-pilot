import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import LinkedInWidget from '@/components/LinkedInWidget';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

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
      id: 'images',
      icon: '🎨',
      label: 'Générateur d\'Images',
      description: 'Créer avec DALL-E 3'
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
      "h-full bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-lg transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span className="text-slate-600">
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
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
        <div className="px-3 mt-4">
          <div className="scale-75 origin-top">
            <LinkedInWidget />
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">K</span>
              </div>
              <span className="text-blue-600 font-medium text-sm">Kora</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Votre assistante IA pour une communication digitale d'excellence
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
