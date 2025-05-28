import { useState, useEffect, useCallback, useMemo } from 'react';
import { planningService, ScheduledPost, WeeklyPlan, PlanningFilters } from '@/lib/planning-service';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface UsePlanningState {
  posts: ScheduledPost[];
  currentWeekStart: Date;
  selectedDate: Date;
  viewMode: 'week' | 'month';
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  filters: PlanningFilters;
  weeklyStats: any;
  suggestions: any[];
}

interface UsePlanningReturn extends UsePlanningState {
  // Navigation
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  setViewMode: (mode: 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
  
  // Gestion des posts
  addPost: (post: Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ScheduledPost>;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => Promise<ScheduledPost | null>;
  deletePost: (id: string) => Promise<boolean>;
  duplicatePost: (id: string, newDate?: Date) => Promise<ScheduledPost | null>;
  
  // Génération IA
  generateWeeklyPlan: (prompt?: string) => Promise<void>;
  generatePostFromAI: (prompt: string, date: Date, time: string, platform: string) => Promise<ScheduledPost>;
  optimizeSchedule: () => Promise<void>;
  
  // Filtrage et recherche
  setFilters: (filters: Partial<PlanningFilters>) => void;
  clearFilters: () => void;
  getFilteredPosts: () => ScheduledPost[];
  
  // Utilitaires
  refreshData: () => void;
  exportPlanning: () => string;
  importPlanning: (data: string) => Promise<boolean>;
  
  // Statistiques
  getWeeklyStats: () => any;
  getPostsByDay: (date: Date) => ScheduledPost[];
  getPostsByWeek: (weekStart: Date) => ScheduledPost[];
}

export const usePlanning = (): UsePlanningReturn => {
  const [state, setState] = useState<UsePlanningState>({
    posts: [],
    currentWeekStart: getWeekStart(new Date()),
    selectedDate: new Date(),
    viewMode: 'week',
    isLoading: false,
    isGenerating: false,
    error: null,
    filters: {},
    weeklyStats: null,
    suggestions: [],
  });

  const { generateContent } = useAI();
  const { toast } = useToast();

  // Charger les données initiales
  useEffect(() => {
    refreshData();
  }, []);

  // Recalculer les stats quand la semaine change
  useEffect(() => {
    const stats = planningService.getWeeklyStats(state.currentWeekStart);
    const suggestions = planningService.getOptimizationSuggestions(state.currentWeekStart);
    
    setState(prev => ({
      ...prev,
      weeklyStats: stats,
      suggestions,
    }));
  }, [state.currentWeekStart, state.posts]);

  // Navigation
  const goToNextWeek = useCallback(() => {
    setState(prev => {
      const nextWeek = new Date(prev.currentWeekStart);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return { ...prev, currentWeekStart: nextWeek };
    });
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setState(prev => {
      const prevWeek = new Date(prev.currentWeekStart);
      prevWeek.setDate(prevWeek.getDate() - 7);
      return { ...prev, currentWeekStart: prevWeek };
    });
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentWeekStart: getWeekStart(new Date()),
      selectedDate: new Date(),
    }));
  }, []);

  const setViewMode = useCallback((mode: 'week' | 'month') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      currentWeekStart: getWeekStart(date),
    }));
  }, []);

  // Gestion des posts
  const addPost = useCallback(async (postData: Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduledPost> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const newPost = planningService.addPost(postData);
      
      setState(prev => ({
        ...prev,
        posts: [...prev.posts, newPost],
        isLoading: false,
      }));

      toast({
        title: "Post ajouté !",
        description: `Post programmé pour le ${newPost.scheduledDate.toLocaleDateString('fr-FR')} à ${newPost.scheduledTime}`,
      });

      return newPost;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le post",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  const updatePost = useCallback(async (id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const updatedPost = planningService.updatePost(id, updates);
      
      if (updatedPost) {
        setState(prev => ({
          ...prev,
          posts: prev.posts.map(p => p.id === id ? updatedPost : p),
          isLoading: false,
        }));

        toast({
          title: "Post mis à jour !",
          description: "Les modifications ont été sauvegardées",
        });
      }

      return updatedPost;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le post",
        variant: "destructive",
      });
      
      return null;
    }
  }, [toast]);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const success = planningService.deletePost(id);
      
      if (success) {
        setState(prev => ({
          ...prev,
          posts: prev.posts.filter(p => p.id !== id),
          isLoading: false,
        }));

        toast({
          title: "Post supprimé !",
          description: "Le post a été retiré du planning",
        });
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le post",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  const duplicatePost = useCallback(async (id: string, newDate?: Date): Promise<ScheduledPost | null> => {
    const originalPost = state.posts.find(p => p.id === id);
    if (!originalPost) return null;

    const duplicatedPost = {
      ...originalPost,
      title: `${originalPost.title} (copie)`,
      scheduledDate: newDate || new Date(originalPost.scheduledDate.getTime() + 24 * 60 * 60 * 1000), // +1 jour par défaut
      status: 'draft' as const,
      aiGenerated: false,
    };

    // Retirer les propriétés qui seront générées automatiquement
    const { id: _, createdAt: __, updatedAt: ___, ...postData } = duplicatedPost;
    
    return await addPost(postData);
  }, [state.posts, addPost]);

  // Génération IA
  const generateWeeklyPlan = useCallback(async (prompt?: string) => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      const defaultPrompt = prompt || `Créer un planning éditorial complet pour la semaine du ${state.currentWeekStart.toLocaleDateString('fr-FR')}. 
      Inclure 5-7 posts variés sur l'IA, la productivité et l'innovation, adaptés pour LinkedIn, Instagram et Twitter. 
      Proposer des horaires optimaux et des types de contenu diversifiés (posts, threads, carrousels).`;

      const response = await generateContent({
        prompt: defaultPrompt,
        platform: "linkedin",
        contentType: "article",
        tone: "Professionnel & stratégique",
        maxTokens: 1500,
      });

      // Parser la réponse IA pour créer des posts structurés
      const generatedPosts = await parseAIResponseToPosts(response.content, state.currentWeekStart);
      
      // Ajouter tous les posts générés
      for (const postData of generatedPosts) {
        await addPost(postData);
      }

      toast({
        title: "Planning généré avec succès !",
        description: `${generatedPosts.length} posts ont été ajoutés à votre planning`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le planning",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [state.currentWeekStart, generateContent, addPost, toast]);

  const generatePostFromAI = useCallback(async (
    prompt: string, 
    date: Date, 
    time: string, 
    platform: string
  ): Promise<ScheduledPost> => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      const response = await generateContent({
        prompt,
        platform: platform.toLowerCase(),
        contentType: "post",
        tone: "Professionnel & engageant",
        maxTokens: 800,
      });

      const postData = {
        title: extractTitleFromContent(response.content),
        content: response.content,
        platform: platform as any,
        scheduledDate: date,
        scheduledTime: time,
        status: 'draft' as const,
        contentType: 'post' as const,
        tone: 'Professionnel & engageant',
        tags: extractTagsFromContent(response.content),
        aiGenerated: true,
        originalPrompt: prompt,
      };

      const newPost = await addPost(postData);
      
      setState(prev => ({ ...prev, isGenerating: false }));
      
      return newPost;
    } catch (error) {
      setState(prev => ({ ...prev, isGenerating: false }));
      throw error;
    }
  }, [generateContent, addPost]);

  const optimizeSchedule = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      const weekPosts = getPostsByWeek(state.currentWeekStart);
      const optimizationPrompt = `Analyser ce planning éditorial et proposer des optimisations d'horaires pour maximiser l'engagement :
      
      Posts actuels :
      ${weekPosts.map(p => `- ${p.platform} : ${p.title} (${p.scheduledTime})`).join('\n')}
      
      Donner des recommandations précises d'horaires optimaux pour chaque plateforme.`;

      const response = await generateContent({
        prompt: optimizationPrompt,
        platform: "linkedin",
        contentType: "post",
        tone: "Professionnel & analytique",
        maxTokens: 800,
      });

      toast({
        title: "Optimisation terminée !",
        description: "Consultez les suggestions pour améliorer vos horaires",
      });

      // Mettre à jour les suggestions avec les recommandations IA
      const suggestions = planningService.getOptimizationSuggestions(state.currentWeekStart);
      setState(prev => ({ ...prev, suggestions, isGenerating: false }));

    } catch (error) {
      setState(prev => ({ ...prev, isGenerating: false }));
      
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser le planning",
        variant: "destructive",
      });
    }
  }, [state.currentWeekStart, generateContent, toast]);

  // Filtrage
  const setFilters = useCallback((newFilters: Partial<PlanningFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} }));
  }, []);

  const getFilteredPosts = useCallback(() => {
    return planningService.filterPosts(state.filters);
  }, [state.filters]);

  // Utilitaires
  const refreshData = useCallback(() => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const posts = planningService.loadPosts();
      const stats = planningService.getWeeklyStats(state.currentWeekStart);
      const suggestions = planningService.getOptimizationSuggestions(state.currentWeekStart);
      
      setState(prev => ({
        ...prev,
        posts,
        weeklyStats: stats,
        suggestions,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [state.currentWeekStart]);

  const exportPlanning = useCallback(() => {
    return planningService.exportData();
  }, []);

  const importPlanning = useCallback(async (data: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = planningService.importData(data);
      
      if (result.success) {
        refreshData();
        toast({
          title: "Import réussi !",
          description: result.message,
        });
      } else {
        toast({
          title: "Erreur d'import",
          description: result.message,
          variant: "destructive",
        });
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result.success;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [refreshData, toast]);

  // Statistiques
  const getWeeklyStats = useCallback(() => {
    return planningService.getWeeklyStats(state.currentWeekStart);
  }, [state.currentWeekStart]);

  const getPostsByDay = useCallback((date: Date) => {
    return state.posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.toDateString() === date.toDateString();
    });
  }, [state.posts]);

  const getPostsByWeek = useCallback((weekStart: Date) => {
    return planningService.getPostsByWeek(weekStart);
  }, []);

  return {
    ...state,
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
    setFilters,
    clearFilters,
    getFilteredPosts,
    refreshData,
    exportPlanning,
    importPlanning,
    getWeeklyStats,
    getPostsByDay,
    getPostsByWeek,
  };
};

// Utilitaires
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
  return new Date(d.setDate(diff));
}

async function parseAIResponseToPosts(content: string, weekStart: Date): Promise<Array<Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt'>>> {
  // Parser intelligent du contenu IA pour extraire des posts structurés
  const posts = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentPost = null;
  
  for (const line of lines) {
    // Détecter les nouveaux posts (patterns courants)
    if (line.match(/^\d+\.|^-|^•|^Post|^LinkedIn|^Instagram|^Twitter/i)) {
      if (currentPost) {
        posts.push(currentPost);
      }
      
      currentPost = {
        title: line.replace(/^\d+\.|^-|^•/, '').trim(),
        content: line,
        platform: detectPlatform(line),
        scheduledDate: getRandomDateInWeek(weekStart),
        scheduledTime: getOptimalTime(detectPlatform(line)),
        status: 'draft' as const,
        contentType: detectContentType(line),
        tone: 'Professionnel & engageant',
        tags: extractTagsFromContent(line),
        aiGenerated: true,
      };
    } else if (currentPost && line.trim()) {
      // Ajouter du contenu au post actuel
      currentPost.content += '\n' + line;
    }
  }
  
  if (currentPost) {
    posts.push(currentPost);
  }
  
  return posts.slice(0, 7); // Maximum 7 posts par semaine
}

