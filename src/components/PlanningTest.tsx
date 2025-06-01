import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PlanningTest = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Planning - Composant Simplifié</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Si vous voyez ce message, le problème ne vient pas des composants UI de base.</p>
          <p>Le serveur fonctionne correctement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningTest; 