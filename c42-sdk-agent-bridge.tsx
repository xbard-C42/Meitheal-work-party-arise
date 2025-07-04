// 🌉 C42 SDK v3.0 - AGENT BRIDGE
// ================================
// This connects your EXISTING SDK with the NEW Agent System!
// Drop this into your main index.tsx and watch the magic! ✨

import React, { useState, useEffect } from 'react';
import { EventEmitter } from 'events';

// 🎯 PART 1: EXTEND YOUR EXISTING SDK
// We're not replacing - we're ENHANCING!
interface C42SDKv2 {
  version: string;
  subscribe: (eventType: string, callback: (payload: any) => void) => void;
  request: (action: string, payload: object) => Promise<any>;
}

export interface C42SDKv3 extends C42SDKv2 {
  // New agent superpowers!
  agent: {
    register: (agentId: string, capabilities: string[]) => void;
    broadcast: (message: AgentMessage) => Promise<void>;
    whisper: (to: string, content: any) => Promise<any>;
    convene: (topic: string) => Promise<string>;
    subscribe: (pattern: string, handler: (msg: AgentMessage) => void) => void;
  };
  
  // Keep v2 compatibility!
  _v2Mode: boolean;
}

// 📨 Message types (simpler version for integration)
export interface AgentMessage {
  from: string;
  to?: string | string[];
  topic: string;
  content: any;
  timestamp?: number;
}

interface AgentInfo {
  id: string;
  appId: string;
  capabilities: string[];
  status: 'active' | 'inactive';
  trustLevel: number;
}

// 🧠 PART 2: THE BRIDGE IMPLEMENTATION
// This goes in your main index.tsx!
export class C42KernelAgentBridge {
  private agents = new Map<string, AgentInfo>();
  public eventBus = new EventEmitter();
  private messageQueue: AgentMessage[] = [];
  private auditLog: any[] = [];
  
  constructor(private subscriptionManager: any) {
    console.log('🌉 C42 Agent Bridge initializing...');
  }

