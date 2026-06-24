import { useState } from 'react';
import TreeNode from './TreeNode.jsx';
import SummaryCards from './SummaryCards.jsx';

/**
 * ResultsDashboard Component
 *
 * Displays all API results: summary cards, hierarchies, invalid entries,
 * duplicate edges, and raw JSON response.
 */
export default function ResultsDashboard({ result }) {
  const [showJson, setShowJson] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  if (!result) return null;

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Failed');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bfhl-response.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="results-dashboard">
      {/* Summary Cards */}
      {result.summary && (
        <section>
          <SectionHeader title="Summary" icon="chart" />
          <SummaryCards summary={result.summary} />
        </section>
      )}

      {/* Hierarchies */}
      {result.hierarchies && result.hierarchies.length > 0 && (
        <section>
          <SectionHeader title="Hierarchies" icon="tree" count={result.hierarchies.length} />
          <div className="space-y-4">
            {result.hierarchies.map((hierarchy, index) => (
              <div
                key={`${hierarchy.root}-${index}`}
                className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 animate-slide-up hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Hierarchy Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100 dark:border-surface-700/50">
                  <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                    ${hierarchy.has_cycle
                      ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                    }
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hierarchy.has_cycle ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {hierarchy.has_cycle ? 'Cycle Detected' : 'Valid Tree'}
                  </span>

                  <span className="text-xs text-surface-400 dark:text-surface-500">
                    Root: <span className="font-bold text-surface-700 dark:text-surface-200">{hierarchy.root}</span>
                  </span>

                  {hierarchy.depth && (
                    <span className="text-xs text-surface-400 dark:text-surface-500">
                      Depth: <span className="font-bold text-surface-700 dark:text-surface-200">{hierarchy.depth}</span>
                    </span>
                  )}
                </div>

                {/* Tree Visualization */}
                {hierarchy.has_cycle ? (
                  <div className="flex items-center gap-2 py-4 px-3 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                    <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm text-rose-600 dark:text-rose-400">
                      Cyclic dependency detected in this component. Tree cannot be constructed.
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {Object.entries(hierarchy.tree || {}).map(([name, children]) => (
                      <TreeNode key={name} name={name} children={children} depth={0} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Invalid Entries */}
      {result.invalid_entries && result.invalid_entries.length > 0 && (
        <section>
          <SectionHeader title="Invalid Entries" icon="warning" count={result.invalid_entries.length} />
          <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-5 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {result.invalid_entries.map((entry, i) => (
                <span
                  key={`${entry}-${i}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-mono border border-amber-200 dark:border-amber-800/50"
                >
                  {entry || '""'}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Duplicate Edges */}
      {result.duplicate_edges && result.duplicate_edges.length > 0 && (
        <section>
          <SectionHeader title="Duplicate Edges" icon="duplicate" count={result.duplicate_edges.length} />
          <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {result.duplicate_edges.map((edge, i) => (
                <span
                  key={`${edge}-${i}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700/50 text-surface-600 dark:text-surface-300 text-sm font-mono border border-surface-200 dark:border-surface-600/50"
                >
                  {edge}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          id="toggle-json-btn"
          onClick={() => setShowJson(!showJson)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          {showJson ? 'Hide' : 'Show'} Raw JSON
        </button>

        <button
          id="copy-json-btn"
          onClick={handleCopyJson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {copyStatus || 'Copy JSON'}
        </button>

        <button
          id="download-btn"
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download JSON
        </button>
      </div>

      {/* Raw JSON */}
      {showJson && (
        <div className="bg-surface-900 dark:bg-surface-950 rounded-2xl p-5 overflow-auto max-h-96 animate-fade-in border border-surface-700">
          <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/* Section Header Helper */
function SectionHeader({ title, icon, count }) {
  const icons = {
    chart: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    tree: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    duplicate: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary-500">{icons[icon]}</span>
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider">
        {title}
      </h3>
      {count !== undefined && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold min-w-[20px]">
          {count}
        </span>
      )}
    </div>
  );
}
