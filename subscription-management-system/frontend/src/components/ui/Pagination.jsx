import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  className = ''
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={`p-4 bg-champagne/30 border-t border-stone-warm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none ${className}`}>
      {/* Items Count and Size Selector */}
      <div className="flex items-center gap-3 text-espresso-muted">
        <span>
          Showing <span className="font-bold text-espresso">{startItem}</span> to{' '}
          <span className="font-bold text-espresso">{endItem}</span> of{' '}
          <span className="font-bold text-espresso">{totalItems}</span> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-stone-warm">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-ivory border border-stone-warm text-espresso rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cherry"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-stone-warm bg-ivory text-espresso hover:bg-champagne/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p) => {
          // Truncate if totalPages > 7
          if (totalPages > 7) {
            if (p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
              if (p === 2 || p === totalPages - 1) {
                return <span key={p} className="px-1 text-stone-400">...</span>;
              }
              return null;
            }
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] h-7 px-2 rounded-lg font-medium transition-all text-xs ${
                isActive
                  ? 'bg-cherry text-ivory font-bold shadow-sm'
                  : 'bg-ivory border border-stone-warm text-espresso hover:bg-champagne/40'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-stone-warm bg-ivory text-espresso hover:bg-champagne/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
