import React, { useState, useEffect } from 'react';
import { 
  Brain, Users, MessageSquare, Zap, Lightbulb,
  Building, UserCheck, Globe, Scale,
  Target, RefreshCw, CheckCircle, BrainCircuit
} from 'lucide-react';

// 🏛️ IRISH GOVERNMENT DOCUMENT SOURCES
const DOCUMENT_SOURCES = {
  government: {
    name: 'Government Departments',
    icon: Building,
    color: 'blue',
    sources: [
      'Department of Environment, Climate and Communications',
      'Department of Agriculture, Food and the Marine', 
      'Department of Housing, Local Government and Heritage',
      'Office of the Attorney General',
      'Department of Public Expenditure and Reform'
    ],
    documentTypes: ['Policy Papers', 'White Papers', 'Green Papers', 'Legislation', 'Strategies']
  },
  opposition: {
    name: 'Opposition Parties',
    icon: Users,
    color: 'orange',
    sources: [
      'Fianna Fáil Parliamentary Party',
      'Sinn Féin Parliamentary Party',
      'Labour Party',
      'Social Democrats',
      'Solidarity-People Before Profit'
    ],
    documentTypes: ['Policy Alternatives', 'Critiques', 'Private Members Bills', 'Position Papers']
  },
  citizens: {
    name: 'Public Consultation',
    icon: UserCheck,
    color: 'green',
    sources: [
      'Citizens Assembly Reports',
      'Public Consultation Responses',
      'NGO Position Papers',
      'Academic Research',
      'Community Group Submissions'
    ],
    documentTypes: ['Consultation Responses', 'Research Papers', 'Recommendations', 'Impact Studies']
  },
  eu: {
    name: 'EU Framework',
    icon: Globe,
    color: 'purple',
    sources: [
      'EU Commission Directives',
      'European Parliament Resolutions',
      'Court of Justice Rulings',
      'EU Agency Reports',
      'Treaty Obligations'
    ],
    documentTypes: ['Directives', 'Regulations', 'Court Decisions', 'Guidance', 'Compliance Reports']
  }
};

// 🤖 AI AGENT DEFINITIONS
const AI_AGENTS = {
  'Government-Agent': {
    name: 'Government Policy Agent',
    role: 'Analyzes official government positions and implementation strategies',
    icon: Building,
    color: 'blue'
  },
  'Opposition-Agent': {
    name: 'Opposition Critique Agent', 
    role: 'Identifies policy gaps, alternative approaches, and potential improvements',
    icon: Users,
    color: 'orange'
  },
  'Citizen-Agent': {
    name: 'Citizen Advocacy Agent',
    role: 'Represents public interest and lived experience of policy impacts',
    icon: UserCheck,
    color: 'green'
  },
  'Expert-Agent': {
    name: 'Evidence Synthesis Agent',
    role: 'Provides objective analysis based on research, data, and best practices',
    icon: Scale,
    color: 'purple'
  }
};

// 📊 MOCK CROSS-POLLINATION RESULTS
const SAMPLE_CROSS_POLLINATION = {
  topic: 'River Restoration Policy',
  governmentPosition: 'Water Action Plan 2024 allocates €3.15bn for restoration over 7 years.',
  oppositionCritiques: [
    'Funding timeline too slow for EU WFD deadline compliance.',
    'Insufficient focus on agricultural pollution sources.',
    'Lacks mandatory targets for local authorities.'
  ],
  emergentConsensus: {
    agreementPoints: [
      'River restoration is urgently needed for legal compliance.',
      'Farmer participation is essential but needs financial incentives.',
      'Transparent, science-based allocation criteria are required.',
      'Local implementation capacity needs strengthening.'
    ],
    innovativeSolutions: [
      'Phased implementation starting with willing farmers.',
      'Insurance premium reductions for participating landowners.',
      'Shared governance model with farmer-council partnerships.',
      'Performance-based funding with measurable outcomes.'
    ],
    consensusLevel: 0.85
  }
};

