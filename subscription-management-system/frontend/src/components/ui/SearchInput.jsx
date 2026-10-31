import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  shortcut = null
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-espresso-muted absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-ivory text-espresso placeholder:text-stone-400 text-sm pl-9 pr-8 py-2 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry focus:ring-1 focus:ring-cherry transition-all shadow-sm"
      />
      {value ? (
        <button
          onClick={onClear || (() => onChange(''))}
          className="absolute right-2.5 text-stone-400 hover:text-espresso p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcut ? (
        <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-espresso-muted bg-champagne/60 border border-stone-warm rounded">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
};
