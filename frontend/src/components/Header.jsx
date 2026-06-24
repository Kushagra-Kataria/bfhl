/**
 * Header Component
 *
 * App title with dark mode toggle and branding.
 */
export default function Header({ isDark, onToggleDark }) {
  return (
    <header className="relative overflow-hidden border-b border-surface-200 dark:border-surface-700/50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl sticky top-0 z-50">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">
                BFHL Graph Analyzer
              </h1>
              <p className="text-xs text-surface-500 dark:text-surface-400 -mt-0.5 hidden sm:block">
                Hierarchical Node Processor
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle"
            onClick={onToggleDark}
            className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 group"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-surface-600 group-hover:-rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
