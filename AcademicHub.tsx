
import React, { useState, useCallback, useEffect } from 'react';
import { GraduationCap, BookOpen, Upload, CheckCircle, Link2, FileText, Loader2, Sparkles, Database, ArrowRight, AlertTriangle } from 'lucide-react';
import { addConversations, searchConversations } from './api.ts';
import { policyDocuments as policyData } from './policy_data.ts';
import { useTranslation } from './i18n.tsx';

// A simple BibTeX parser
const parseBibTeX = (text: string) => {
  const entries = [];
  const entryRegex = /@(\w+)\s*\{([^,]+),([\s\S]*?)\n\}/g;
  let match;
  while ((match = entryRegex.exec(text)) !== null) {
    const type = match[1].toLowerCase();
    const citationKey = match[2].trim();
    let fieldsText = match[3];
    
    const fields: Record<string, string> = {};
    const fieldRegex = /\b(\w+)\s*=\s*(?:\{([\s\S]*?)\}|"([\s\S]*?)")/g;
    let fieldMatch;
    while((fieldMatch = fieldRegex.exec(fieldsText)) !== null) {
      const value = fieldMatch[2] || fieldMatch[3];
      fields[fieldMatch[1].toLowerCase()] = value.replace(/[\{\}]/g, '').trim();
    }
    
    entries.push({ type, citationKey, fields });
  }
  return entries;
};


const services = [
    { name: 'Zotero', description: 'Reference management software', icon: BookOpen, connected: true },
    { name: 'Mendeley', description: 'Reference manager and academic social network', icon: BookOpen, connected: false },
    { name: 'Google Scholar', description: 'Search for scholarly literature', icon: Sparkles, connected: false },
    { name: 'arXiv', description: 'Open-access archive for scholarly articles', icon: BookOpen, connected: false },
];

