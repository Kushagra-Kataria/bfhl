/**
 * Toast Component
 *
 * Simple toast notification for success/error messages.
 */
export default function Toast({ message, type = 'error', onDismiss }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800/50',
      text: 'text-rose-700 dark:text-rose-300',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const s = styles[type] || styles.error;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${s.border} ${s.bg} animate-fade-in`} id="toast-notification">
      {s.icon}
      <p className={`flex-1 text-sm font-medium ${s.text}`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${s.text} transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
