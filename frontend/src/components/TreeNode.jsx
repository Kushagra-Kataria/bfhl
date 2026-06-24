import { useState } from 'react';

/**
 * TreeNode Component
 *
 * Recursively renders a tree node with expand/collapse functionality,
 * indentation, and connector lines.
 */
export default function TreeNode({ name, children, depth = 0, isLast = true }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const childEntries = Object.entries(children || {});
  const hasChildren = childEntries.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-6' : ''} relative`}>
      {/* Connector line */}
      {depth > 0 && (
        <>
          <div className="absolute -left-6 top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700" style={{ display: isLast ? 'none' : 'block' }} />
          <div className="absolute -left-6 top-3.5 w-6 h-px bg-surface-200 dark:bg-surface-700" />
          <div className="absolute -left-6 top-0 h-3.5 w-px bg-surface-200 dark:bg-surface-700" />
        </>
      )}

      {/* Node */}
      <div className="flex items-center gap-1.5 py-1 group">
        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <svg
              className={`w-3 h-3 text-surface-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <span className="w-5 h-5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-300 dark:bg-surface-600" />
          </span>
        )}

        {/* Node Label */}
        <span
          className={`
            inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold tracking-wide transition-all duration-150
            ${depth === 0
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/20'
              : hasChildren
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50'
                : 'bg-surface-100 dark:bg-surface-700/50 text-surface-600 dark:text-surface-300'
            }
            group-hover:scale-105
          `}
        >
          {name}
          {depth === 0 && (
            <span className="ml-1.5 text-[10px] font-normal opacity-70">root</span>
          )}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {childEntries.map(([childName, grandChildren], index) => (
            <TreeNode
              key={childName}
              name={childName}
              children={grandChildren}
              depth={depth + 1}
              isLast={index === childEntries.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
