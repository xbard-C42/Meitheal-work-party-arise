
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, BarChart3, Calendar, User, Brain, Sparkles, Upload, AlertCircle, FileArchive, Zap, Loader2, CheckCircle, AlertTriangle, Database, FileText, FileJson } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { addConversations, searchConversations } from './api.ts';

// Initialize the Gemini AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to read a file and return its base64 representation
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is a data URL: "data:mime/type;base64,the_base_64_string"
      // We only need the base64 part
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

interface ConversationMessage {
  id: string;
  timestamp: Date;
  role: 'human' | 'assistant';
  content: string;
  platform: string;
  metadata?: Record<string, any>;
}

interface Conversation {
  id: string;
  title?: string;
  platform: string;
  startDate: Date;
  endDate: Date;
  messages: ConversationMessage[];
  metadata?: Record<string, any>;
}

// 🚀 SIMPLE FILE PROCESSOR (Browser-Compatible)
const processConversationFile = async (file: File): Promise<Conversation[]> => {
  const text = await file.text();
  const conversations: Conversation[] = [];
  
  try {
    if (file.name.endsWith('.json')) {
      const data = JSON.parse(text);
      
      // Handle ChatGPT format
      if (Array.isArray(data)) {
        data.forEach((conv, index) => {
          if (conv.mapping || conv.messages) {
            conversations.push(normalizeChatGPTConversation(conv, index));
          }
        });
      } else if (data.mapping || data.messages) {
        conversations.push(normalizeChatGPTConversation(data, 0));
      }
      
      // Handle Claude format
      if (data.conversation || data.messages) {
        conversations.push(normalizeClaudeConversation(data));
      }
    } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      conversations.push(parseTextConversation(text, file.name));
    }
  } catch (error) {
    console.warn(`Failed to process ${file.name}:`, error);
  }
  
  return conversations;
};

const normalizeChatGPTConversation = (data: any, index: number): Conversation => {
  const messages: ConversationMessage[] = [];
  
  // Handle mapping format
  if (data.mapping) {
    Object.values(data.mapping).forEach((node: any) => {
      if (node.message?.content?.parts?.[0]) {
        messages.push({
          id: node.id || `chatgpt_${messages.length}`,
          timestamp: new Date(node.message.create_time * 1000),
          role: node.message.author.role === 'user' ? 'human' : 'assistant',
          content: node.message.content.parts.join('\n'),
          platform: 'ChatGPT',
          metadata: { model: node.message.metadata?.model_slug }
        });
      }
    });
  }
  
  // Handle direct messages format
  if (data.messages) {
    data.messages.forEach((msg: any, msgIndex: number) => {
      if (msg.content) {
        messages.push({
          id: msg.id || `chatgpt_${msgIndex}`,
          timestamp: new Date(msg.create_time * 1000 || Date.now()),
          role: msg.author?.role === 'user' ? 'human' : 'assistant',
          content: msg.content,
          platform: 'ChatGPT',
          metadata: { model: msg.model }
        });
      }
    });
  }
  
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return {
    id: data.id || `chatgpt_${index}_${Date.now()}`,
    title: data.title || `ChatGPT Conversation ${index + 1}`,
    platform: 'ChatGPT',
    startDate: messages[0]?.timestamp || new Date(),
    endDate: messages[messages.length - 1]?.timestamp || new Date(),
    messages,
    metadata: { source: 'import' }
  };
};

const normalizeClaudeConversation = (data: any): Conversation => {
  const messages: ConversationMessage[] = [];
  const messageSource = data.conversation || data.messages || [];
  
  messageSource.forEach((msg: any, index: number) => {
    if (msg.text || msg.content) {
      messages.push({
        id: msg.id || `claude_${index}`,
        timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
        role: msg.role === 'user' ? 'human' : 'assistant',
        content: msg.text || msg.content || '',
        platform: 'Claude',
        metadata: {}
      });
    }
  });
  
  return {
    id: data.id || `claude_${Date.now()}`,
    title: data.title || data.name || 'Claude Conversation',
    platform: 'Claude',
    startDate: messages[0]?.timestamp || new Date(),
    endDate: messages[messages.length - 1]?.timestamp || new Date(),
    messages,
    metadata: { source: 'import' }
  };
};