const IrishPolicyDemo: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [documentCount, setDocumentCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDocumentCount(prev => Math.min(prev + Math.floor(Math.random() * 5) + 1, 247));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerCrossPollination = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setResults(SAMPLE_CROSS_POLLINATION);
      setActiveView('results');
      setIsProcessing(false);
    }, 3000);
  };

  const OverviewView = () => (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4">Irish Democracy Cross-Pollinator</h1>
        <p className="text-lg text-gray-600 dark:text-c42-text-dark-secondary mb-6">
          A demonstration of AI-driven policy synthesis for Irish governance.
        </p>
        <div className="inline-flex items-center space-x-4 bg-white dark:bg-c42-dark-card rounded-full px-6 py-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{documentCount} Documents Analyzed</span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">4 AI Agents Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(DOCUMENT_SOURCES).map(([key, source]) => {
          const IconComponent = source.icon;
          const colorClass = `text-${source.color}-600 dark:text-${source.color}-400`;
          return (
            <div key={key} className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <IconComponent className={`w-8 h-8 ${colorClass}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-c42-text-dark-primary">{source.name}</h3>
              </div>
              <ul className="space-y-2 mb-4 list-disc list-inside text-sm text-gray-600 dark:text-c42-text-dark-secondary">
                {source.documentTypes.slice(0, 2).map((type, idx) => (
                  <li key={idx}>{type}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-c42-primary/5 via-white to-c42-secondary/5 dark:from-c42-primary/20 dark:via-c42-dark-card dark:to-c42-secondary/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
          <BrainCircuit className="w-6 h-6 text-c42-primary" />
          <span>AI Agent Council</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(AI_AGENTS).map(([id, agent]) => {
            const IconComponent = agent.icon;
            const colorClass = `text-${agent.color}-600 dark:text-${agent.color}-400`;
            return (
              <div key={id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800/50">
                <div className="flex items-center space-x-3 mb-2">
                  <IconComponent className={`w-6 h-6 ${colorClass}`} />
                  <h3 className="font-semibold text-gray-800 dark:text-c42-text-dark-primary">{agent.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary">{agent.role}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-6">
          <button
            onClick={triggerCrossPollination}
            disabled={isProcessing}
            className="px-8 py-4 bg-gradient-to-r from-c42-primary to-c42-secondary text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center space-x-2 mx-auto"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Agents Collaborating...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Run Demo Analysis on River Restoration</span>
              </>
            )}
          </button>
      </div>
    </div>
  );

  const ResultsView = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center space-x-3">
          <Target className="w-6 h-6 text-c42-accent" />
          <span>Analysis Results: River Restoration</span>
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Consensus Level: <span className="font-bold text-green-600 dark:text-green-400">85%</span>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4">Agreement Points</h3>
        <ul className="space-y-2 list-disc list-inside text-green-700 dark:text-green-200">
          {results?.emergentConsensus?.agreementPoints?.map((point: string, idx: number) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Emergent Solutions</h3>
        <ul className="space-y-2 list-disc list-inside text-blue-700 dark:text-blue-200">
          {results?.emergentConsensus?.innovativeSolutions?.map((solution: string, idx: number) => (
            <li key={idx}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Government Position</span>
          </h3>
          <p className="text-gray-600 dark:text-c42-text-dark-secondary">{results?.governmentPosition}</p>
        </div>
        <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Opposition Critique</span>
          </h3>
          <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-c42-text-dark-secondary">
            {results?.oppositionCritiques?.map((critique: string, idx: number) => (
              <li key={idx}>{critique}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setActiveView('overview')}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Overview
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary">
        {isProcessing && !results ? (
             <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-c42-primary mx-auto animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agents are Collaborating...</h2>
                    <p className="text-gray-500 dark:text-gray-400">Synthesizing perspectives to find common ground.</p>
                </div>
            </div>
        ) : (
            <>
                {activeView === 'overview' && <OverviewView />}
                {activeView === 'results' && results && <ResultsView />}
            </>
        )}
    </div>
  );
};

export default IrishPolicyDemo;
