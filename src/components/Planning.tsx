import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, TrendingUp, Plus, Edit, Trash2, Copy, Filter, Download, Upload } from 'lucide-react';
import { usePlanning } from '@/hooks/usePlanning';
import { ScheduledPost } from '@/lib/planning-service';
import PostModal from './PostModal';
import FilterPanel from './FilterPanel';

const Planning = () => {
  const {
    posts,
    currentWeekStart,
    selectedDate,
    viewMode,
    isLoading,
    isGenerating,
    error,
    weeklyStats,
    suggestions,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    setViewMode,
    setSelectedDate,
    addPost,
    updatePost,
    deletePost,
    duplicatePost,
    generateWeeklyPlan,
    generatePostFromAI,
    optimizeSchedule,
    getPostsByDay,
    exportPlanning,
    importPlanning,
  } = usePlanning();

  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'published': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'failed': return 'Échec';
      default: return 'Inconnu';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn': return '💼';
      case 'Instagram': return '📸';
      case 'X (Twitter)': return '𝕏';
      case 'Facebook': return '📘';
      case 'TikTok': return '🎵';
      default: return '📱';
    }
  };

  const handleAddPost = (date: Date) => {
    setSelectedDay(date);
    setEditingPost(null);
    setShowPostModal(true);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      await deletePost(postId);
    }
  };

  const handleDuplicatePost = async (postId: string) => {
    await duplicatePost(postId);
  };

  const handleSavePost = async (postData: any) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
      } else {
        await addPost({
          ...postData,
          scheduledDate: selectedDay || new Date(),
        });
      }
      setShowPostModal(false);
      setEditingPost(null);
      setSelectedDay(null);
    } catch (error) {
      console.error('Erreur sauvegarde post:', error);
    }
  };

  const handleExport = () => {
    const data = exportPlanning();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning-kora-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        await importPlanning(data);
      };
      reader.readAsText(file);
    }
  };

  const renderPostCard = (post: ScheduledPost) => (
    <div
      key={post.id}
      className="group p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{getPlatformIcon(post.platform)}</span>
          <span className="text-slate-900 text-xs font-semibold">{post.scheduledTime}</span>
          {post.aiGenerated && (
            <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">IA</span>
          )}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPost(post);
            }}
            className="h-6 w-6 p-0 hover:bg-blue-100"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicatePost(post.id);
            }}
            className="h-6 w-6 p-0 hover:bg-green-100"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost(post.id);
            }}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="mb-2">
        <Badge className={getStatusColor(post.status)}>
          {getStatusText(post.status)}
        </Badge>
      </div>
      
      <p className="text-slate-900 text-xs font-medium mb-2 line-clamp-2">
        {post.title}
      </p>
      
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-slate-100 text-slate-600 px-1 rounded"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-xs text-slate-400">+{post.tags.length - 2}</span>
          )}
        </div>
      )}
      
      {post.estimatedEngagement && (
        <p className="text-slate-500 text-xs">{post.estimatedEngagement}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span>Planning éditorial</span>
          </h2>
          <p className="text-slate-600">
            Organisez et planifiez vos publications sur tous les réseaux
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Boutons d'action */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4" />
                  <span>Importer</span>
                </span>
              </Button>
            </label>
          </div>

          {/* Sélecteur de vue */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Mois
            </button>
          </div>
          
          <Button 
            onClick={() => generateWeeklyPlan()}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                ✨ Planifier avec Kora
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <FilterPanel onClose={() => setShowFilters(false)} />
      )}

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Vue semaine */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">
                  Semaine du {currentWeek[0].getDate()}-{currentWeek[6].getDate()} 
                  {' '}
                  {currentWeek[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={goToPreviousWeek}
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    ← Précédent
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={goToToday}
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Aujourd'hui
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={goToNextWeek}
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const date = currentWeek[index];
                  const dayPosts = getPostsByDay(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={day} className="space-y-4">
                      <div className={`text-center p-3 rounded-xl ${
                        isToday 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200' 
                          : 'bg-gradient-to-br from-slate-50 to-slate-25'
                      }`}>
                        <p className="text-slate-600 text-sm font-semibold">{day}</p>
                        <p className={`text-xl font-bold ${
                          isToday ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {date.getDate()}
                        </p>
                        {dayPosts.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3 min-h-[200px]">
                        {dayPosts.map(renderPostCard)}
                        
                        <button 
                          onClick={() => handleAddPost(date)}
                          className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">Ajouter</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel latéral */}
        <div className="space-y-6">
          {/* Statistiques de la semaine */}
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 text-lg">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {weeklyStats && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Posts programmés</span>
                    <span className="text-slate-900 font-bold text-lg">
                      {weeklyStats.scheduledPosts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Brouillons</span>
                    <span className="text-amber-600 font-bold text-lg">
                      {weeklyStats.draftPosts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Publiés</span>
                    <span className="text-green-600 font-bold text-lg">
                      {weeklyStats.publishedPosts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Total</span>
                    <span className="text-blue-600 font-bold text-lg">
                      {weeklyStats.totalPosts}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Suggestions Kora */}
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <span>Suggestions Kora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {suggestions.length > 0 ? (
                suggestions.slice(0, 3).map((suggestion, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      suggestion.priority === 'high' 
                        ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                        : suggestion.priority === 'medium'
                        ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                        : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                    }`}
                  >
                    <h4 className={`font-semibold text-sm mb-2 flex items-center space-x-2 ${
                      suggestion.priority === 'high' ? 'text-red-600' :
                      suggestion.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {suggestion.type === 'timing' && <Clock className="w-4 h-4" />}
                      {suggestion.type === 'platform' && <TrendingUp className="w-4 h-4" />}
                      {suggestion.type === 'frequency' && <Zap className="w-4 h-4" />}
                      {suggestion.type === 'content' && <Edit className="w-4 h-4" />}
                      <span>{suggestion.title}</span>
                    </h4>
                    <p className="text-slate-900 text-xs mb-3">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {suggestion.impact}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={optimizeSchedule}
                        className={`text-xs px-3 py-1 border-0 ${
                          suggestion.priority === 'high' 
                            ? 'bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white'
                            : suggestion.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white'
                            : 'bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune suggestion pour le moment</p>
                  <p className="text-xs">Ajoutez des posts pour recevoir des conseils</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button
                onClick={() => generateWeeklyPlan()}
                disabled={isGenerating}
                className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white border-0"
              >
                🎯 Générer un planning complet
              </Button>
              
              <Button
                onClick={optimizeSchedule}
                disabled={isGenerating}
                className="w-full bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white border-0"
              >
                ⚡ Optimiser les horaires
              </Button>
              
              <Button
                onClick={() => handleAddPost(new Date())}
                className="w-full bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white border-0"
              >
                ✍️ Créer un post maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de création/édition de post */}
      {showPostModal && (
        <PostModal
          post={editingPost}
          selectedDate={selectedDay}
          onSave={handleSavePost}
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(null);
            setSelectedDay(null);
          }}
        />
      )}
    </div>
  );
};

export default Planning;
