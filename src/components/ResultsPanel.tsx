import { useState } from 'react';
import { bookName } from '../lib/markdown';
import { ResultItemCard } from './ResultItemCard';
import type { FlattenedItem } from '../lib/formatters';

interface ResultsPanelProps {
  sortedData: Record<string, FlattenedItem[]>;
  groupResults: boolean;
  accent?: 'apps' | 'search';
}

export function ResultsPanel({ sortedData, groupResults, accent = 'apps' }: ResultsPanelProps) {
  const accentClass = accent === 'search' ? 'border-search-primary' : 'border-apps-primary';
  const groupNames = Object.keys(sortedData);
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());

  if (!groupNames.length) {
    return <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 text-gray-600">Nenhum resultado encontrado.</div>;
  }

  const togglePanel = (key: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!groupResults) {
    const allItems = groupNames.flatMap((name) => sortedData[name]);
    const sorted = [...allItems].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    const isOpen = openPanels.has('all-results');
    return (
      <div className="my-4">
        <button
          type="button"
          onClick={() => togglePanel('all-results')}
          className={`flex w-full items-center justify-between rounded-full border ${accentClass} bg-gray-100 px-4 py-3 text-base text-gray-700 shadow-sm hover:bg-gray-200`}
        >
          <span>Total</span>
          <span className="rounded-full bg-gray-200 px-2 font-semibold text-gray-700">{sorted.length}</span>
        </button>
        {isOpen && (
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              {sorted.map((item, idx) => (
                <ResultItemCard key={idx} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-4 grid gap-2">
      {groupNames.map((name) => {
        const items = sortedData[name];
        const isOpen = openPanels.has(name);
        return (
          <div key={name}>
            <button
              type="button"
              onClick={() => togglePanel(name)}
              className={`flex w-full items-center justify-between rounded-full border ${accentClass} bg-gray-100 px-4 py-3 text-base text-gray-700 shadow-sm hover:bg-gray-200`}
            >
              <span>{bookName(name) || name}</span>
              <span className="rounded-full bg-gray-200 px-2 font-semibold text-gray-700">{items.length}</span>
            </button>
            {isOpen && (
              <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                  {items.map((item, idx) => (
                    <ResultItemCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