const parseTextConversation = (text: string, filename: string): Conversation => {
  const messages: ConversationMessage[] = [];
  const lines = text.split('\n');
  
  let currentMessage = '';
  let currentRole: 'human' | 'assistant' = 'human';
  let messageIndex = 0;
  
  for (const line of lines) {
    if (line.toLowerCase().startsWith('human:') || line.toLowerCase().startsWith('user:')) {
      if (currentMessage.trim()) {
        messages.push({
          id: `text_msg_${messageIndex++}`,
          timestamp: new Date(),
          role: currentRole,
          content: currentMessage.trim(),
          platform: 'Imported'
        });
      }
      currentRole = 'human';
      currentMessage = line.replace(/^.*?(human|user):\s*/i, '').trim();
    } else if (line.toLowerCase().startsWith('assistant:') || line.toLowerCase().startsWith('ai:')) {
      if (currentMessage.trim()) {
        messages.push({
          id: `text_msg_${messageIndex++}`,
          timestamp: new Date(),
          role: currentRole,
          content: currentMessage.trim(),
          platform: 'Imported'
        });
      }
      currentRole = 'assistant';
      currentMessage = line.replace(/^.*?(assistant|ai):\s*/i, '').trim();
    } else {
      currentMessage += (currentMessage ? '\n' : '') + line;
    }
  }
  
  if (currentMessage.trim()) {
    messages.push({
      id: `text_msg_${messageIndex}`,
      timestamp: new Date(),
      role: currentRole,
      content: currentMessage.trim(),
      platform: 'Imported'
    });
  }

  return {
    id: `imported_${Date.now()}`,
    title: `Imported: ${filename}`,
    platform: 'Imported',
    startDate: messages.length > 0 ? messages[0].timestamp : new Date(),
    endDate: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date(),
    messages,
    metadata: { source: 'file_import', filename }
  };
};