function detectPlatform(content: string): 'LinkedIn' | 'Instagram' | 'X (Twitter)' {
  const lower = content.toLowerCase();
  if (lower.includes('linkedin') || lower.includes('professionnel')) return 'LinkedIn';
  if (lower.includes('instagram') || lower.includes('carrousel') || lower.includes('visuel')) return 'Instagram';
  if (lower.includes('twitter') || lower.includes('thread') || lower.includes('quick')) return 'X (Twitter)';
  
  // Par défaut, alterner
  return ['LinkedIn', 'Instagram', 'X (Twitter)'][Math.floor(Math.random() * 3)] as any;
}

function detectContentType(content: string): 'post' | 'thread' | 'article' | 'carousel' {
  const lower = content.toLowerCase();
  if (lower.includes('thread')) return 'thread';
  if (lower.includes('carrousel') || lower.includes('carousel')) return 'carousel';
  if (lower.includes('article') || content.length > 500) return 'article';
  return 'post';
}

function extractTitleFromContent(content: string): string {
  const firstLine = content.split('\n')[0];
  return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
}

function extractTagsFromContent(content: string): string[] {
  const tags = [];
  const lower = content.toLowerCase();
  
  if (lower.includes('ia') || lower.includes('ai')) tags.push('IA');
  if (lower.includes('productivité')) tags.push('Productivité');
  if (lower.includes('innovation')) tags.push('Innovation');
  if (lower.includes('tech')) tags.push('Tech');
  if (lower.includes('business')) tags.push('Business');
  
  return tags;
}

function getRandomDateInWeek(weekStart: Date): Date {
  const randomDay = Math.floor(Math.random() * 7);
  const date = new Date(weekStart);
  date.setDate(date.getDate() + randomDay);
  return date;
}

function getOptimalTime(platform: string): string {
  const times = {
    'LinkedIn': ['09:00', '10:30', '14:00', '17:00'],
    'Instagram': ['12:00', '15:00', '18:00', '20:00'],
    'X (Twitter)': ['08:00', '12:00', '17:00', '19:00'],
  };
  
  const platformTimes = times[platform as keyof typeof times] || times['LinkedIn'];
  return platformTimes[Math.floor(Math.random() * platformTimes.length)];
} 