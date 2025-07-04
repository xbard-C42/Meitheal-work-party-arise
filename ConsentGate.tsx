
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Users } from 'lucide-react';
import { useTranslation } from './i18n.tsx';

interface ConsentGateProps {
  onConsent: () => void;
}

const ConsentGate: React.FC<ConsentGateProps> = ({ onConsent }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-c42-dark-bg flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-c42-dark-card rounded-xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <Users className="w-16 h-16 text-c42-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-c42-text-dark-primary">
              {t('consent_title')}
            </h1>
            <p className="text-gray-600 dark:text-c42-text-dark-secondary mt-2">
              {t('consent_subtitle')}
            </p>
          </div>

          <div 
            className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-c42-text-dark-secondary space-y-3"
            dangerouslySetInnerHTML={{ __html: t('consent_body').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800 dark:text-c42-text-dark-primary">$1</strong>').replace(/\n/g, '<br/>') }}
          />


          <div className="flex items-start space-x-3 mt-4">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-400 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 text-c42-primary focus:ring-c42-primary"
            />
            <label htmlFor="consent-checkbox" className="text-gray-600 dark:text-c42-text-dark-secondary">
              {t('consent_checkbox_label')}
            </label>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 px-8 py-4 rounded-b-xl">
          <button
            onClick={onConsent}
            disabled={!isChecked}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-c42-primary hover:scale-102 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100"
          >
            <span>{t('consent_button')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentGate;
