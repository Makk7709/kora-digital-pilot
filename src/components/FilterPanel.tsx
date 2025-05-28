import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Filter, RotateCcw } from 'lucide-react';
import { usePlanning } from '@/hooks/usePlanning';

interface FilterPanelProps {
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { filters, setFilters, clearFilters } = usePlanning();
  
  const [localFilters, setLocalFilters] = useState({
    platforms: filters.platforms || [],
    status: filters.status || [],
    contentTypes: filters.contentTypes || [],
  });

  const platforms = [
    { value: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
    { value: 'Instagram', label: 'Instagram', icon: '📸' },
    { value: 'X (Twitter)', label: 'X (Twitter)', icon: '𝕏' },
    { value: 'Facebook', label: 'Facebook', icon: '📘' },
    { value: 'TikTok', label: 'TikTok', icon: '🎵' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon', color: 'bg-amber-100 text-amber-700' },
    { value: 'scheduled', label: 'Programmé', color: 'bg-blue-100 text-blue-700' },
    { value: 'published', label: 'Publié', color: 'bg-green-100 text-green-700' },
    { value: 'failed', label: 'Échec', color: 'bg-red-100 text-red-700' },
  ];

  const contentTypes = [
    { value: 'post', label: 'Post simple' },
    { value: 'thread', label: 'Thread' },
    { value: 'article', label: 'Article long' },
    { value: 'carousel', label: 'Carrousel' },
    { value: 'story', label: 'Story' },
    { value: 'video', label: 'Vidéo' },
  ];

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...(prev[category as keyof typeof prev] || []), value]
        : (prev[category as keyof typeof prev] || []).filter(item => item !== value)
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({
      platforms: [],
      status: [],
      contentTypes: [],
    });
    clearFilters();
  };

  const getActiveFiltersCount = () => {
    return (localFilters.platforms?.length || 0) + 
           (localFilters.status?.length || 0) + 
           (localFilters.contentTypes?.length || 0);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtrer les posts</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} filtre{getActiveFiltersCount() > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plateformes */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Plateformes</h3>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <div key={platform.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform.value}`}
                    checked={localFilters.platforms?.includes(platform.value) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('platforms', platform.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`platform-${platform.value}`}
                    className="text-sm text-slate-700 cursor-pointer flex items-center space-x-2"
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Statuts */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Statuts</h3>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={localFilters.status?.includes(status.value) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('status', status.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className="text-sm cursor-pointer flex items-center space-x-2"
                  >
                    <Badge className={`${status.color} text-xs`}>
                      {status.label}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Types de contenu */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Types de contenu</h3>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={localFilters.contentTypes?.includes(type.value) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('contentTypes', type.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`type-${type.value}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 text-white"
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel; 