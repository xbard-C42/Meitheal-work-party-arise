
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, Users, FileText, MessageSquare, Zap, Eye, Settings, 
  ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Heart,
  Building, UserCheck, Globe, Scale, BookOpen, Lightbulb,
  Target, Search, Filter, RefreshCw, Database, Loader2,
  Upload, Download, BarChart3, BrainCircuit
} from 'lucide-react';
import { policyDocuments, PolicyDocument } from './policy_data.ts';
import DocumentViewer from './DocumentViewer.tsx';

// 🌐 API SERVICE CLASS
class DemocracyAPI {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🔍 SEARCH DOCUMENTS (Now uses real data)
  async searchDocuments(query: string, filters?: {
    category?: string;
    source?: string;
    type?: string;
  }): Promise<any[]> {
    await this.trackInteraction('search_documents', query);
    
    let results = policyDocuments;

    // Text search
    if (query) {
        const lowerCaseQuery = query.toLowerCase();
        results = results.filter(doc => 
            doc.title.toLowerCase().includes(lowerCaseQuery) ||
            doc.aiAnalysis.summary.toLowerCase().includes(lowerCaseQuery) ||
            doc.keyTopics.some(topic => topic.toLowerCase().includes(lowerCaseQuery))
        );
    }
    
    // Filter by category
    if (filters?.category && filters.category !== 'all') {
        results = results.filter(doc => doc.category === filters.category);
    }

    // Filter by source
    if (filters?.source && filters.source !== 'all') {
        results = results.filter(doc => doc.source === filters.source);
    }

    // Filter by type
    if (filters?.type && filters.type !== 'all') {
        results = results.filter(doc => doc.type === filters.type);
    }

    return Promise.resolve(results);
  }

  // 🌱 START CROSS-POLLINATION
  async startCrossPollination(topic: string, documentIds: string[]): Promise<string | null> {
    try {
      console.log('Starting cross-pollination with topic:', topic, 'and docs:', documentIds);
      // Mock response for demo
      const conversationId = `conv_${Date.now()}`;
      await this.trackInteraction('trigger_cross_pollination', topic, true);
      return Promise.resolve(conversationId);
    } catch (error) {
      console.error('Cross-pollination failed:', error);
      return null;
    }
  }

  // 📊 GET CONVERSATION RESULTS
  async getConversationResults(conversationId: string): Promise<any | null> {
    try {
      console.log('Getting results for conversation:', conversationId);
      // Mock response for demo
      const mockResults = {
        topic: 'River Restoration Policy',
        emergentConsensus: {
            agreementPoints: [
                'River restoration is urgently needed for legal compliance and biodiversity.',
                'Farmer participation is essential and requires financial incentives and support.',
                'Transparent, science-based allocation criteria for funding are required.',
                'Local implementation capacity, especially in councils, needs strengthening.'
            ],
            innovativeSolutions: [
                'Establish a "results-based" payment scheme for farmers who improve water quality.',
                'Create local "Water Trusts" with shared governance between farmers, councils, and community groups.',
                'Offer insurance premium reductions for landowners implementing natural flood management.',
                'Develop a digital platform for real-time monitoring of water quality accessible to the public.'
            ],
            consensusLevel: 0.85
        },
        conversation: [
            { agentId: 'Government-Agent', analysisType: 'support', confidence: 0.9, message: 'The current Water Action Plan provides a robust framework and funding for these efforts.' },
            { agentId: 'Opposition-Agent', analysisType: 'critique', confidence: 0.8, message: 'The timeline is too slow, and enforcement against major polluters is weak.' },
            { agentId: 'Citizen-Agent', analysisType: 'synthesis', confidence: 0.88, message: 'Communities are eager to help but need technical guidance and assurance that their concerns about land use are heard.' },
            { agentId: 'Expert-Agent', analysisType: 'support', confidence: 0.95, message: 'International evidence shows that collaborative, catchment-based approaches yield the best long-term results.' }
        ]
      };
      return Promise.resolve(mockResults);
    } catch (error) {
      console.error('Failed to get conversation results:', error);
      return null;
    }
  }
  
