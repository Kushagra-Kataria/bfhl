/**
 * SummaryCards Component
 *
 * Displays summary statistics in attractive stat cards.
 */
export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Trees',
      value: summary.total_trees,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgGlow: 'bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800/50',
    },
    {
      label: 'Total Cycles',
      value: summary.total_cycles,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
        </svg>
      ),
      gradient: 'from-rose-500 to-rose-600',
      bgGlow: 'bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-200 dark:border-rose-800/50',
    },
    {
      label: 'Largest Tree Root',
      value: summary.largest_tree_root || '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      bgGlow: 'bg-amber-500/10',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-800/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`
            relative overflow-hidden rounded-2xl border ${card.borderColor} 
            bg-white dark:bg-surface-800/50 
            p-5 animate-slide-up
            hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
          `}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Background Glow */}
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${card.bgGlow} blur-2xl`} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
