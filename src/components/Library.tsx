import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import EmptyState from '@/components/EmptyState';
import { useDataMode } from '@/contexts/DataModeContext';
import { DEMO_LIBRARY_CATEGORIES, DEMO_LIBRARY_ITEMS, DEMO_LIBRARY_STATS } from '@/lib/demo-data';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { isDemo } = useDataMode();

  const categories = isDemo
    ? DEMO_LIBRARY_CATEGORIES
    : DEMO_LIBRARY_CATEGORIES.map((c) => ({ ...c, count: 0 }));

  const savedContent = isDemo ? DEMO_LIBRARY_ITEMS : [];
  const libraryStats = isDemo
    ? DEMO_LIBRARY_STATS
    : { total: 0, published: 0, drafts: 0, templates: 0 };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'thread':
        return '🧵';
      case 'visual':
        return '🎨';
      case 'template':
        return '📋';
      default:
        return '📄';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return '💼';
      case 'Instagram':
        return '📸';
      case 'X (Twitter)':
        return '𝕏';
      case 'Multi':
        return '🌐';
      default:
        return '📱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'draft':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'scheduled':
        return 'bg-sky-500/20 text-sky-600 border-sky-500/30';
      case 'template':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'draft':
        return 'Brouillon';
      case 'scheduled':
        return 'Programmé';
      case 'template':
        return 'Template';
      default:
        return 'Inconnu';
    }
  };

  const filteredContent = savedContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'posts' && item.type === 'post') ||
      (selectedCategory === 'threads' && item.type === 'thread') ||
      (selectedCategory === 'visuals' && item.type === 'visual') ||
      (selectedCategory === 'templates' && item.type === 'template');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center space-x-2">
            <span>📚</span>
            <span>Bibliothèque de contenu</span>
          </h2>
          <p className="text-slate-600">Retrouvez et réutilisez tous vos contenus sauvegardés</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              🔲 Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              📋 Liste
            </button>
          </div>

          <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            + Nouveau contenu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec filtres */}
        <div className="space-y-4">
          {/* Recherche */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Rechercher dans la bibliothèque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </CardContent>
          </Card>

          {/* Catégories */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg">Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600'
                      : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <span className="text-sm">{category.name}</span>
                  <Badge variant="outline" className="border-current text-current">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Stats rapides */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg flex items-center justify-between">
                <span>Statistiques</span>
                {isDemo && (
                  <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs">
                    Démo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Total contenus</span>
                <span className="text-slate-800 font-semibold">{libraryStats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Publiés</span>
                <span className="text-green-600 font-semibold">{libraryStats.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Brouillons</span>
                <span className="text-blue-600 font-semibold">{libraryStats.drafts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Templates</span>
                <span className="text-purple-600 font-semibold">{libraryStats.templates}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <Card
                  key={item.id}
                  className="premium-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <span className="text-sm">{getPlatformIcon(item.platform)}</span>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-slate-800 text-sm">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-600 text-sm line-clamp-2">{item.content}</p>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-300 text-slate-500 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {item.performance && (
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>👍 {item.performance.likes}</span>
                        <span>🔄 {item.performance.shares}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-slate-500 hover:bg-slate-50"
                        >
                          📋
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          🔄
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="premium-card">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredContent.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors ${
                        index === filteredContent.length - 1 ? '' : 'border-b'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(item.type)}</span>
                            <span className="text-sm">{getPlatformIcon(item.platform)}</span>
                          </div>

                          <div className="flex-1">
                            <h4 className="text-slate-800 font-medium text-sm">{item.title}</h4>
                            <p className="text-slate-500 text-xs mt-1">
                              {item.content.substring(0, 100)}...
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-slate-300 text-slate-500 text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          {item.performance && (
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <span>👍 {item.performance.likes}</span>
                              <span>🔄 {item.performance.shares}</span>
                            </div>
                          )}

                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>

                          <span className="text-slate-400 text-xs">
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>

                        <div className="flex space-x-1 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50"
                          >
                            ✏️ Éditer
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-slate-500 hover:bg-slate-50"
                          >
                            📋 Copier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50"
                          >
                            🔄 Réutiliser
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredContent.length === 0 &&
            (isDemo ? (
              <Card className="premium-card">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-slate-400 text-2xl">📭</span>
                    </div>
                    <h3 className="text-slate-800 font-medium mb-2">Aucun contenu trouvé</h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white">
                      ✨ Créer du nouveau contenu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                platform="Bibliothèque"
                title="Bibliothèque vide"
                description="Aucun contenu n'a encore été enregistré dans cette bibliothèque. La liste démo (4 posts d'exemple) ne s'affiche qu'en mode démo (VITE_DATA_MODE=demo)."
                ctaLabel="Créer du nouveau contenu"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
