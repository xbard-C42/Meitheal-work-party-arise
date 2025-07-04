
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    consent_title: "Welcome to the Collaborative Intelligence Platform",
    consent_subtitle: "Your participation is governed by principles of transparency and mutual respect. Please review and consent to continue.",
    consent_body: `**Purpose:** This platform is a research prototype for exploring AI-driven collaborative governance and collective intelligence. Your interactions help us understand how to build better tools for sense-making and decision-making.<br/><br/>**Data Usage:** All data, including uploaded documents and conversations, may be stored and analyzed for research purposes. The data will be handled in accordance with the project's security policy. No personally identifiable information is intentionally collected unless provided by you.<br/><br/>**No Guarantee:** This is a prototype. There is no guarantee of data persistence, uptime, or accuracy of AI-generated insights. Use it as an exploratory tool.`,
    consent_checkbox_label: "I have read and understood the terms and consent to participate.",
    consent_button: "Enter the Platform",
    
    fáilte_message: "Fáilte! Welcome to the C42 OS. The foundational knowledge base has been seeded successfully.",
    
    evidence_hub_title: "Evidence Hub",
    evidence_hub_subtitle: "Integrate academic sources and foundational knowledge into the system.",
    evidence_hub_seed_title: "Foundational Knowledge",
    evidence_hub_seed_desc_unseeded: "The shared knowledge base is currently empty. Seed it with foundational Irish policy documents to enable system-wide analysis.",
    evidence_hub_seed_button: "Seed Knowledge Base",
    evidence_hub_seeding_progress: "Seeding... {processed} of {total} documents processed.",
    evidence_hub_seeded_desc: "The foundational knowledge base is seeded. You can now explore it in the Shared Knowledge view.",
    evidence_hub_explore_button: "Explore Shared Knowledge",
    evidence_hub_seed_error: "Could not connect to the database to check for or seed data. Please ensure the backend server is running.",
    evidence_hub_seed_retry: "Retry Connection",
    
    evidence_hub_import_bibtex: "Import from BibTeX",
    evidence_hub_import_bibtex_desc: "Upload a .bib file from Zotero, Mendeley, or another reference manager to add your academic library.",
    evidence_hub_choose_bib_file: "Choose .bib File",

  },
};

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    if (params) {
        Object.keys(params).forEach(p_key => {
            const regex = new RegExp(`{${p_key}}`, 'g');
            translation = translation.replace(regex, params[p_key]);
        });
    }
    return translation;
  };

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
