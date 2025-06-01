#!/bin/bash

echo "🚀 Démarrage des serveurs pour test LinkedIn"
echo "============================================"

# Vérifier si les ports sont libres
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 déjà utilisé (serveur proxy)"
else
    echo "🔧 Démarrage du serveur proxy sur port 3001..."
    node server.cjs &
    PROXY_PID=$!
    echo "✅ Serveur proxy démarré (PID: $PROXY_PID)"
fi

if lsof -Pi :8088 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8088 déjà utilisé (serveur Vite)"
else
    echo "🔧 Démarrage du serveur Vite sur port 8088..."
    npm run dev &
    VITE_PID=$!
    echo "✅ Serveur Vite démarré (PID: $VITE_PID)"
fi

echo ""
echo "🌐 Serveurs disponibles:"
echo "   - Application: http://localhost:8088"
echo "   - Test LinkedIn: http://localhost:8088/linkedin-test"
echo "   - Proxy API: http://localhost:3001"
echo ""
echo "📝 Instructions pour le test:"
echo "1. Ouvrez http://localhost:8088/linkedin-test"
echo "2. Cliquez sur '🚀 Test Immédiat LinkedIn'"
echo "3. Autorisez l'application sur LinkedIn"
echo "4. Observez les logs dans la console du navigateur"
echo ""
echo "⏹️  Pour arrêter les serveurs: Ctrl+C"

# Attendre que l'utilisateur arrête
wait 