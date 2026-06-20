import { useRef, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SimpleCard } from '../components/PensataCard';
import { LoadingIndicator, ErrorMessage } from '../components/LoadingIndicator';
import { callBiblioWvBuild } from '../lib/api';
import { logFeatureAccess } from '../lib/config';

interface BookOption {
  sigla: string;
  title: string;
}

const BOOK_OPTIONS: BookOption[] = [
  { sigla: 'CCG', title: 'Conscienciograma' },
  { sigla: 'T100', title: '100 Testes da Conscienciometria' },
  { sigla: 'T200', title: '200 Teáticas da Conscienciologia' },
  { sigla: 'TC', title: 'Temas da Conscienciologia' },
  { sigla: 'MRC', title: 'Manual de Redação da Conscienciologia' },
  { sigla: 'HSR', title: 'Homo sapiens reurbanisatus' },
  { sigla: 'HSP', title: 'Homo sapiens pacificus' },
  { sigla: 'MMT', title: 'Manual dos Megapensenes Trivocabulares' },
  { sigla: 'PROJ', title: 'Projeciologia' },
  { sigla: 'NE', title: 'Nossa Evolução' },
  { sigla: 'MP', title: 'Manual da Proéxis' },
  { sigla: 'TNP', title: 'Manual da Tenepes' },
  { sigla: 'MDE', title: 'Manual da Dupla Evolutiva' },
  { sigla: 'EXP', title: '700 Experimentos da Conscienciologia' },
  { sigla: 'PC', title: 'Projeções da Consciência' },
  { sigla: 'DAC', title: 'Dicionário de Argumentos da Conscienciologia' },
  { sigla: 'DNC', title: 'Dicionário de Neologismos da Conscienciologia' },
  { sigla: 'LO1', title: 'Léxico de Ortopensatas (1a ed.)' },
  { sigla: 'LO2', title: 'Léxico de Ortopensatas (2a ed.)' },
  { sigla: 'EC10', title: 'Enciclopédia da Conscienciologia (10 ed.)' },
  { sigla: 'ECNEW', title: 'Enciclopédia da Conscienciologia (novos)' },
];

function parsePagesInput(rawInput: string): number[] {
  const chunks = String(rawInput || '')
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const numbers = chunks.map((token) => Number.parseInt(token, 10)).filter((n) => Number.isFinite(n) && n > 0);
  return Array.from(new Set(numbers)).sort((a, b) => a - b);
}

function mountBibliographyText(bibliografia: string, pages: number[]): string {
  const biblio = String(bibliografia || '').trim().replace(/[.;\s]+$/, '');
  if (!pages.length) return `${biblio}.`;
  return `${biblio}; p. ${pages.join(', ')}.`;
}

type Stage = 'idle' | 'mounting' | 'done' | 'error';

export function BiblioWvPage() {
  const [selectedSigla, setSelectedSigla] = useState('CCG');
  const [pagesText, setPagesText] = useState('');
  const [style, setStyle] = useState<'simples' | 'bee'>('simples');
  const [stage, setStage] = useState<Stage>('idle');
  const [resultText, setResultText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const busyRef = useRef(false);

  const selectedBook = BOOK_OPTIONS.find((b) => b.sigla === selectedSigla);

  const mount = async () => {
    if (busyRef.current) return;
    if (!selectedBook) {
      setStage('error');
      setErrorMessage('Selecione 1 livro para montar a bibliografia.');
      return;
    }

    busyRef.current = true;
    setStage('mounting');
    setErrorMessage('');
    setResultText('');

    try {
      const response = await callBiblioWvBuild({
        book_title: selectedBook.title,
        book_sigla: selectedBook.sigla,
        style,
      });

      const pages = parsePagesInput(pagesText);
      const finalText = mountBibliographyText(response?.text || '', pages);
      setResultText(finalText);
      setStage('done');

      try {
        logFeatureAccess({
          module: 'biblio_wv',
          action: 'generate',
          label: selectedBook.title,
          value: selectedBook.title,
          meta: { book_sigla: selectedBook.sigla, style, pages, pages_count: pages.length },
        });
      } catch {
        // ignore logging errors
      }
    } catch (error) {
      setStage('error');
      setErrorMessage((error as Error)?.message || 'Erro ao montar bibliografia.');
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <>
      <Navbar title="Bibliografia Livros" subtitle="Obras Waldo Vieira" />

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-[90px]">
        <div className="mx-auto flex max-w-[600px] flex-col items-center px-6 py-8 text-center">
          <button
            type="button"
            onClick={mount}
            disabled={stage === 'mounting'}
            className="mx-auto inline-flex items-center gap-3 rounded-xl bg-biblio-primary px-8 py-5 text-lg font-semibold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-biblio-secondary disabled:cursor-not-allowed disabled:opacity-70"
          >
            <i className="fas fa-list" />
            Bibliografia
          </button>
          <p className="mt-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Monta a bibliografia para o livro selecionado
          </p>
        </div>

        <div className="mb-4">
          {stage === 'mounting' && <LoadingIndicator message="Consultando bibliografia da obra selecionada..." />}
          {stage === 'error' && <ErrorMessage message={errorMessage} />}
          {stage === 'done' && <SimpleCard text={resultText} />}
        </div>

        <div className="mx-auto grid max-w-[520px] gap-3 justify-items-center">
          <div className="columns-2 gap-2.5">
            {BOOK_OPTIONS.map((book) => (
              <button
                key={book.sigla}
                type="button"
                onClick={() => setSelectedSigla(book.sigla)}
                title={book.title}
                className={`mb-0.5 block w-[40ch] max-w-full overflow-hidden whitespace-nowrap rounded-full px-2 py-1.5 text-left text-sm font-medium text-ellipsis shadow-sm transition-colors ${
                  selectedSigla === book.sigla
                    ? 'bg-gray-400 text-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {book.title}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="pagesInput" className="mb-1.5 block w-[40ch] max-w-full text-xs font-semibold text-gray-700">
              Páginas
            </label>
            <textarea
              id="pagesInput"
              value={pagesText}
              onChange={(e) => setPagesText(e.target.value)}
              rows={1}
              className="w-[46ch] max-w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-biblio-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {(['simples', 'bee'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStyle(opt)}
                className={`h-9 w-[100px] rounded-full border text-sm font-medium shadow-sm transition-colors ${
                  style === opt
                    ? 'border-gray-200 bg-gray-400 text-yellow-200'
                    : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt === 'simples' ? 'Simplificada' : 'BEE'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
