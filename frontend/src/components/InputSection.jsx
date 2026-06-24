import { useState } from 'react';

const SAMPLE_DATA = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;


/**
 * InputSection Component
 *
 * Textarea for edge input, submit button, and sample data button.
 */
export default function InputSection({ onSubmit, isLoading }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    // Convert textarea lines to array, filter empty lines
    const data = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    onSubmit(data);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_DATA);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="animate-fade-in" id="input-section">
      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 shadow-xl shadow-surface-900/5 dark:shadow-black/20 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-700/50 bg-surface-50/50 dark:bg-surface-800/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-glow" />
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider">
              Input Data
            </h2>
          </div>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Enter node relationships, one per line (e.g., A→B). Press <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-700 text-[10px] font-mono">Ctrl+Enter</kbd> to submit.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Textarea */}
          <textarea
            id="edge-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={"A->B\nA->C\nB->D"}
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
            spellCheck={false}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="submit-btn"
              onClick={handleSubmit}
              disabled={isLoading || !inputText.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Submit
                </>
              )}
            </button>

            <button
              id="sample-data-btn"
              onClick={handleLoadSample}
              className="px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 font-medium text-sm transition-all duration-200 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Load Sample
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
