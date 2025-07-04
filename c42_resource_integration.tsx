
import React, { useState, useEffect } from 'react';
import { Euro, Users, Target, Activity, CheckCircle, BrainCircuit, Zap, TrendingUp } from 'lucide-react';

// Mock SDK for demo purposes
const createMockSDK = () => {
  const eventBus = {
    listeners: new Map(),
    emit: (event, data) => {
      const handlers = eventBus.listeners.get(event) || [];
      handlers.forEach(handler => handler(data));
    },
    on: (event, handler) => {
      if (!eventBus.listeners.has(event)) {
        eventBus.listeners.set(event, []);
      }
      eventBus.listeners.get(event).push(handler);
    }
  };

  return {
    version: '3.0',
    agent: {
      register: (id, capabilities) => {
        console.log(`🤖 Agent registered: ${id}`, capabilities);
        eventBus.emit('agent_registered', { id, capabilities });
      },
      broadcast: async (message) => {
        console.log('📢 Broadcasting:', message);
        eventBus.emit('agent_message', message);
        eventBus.emit(`message_${message.topic}`, message);
      },
      whisper: async (to, content) => {
        console.log(`🤫 Whispering to ${to}:`, content);
        eventBus.emit('agent_whisper', { to, content });
      },
      convene: async (topic) => {
        const councilId = `council_${Date.now()}`;
        console.log(`🏛️ Council convened: ${councilId} for ${topic}`);
        eventBus.emit('council_convened', { councilId, topic });
        return councilId;
      },
      subscribe: (pattern, handler) => {
        eventBus.on(`message_${pattern}`, handler);
        eventBus.on('agent_message', (msg) => {
          if (pattern === '*' || msg.topic.includes(pattern)) {
            handler(msg);
          }
        });
      }
    },
    eventBus
  };
};

interface Donor {
  id: string;
  wallet: number;
  preferences: Record<string, number>;
  allocationBudget: number;
  lastActivity: number;
  trustLevel: number;
}

interface Cause {
  id: string;
  name: string;
  need: number;
  priority: number;
  received: number;
  totalReceived: number;
  lastUpdate: number;
}

interface CouncilInsight {
    agent: string;
    reasoning: string;
    recommendations: Record<string, Record<string, number>>;
    confidence: number;
}

// Council-Enhanced ResourceDistributorAgent
class DemoResourceDistributorAgent {
  id: string;
  sdk: any;
  donors: Map<string, Donor>;
  causes: Map<string, Cause>;
  allocationHistory: any[];
  isProcessing: boolean;
  councilActive: boolean;
  councilInsights: CouncilInsight[];
  onUpdate: () => void;


  constructor(sdk, onUpdate) {
    this.id = 'Distributor-Agent';
    this.sdk = sdk;
    this.donors = new Map();
    this.causes = new Map();
    this.allocationHistory = [];
    this.isProcessing = false;
    this.councilActive = false;
    this.councilInsights = [];
    this.onUpdate = onUpdate;
    
    this.initialize();
  }

  async initialize() {
    this.sdk.agent.register(this.id, ['allocate_resources', 'track_flows', 'coordinate_donors', 'council_review']);
    
    this.sdk.agent.subscribe('offer_capacity', (msg) => this.handleCapacityOffer(msg));
    this.sdk.agent.subscribe('register_need', (msg) => this.handleNeedRegistration(msg));
    this.sdk.agent.subscribe('preference_update', (msg) => this.handlePreferenceUpdate(msg));
    this.sdk.agent.subscribe('council_insight', (msg) => this.handleCouncilInsight(msg));
    
    await this.sdk.agent.broadcast({
      from: this.id,
      topic: 'agent:ready',
      content: { message: 'ResourceDistributorAgent ready!' }
    });
  }

  handleCouncilInsight(msg) {
    this.councilInsights.push(msg.content);
    this.onUpdate();
  }

  async handleCapacityOffer(msg) {
    const { donorId, wallet, allocationPercentage = 0.15, preferences = {} } = msg.content;
    
    const donor: Donor = {
      id: donorId,
      wallet,
      preferences,
      allocationBudget: wallet * allocationPercentage,
      lastActivity: Date.now(),
      trustLevel: 75
    };
    
    this.donors.set(donorId, donor);
    console.log(`💰 Donor ${donorId} offered €${donor.allocationBudget.toFixed(2)}`);
    
    await this.evaluateAllocations();
    
    await this.sdk.agent.whisper(donorId, {
      topic: 'capacity_acknowledged',
      content: { budget: donor.allocationBudget, message: 'Capacity registered successfully' }
    });
    this.onUpdate();
  }

  async handleNeedRegistration(msg) {
    const { causeId, name, need, priority = 0.6 } = msg.content;
    
    const cause: Cause = {
      id: causeId,
      name: name || causeId,
      need,
      priority: Math.max(0, Math.min(1, priority)),
      received: 0,
      totalReceived: 0,
      lastUpdate: Date.now()
    };
    
    this.causes.set(causeId, cause);
    console.log(`🎯 Cause ${causeId} needs €${need} (priority: ${priority})`);
    
    await this.evaluateAllocations();
    
    await this.sdk.agent.whisper(causeId, {
      topic: 'need_acknowledged',
      content: { need: cause.need, message: 'Need registered successfully' }
    });
    this.onUpdate();
  }

