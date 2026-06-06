import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Clock, Tag } from 'lucide-react';
import { ScheduledPost } from '@/lib/planning-service';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface PostModalProps {
  post?: ScheduledPost | null;
  selectedDate?: Date | null;
  onSave: (postData: any) => void;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, selectedDate, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'LinkedIn',
    scheduledTime: '09:00',
    contentType: 'post',
    tone: 'Professionnel & engageant',
    tags: [] as string[],
    status: 'draft',
    estimatedEngagement: '',
  });

  const [newTag, setNewTag] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const { generateContent } = useAI();
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        platform: post.platform,
        scheduledTime: post.scheduledTime,
        contentType: post.contentType,
        tone: post.tone,
        tags: post.tags,
        status: post.status,
        estimatedEngagement: post.estimatedEngagement || '',
      });
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        scheduledDate: selectedDate,
      }));
    }
  }, [post, selectedDate]);

  const platforms = [
    { value: 'LinkedIn', label: 'LinkedIn 💼' },
    { value: 'Instagram', label: 'Instagram 📸' },
    { value: 'X (Twitter)', label: 'X (Twitter) 𝕏' },
    { value: 'Facebook', label: 'Facebook 📘' },
    { value: 'TikTok', label: 'TikTok 🎵' },
  ];

  const contentTypes = [
    { value: 'post', label: 'Post simple' },
    { value: 'thread', label: 'Thread' },
    { value: 'article', label: 'Article long' },
    { value: 'carousel', label: 'Carrousel' },
    { value: 'story', label: 'Story' },
    { value: 'video', label: 'Vidéo' },
  ];

  const tones = [
    'Professionnel & engageant',
    'Décontracté & amical',
    'Educatif & expert',
    'Inspirant & motivant',
    'Humoristique & léger',
    'Analytique & factuel',
  ];

  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Prompt requis',
        description: 'Veuillez saisir une description pour générer le contenu',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateContent({
        prompt: aiPrompt,
        platform: formData.platform.toLowerCase(),
        contentType: formData.contentType,
        tone: formData.tone,
        maxTokens: 1000,
      });

      // Extraire le titre du contenu généré
      const lines = response.content.split('\n').filter((line) => line.trim());
      const title =
        lines[0]?.length > 60
          ? lines[0].substring(0, 60) + '...'
          : lines[0] || 'Post généré par IA';

      setFormData((prev) => ({
        ...prev,
        title,
        content: response.content,
        tags: [...prev.tags, 'IA'],
      }));

      toast({
        title: 'Contenu généré !',
        description: 'Le contenu a été créé par Kora',
      });
    } catch (error) {
      console.error('[components/PostModal] catch:', error);
      toast({
        title: 'Erreur de génération',
        description: 'Impossible de générer le contenu',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et le contenu',
        variant: 'destructive',
      });
      return;
    }

    const postData = {
      ...formData,
      scheduledDate: selectedDate || new Date(),
      aiGenerated: formData.tags.includes('IA'),
      originalPrompt: aiPrompt || undefined,
    };

    onSave(postData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <span>{post ? 'Modifier le post' : 'Créer un nouveau post'}</span>
              {selectedDate && (
                <Badge variant="outline">{selectedDate.toLocaleDateString('fr-FR')}</Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Génération IA */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-blue-900 font-semibold mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Générer avec Kora</span>
            </h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Décrivez le contenu que vous souhaitez créer..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="bg-blue-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Contenu */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titre du post
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Titre accrocheur pour votre post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contenu</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Rédigez votre contenu ici..."
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.content.length} caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={`row-${index}`}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} variant="outline" size="sm">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Colonne droite - Paramètres */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Plateforme</label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => handleInputChange('platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de contenu
                </label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => handleInputChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ton</label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => handleInputChange('tone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Heure de publication</span>
                </label>
                <Select
                  value={formData.scheduledTime}
                  onValueChange={(value) => handleInputChange('scheduledTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="scheduled">Programmé</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Engagement estimé
                </label>
                <Input
                  value={formData.estimatedEngagement}
                  onChange={(e) => handleInputChange('estimatedEngagement', e.target.value)}
                  placeholder="ex: ~150 interactions"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 text-white">
              {post ? 'Mettre à jour' : 'Créer le post'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostModal;
