import { useState } from 'react';
import Header from './components/Header.jsx';
import InputSection from './components/InputSection.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import Toast from './components/Toast.jsx';
import { useDarkMode } from './hooks/useDarkMode.js';
import { processEdges } from './services/api.js';

/**
 * Main Application Component
 *
 * Manages global state: dark mode, API result, loading, errors.
 */
export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (data) => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await processEdges(data);
      setResult(response);
      setSuccessMsg(
        `Analysis complete — ${response.summary?.total_trees || 0} tree(s), ${response.summary?.total_cycles || 0} cycle(s) found.`
      );
      // Auto-dismiss success after 4 seconds
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Header isDark={isDark} onToggleDark={toggleDark} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Toast */}
        {error && (
          <Toast
            message={error}
            type="error"
            onDismiss={() => setError('')}
          />
        )}

        {/* Success Toast */}
        {successMsg && (
          <Toast
            message={successMsg}
            type="success"
            onDismiss={() => setSuccessMsg('')}
          />
        )}

        {/* Input Section */}
        <InputSection onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Results Dashboard */}
        <ResultsDashboard result={result} />

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 mb-4">
              <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">
              No results yet
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
              Enter node relationships above and click <span className="font-medium text-primary-600 dark:text-primary-400">Analyze Graph</span> to see tree hierarchies, cycle detection, and more.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-surface-400 dark:text-surface-500">
            BFHL Graph Analyzer • Chitkara Full Stack Engineering Challenge
          </p>
        </div>
      </footer>
    </div>
  );
}