  // 🔌 INJECT INTO IFRAME
  // This is what each app gets!
  createSDKForIframe(iframe: HTMLIFrameElement, appId: string): void {
    // Wait for iframe to load
    iframe.addEventListener('load', () => {
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) return;

      // Create the enhanced SDK
      const sdk: C42SDKv3 = {
        // Keep ALL v2 functionality
        version: '3.0',
        subscribe: (eventType, callback) => {
          this.subscriptionManager.subscribe(eventType, callback);
        },
        
        request: async (action, payload) => {
          if (action.startsWith('agent:')) {
            return this.handleAgentRequest(appId, action, payload);
          }
          return this.handleLegacyRequest(action, payload);
        },
        
        // NEW AGENT FEATURES!
        agent: {
          register: (agentId, capabilities) => {
            this.registerAgent(agentId, appId, capabilities);
          },
          broadcast: async (message) => {
            return this.broadcastMessage({ ...message, from: appId });
          },
          whisper: async (to, content) => {
            return this.sendWhisper(appId, to, content);
          },
          convene: async (topic) => {
            return this.startCouncil(appId, topic);
          },
          subscribe: (pattern, handler) => {
            this.subscribeToAgentMessages(appId, pattern, handler);
          }
        },
        
        _v2Mode: false
      };

      // Inject into iframe
      (iframeWindow as any).C42_SDK = sdk;
      
      console.log(`💉 Injected SDK v3 into ${appId}`);
      
      // Notify the app
      iframeWindow.postMessage({
        type: 'sdk_ready',
        version: '3.0',
        features: ['agent', 'legacy']
      }, '*');
    });
  }

  // 🤖 AGENT REGISTRATION
  private registerAgent(agentId: string, appId: string, capabilities: string[]): void {
    console.log(`🤖 Registering agent: ${agentId} from app: ${appId}`);
    
    this.agents.set(agentId, {
      id: agentId,
      appId,
      capabilities,
      status: 'active',
      trustLevel: 50
    });

    this.broadcastMessage({
      from: 'C42-Kernel',
      topic: 'agent:joined',
      content: { agentId, capabilities }
    });
    
    this.eventBus.emit('agent:update', Array.from(this.agents.values()));
  }

  // 📢 MESSAGE BROADCASTING
  private async broadcastMessage(message: AgentMessage): Promise<void> {
    message.timestamp = Date.now();
    this.audit('broadcast', message);
    this.messageQueue.push(message);
    this.processMessageQueue();
  }

  private processMessageQueue(): void {
    const message = this.messageQueue.shift();
    if(!message) return;

    const interested = this.findInterestedAgents(message.topic);
    
    interested.forEach(agentInfo => {
      this.deliverMessage(agentInfo, message);
    });
  }

  // 🤫 PRIVATE MESSAGING
  private async sendWhisper(from: string, to: string, content: any): Promise<any> {
    const message: AgentMessage = {
      from,
      to,
      topic: 'whisper',
      content,
      timestamp: Date.now()
    };

    if (!this.checkTrust(from, to)) {
      throw new Error(`Trust not established between ${from} and ${to}`);
    }

    this.audit('whisper', { from, to, timestamp: message.timestamp });
    const targetAgent = Array.from(this.agents.values()).find(a => a.id === to);
    if (targetAgent) {
      return this.deliverMessage(targetAgent, message);
    }
  }

  // 🏛️ COUNCIL CREATION
  private async startCouncil(initiator: string, topic: string): Promise<string> {
    const councilId = `council_${Date.now()}`;
    console.log(`🏛️ ${initiator} starting council about: ${topic}`);
    this.broadcastMessage({
      from: 'C42-Kernel',
      to: '*',
      topic: 'council:invitation',
      content: { councilId, topic, initiator }
    });

    return councilId;
  }

  private findInterestedAgents(topic: string): AgentInfo[] {
    const interested: AgentInfo[] = [];
    this.agents.forEach(agent => {
        if (agent.capabilities.some(cap => topic.includes(cap))) {
            interested.push(agent);
        }
    });
    return interested;
  }

  private deliverMessage(agent: AgentInfo, message: AgentMessage): any {
    const iframe = document.querySelector(`iframe[data-app-id="${agent.appId}"]`) as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ type: 'agent:message', message }, '*');
    return { delivered: true };
  }

  private checkTrust(from: string, to: string): boolean {
    const fromAgent = Array.from(this.agents.values()).find(a => a.appId === from);
    const toAgent = Array.from(this.agents.values()).find(a => a.id === to);
    return fromAgent && toAgent && fromAgent.trustLevel > 30;
  }

  private audit(action: string, details: any): void {
    const entry = { timestamp: Date.now(), action, details, hash: 'mock_hash' };
    this.auditLog.push(entry);
    this.eventBus.emit('audit', entry);
  }

  private subscribeToAgentMessages(appId: string, pattern: string, handler: Function): void {
    const messageHandler = (message: AgentMessage) => {
        if (message.topic.match(pattern.replace('*', '.*'))) {
            handler(message);
        }
    };
    this.eventBus.on('agent:message', messageHandler);
  }

  private handleLegacyRequest(action: string, payload: any): Promise<any> {
    console.log(`Legacy request: ${action}`, payload);
    return Promise.resolve({ success: true });
  }

  private handleAgentRequest(appId: string, action: string, payload: any): Promise<any> {
    console.log(`Agent request from ${appId}: ${action}`, payload);
    return Promise.resolve({ success: true });
  }
}

// 🎨 PART 5: ADD UI FOR AGENT VISIBILITY
export const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [recentMessages, setRecentMessages] = useState<AgentMessage[]>([]);
  
  useEffect(() => {
    const bridge = (window as any).c42Bridge as C42KernelAgentBridge;
    if (bridge) {
      const agentUpdateHandler = (agentList: AgentInfo[]) => setAgents(agentList);
      const auditHandler = (entry: any) => {
        if (entry.action === 'broadcast') {
          setRecentMessages(prev => [...prev.slice(-4), entry.details]);
        }
      };
      bridge.eventBus.on('agent:update', agentUpdateHandler);
      bridge.eventBus.on('audit', auditHandler);
      
      return () => {
          bridge.eventBus.off('agent:update', agentUpdateHandler);
          bridge.eventBus.off('audit', auditHandler);
      }
    }
  }, []);

  return (
    <div className="bg-white/80 dark:bg-c42-dark-card/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Active Agents</h3>
      
      <div className="space-y-2">
        {agents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{agent.id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Trust: {agent.trustLevel}%</span>
            </div>
            <div className="flex space-x-1">
              {agent.capabilities.slice(0, 3).map(cap => (
                <span key={cap} className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <h4 className="font-medium text-sm mt-4 mb-2 text-gray-900 dark:text-white">Recent Activity</h4>
      <div className="space-y-1 text-sm font-mono">
        {recentMessages.map((msg, i) => (
          <div key={i} className="text-gray-500 dark:text-gray-400">
            {msg.from} → {msg.topic}
          </div>
        ))}
      </div>
    </div>
  );
};
