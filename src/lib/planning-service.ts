/** Champs systèmes d'un ScheduledPost (générés à la persistance). */
export type ScheduledPostSystemField = 'id' | 'createdAt' | 'updatedAt';

/** Payload de création d'un post (sans les champs systèmes). */
export type ScheduledPostInput = Omit<ScheduledPost, ScheduledPostSystemField>;

export interface ScheduledPost {
  id: string;
  platform: 'LinkedIn' | 'Instagram' | 'X (Twitter)' | 'Facebook' | 'TikTok';
  title: string;
  content: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  contentType: 'post' | 'thread' | 'story' | 'article' | 'carousel' | 'video';
  tone: string;
  tags: string[];
  estimatedEngagement?: string;
  actualEngagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  aiGenerated: boolean;
  originalPrompt?: string;
}

export interface WeeklyPlan {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  posts: ScheduledPost[];
  goals: {
    totalPosts: number;
    platformDistribution: Record<string, number>;
    contentTypeDistribution: Record<string, number>;
  };
  performance?: {
    totalEngagement: number;
    averageEngagement: number;
    bestPerformingPost?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanningFilters {
  platforms?: string[];
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  contentTypes?: string[];
}

class PlanningService {
  private readonly STORAGE_KEY = 'kora_planning_data';
  private readonly PLANS_KEY = 'kora_weekly_plans';

  // Gestion des posts individuels
  savePosts(posts: ScheduledPost[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Erreur sauvegarde posts:', error);
      throw new Error('Impossible de sauvegarder les posts');
    }
  }

  loadPosts(): ScheduledPost[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const posts = JSON.parse(data);
      return posts.map((post: any) => ({
        ...post,
        scheduledDate: new Date(post.scheduledDate),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      }));
    } catch (error) {
      console.error('Erreur chargement posts:', error);
      return [];
    }
  }

  addPost(post: ScheduledPostInput): ScheduledPost {
    const newPost: ScheduledPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const posts = this.loadPosts();
    posts.push(newPost);
    this.savePosts(posts);

    return newPost;
  }

  updatePost(id: string, updates: Partial<ScheduledPost>): ScheduledPost | null {
    const posts = this.loadPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.savePosts(posts);
    return posts[index];
  }

  deletePost(id: string): boolean {
    const posts = this.loadPosts();
    const filteredPosts = posts.filter((p) => p.id !== id);

    if (filteredPosts.length === posts.length) return false;

    this.savePosts(filteredPosts);
    return true;
  }

  getPostsByDateRange(start: Date, end: Date): ScheduledPost[] {
    const posts = this.loadPosts();
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledDate);
      return postDate >= start && postDate <= end;
    });
  }

  getPostsByWeek(weekStart: Date): ScheduledPost[] {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return this.getPostsByDateRange(weekStart, weekEnd);
  }

  // Gestion des plans hebdomadaires
  saveWeeklyPlan(plan: WeeklyPlan): void {
    try {
      const plans = this.loadWeeklyPlans();
      const existingIndex = plans.findIndex((p) => p.id === plan.id);

      if (existingIndex >= 0) {
        plans[existingIndex] = { ...plan, updatedAt: new Date() };
      } else {
        plans.push(plan);
      }

      localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Erreur sauvegarde plan:', error);
      throw new Error('Impossible de sauvegarder le plan');
    }
  }

  loadWeeklyPlans(): WeeklyPlan[] {
    try {
      const data = localStorage.getItem(this.PLANS_KEY);
      if (!data) return [];

      const plans = JSON.parse(data);
      return plans.map((plan: any) => ({
        ...plan,
        weekStart: new Date(plan.weekStart),
        weekEnd: new Date(plan.weekEnd),
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
        posts: plan.posts.map((post: any) => ({
          ...post,
          scheduledDate: new Date(post.scheduledDate),
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        })),
      }));
    } catch (error) {
      console.error('Erreur chargement plans:', error);
      return [];
    }
  }

  createWeeklyPlan(weekStart: Date, posts: ScheduledPost[]): WeeklyPlan {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const plan: WeeklyPlan = {
      id: this.generateId(),
      weekStart,
      weekEnd,
      posts,
      goals: this.calculateGoals(posts),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveWeeklyPlan(plan);
    return plan;
  }

  // Filtrage et recherche
  filterPosts(filters: PlanningFilters): ScheduledPost[] {
    let posts = this.loadPosts();

    if (filters.platforms?.length) {
      const { platforms } = filters;
      posts = posts.filter((post) => platforms.includes(post.platform));
    }

    if (filters.status?.length) {
      const { status } = filters;
      posts = posts.filter((post) => status.includes(post.status));
    }

    if (filters.dateRange) {
      const { dateRange } = filters;
      posts = posts.filter((post) => {
        const postDate = new Date(post.scheduledDate);
        return postDate >= dateRange.start && postDate <= dateRange.end;
      });
    }

    if (filters.contentTypes?.length) {
      const { contentTypes } = filters;
      posts = posts.filter((post) => contentTypes.includes(post.contentType));
    }

    return posts;
  }

  // Statistiques et analytics
  getWeeklyStats(weekStart: Date) {
    const posts = this.getPostsByWeek(weekStart);

    const platformDistribution = posts.reduce(
      (acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const statusDistribution = posts.reduce(
      (acc, post) => {
        acc[post.status] = (acc[post.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalPosts: posts.length,
      platformDistribution,
      statusDistribution,
      scheduledPosts: posts.filter((p) => p.status === 'scheduled').length,
      draftPosts: posts.filter((p) => p.status === 'draft').length,
      publishedPosts: posts.filter((p) => p.status === 'published').length,
    };
  }

  // Optimisation et suggestions
  getOptimizationSuggestions(weekStart: Date): Array<{
    type: 'timing' | 'content' | 'platform' | 'frequency';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: string;
    impact: string;
  }> {
    const posts = this.getPostsByWeek(weekStart);
    type Suggestion = {
      type: 'content' | 'timing' | 'platform' | 'frequency';
      priority: 'high' | 'low' | 'medium';
      title: string;
      description: string;
      action: string;
      impact: string;
    };
    const suggestions: Suggestion[] = [];

    // Vérifier la distribution des plateformes
    const platforms = [...new Set(posts.map((p) => p.platform))];
    if (platforms.length < 2) {
      suggestions.push({
        type: 'platform',
        priority: 'high' as const,
        title: 'Diversifier les plateformes',
        description: 'Vous ne publiez que sur une plateforme cette semaine',
        action: "Ajouter des posts sur d'autres réseaux",
        impact: '+30% de portée potentielle',
      });
    }

    // Vérifier la fréquence de publication
    const dailyDistribution = posts.reduce(
      (acc, post) => {
        const day = post.scheduledDate.getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const emptyDays = Array.from({ length: 7 }, (_, i) => i).filter(
      (day) => !dailyDistribution[day],
    );
    if (emptyDays.length > 3) {
      suggestions.push({
        type: 'frequency',
        priority: 'medium' as const,
        title: 'Augmenter la fréquence',
        description: `${emptyDays.length} jours sans publication cette semaine`,
        action: 'Ajouter du contenu pour les jours vides',
        impact: "+15% d'engagement régulier",
      });
    }

    // Suggestions d'horaires optimaux
    const morningPosts = posts.filter((p) => {
      const hour = Number.parseInt(p.scheduledTime.split(':')[0]);
      return hour >= 8 && hour <= 11;
    });

    if (morningPosts.length < posts.length * 0.3) {
      suggestions.push({
        type: 'timing',
        priority: 'medium' as const,
        title: 'Optimiser les horaires',
        description: 'Peu de posts programmés aux heures de pointe (8h-11h)',
        action: 'Décaler certains posts vers le matin',
        impact: "+20% d'engagement moyen",
      });
    }

    return suggestions;
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calculateGoals(posts: ScheduledPost[]) {
    const platformDistribution = posts.reduce(
      (acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const contentTypeDistribution = posts.reduce(
      (acc, post) => {
        acc[post.contentType] = (acc[post.contentType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalPosts: posts.length,
      platformDistribution,
      contentTypeDistribution,
    };
  }

  // Export/Import pour backup
  exportData(): string {
    const posts = this.loadPosts();
    const plans = this.loadWeeklyPlans();

    return JSON.stringify(
      {
        posts,
        plans,
        exportDate: new Date(),
        version: '1.0',
      },
      null,
      2,
    );
  }

  importData(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);

      if (data.posts) {
        this.savePosts(data.posts);
      }

      if (data.plans) {
        localStorage.setItem(this.PLANS_KEY, JSON.stringify(data.plans));
      }

      return { success: true, message: 'Données importées avec succès' };
    } catch (_error) {
      return { success: false, message: "Erreur lors de l'import des données" };
    }
  }
}

export const planningService = new PlanningService();
