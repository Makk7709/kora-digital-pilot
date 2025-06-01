import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TestComponent = () => {
  const [status, setStatus] = React.useState('loading');

  React.useEffect(() => {
    // Test simple pour vérifier que React fonctionne
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'loading' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
          {status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          Test React
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Status: <span className="font-semibold">{status}</span>
          </p>
          <p className="text-sm text-gray-600">
            React: ✅ Fonctionnel
          </p>
          <p className="text-sm text-gray-600">
            TypeScript: ✅ Fonctionnel
          </p>
          <p className="text-sm text-gray-600">
            Vite: ✅ Fonctionnel
          </p>
          <p className="text-sm text-gray-600">
            shadcn/ui: ✅ Fonctionnel
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestComponent; 