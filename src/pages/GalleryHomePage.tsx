import { useState } from 'react';
import type { ComponentType } from 'react';
import { Moon, Sun } from 'lucide-react';
import { AppTile, type IllustrationProps } from '../components/AppTile';
import {
  BiblioVerbeteIllustration,
  SearchBookIllustration,
  SearchVerbIllustration,
  SearchCcgIllustration,
  GlobeIllustration,
  EnciclopediaIllustration,
  PeriodicosIllustration,
  PdfIllustration,
} from '../components/illustrations';
import { useTheme } from '../lib/theme';
import { logFeatureAccess } from '../lib/config';

type Category = 'apps' | 'biblio' | 'bots' | 'search' | 'utils' | 'estudo';

interface ModuleEntry {
  href: string;
  title: string;
  description: string;
  illustration?: ComponentType<IllustrationProps>;
  image?: string;
  external?: boolean;
}

const SECTION_LABEL_CLASSES: Record<Category, string> = {
  apps: 'text-apps-primary border-apps-primary',
  biblio: 'text-biblio-primary border-biblio-primary',
  bots: 'text-bots-primary border-bots-primary',
  search: 'text-search-primary border-search-primary',
  utils: 'text-utils-primary border-utils-primary',
  estudo: 'text-estudo-primary border-estudo-primary',
};

const SECTIONS: { category: Category; title: string; subtitle: string; modules: ModuleEntry[] }[] = [
  {
    category: 'apps',
    title: 'Apps IA',
    subtitle: 'Aplicativos Diversos',
    modules: [
      {
        href: 'index_mancia.html',
        title: 'Bibliomancia Digital',
        description: 'Sorteio e interpretação de ortopensatas do Léxico',
        image: '/Modules_Figures/LO_New.png'
      },
      {
        href: 'https://verbetograma.streamlit.app/',
        title: 'Revisão Verbetográfica',
        description: 'Auditoria nos verbetes antes da entrega',
        image: '/Modules_Figures/Verbetogram.png',
        external: true,
      },
      {
        href: 'https://lexicons-g86o.onrender.com',
        title: 'Lexicons',
        description: 'Dissecção lexicográfica',
        image: '/Modules_Figures/Lexicons_New_noWords.png',
        external: true,
      },
      {
        href: 'https://conswiki.onrender.com',
        title: 'Cons Wiki LLM',
        description: 'Wiki da Conscienciologia com IA',
        external: true,
      },
    ],
  },
  {
    category: 'estudo',
    title: 'Estudo IA',
    subtitle: 'Recursos de Estudo e Memorização',
    modules: [
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67?artifactId=8f6fc286-021f-4184-b572-7f17c8561539',
        title: 'Quiz Conscienciológico',
        description: 'Teste seus conhecimentos de Conscienciologia com questões de múltipla escolha',
        image: '/Modules_Figures/Quiz_new.png',
        external: true,
      },
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67?artifactId=2da2f57f-996c-4efd-b24c-c2f49ba8b452',
        title: 'Flashcards de Temas',
        description: 'Estude a Conscienciologia com flashcards de perguntas e respostas',
        image: '/Modules_Figures/FlashCards.png',
        external: true,
      },
    ],
  },
  {
    category: 'biblio',
    title: 'Bibliografia IA',
    subtitle: 'Referências de Livros, Artigos e Verbetes',
    modules: [
      { href: 'index_biblio_wv.html', title: 'Bibliografia de Livros', description: 'Bibliografia de livros e tratados de Waldo Vieira', image: '/Modules_Figures/Biblio_Books.png' },
      { href: 'index_biblio_verbete.html', title: 'Bibliografia de Verbetes', description: 'Listagem e bibliografia de verbetes da Enciclopédia da Conscienciologia', image: '/Modules_Figures/Biblio_EC.png' },
    ],
  },
  {
    category: 'bots',
    title: 'Bots IA',
    subtitle: 'Assistentes de Conversação',
    modules: [
      {
        href: 'https://chatgpt.com/g/g-68a5d68b96c4819189dd1e6fb0def83f-consgpt',
        title: 'ConsGPT',
        description: 'ChatGPT da OpenAI',
        image: '/Modules_Figures/ConsGPT_New.png',
        external: true,
      },
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67',
        title: 'ConsLM',
        description: 'NotebookLM da Google',
        image: '/Modules_Figures/ConsLM_New.png',
        external: true,
      },
      { href: 'index_ragbot.html', title: 'ConsBOT', description: 'Chatbot da Conscienciologia', image: '/Modules_Figures/ConsBOT_New.png' },
    ],
  },
  {
    category: 'search',
    title: 'Busca IA',
    subtitle: 'Busca de Palavras em Livros',
    modules: [
      { href: 'index_search_book.html', title: 'Livros & Tratados', description: 'Busca de palavras nos livros e tratados de Waldo Vieira', image: '/Modules_Figures/Book_Search_New.png' },
      { href: 'index_search_verb.html', title: 'Definologia de Verbetes', description: 'Busca na Definologia dos verbetes (não apenas nos títulos)', image: '/Modules_Figures/Busca_Verbetes.png' },
      { href: 'index_search_ccg.html', title: 'Questões do Conscienciograma', description: 'Busca nas questões do Conscienciograma', image: '/Modules_Figures/Busca_Conscienciograma.png' },
    ],
  },
  {
    category: 'utils',
    title: 'Links Externos',
    subtitle: 'Páginas Úteis da Conscienciologia',
    modules: [
      { href: 'https://www.icge.org.br/', title: 'ICGE', description: 'Site do ICGE', illustration: GlobeIllustration, external: true },
      { href: 'https://enciclopediadaconscienciologia.org/', title: 'Enciclopédia da Conscienciologia', description: 'Download de verbetes', illustration: EnciclopediaIllustration, external: true },
      { href: 'https://periodicos.conscienciologia.org.br/', title: 'Portal de Periódicos', description: 'Portal de periódicos da Conscienciologia', illustration: PeriodicosIllustration, external: true },
      {
        href: 'https://drive.google.com/drive/folders/1Mp6Zfhq-peIYlo9Js0wYRX2DnRjFYyUj?usp=sharing',
        title: 'Livros em PDF',
        description: 'Acervo de obras de Waldo Vieira',
        illustration: PdfIllustration,
        external: true,
      },
    ],
  },
];

