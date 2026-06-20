import { useCallback, useRef, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ResultsPanel } from '../components/ResultsPanel';
import { LoadingIndicator, ErrorMessage } from '../components/LoadingIndicator';
import { callLexical, downloadFile, type DownloadPayload } from '../lib/api';
import { CONFIG, logFeatureAccess } from '../lib/config';
import { flattenDataEntries, delDuplicateItems, sortData, limitResultsPerSource, type FlattenedItem } from '../lib/formatters';

interface FixedBookSearchPageProps {
  navTitle: string;
  navSubtitle: string;
  moduleKey: string;
  storageKey: string;
  fixedBook: string;
  fixedBookLabel: string;
  placeholder: string;
}

interface ModuleSettings {
  maxResults: number;
}

type Stage = 'idle' | 'searching' | 'done' | 'error';

function loadSettings(storageKey: string): ModuleSettings {
  const defaults: ModuleSettings = { maxResults: 10 };
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { maxResults: typeof parsed.maxResults === 'number' ? parsed.maxResults : defaults.maxResults };
  } catch {
    return defaults;
  }
}

export function FixedBookSearchPage({
  navTitle,
  navSubtitle,
  moduleKey,
  storageKey,
  fixedBook,
  fixedBookLabel,
  placeholder,
}: FixedBookSearchPageProps) {
  const [settings, setSettings] = useState<ModuleSettings>(() => loadSettings(storageKey));
  const [panelOpen, setPanelOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sortedResults, setSortedResults] = useState<Record<string, FlattenedItem[]>>({});
  const [downloadPayload, setDownloadPayload] = useState<DownloadPayload | null>(null);
  const [downloading, setDownloading] = useState(false);
  const busyRef = useRef(false);

  const saveSettings = useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    try {
      logFeatureAccess({
        module: moduleKey,
        action: 'save_config',
        label: `Configuracao da busca em ${fixedBookLabel}`,
        meta: { max_results: settings.maxResults },
      });
    } catch {
      // ignore logging errors
    }
    setPanelOpen(false);
  }, [settings, storageKey, moduleKey, fixedBookLabel]);

  const search = useCallback(async () => {
    if (busyRef.current) return;
    const trimmed = term.trim();
    if (!trimmed) {
      setStage('error');
      setErrorMessage('Please enter a search term');
      return;
    }

    busyRef.current = true;
    setStage('searching');
    setErrorMessage('');
    setSortedResults({});
    setDownloadPayload(null);

    try {
      const respLexical = await callLexical({
        term: trimmed,
        source: [fixedBook],
        maxResults: settings.maxResults,
        flag_grouping: false,
        fullBadges: CONFIG.FULL_BADGES,
      });

      const results = Array.isArray(respLexical.results)
        ? limitResultsPerSource(respLexical.results as Array<{ source?: string }>, settings.maxResults)
        : [];

      const flattened = flattenDataEntries(results as any);
      const unique = delDuplicateItems(flattened);
      const sorted = sortData(unique);

      setSortedResults(sorted);
      setStage('done');

      setDownloadPayload({
        results: unique.map((item, idx) => ({
          text: item.mk_text || item.raw_text,
          source: item.source,
          type: moduleKey,
          metadata: { title: item.title, content: item.mk_text || item.raw_text, order: idx },
        })),
        search_type: moduleKey,
        term: trimmed,
      });

      try {
        logFeatureAccess({
          module: moduleKey,
          action: 'search',
          label: `Busca em ${fixedBookLabel}`,
          value: trimmed,
          meta: { sources: [fixedBook], results_count: unique.length, max_results: settings.maxResults },
        });
      } catch {
        // ignore logging errors
      }
    } catch (error) {
      console.error(`${moduleKey} SEARCH EXCEPTION:`, error);
      setStage('error');
      setErrorMessage((error as Error)?.message || 'An unexpected error occurred');
    } finally {
      busyRef.current = false;
    }
  }, [term, settings, fixedBook, moduleKey, fixedBookLabel]);

  const handleDownload = async () => {
    if (!downloadPayload || downloading) return;
    setDownloading(true);
    try {
      await downloadFile('docx', downloadPayload);
    } catch (error) {
      alert(`Download failed: ${(error as Error)?.message ?? 'unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Navbar title={navTitle} subtitle={navSubtitle} />

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-[90px]">
        <div className="relative">
          <div className="mb-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              title="Search options"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <i className="fas fa-sliders-h" />
            </button>
            {downloadPayload && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                title="Download as Word"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                <i className={downloading ? 'fas fa-spinner fa-spin' : 'fas fa-file-word fa-lg'} />
              </button>
            )}
          </div>

          {panelOpen && (
            <div className="absolute right-0 top-12 z-50 w-[min(420px,92vw)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="w-full rounded-full bg-search-primary px-2 py-2 text-center text-sm font-medium text-white">
                {fixedBookLabel}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Resultados (máximo)
                  <input
                    type="number"
                    min={1}
                    value={settings.maxResults}
                    onChange={(e) => setSettings({ maxResults: Number(e.target.value) || 1 })}
                    className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={saveSettings}
                  title="Salvar ajustes"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-search-primary text-white hover:bg-search-secondary"
                >
                  <i className="fa-solid fa-check" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-3 focus-within:border-search-primary">
            <textarea
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  search();
                }
              }}
              placeholder={placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={search}
              disabled={stage === 'searching'}
              aria-label="Search"
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-search-primary bg-search-primary text-white transition-colors hover:bg-search-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <i className="fas fa-search" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {stage === 'searching' && <LoadingIndicator message="Busca Léxica" />}
          {stage === 'error' && <ErrorMessage message={errorMessage} />}
          {stage === 'done' && <ResultsPanel sortedData={sortedResults} groupResults={false} accent="search" />}
        </div>
      </div>
    </>
  );
}
