import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import InspirationAI from '../components/InspirationAI';
import ImageGenerator from '../components/ImageGenerator';
import Planning from '../components/Planning';
import Analytics from '../components/Analytics';
import Library from '../components/Library';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'inspiration':
        return <InspirationAI />;
      case 'images':
        return <ImageGenerator />;
      case 'planning':
        return <Planning />;
      case 'analytics':
        return <Analytics />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
