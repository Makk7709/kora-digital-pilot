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
    { id: 'dashboard', num: 'I', label: 'Dashboard', description: "Vue d'ensemble" },
    { id: 'cm-dashboard', num: 'II', label: 'CM Dashboard', description: 'Veille IA automatisée' },
    { id: 'cm-domain-search', num: 'III', label: 'Recherche', description: 'Analyse par domaine' },
    { id: 'brand-monitoring', num: 'IV', label: 'Veille de marque', description: 'E-réputation' },
    { id: 'brand-intelligence-tdd', num: 'V', label: 'P.R.I.S.M', description: 'Deep Research' },
    { id: 'inspiration', num: 'VI', label: 'Inspiration', description: 'Génération éditoriale' },
    { id: 'images', num: 'VII', label: 'Visuels', description: 'DALL·E 3' },
    { id: 'planning', num: 'VIII', label: 'Planning', description: 'Calendrier éditorial' },
    { id: 'analytics', num: 'IX', label: 'Analyse', description: 'Performances' },
    { id: 'library', num: 'X', label: 'Bibliothèque', description: 'Archives' },
  ];

  return (
    <aside className={cn(
      "h-full bg-background border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs tracking-widest">{isCollapsed ? '›' : '‹'}</span>
        </button>
      </div>

      {!isCollapsed && (
        <p className="px-6 mb-4 text-[10px] uppercase tracking-[0.35em] text-primary/70">
          Sommaire
        </p>
      )}
      <nav className="px-3 space-y-px">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-baseline gap-4 px-4 py-3 border-l-2 transition-all duration-200 group text-left",
              activeSection === item.id
                ? "border-primary bg-primary/5 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            <span className={cn(
              "font-display text-sm w-6 shrink-0",
              activeSection === item.id ? "text-primary" : "text-muted-foreground/60"
            )}>
              {item.num}
            </span>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-display text-base leading-tight">{item.label}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-0.5">
                  {item.description}
                </p>
              </div>
            )}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="px-3 mt-6 pt-6 border-t border-border/40">
          <div className="scale-75 origin-top">
            <LinkedInWidget />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