  private async trackInteraction(action: string, query?: string, satisfied: boolean = true): Promise<void> {
    try {
      console.log('Tracking interaction:', { sessionId: this.sessionId, action, query, satisfied });
      return Promise.resolve();
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  }
}

const PolicyPollinator: React.FC = () => {
  const [api] = useState(new DemocracyAPI());
  const [activeView, setActiveView] = useState<string>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState({ category: 'all', source: 'all', type: 'all' });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [crossPollinationTopic, setCrossPollinationTopic] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationResults, setConversationResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [viewingDocument, setViewingDocument] = useState<PolicyDocument | null>(null);

  const filterOptions = useMemo(() => {
    const categories = [...new Set(policyDocuments.map(d => d.category))].sort();
    const sources = [...new Set(policyDocuments.map(d => d.source))].sort();
    const types = [...new Set(policyDocuments.map(d => d.type))].sort();
    return { categories, sources, types };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      try {
        const results = await api.searchDocuments(searchQuery, filters);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, api]);

  const toggleDocumentSelection = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  const startCrossPollination = async () => {
    if (!crossPollinationTopic.trim() || selectedDocuments.size === 0) {
      alert('Please enter a topic and select at least one document');
      return;
    }

    setIsProcessing(true);
    setConversationResults(null);
    try {
      const convId = await api.startCrossPollination(
        crossPollinationTopic,
        Array.from(selectedDocuments)
      );
      
      if (convId) {
        setConversationId(convId);
        setActiveView('results');
        pollForResults(convId);
      }
    } finally {
      // Keep processing true until poll is done
    }
  };

  const pollForResults = (convId: string) => {
    setTimeout(async () => {
        const results = await api.getConversationResults(convId);
        if (results) {
            setConversationResults(results);
        }
        setIsProcessing(false);
    }, 3000);
  };

  const SearchView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4 flex items-center space-x-3">
          <Search className="w-6 h-6 text-c42-primary" />
          <span>Search Policy Documents</span>
        </h2>
        
        <div className="space-y-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies, legislation, consultations..."
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-c42-text-dark-primary rounded-lg border border-gray-300 dark:border-gray-700 focus:border-c42-primary focus:ring-1 focus:ring-c42-primary"
            aria-label="Search documents"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({...f, category: e.target.value}))}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-c42-text-dark-secondary rounded-lg border border-gray-300 dark:border-gray-700 focus:border-c42-primary focus:ring-1 focus:ring-c42-primary"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilters(f => ({...f, source: e.target.value}))}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-c42-text-dark-secondary rounded-lg border border-gray-300 dark:border-gray-700 focus:border-c42-primary focus:ring-1 focus:ring-c42-primary"
              aria-label="Filter by source"
            >
              <option value="all">All Sources</option>
              {filterOptions.sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({...f, type: e.target.value}))}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-c42-text-dark-secondary rounded-lg border border-gray-300 dark:border-gray-700 focus:border-c42-primary focus:ring-1 focus:ring-c42-primary"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-c42-primary" />
        </div>
      ) : (
        <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary">Search Results ({searchResults.length})</h3>
            <div className="text-sm text-gray-600 dark:text-c42-text-dark-secondary">
              Selected: {selectedDocuments.size} documents
            </div>
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {searchResults.length > 0 ? searchResults.map((doc) => (
              <div
                key={doc._id}
                className={`border rounded-lg p-4 transition-all duration-200 bg-white dark:bg-c42-dark-card cursor-pointer group ${
                  selectedDocuments.has(doc._id)
                    ? 'border-c42-primary/80 bg-c42-primary/5 dark:bg-c42-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setViewingDocument(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-gray-900 dark:text-c42-text-dark-primary mb-2 group-hover:text-c42-primary transition-colors">{doc.title}</h4>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-c42-text-dark-secondary mb-2">
                      <span><Building className="w-3 h-3 inline mr-1" />{doc.source}</span>
                      <span><FileText className="w-3 h-3 inline mr-1" />{doc.type}</span>
                      <span><Globe className="w-3 h-3 inline mr-1" />{doc.category}</span>
                      <span>{new Date(doc.datePublished).getFullYear()}</span>
                    </div>
                    {doc.aiAnalysis && (
                      <p className="text-gray-600 dark:text-c42-text-dark-secondary text-sm line-clamp-2">{doc.aiAnalysis.summary}</p>
                    )}
                     <div className="flex flex-wrap gap-2 mt-3">
                      {doc.keyTopics?.slice(0, 5).map((topic: string, idx: number) => (
                        <span key={idx} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pl-4" onClick={e => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selectedDocuments.has(doc._id)}
                        onChange={() => toggleDocumentSelection(doc._id)}
                        className="h-5 w-5 rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-c42-primary focus:ring-2 focus:ring-c42-primary focus:ring-offset-white dark:focus:ring-offset-c42-dark-card"
                        aria-label={`Select document: ${doc.title}`}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-500 dark:text-c42-text-dark-secondary">
                <p>No documents match your criteria.</p>
                <p className="text-sm">Try broadening your search or adjusting filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDocuments.size > 0 && (
        <div className="bg-gradient-to-r from-purple-50/50 via-white to-violet-50/50 dark:from-purple-900/50 dark:via-c42-dark-card dark:to-violet-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4 flex items-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-300" />
            <span>Start Cross-Pollination Analysis</span>
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={crossPollinationTopic}
              onChange={(e) => setCrossPollinationTopic(e.target.value)}
              placeholder="Enter analysis topic (e.g., 'River restoration policy implementation')"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-c42-text-dark-primary rounded-lg border border-gray-300 dark:border-gray-700 focus:border-c42-primary"
            />
            <div className="flex items-center justify-between">
              <div className="text-purple-700 dark:text-purple-200 text-sm">
                {selectedDocuments.size} documents selected for analysis
              </div>
              <button
                onClick={startCrossPollination}
                disabled={isProcessing || !crossPollinationTopic.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:scale-105 disabled:from-gray-500 disabled:to-gray-600 disabled:hover:scale-100 text-white font-semibold rounded-lg transition-all flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ResultsView = () => (
    <div className="space-y-6">
      {isProcessing || !conversationResults ? (
        <div className="text-center py-12">
          <BrainCircuit className="w-16 h-16 text-c42-primary mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-2">AI Agents Collaborating</h3>
          <p className="text-gray-600 dark:text-c42-text-dark-secondary">
            Synthesizing perspectives from selected documents to find common ground...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center space-x-3">
              <Target className="w-6 h-6 text-c42-accent" />
              <span>Analysis Results</span>
            </h2>
            <div className="text-sm text-gray-600 dark:text-c42-text-dark-secondary">
              Consensus Level: <span className="text-green-600 dark:text-green-400 font-bold">
                {(conversationResults.emergentConsensus.consensusLevel * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Points of Agreement</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-green-700 dark:text-green-200">
              {conversationResults.emergentConsensus.agreementPoints.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-c42-secondary/10 border border-blue-200 dark:border-c42-secondary/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 dark:text-c42-secondary mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Emergent Solutions</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-blue-700 dark:text-c42-text-dark-primary">
              {conversationResults.emergentConsensus.innovativeSolutions.map((solution: string, idx: number) => (
                <li key={idx}>{solution}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Agent Conversation</span>
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
              {conversationResults.conversation.map((message: any, idx: number) => (
                <div key={idx} className="flex items-start space-x-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                    message.agentId.includes('Government') ? 'bg-blue-600' :
                    message.agentId.includes('Opposition') ? 'bg-orange-600' :
                    message.agentId.includes('Citizen') ? 'bg-green-600' :
                    'bg-purple-600'
                  }`}>
                    {message.agentId.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800 dark:text-c42-text-dark-primary">{message.agentId}</span>
                      <span className="text-xs text-gray-500 dark:text-c42-text-dark-secondary">
                        {message.analysisType} • {(message.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-c42-text-dark-secondary text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => setActiveView('search')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-c42-text-dark-primary rounded-lg transition-colors"
            >
              New Analysis
            </button>
            <button
              onClick={() => {
                const data = JSON.stringify(conversationResults, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cross-pollination-${conversationResults.topic.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-6 py-3 bg-c42-primary hover:bg-c42-primary/80 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-full p-6 bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-c42-primary"/>
                Policy Pollinator
            </h1>
            <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">
                Synthesizing diverse policy documents to uncover consensus and innovative solutions.
            </p>
        </div>
        
        {activeView === 'search' ? <SearchView /> : <ResultsView />}

        <DocumentViewer document={viewingDocument} onClose={() => setViewingDocument(null)} />
      </div>
    </div>
  );
};

export default PolicyPollinator;