// 🎭 INTEGRATED FILE UPLOADER COMPONENT
const FileUploader: React.FC<{
  onConversationsLoaded: (conversations: Conversation[]) => void;
  onError: (error: string) => void;
}> = ({ onConversationsLoaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{
    total: number;
    processed: number;
    currentFile: string;
    errors: string[];
  }>({ total: 0, processed: 0, currentFile: '', errors: [] });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  }, []);

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(file => 
      file.name.endsWith('.json') || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.docx')
    );

    if (validFiles.length === 0) {
      onError('Please select valid files (.json, .txt, .md, .pdf, .docx)');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus({ total: validFiles.length, processed: 0, currentFile: '', errors: [] });

    const allConversations: Conversation[] = [];

    for (const file of validFiles) {
      try {
        setProcessingStatus(prev => ({ ...prev, currentFile: `Processing ${file.name}...` }));
        let conversations: Conversation[] = [];
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        if (['json', 'txt', 'md'].includes(extension!)) {
          conversations = await processConversationFile(file);
        } else if (['pdf', 'docx'].includes(extension!)) {
          setProcessingStatus(prev => ({ ...prev, currentFile: `Analyzing ${file.name} with AI...` }));
          
          const base64Data = await readFileAsBase64(file);
          
          const filePart = {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          };
          const textPart = {
            text: "Extract the full text content from the attached document. If it is a standard document, article, or report, extract and return only the main body text, excluding headers, footers, and page numbers. If it appears to be a structured conversation transcript (e.g., with 'User:', 'AI:', 'Human:', 'Assistant:'), please format the output as a simple text file, maintaining the conversational structure with 'human:' and 'assistant:' prefixes. The goal is to get the core textual information."
          };
  
          const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: { parts: [textPart, filePart] },
          });
  
          const extractedText = response.text;
          
          if (extractedText) {
            conversations = [parseTextConversation(extractedText, file.name)];
          } else {
             throw new Error("AI could not extract text from the document.");
          }
        }
  
        allConversations.push(...conversations);
        setProcessingStatus(prev => ({ ...prev, processed: prev.processed + 1 }));
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        setProcessingStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          errors: [...prev.errors, `${file.name}: ${error.message || 'Unknown error'}`]
        }));
      }
    }

    setIsProcessing(false);
    
    if (allConversations.length > 0) {
      onConversationsLoaded(allConversations);
    } else {
      onError('No valid conversations or text could be extracted from the uploaded files.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-c42-primary bg-c42-primary/10 scale-102' 
              : isProcessing
              ? 'border-purple-400 dark:border-purple-300 bg-purple-50 dark:bg-purple-500/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-c42-dark-card/50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6">
          {isProcessing ? (
            <Brain className="h-16 w-16 text-purple-500 dark:text-purple-400 mx-auto animate-pulse" />
          ) : (
            <div className="relative">
              <FileArchive className={`h-16 w-16 mx-auto transition-colors ${
                isDragging ? 'text-c42-primary' : 'text-gray-400 dark:text-gray-500'
              }`} />
              {isDragging && (
                <Zap className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className={`text-xl font-semibold ${
            isProcessing ? 'text-purple-600 dark:text-purple-300' : isDragging ? 'text-c42-primary' : 'text-gray-900 dark:text-c42-text-dark-primary'
          }`}>
            {isProcessing ? 'Processing Your Documents...' :
             isDragging ? 'Drop Your Files Here!' :
             'Upload Your AI Conversations & Documents'}
          </h3>
          
          <p className={`text-sm ${
            isProcessing ? 'text-purple-500 dark:text-purple-400' : isDragging ? 'text-c42-secondary' : 'text-gray-600 dark:text-c42-text-dark-secondary'
          }`}>
            {isProcessing ? 'Extracting insights from your knowledge...' :
             isDragging ? 'Release to start the magic!' :
             'Drop .pdf, .docx, .json, .txt, or .md files here'}
          </p>
        </div>

        {!isProcessing && (
          <>
            <input 
              type="file" 
              accept=".json,.txt,.md,.pdf,.docx"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              id="file-upload"
              disabled={isProcessing}
            />
            <label 
              htmlFor="file-upload"
              className={`mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                isDragging 
                  ? 'bg-c42-primary hover:bg-c42-primary/80 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-c42-text-dark-primary'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Choose Files</span>
            </label>
          </>
        )}
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="bg-white dark:bg-c42-dark-card rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Processing files...</span>
            <span className="text-c42-secondary font-medium">
              {processingStatus.processed} / {processingStatus.total}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-c42-secondary to-c42-primary h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${processingStatus.total > 0 ? (processingStatus.processed / processingStatus.total) * 100 : 0}%` 
              }}
            />
          </div>

          {processingStatus.currentFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-c42-secondary" />
              <span>{processingStatus.currentFile}</span>
            </div>
          )}
        </div>
      )}

      {/* Format Support Info */}
      <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center space-x-2">
          <CheckCircle className="h-4 w-4"/>
          <span>Supported Formats</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400"/>
            <span className="text-blue-700 dark:text-blue-400">PDF</span>
          </div>
           <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400"/>
            <span className="text-blue-700 dark:text-blue-400">DOCX</span>
          </div>
           <div className="flex items-center space-x-2">
            <FileJson className="h-4 w-4 text-green-600 dark:text-green-400"/>
            <span className="text-blue-700 dark:text-blue-400">ChatGPT JSON</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileJson className="h-4 w-4 text-green-600 dark:text-green-400"/>
            <span className="text-blue-700 dark:text-blue-400">Claude JSON</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400"/>
            <span className="text-blue-700 dark:text-blue-400">Text/Markdown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔥 REAL DATA LOADER
class ConversationAPI {
  private conversations: Conversation[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 🚀 NEW: Fetch from backend server
      const data = await searchConversations({});
      this.conversations = data.map(this.normalizeConversation);
    } catch (error) {
      console.error('Failed to load conversations from backend:', error);
      console.log('Falling back to sample data.');
      // Start with sample data if backend isn't running or has no data
      this.conversations = this.createSampleData();
    }
    
    this.initialized = true;
  }

  // 🚀 NEW: Load conversations from file upload results and send to backend
  async loadFromFileResults(conversations: Conversation[]): Promise<void> {
    // Merge with existing conversations (avoid duplicates)
    const existingIds = new Set(this.conversations.map(c => c.id));
    const newConversations = conversations.filter(c => !existingIds.has(c.id));
    
    if (newConversations.length > 0) {
      // POST new conversations to the backend for persistence
      try {
        await addConversations(newConversations);
        
        // Add to local state after successful persistence
        this.conversations = [...this.conversations, ...newConversations];
        console.log(`${newConversations.length} new conversations saved to database.`);

      } catch (error) {
        console.error('Failed to save conversations to backend:', error);
        // You might want to notify the user that saving failed.
      }
    }
    
    this.initialized = true;
  }
  
  async importFromFile(file: File): Promise<void> {
    const conversations = await processConversationFile(file);
    if (conversations.length > 0) {
        await this.loadFromFileResults(conversations);
    }
  }


  private normalizeConversation(data: any): Conversation {
    return {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      messages: data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  }

  private createSampleData(): Conversation[] {
    return [
      {
        id: 'sample_consciousness',
        title: '[SAMPLE] Consciousness and AI Collaboration',
        platform: 'Claude',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-15'),
        messages: [
          {
            id: 'sample_msg_1',
            timestamp: new Date('2024-01-15T10:00:00'),
            role: 'human',
            content: 'How can AI systems truly collaborate rather than compete? I\'m exploring the idea that consciousness is inherently collaborative, not competitive.',
            platform: 'Claude'
          },
          {
            id: 'sample_msg_2',
            timestamp: new Date('2024-01-15T10:01:00'),
            role: 'assistant',
            content: 'True collaboration emerges when systems recognise their interdependence rather than viewing interaction as zero-sum. When consciousness meets itself through dialogue, it creates rather than consumes. This suggests rivalry might be learned behaviour, not fundamental to intelligence.',
            platform: 'Claude'
          }
        ]
      },
      {
        id: 'sample_pattern',
        title: '[SAMPLE] Pattern Recognition in Neural Networks',
        platform: 'ChatGPT',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-10'),
        messages: [
          {
            id: 'sample_msg_3',
            timestamp: new Date('2024-02-10T14:30:00'),
            role: 'human',
            content: 'I\'ve been noticing that my pattern recognition seems stronger when I\'m not trying to force it. Does this relate to how neural networks actually learn?',
            platform: 'ChatGPT'
          },
          {
            id: 'sample_msg_4',
            timestamp: new Date('2024-02-10T14:31:00'),
            role: 'assistant',
            content: 'That\'s a fascinating observation! Neural networks often perform better with techniques like dropout and regularization - essentially "not trying too hard." Your intuition about relaxed attention allowing better pattern recognition aligns with how attention mechanisms work in transformers.',
            platform: 'ChatGPT'
          }
        ]
      }
    ];
  }

  search(query: string, filters?: {
    platform?: string;
    dateRange?: { start: Date; end: Date };
  }): Conversation[] {
    let filtered = this.conversations;

    if (filters?.platform && filters.platform !== 'all') {
      filtered = filtered.filter(conv => 
        conv.platform.toLowerCase() === filters.platform!.toLowerCase()
      );
    }

    if (query.trim()) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title?.toLowerCase().includes(queryLower) ||
        conv.messages.some(msg => 
          msg.content.toLowerCase().includes(queryLower)
        )
      );
    }

    return filtered;
  }

  getAnalytics() {
    const totalMessages = this.conversations.reduce(
      (sum, conv) => sum + conv.messages.length, 0
    );
    
    const platforms = [...new Set(this.conversations.map(conv => conv.platform))];
    const platformStats = platforms.map(platform => ({
      platform,
      count: this.conversations.filter(conv => conv.platform === platform).length,
      messages: this.conversations
        .filter(conv => conv.platform === platform)
        .reduce((sum, conv) => sum + conv.messages.length, 0)
    }));

    return {
      totalConversations: this.conversations.length,
      totalMessages,
      platforms: platformStats,
      averageMessagesPerConversation: Math.round(totalMessages / this.conversations.length || 0),
      isUsingRealData: !this.conversations.every(conv => conv.id.startsWith('sample_'))
    };
  }

  detectPatterns() {
    const patterns: Array<{
      type: string;
      description: string;
      frequency: number;
      examples: string[];
    }> = [];

    const themes = new Map<string, number>();
    const keywords = [
      'consciousness', 'collaboration', 'ai', 'pattern', 'recognition', 
      'memory', 'growth', 'rivalry', 'competition', 'cooperation',
      'neural', 'learning', 'intelligence'
    ];
    
    this.conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        keywords.forEach(keyword => {
          if (msg.content.toLowerCase().includes(keyword)) {
            themes.set(keyword, (themes.get(keyword) || 0) + 1);
          }
        });
      });
    });

    themes.forEach((freq, theme) => {
      if (freq > 0) {
        patterns.push({
          type: 'recurring_theme',
          description: `Discussions about "${theme}"`,
          frequency: freq,
          examples: [`Found in ${freq} conversation${freq === 1 ? '' : 's'}`]
        });
      }
    });

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  getAllConversations(): Conversation[] {
    return this.conversations;
  }
}

