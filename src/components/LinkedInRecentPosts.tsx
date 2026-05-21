import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageCircle, MousePointer, TrendingUp, Calendar } from 'lucide-react';
import type { LinkedInPost } from '@/lib/linkedin-api';

interface LinkedInRecentPostsProps {
  posts: LinkedInPost[];
  isLoading?: boolean;
  maxPosts?: number;
}

// Fonction de formatage du contenu selon les tests TDD
const formatPostContent = (content: string, maxLength: number = 100): string => {
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};

// Fonction de calcul des métriques selon les tests TDD
const formatMetrics = (metrics: LinkedInPost['metrics']) => ({
  engagement:
    (((metrics.likes + metrics.comments + metrics.shares) / metrics.impressions) * 100).toFixed(1) +
    '%',
  totalInteractions: metrics.likes + metrics.comments + metrics.shares,
});

// Fonction de formatage des dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Fonction de formatage des nombres
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const LinkedInRecentPosts: React.FC<LinkedInRecentPostsProps> = ({
  posts,
  isLoading = false,
  maxPosts = 3,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Derniers Articles LinkedIn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Derniers Articles LinkedIn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">📝</div>
            <p className="text-gray-600">Aucun article trouvé</p>
            <p className="text-sm text-gray-500">Publiez du contenu pour voir vos métriques ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayPosts = posts.slice(0, maxPosts);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Derniers Articles LinkedIn
          </div>
          <Badge variant="secondary">{posts.length} posts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayPosts.map((post, index) => {
            const metrics = formatMetrics(post.metrics);
            const isTopPerformer = index === 0; // Le premier post est généralement le plus performant

            return (
              <div
                key={post.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isTopPerformer ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Header du post */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={isTopPerformer ? 'default' : 'secondary'} className="text-xs">
                        {isTopPerformer && <TrendingUp className="h-3 w-3 mr-1" />}
                        Post #{index + 1}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metrics.engagement}
                  </Badge>
                </div>

                {/* Contenu du post */}
                <div className="mb-4">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {formatPostContent(post.content, 150)}
                  </p>
                </div>

                {/* Métriques détaillées */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Portée</p>
                      <p className="text-sm font-medium">
                        {formatNumber(post.metrics.impressions)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Likes</p>
                      <p className="text-sm font-medium">{formatNumber(post.metrics.likes)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Commentaires</p>
                      <p className="text-sm font-medium">{formatNumber(post.metrics.comments)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">Clics</p>
                      <p className="text-sm font-medium">{formatNumber(post.metrics.clicks)}</p>
                    </div>
                  </div>
                </div>

                {/* Badge de performance pour le meilleur post */}
                {isTopPerformer && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Meilleur post ({metrics.totalInteractions} interactions)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lien vers plus de posts si nécessaire */}
        {posts.length > maxPosts && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              + {posts.length - maxPosts} autres posts disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