const EvidenceHub = ({ showMessage, setActiveView }) => {
    const { t } = useTranslation();
    const [isProcessingBib, setIsProcessingBib] = useState(false);
    const [importedCount, setImportedCount] = useState(0);

    const [seedStatus, setSeedStatus] = useState<'checking' | 'unseeded' | 'seeding' | 'seeded' | 'error'>('checking');
    const [seedingProgress, setSeedingProgress] = useState('');

    const checkSeedStatus = useCallback(async () => {
        setSeedStatus('checking');
        try {
            const results = await searchConversations({});
            if (results.length > 0) {
                setSeedStatus('seeded');
            } else {
                setSeedStatus('unseeded');
            }
        } catch (e) {
            console.error("Failed to check seed status", e);
            setSeedStatus('error');
        }
    }, []);

    useEffect(() => {
        checkSeedStatus();
    }, [checkSeedStatus]);

    const handleSeedDatabase = useCallback(async () => {
        setSeedStatus('seeding');
        try {
            const BATCH_SIZE = 5;
            const totalDocuments = policyData.length;

            for (let i = 0; i < totalDocuments; i += BATCH_SIZE) {
                const batch = policyData.slice(i, i + BATCH_SIZE);
                const documentsProcessed = Math.min(i + BATCH_SIZE, totalDocuments);
                setSeedingProgress(t('evidence_hub_seeding_progress', { processed: documentsProcessed, total: totalDocuments }));
                await addConversations(batch);
            }

            showMessage(t('fáilte_message'));
            setSeedStatus('seeded');

        } catch (error) {
            console.error("Database seeding failed:", error);
            showMessage(t('evidence_hub_seed_error'));
            setSeedStatus('error');
        }
    }, [showMessage, t]);


    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.name.endsWith('.bib')) {
            showMessage("Please select a valid .bib file.");
            return;
        }

        setIsProcessingBib(true);
        setImportedCount(0);

        try {
            const text = await file.text();
            const bibEntries = parseBibTeX(text);
            
            if (bibEntries.length === 0) {
                throw new Error("No valid BibTeX entries found in the file.");
            }

            const conversations = bibEntries.map(entry => {
                const fields = entry.fields;
                const year = fields.year || new Date().getFullYear().toString();
                const date = new Date(`${year}-01-01`);

                return {
                    id: `bibtex_${entry.citationKey}_${Date.now()}`,
                    title: fields.title || 'Untitled Publication',
                    platform: 'BibTeX Import',
                    startDate: date,
                    endDate: date,
                    messages: [ { id: `msg_${Date.now()}`, timestamp: date, role: 'assistant', content: fields.abstract || `A ${fields.type || 'publication'} by ${fields.author || 'Unknown Author'}.`, platform: 'BibTeX Import' } ],
                    metadata: { source: 'bibtex_import', authors: fields.author, year: fields.year, journal: fields.journal || fields.booktitle, doi: fields.doi, type: entry.type, category: 'Academic Publications' }
                };
            });
            
            await addConversations(conversations);
            setImportedCount(conversations.length);
            showMessage(`${conversations.length} entries successfully imported!`);

        } catch (error) {
            console.error("BibTeX import failed:", error);
            showMessage(`Error: ${(error as Error).message}`);
        } finally {
            setIsProcessingBib(false);
        }
    }, [showMessage]);
    
    const FoundationalKnowledgeSection = () => {
        switch (seedStatus) {
            case 'checking':
                return <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /><span>Checking knowledge base...</span></div>;
            case 'error':
                return (
                    <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4 rounded-lg text-center">
                        <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400 mx-auto mb-2"/>
                        <p className="text-red-700 dark:text-red-300 mb-3">{t('evidence_hub_seed_error')}</p>
                        <button onClick={checkSeedStatus} className="bg-c42-primary px-4 py-2 rounded-lg text-white hover:bg-c42-primary/80">{t('evidence_hub_seed_retry')}</button>
                    </div>
                );
            case 'unseeded':
                return (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary mt-2 mb-4">{t('evidence_hub_seed_desc_unseeded')}</p>
                        <button
                            onClick={handleSeedDatabase}
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors bg-c42-primary hover:bg-c42-primary/80 text-white"
                        >
                            <Database className="w-5 h-5" />
                            <span>{t('evidence_hub_seed_button')}</span>
                        </button>
                    </div>
                );
            case 'seeding':
                 return (
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-c42-primary" />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-c42-text-dark-primary">Seeding in progress...</p>
                            <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary">{seedingProgress}</p>
                        </div>
                    </div>
                );
            case 'seeded':
                return (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary mt-2 mb-4">{t('evidence_hub_seeded_desc')}</p>
                        <button
                            onClick={() => setActiveView('knowledge_base')}
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors bg-c42-primary hover:bg-c42-primary/80 text-white"
                        >
                            <span>{t('evidence_hub_explore_button')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-c42-dark-bg text-gray-700 dark:text-c42-text-dark-secondary min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-c42-text-dark-primary flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-c42-primary"/>
                        {t('evidence_hub_title')}
                    </h1>
                    <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">{t('evidence_hub_subtitle')}</p>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-c42-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-2">{t('evidence_hub_seed_title')}</h2>
                        <FoundationalKnowledgeSection />
                    </div>
                
                    <div className="bg-white dark:bg-c42-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                         <h2 className="text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary mb-4">{t('evidence_hub_import_bibtex')}</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-c42-text-dark-primary flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-c42-accent"/>
                                    {t('evidence_hub_import_bibtex')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-c42-text-dark-secondary mt-2 mb-4">{t('evidence_hub_import_bibtex_desc')}</p>
                                <label htmlFor="bibtex-upload" className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${isProcessingBib ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-c42-accent hover:bg-c42-accent/80 text-white'}`}>
                                    {isProcessingBib ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            <span>{t('evidence_hub_choose_bib_file')}</span>
                                        </>
                                    )}
                                </label>
                                <input id="bibtex-upload" type="file" accept=".bib" className="hidden" onChange={handleFileUpload} disabled={isProcessingBib}/>
                            </div>
                            { (isProcessingBib || importedCount > 0) && (
                                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                                    {isProcessingBib ? (
                                        <>
                                            <Loader2 className="w-12 h-12 text-c42-primary mx-auto animate-spin" />
                                            <p className="mt-3 text-gray-800 dark:text-c42-text-dark-primary">Parsing file...</p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-12 h-12 text-c42-accent mx-auto" />
                                            <p className="mt-3 text-xl font-bold text-gray-900 dark:text-c42-text-dark-primary">{importedCount} entries added</p>
                                            <p className="text-gray-600 dark:text-c42-text-dark-secondary text-sm">Your library is growing!</p>
                                            <button 
                                                onClick={() => setActiveView('knowledge_base')}
                                                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-c42-primary hover:bg-c42-primary/80 text-white rounded-lg transition-colors"
                                            >
                                                <span>View in Shared Knowledge</span>
                                                <ArrowRight className="w-4 h-4"/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvidenceHub;
