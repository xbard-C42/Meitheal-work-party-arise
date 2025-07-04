
import React, { useState, useMemo } from 'react';
import { LayoutDashboard, BrainCircuit, Zap, Database, Globe, History, Shield, Menu, X, GraduationCap } from 'lucide-react';

import Dashboard from './Dashboard.tsx';
import PolicyPollinator from './enhanced_democracy_frontend.tsx';
import IrishPolicyDemo from './irish_democracy_cross_pollinator.tsx';
import ResourceSteward from './c42_resource_integration.tsx';
import KnowledgeBase from './conversation_search_engine.tsx';
import ChangelogModal from './changelog_component.tsx';
import SecurityPolicyModal from './security_policy_component.tsx';
import EvidenceHub from './AcademicHub.tsx';
import ConsentGate from './ConsentGate.tsx';


const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const showMessage = (message: string) => {
    // A simple implementation for now. Can be replaced with a toast library.
    alert(message);
  };

  const views = useMemo(() => ({
    dashboard: {
      label: 'Dashboard',
      component: <Dashboard setActiveView={setActiveView} />,
      icon: LayoutDashboard
    },
    evidence_hub: {
      label: 'Evidence Hub',
      component: <EvidenceHub showMessage={showMessage} setActiveView={setActiveView} />,
      icon: GraduationCap
    },
    policy_pollinator: {
      label: 'Policy Pollinator',
      component: <PolicyPollinator />,
      icon: BrainCircuit
    },
    resource_steward: {
      label: 'Resource Steward',
      component: <ResourceSteward />,
      icon: Zap
    },
    knowledge_base: {
      label: 'Knowledge Base',
      component: <KnowledgeBase />,
      icon: Database
    },
    irish_demo: {
        label: 'Irish Policy Demo',
        component: <IrishPolicyDemo />,
        icon: Globe
    }
  }), [setActiveView]);

  const NavItem: React.FC<{ viewId: string }> = ({ viewId }) => {
    const { label, icon: Icon } = views[viewId];
    const isActive = activeView === viewId;
    return (
      <button
        onClick={() => {
          setActiveView(viewId);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-c42-primary/10 text-c42-primary font-semibold'
            : 'text-gray-600 dark:text-c42-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-c42-text-dark-primary'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1 text-left">{label}</span>
      </button>
    );
  };
  
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white dark:bg-c42-dark-card border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
            <BrainCircuit className="w-8 h-8 text-c42-primary" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary">C42 OS</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="w-6 h-6"/>
        </button>
      </div>
      
      <nav className="flex-grow space-y-2">
        {Object.keys(views).map(viewId => (
          <NavItem key={viewId} viewId={viewId} />
        ))}
      </nav>

      <div className="flex-shrink-0 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowChangelog(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-c42-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-c42-text-dark-primary"
        >
          <History className="w-5 h-5" />
          <span>System Updates</span>
        </button>
        <button
          onClick={() => setShowSecurityPolicy(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-c42-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-c42-text-dark-primary"
        >
          <Shield className="w-5 h-5" />
          <span>Security Policy</span>
        </button>
      </div>
    </div>
  );

  if (!hasConsented) {
    return <ConsentGate onConsent={() => setHasConsented(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-c42-dark-bg">
      <aside className={`fixed lg:relative z-20 h-full w-64 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex-shrink-0`}>
          <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col max-h-screen">
          <div className="lg:hidden flex items-center p-4 bg-white dark:bg-c42-dark-card border-b border-gray-200 dark:border-gray-700">
             <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Menu className="w-6 h-6"/>
            </button>
            <h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">{views[activeView].label}</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
              {views[activeView].component}
          </div>
      </main>

      <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
      <SecurityPolicyModal isOpen={showSecurityPolicy} onClose={() => setShowSecurityPolicy(false)} />
    </div>
  );
};

export default App;