  async handlePreferenceUpdate(msg) {
    const { donorId, preferences } = msg.content;
    const donor = this.donors.get(donorId);
    if (donor) {
      donor.preferences = { ...donor.preferences, ...preferences };
      this.donors.set(donorId, donor);
      await this.evaluateAllocations();
    }
    this.onUpdate();
  }

  async evaluateAllocations() {
    // Placeholder for allocation logic
    this.onUpdate();
  }
}

const ResourceSteward: React.FC = () => {
    const [agent, setAgent] = useState<DemoResourceDistributorAgent | null>(null);
    const [_, setTick] = useState(0); // Used to force re-renders

    useEffect(() => {
        const sdk = createMockSDK();
        const demoAgent = new DemoResourceDistributorAgent(sdk, () => {
            setTick(t => t + 1);
        });
        setAgent(demoAgent);

        // Add some initial data
        setTimeout(() => {
            sdk.eventBus.emit('message_offer_capacity', {
                content: { donorId: 'EU Climate Fund', wallet: 500000, preferences: { 'River-Cleanup': 0.7, 'Community-Garden': 0.3 } }
            });
            sdk.eventBus.emit('message_offer_capacity', {
                content: { donorId: 'Local Philanthropist', wallet: 75000, preferences: { 'Community-Garden': 0.9 } }
            });
            sdk.eventBus.emit('message_register_need', {
                content: { causeId: 'River-Cleanup', name: 'River Liffey Restoration', need: 120000, priority: 0.8 }
            });
            sdk.eventBus.emit('message_register_need', {
                content: { causeId: 'Community-Garden', name: 'Dublin Community Garden', need: 35000, priority: 0.5 }
            });
             sdk.eventBus.emit('message_register_need', {
                content: { causeId: 'Peatland-Restoration', name: 'Wicklow Mountains Peatlands', need: 250000, priority: 0.9 }
            });
        }, 500);

    }, []);

    if (!agent) {
        return <div className="p-6 text-center text-gray-600 dark:text-c42-text-dark-secondary">Initializing Resource Steward Agent...</div>;
    }

    const totalBudget = Array.from(agent.donors.values()).reduce((sum, d) => sum + d.allocationBudget, 0);
    const totalNeed = Array.from(agent.causes.values()).reduce((sum, c) => sum + c.need, 0);
    const efficiency = totalBudget > 0 ? ((Math.min(totalBudget, totalNeed)/totalBudget)*100) : 0;

    return (
        <div className="p-6 bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center gap-3">
                        <Zap className="w-8 h-8 text-c42-primary" />
                        AI Resource Steward
                    </h1>
                    <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">
                        An autonomous agent for efficient and transparent resource allocation based on collective intelligence.
                    </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-green-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Total Budget</h3>
                            <Euro className="w-8 h-8 opacity-70" />
                        </div>
                        <p className="text-4xl font-bold mt-2">
                            €{totalBudget.toLocaleString('en-IE')}
                        </p>
                        <p className="text-sm opacity-80 mt-1">{agent.donors.size} donors contributing</p>
                    </div>
                     <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex justify-between items-start">
                           <h3 className="font-semibold">Total Need</h3>
                            <Target className="w-8 h-8 opacity-70" />
                        </div>
                        <p className="text-4xl font-bold mt-2">
                             €{totalNeed.toLocaleString('en-IE')}
                        </p>
                        <p className="text-sm opacity-80 mt-1">{agent.causes.size} causes requesting funds</p>
                    </div>
                     <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Allocation Efficiency</h3>
                            <TrendingUp className="w-8 h-8 opacity-70" />
                        </div>
                        <p className="text-4xl font-bold mt-2">
                            {efficiency.toFixed(1)}%
                        </p>
                        <p className="text-sm opacity-80 mt-1">Matching budget to priority needs</p>
                    </div>
                     <div className="bg-white dark:bg-c42-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-c42-text-dark-primary">Agent Status</h3>
                             <BrainCircuit className="w-6 h-6 text-gray-400 dark:text-c42-text-dark-secondary" />
                        </div>
                        <p className="text-3xl font-bold text-green-500 dark:text-green-400 mt-2 flex items-center gap-2">
                           <CheckCircle className="w-7 h-7" /> Active
                        </p>
                        <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary mt-1">Continuously evaluating...</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Donors Column */}
                    <div className="bg-white dark:bg-c42-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-c42-secondary" />
                            Donors ({agent.donors.size})
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {Array.from(agent.donors.values()).map(donor => (
                                <div key={donor.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="font-semibold text-gray-900 dark:text-c42-text-dark-primary">{donor.id}</p>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-500 dark:text-gray-400">Allocation Budget:</span>
                                        <span className="font-mono text-green-600 dark:text-green-400 flex items-center">
                                            <Euro className="w-4 h-4 mr-1" />
                                            {donor.allocationBudget.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Preferences: {Object.keys(donor.preferences).join(', ') || 'None'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Causes Column */}
                    <div className="bg-white dark:bg-c42-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-c42-primary" />
                            Causes ({agent.causes.size})
                        </h2>
                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {Array.from(agent.causes.values()).map(cause => (
                                <div key={cause.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="font-semibold text-gray-900 dark:text-c42-text-dark-primary">{cause.name}</p>
                                     <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-500 dark:text-gray-400">Funding Need:</span>
                                        <span className="font-mono text-orange-600 dark:text-orange-400 flex items-center">
                                            <Euro className="w-4 h-4 mr-1" />
                                            {cause.need.toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Priority: </span>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                            <div className="bg-c42-primary h-1.5 rounded-full" style={{ width: `${cause.priority * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceSteward;
