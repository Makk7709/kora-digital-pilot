
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'Tout', count: 24 },
    { id: 'posts', name: 'Posts', count: 12 },
    { id: 'threads', name: 'Threads', count: 6 },
    { id: 'visuals', name: 'Visuels', count: 4 },
    { id: 'templates', name: 'Templates', count: 2 }
  ];

  const savedContent = [
    {
      id: 1,
      type: 'post',
      platform: 'LinkedIn',
      title: 'Innovation IA dans l\'entreprise',
      content: '🚀 L\'IA générative redéfinit notre approche business...',
      tags: ['IA', 'Business', 'Innovation'],
      createdAt: '2024-01-15',
      performance: { likes: 156, shares: 23 },
      status: 'published'
    },
    {
      id: 2,
      type: 'thread',
      platform: 'X (Twitter)',
      title: 'Thread GPT-4o vs Claude',
      content: '🧵 Comparaison détaillée entre GPT-4o et Claude 3.5...',
      tags: ['GPT-4o', 'Claude', 'Comparaison'],
      createdAt: '2024-01-14',
      performance: { likes: 89, shares: 45 },
      status: 'draft'
    },
    {
      id: 3,
      type: 'visual',
      platform: 'Instagram',
      title: 'Infographie productivité IA',
      content: 'Carrousel : 5 tips pour booster sa productivité...',
      tags: ['Productivité', 'Tips', 'Carrousel'],
      createdAt: '2024-01-13',
      performance: { likes: 67, shares: 12 },
      status: 'scheduled'
    },
    {
      id: 4,
      type: 'template',
      platform: 'Multi',
      title: 'Template annonce produit',
      content: 'Structure réutilisable pour annoncer un nouveau...',
      tags: ['Template', 'Produit', 'Annonce'],
      createdAt: '2024-01-12',
      performance: null,
      status: 'template'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'thread': return '🧵';
      case 'visual': return '🎨';
      case 'template': return '📋';
      default: return '📄';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn': return '💼';
      case 'Instagram': return '📸';
      case 'X (Twitter)': return '𝕏';
      case 'Multi': return '🌐';
      default: return '📱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-korev-gold/20 text-korev-gold border-korev-gold/30';
      case 'scheduled': return 'bg-korev-blue/20 text-korev-blue border-korev-blue/30';
      case 'template': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'scheduled': return 'Programmé';
      case 'template': return 'Template';
      default: return 'Inconnu';
    }
  };

  const filteredContent = savedContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
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
          <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>📚</span>
            <span>Bibliothèque de contenu</span>
          </h2>
          <p className="text-korev-gray-400">
            Retrouvez et réutilisez tous vos contenus sauvegardés
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-korev-blue text-white' 
                  : 'text-korev-gray-400 hover:text-white'
              }`}
            >
              🔲 Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-korev-blue text-white' 
                  : 'text-korev-gray-400 hover:text-white'
              }`}
            >
              📋 Liste
            </button>
          </div>
          
          <Button className="korev-gradient hover-glow">
            + Nouveau contenu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec filtres */}
        <div className="space-y-4">
          {/* Recherche */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Rechercher dans la bibliothèque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-korev-gray-400"
              />
            </CardContent>
          </Card>

          {/* Catégories */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    selectedCategory === category.id
                      ? 'border-korev-blue bg-korev-blue/10 text-korev-blue'
                      : 'border-white/20 text-korev-gray-300 hover:border-white/30 hover:text-white'
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
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Total contenus</span>
                <span className="text-white font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Publiés</span>
                <span className="text-green-400 font-semibold">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Brouillons</span>
                <span className="text-korev-gold font-semibold">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Templates</span>
                <span className="text-purple-400 font-semibold">2</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="glass-effect border-white/10 hover-glow cursor-pointer">
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
                    <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-korev-gray-300 text-sm line-clamp-2">
                      {item.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-korev-gray-400/30 text-korev-gray-400 text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {item.performance && (
                      <div className="flex items-center space-x-4 text-xs text-korev-gray-400">
                        <span>👍 {item.performance.likes}</span>
                        <span>🔄 {item.performance.shares}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-korev-gray-400 text-xs">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-korev-blue hover:bg-korev-blue/10">
                          ✏️
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-korev-gray-400 hover:bg-white/5">
                          📋
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-korev-gold hover:bg-korev-gold/10">
                          🔄
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-white/10">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredContent.map((item, index) => (
                    <div key={item.id} className={`p-4 border-white/10 hover:bg-white/5 cursor-pointer transition-colors ${
                      index !== filteredContent.length - 1 ? 'border-b' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(item.type)}</span>
                            <span className="text-sm">{getPlatformIcon(item.platform)}</span>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{item.title}</h4>
                            <p className="text-korev-gray-400 text-xs mt-1">{item.content.substring(0, 100)}...</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="border-korev-gray-400/30 text-korev-gray-400 text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {item.performance && (
                            <div className="flex items-center space-x-3 text-xs text-korev-gray-400">
                              <span>👍 {item.performance.likes}</span>
                              <span>🔄 {item.performance.shares}</span>
                            </div>
                          )}
                          
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                          
                          <span className="text-korev-gray-400 text-xs">
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1 ml-4">
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-korev-blue hover:bg-korev-blue/10">
                            ✏️ Éditer
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-korev-gray-400 hover:bg-white/5">
                            📋 Copier
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-korev-gold hover:bg-korev-gold/10">
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
          
          {filteredContent.length === 0 && (
            <Card className="glass-effect border-white/10">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-korev-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-korev-gray-400 text-2xl">📭</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Aucun contenu trouvé</h3>
                  <p className="text-korev-gray-400 text-sm mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button className="korev-gradient">
                    ✨ Créer du nouveau contenu
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