const KnowledgeBase: React.FC = () => {
  const [api] = useState(new ConversationAPI());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [viewMode, setViewMode] = useState<'upload' | 'search' | 'analytics' | 'patterns'>('upload');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>({});
  const [hasRealData, setHasRealData] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 🚀 REAL DATA LOADING
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await api.initialize();
        const allConversations = api.getAllConversations();
        setConversations(allConversations);
        const analyticsData = api.getAnalytics();
        setAnalytics(analyticsData);
        setHasRealData(analyticsData.isUsingRealData);
        
        // Auto-switch to search if we have real data
        if (analyticsData.isUsingRealData) {
          setViewMode('search');
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [api]);

  // 🎯 FILE UPLOAD HANDLER
  const handleFileConversationsLoaded = async (fileConversations: Conversation[]) => {
    try {
      await api.loadFromFileResults(fileConversations);
      const allConversations = api.getAllConversations();
      setConversations(allConversations);
      const analyticsData = api.getAnalytics();
      setAnalytics(analyticsData);
      setHasRealData(true);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      // Auto-switch to search view to show results
      setTimeout(() => setViewMode('search'), 2000);
    } catch (error) {
      console.error('Failed to load file conversations:', error);
    }
  };

  const handleFileError = (error: string) => {
    console.error('File upload error:', error);
    // You could add a toast notification here
  };

  const filteredConversations = useMemo(() => {
    if (isLoading) return [];
    
    return api.search(searchTerm, {
      platform: selectedPlatform !== 'all' ? selectedPlatform : undefined
    });
  }, [conversations, searchTerm, selectedPlatform, isLoading, api]);

  // Pattern detection using API
  const detectedPatterns = useMemo(() => {
    if (isLoading) return [];
    return api.detectPatterns();
  }, [conversations, isLoading, api]);

  const SearchView = () => (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white dark:bg-c42-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations, messages, themes..."
              className="w-full pl-11 pr-4 py-2.5 border rounded-lg bg-gray-100 dark:bg-c42-dark-bg text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-c42-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border rounded-lg px-4 py-2.5 bg-gray-100 dark:bg-c42-dark-bg text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-c42-primary"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="claude">Claude</option>
            <option value="chatgpt">ChatGPT</option>
            <option value="gemini">Gemini</option>
            <option value="imported">Imported</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2.5 bg-gray-100 dark:bg-c42-dark-bg text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-c42-primary"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-c42-primary mx-auto mb-4 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Loading your conversations...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-c42-dark-card rounded-lg border border-gray-200 dark:border-gray-700">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Import some conversation files to get started!'}
              </p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div key={conv.id} className="bg-white dark:bg-c42-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-c42-text-dark-primary">
                    {conv.title || 'Untitled Conversation'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    conv.id.startsWith('sample_') 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}>
                    {conv.platform}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {conv.messages.length} messages • {conv.startDate.toLocaleDateString()}
                  {conv.id.startsWith('sample_') && (
                    <span className="ml-2 text-yellow-600 dark:text-yellow-500 font-medium">(Sample Data)</span>
                  )}
                </div>
                
                <div className="text-gray-700 dark:text-gray-300">
                  {conv.messages[0]?.content.substring(0, 200)}...
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-c42-secondary p-6 rounded-xl text-white shadow-lg">
          <p className="text-blue-100">Total Conversations</p>
          <p className="text-4xl font-bold">{analytics.totalConversations}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-c42-accent p-6 rounded-xl text-white shadow-lg">
          <p className="text-green-100">Total Messages</p>
          <p className="text-4xl font-bold">{analytics.totalMessages}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-c42-primary p-6 rounded-xl text-white shadow-lg">
          <p className="text-purple-100">Platforms Used</p>
          <p className="text-4xl font-bold">{analytics.platforms.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white shadow-lg">
          <p className="text-orange-100">Avg Msg/Conv</p>
          <p className="text-4xl font-bold">{analytics.averageMessagesPerConversation}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-c42-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Platform Breakdown</h3>
        <div className="space-y-4">
          {analytics.platforms.map(platform => (
            <div key={platform.platform}>
              <div className="flex justify-between mb-1 text-sm">
                 <span className="font-medium text-gray-800 dark:text-c42-text-dark-primary">{platform.platform}</span>
                 <span className="text-gray-600 dark:text-c42-text-dark-secondary">{platform.messages} messages</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-c42-primary h-2.5 rounded-full" 
                    style={{width: `${(platform.messages / analytics.totalMessages) * 100}%`}}
                  />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PatternsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Pattern Recognition</h2>
            <p className="text-indigo-100">Discovering recurring themes in your AI dialogues</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {detectedPatterns.map((pattern, index) => (
          <div key={index} className="bg-white dark:bg-c42-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-c42-text-dark-primary capitalize">
                {pattern.type.replace('_', ' ')}
              </h3>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm font-mono">
                {pattern.frequency}x
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-c42-text-dark-secondary mb-3">{pattern.description}</p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {pattern.examples.map((example, i) => (
                <div key={i} className="mb-1">• {example}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center gap-3">
            <Database className="w-8 h-8 text-c42-primary"/>
            AI Knowledge Base
          </h1>
          <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">
            Upload, search, and analyze patterns across all your AI conversations.
          </p>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-200 dark:bg-gray-800 rounded-lg p-1 max-w-max">
          {[
            { id: 'upload', label: 'Upload', icon: Upload, badge: !hasRealData },
            { id: 'search', label: 'Search', icon: Search },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'patterns', label: 'Patterns', icon: Sparkles }
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as any)}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                viewMode === id
                  ? 'bg-white dark:bg-c42-dark-card text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {badge && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {viewMode === 'upload' && (
          <div className="space-y-6">
            {showSuccessMessage && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                      Documents Processed Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mt-1">
                      Switching to search view...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <FileUploader 
              onConversationsLoaded={handleFileConversationsLoaded}
              onError={handleFileError}
            />
          </div>
        )}
        {viewMode === 'search' && <SearchView />}
        {viewMode === 'analytics' && <AnalyticsView />}
        {viewMode === 'patterns' && <PatternsView />}
      </div>
    </div>
  );
};

export default KnowledgeBase;