export function GalleryHomePage() {
  const [theme, toggleTheme] = useTheme();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const logClick = (module: string, label: string, href: string) => {
    try {
      logFeatureAccess({ module, action: 'click', label, value: href, meta: { href, source: 'gallery' } });
    } catch {
      // ignore logging errors
    }
  };

  const sendFeedback = () => {
    const msg = feedbackText.trim();
    if (!msg) {
      setFeedbackStatus('Digite uma mensagem.');
      return;
    }
    try {
      logFeatureAccess({ module: 'feedback', action: 'send', label: 'Feedback enviado (gallery)', value: msg });
      setFeedbackStatus('Feedback enviado! Agradecemos sua mensagem.');
    } catch {
      setFeedbackStatus('Falha ao enviar. Tente novamente.');
    }
    setTimeout(() => setFeedbackOpen(false), 1000);
  };

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="index.html" title="Voltar à página inicial" className="group flex items-center gap-3">
            <img
              src="/icon.png"
              alt="Cons-IA"
              className="h-9 w-9 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]"
            />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-3xl tracking-tight text-gray-900 dark:text-gray-100">
                Cons<span className="italic" style={{ color: 'var(--tone-lilac-strong)' }}> IA</span>
              </span>
              <span className="hidden text-xs uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 sm:inline">Vitrine de Aplicativos</span>
            </span>
          </a>

          <button
            type="button"
            title="Toggle Theme"
            onClick={toggleTheme}
            className="nav-icon-btn group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/60 bg-white/60 text-gray-600 transition-colors dark:border-gray-700/60 dark:bg-gray-800/60 dark:text-gray-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.5} />
            ) : (
              <Moon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-70px)] bg-gray-50 px-6 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 pt-8 text-center">
            <h1 className="font-display text-5xl leading-[1.05] text-gray-900 sm:text-6xl dark:text-gray-100">
              Explore as ferramentas de IA
              <br />
              <span className="italic" style={{ color: 'color-mix(in oklch, var(--tone-lilac-strong) 80%, transparent)' }}>
                da Conscienciologia
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {SECTIONS.map((s) => s.title).join(' • ')}
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {SECTIONS.map((section) => (
              <section key={section.category}>
                <div className={`mb-5 border-b pb-2 ${SECTION_LABEL_CLASSES[section.category]}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wide ${SECTION_LABEL_CLASSES[section.category]}`}>{section.title}</h2>
                  <p className="text-xs italic text-gray-500 dark:text-gray-400">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {section.modules.map((mod) => (
                    <AppTile
                      key={mod.title}
                      href={mod.href}
                      title={mod.title}
                      description={mod.description}
                      illustration={mod.illustration}
                      image={mod.image}
                      category={section.category}
                      external={mod.external}
                      onClick={() => logClick(section.category, mod.title, mod.href)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="mx-auto mt-16 max-w-[1400px] border-t border-gray-200 px-6 py-8 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200"
            >
              Envie seu feedback
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">©2026 Cons-IA.org</div>
            <a href="mailto:legadologia@gmail.com" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Fale com o Diretor:</span>
              <i className="fas fa-envelope" />
              <em>transmentor@interludium.ccce</em>
            </a>
          </div>
        </footer>
      </main>

      {feedbackOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFeedbackOpen(false);
          }}
        >
          <div className="w-[min(420px,92vw)] rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Enviar Feedback</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Sua mensagem será enviada aos desenvolvedores.</p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="Escreva aqui sua mensagem..."
              className="mt-3 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-apps-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFeedbackOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={sendFeedback}
                className="rounded-lg bg-apps-primary px-4 py-2 text-sm font-medium text-white hover:bg-apps-secondary"
              >
                Enviar
              </button>
            </div>
            {feedbackStatus && <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feedbackStatus}</div>}
          </div>
        </div>
      )}
    </>
  );
}
