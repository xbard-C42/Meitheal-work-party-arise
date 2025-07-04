import React from 'react';
import { LayoutDashboard, BrainCircuit, Zap, Database, Globe, ArrowRight } from 'lucide-react';
import { AgentDashboard } from './c42-sdk-agent-bridge.tsx';

interface DashboardProps {
    setActiveView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {

    const AppCard = ({ title, description, icon: Icon, viewId, gradient }) => (
        <div 
            className={`bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-c42-primary transition-all flex flex-col cursor-pointer group shadow-sm hover:shadow-lg`}
            onClick={() => setActiveView(viewId)}
        >
            <div className="flex-grow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-c42-text-dark-primary mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary">{description}</p>
            </div>
            <div className="mt-6 text-sm font-semibold text-c42-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary">C42 OS Dashboard</h1>
                    <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">
                        Welcome to the unified interface for collaborative intelligence.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <AppCard 
                                title="Policy Pollinator"
                                description="Synthesize diverse policy documents to find consensus and emergent solutions."
                                icon={BrainCircuit}
                                viewId="policy_pollinator"
                                gradient="bg-gradient-to-br from-purple-500 to-c42-primary"
                           />
                           <AppCard 
                                title="Resource Steward"
                                description="An autonomous agent for efficient and transparent resource allocation."
                                icon={Zap}
                                viewId="resource_steward"
                                gradient="bg-gradient-to-br from-green-500 to-c42-accent"
                           />
                           <AppCard 
                                title="Knowledge Base"
                                description="Upload, search, and analyze patterns across all your AI conversations."
                                icon={Database}
                                viewId="knowledge_base"
                                gradient="bg-gradient-to-br from-blue-500 to-c42-secondary"
                           />
                           <AppCard 
                                title="Irish Policy Demo"
                                description="A specific use-case demonstrating AI-driven policy synthesis for Ireland."
                                icon={Globe}
                                viewId="irish_demo"
                                gradient="bg-gradient-to-br from-orange-500 to-red-500"
                           />
                        </div>
                    </div>
                    
                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <AgentDashboard />
                        <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                             <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">System Status</h3>
                             <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-c42-text-dark-secondary">Core Services</span>
                                    <span className="font-medium text-c42-accent">Online</span>
                                </div>
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-c42-text-dark-secondary">Agent Network</span>
                                     <span className="font-medium text-c42-accent">Healthy</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-c42-text-dark-secondary">Database Connection</span>
                                     <span className="font-medium text-c42-accent">Stable</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
