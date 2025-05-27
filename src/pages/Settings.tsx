import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import Header from '../components/Header';
import AIConnectionTest from '../components/AIConnectionTest';
import LinkedInAuth from '../components/LinkedInAuth';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
          <p className="text-slate-600">Gérez vos préférences et votre compte Korev AI</p>
        </div>

        <div className="space-y-6">
          {/* Test de connectivité IA */}
          <AIConnectionTest />

          {/* Connexion LinkedIn */}
          <LinkedInAuth />

          {/* Profil utilisateur */}
          <Card className="bg-white border border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <User className="w-5 h-5 text-blue-600" />
                <span>Profil utilisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" alt="Franck" />
                  <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                    F
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-1">
                  <div>
                    <Label htmlFor="username" className="text-slate-700">Nom d'utilisateur</Label>
                    <Input id="username" defaultValue="Franck" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input id="email" type="email" defaultValue="franck@korev.ai" className="mt-1" />
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Mettre à jour le profil
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white border border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700">Notifications push</Label>
                  <p className="text-sm text-slate-500">Recevoir des notifications en temps réel</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700">Sauvegarde automatique</Label>
                  <p className="text-sm text-slate-500">Sauvegarder automatiquement vos projets</p>
                </div>
                <Switch 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>

          {/* Apparence */}
          <Card className="bg-white border border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <Palette className="w-5 h-5 text-blue-600" />
                <span>Apparence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700">Mode sombre</Label>
                  <p className="text-sm text-slate-500">Activer le thème sombre</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div>
                <Label className="text-slate-700">Langue</Label>
                <select className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-900">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white border border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-slate-700">Mot de passe actuel</Label>
                <Input id="current-password" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="new-password" className="text-slate-700">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-slate-700">Confirmer le nouveau mot de passe</Label>
                <Input id="confirm-password" type="password" className="mt-1" />
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline" className="text-slate-600 border-slate-300">
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
