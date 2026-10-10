import React, { useState, useEffect } from 'react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  testGeminiApiKey,
} from '../../services/gemini-service.js';
import { TactileButton } from './TactileButton.js';
import { BotanicalLeafSprig } from './BotanicalIllustrations.js';
import {
  X,
  Key,
  Check,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGeminiApiKey());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(apiKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    setGeminiApiKey('');
    setTestResult(null);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please paste your Gemini API key before testing.',
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const isConfigured = Boolean(apiKey.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FIELDNOTE Naturalist Settings"
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-sm border border-stone-deep bg-[#FAF6ED] p-6 sm:p-8 shadow-2xl space-y-6 text-ink animate-journal-entry relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          aria-label="Close settings dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 border-b border-stone-deep/40 pb-4">
          <div className="flex items-center space-x-2">
            <BotanicalLeafSprig className="w-5 h-5 text-forest" />
            <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
              Naturalist Configuration
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
            Settings & AI Engine
          </h2>
          <p className="font-serif italic text-xs text-ink-muted">
            Configure live Google Gemini cloud intelligence or utilize on-device deterministic synthesis.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="p-3.5 rounded-sm border flex items-center justify-between text-xs font-mono bg-paper-bright border-stone-deep/50">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConfigured ? 'bg-forest animate-pulse' : 'bg-amber-600'
              }`}
            />
            <span className="font-semibold text-ink">
              {isConfigured ? 'Google Gemini AI (Live Cloud)' : 'On-Device Naturalist Core (Offline)'}
            </span>
          </div>
          <span className="text-[10px] text-ink-muted">
            {isConfigured ? 'Direct API' : 'No Key Set'}
          </span>
        </div>

        {/* API Key Form */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-ink font-semibold">
            Google Gemini API Key
          </label>

          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-3 pr-20 text-sm font-mono bg-paper-bright border border-stone-deep/60 rounded-sm focus:outline-none focus:border-forest shadow-inner"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 text-ink-muted hover:text-ink min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={showKey ? 'Hide key' : 'Show key'}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-terracotta hover:text-terracotta-deep min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Remove key"
                  aria-label="Remove key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] font-sans text-ink-muted leading-relaxed">
            Free API keys can be generated in 30 seconds at{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest underline font-semibold hover:text-botanical-teal inline-flex items-center"
            >
              Google AI Studio
              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
            </a>
            . The free tier includes 15 requests per minute, which is abundant for physical fieldwork.
          </p>
        </div>

        {/* Test Result Feedback */}
        {testResult && (
          <div
            className={`p-3 rounded-sm border text-xs font-mono flex items-start space-x-2.5 ${
              testResult.success
                ? 'bg-forest/10 border-forest/40 text-forest'
                : 'bg-terracotta/10 border-terracotta/40 text-terracotta'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 leading-snug">
              <strong>{testResult.success ? 'Connection Verified' : 'Connection Error'}:</strong>
              <p>
                {testResult.success
                  ? 'Gemini 2.5 Flash model is active and responding. Live field synthesis enabled!'
                  : testResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Privacy Assurance */}
        <div className="p-3.5 rounded-sm bg-stone-light/40 border border-stone-deep/30 flex items-start space-x-2.5 text-[11px] text-ink-muted">
          <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Local Storage Privacy:</strong> Your API key is stored strictly on your local browser. It is dispatched directly to Google's official API endpoints and never routed through any third-party server.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-deep/30">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={isTesting || !apiKey.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-[2px] border border-stone-deep/70 bg-paper-bright hover:bg-stone-light/60 text-xs font-mono uppercase tracking-wider text-ink disabled:opacity-50 min-h-[44px] flex items-center justify-center transition-colors"
          >
            {isTesting ? (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin text-terracotta" />
                Testing Ping...
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 mr-1.5 text-forest" />
                Test Connection
              </>
            )}
          </button>

          <TactileButton
            type="button"
            onClick={handleSave}
            variant="primary"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider min-h-[44px]"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-paper" />
                Saved to Device!
              </>
            ) : (
              'Save Configuration'
            )}
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
