import { useState } from 'react';
import type { ComponentType } from 'react';
import { AppTile, type IllustrationProps } from '../components/AppTile';
import {
  QuizIllustration,
  FlashcardsIllustration,
  BiblioVerbeteIllustration,
  ConsGptIllustration,
  ConsLmIllustration,
  ConsBotIllustration,
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

type Category = 'apps' | 'biblio' | 'bots' | 'search' | 'utils';

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
};

const SECTIONS: { category: Category; title: string; subtitle: string; modules: ModuleEntry[] }[] = [
  {
    category: 'apps',
    title: 'Apps IA',
    subtitle: 'Aplicativos Diversos',
    modules: [
      { href: 'index_mancia.html', title: 'Bibliomancia Digital', description: 'Sorteio de ortopensatas do Léxico', image: '/Modules_Figures/LO.png' },
      {
        href: 'https://verbetograma.streamlit.app/',
        title: 'Revisão Verbetográfica',
        description: 'Realiza auditoria nos verbetes antes da entrega',
        image: '/Modules_Figures/Lexicons.png',
        external: true,
      },
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67?artifactId=8f6fc286-021f-4184-b572-7f17c8561539',
        title: 'Quiz Conscienciológico',
        description: 'Quiz de Perguntas & Respostas',
        illustration: QuizIllustration,
        external: true,
      },
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67?artifactId=2da2f57f-996c-4efd-b24c-c2f49ba8b452',
        title: 'Flashcards de Temas',
        description: 'Temas da Conscienciologia em cards',
        illustration: FlashcardsIllustration,
        external: true,
      },
    ],
  },
  {
    category: 'biblio',
    title: 'Bibliografia IA',
    subtitle: 'Referências de Livros, Artigos e Verbetes',
    modules: [
      { href: 'index_biblio_wv.html', title: 'Bibliografia de Livros', description: 'Bibliografia de livros de Waldo Vieira', image: '/Modules_Figures/Books.png' },
      { href: 'index_biblio_verbete.html', title: 'Bibliografia de Verbetes', description: 'Listagem e bibliografia de verbetes', illustration: BiblioVerbeteIllustration },
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
        illustration: ConsGptIllustration,
        external: true,
      },
      {
        href: 'https://notebooklm.google.com/notebook/c3528e65-0c2b-4a80-b3f2-2f22e3626b67',
        title: 'ConsLM',
        description: 'NotebookLM da Google',
        illustration: ConsLmIllustration,
        external: true,
      },
      { href: 'index_ragbot.html', title: 'ConsBOT', description: 'Chatbot da Conscienciologia', illustration: ConsBotIllustration },
    ],
  },
  {
    category: 'search',
    title: 'Busca IA',
    subtitle: 'Busca de Palavras em Livros',
    modules: [
      { href: 'index_search_book.html', title: 'Livros & Tratados', description: 'Busca de palavras em livros', image: '/Modules_Figures/Dict.jpg' },
      { href: 'index_search_verb.html', title: 'Definologia de Verbetes', description: 'Busca na Definologia dos verbetes', illustration: SearchVerbIllustration },
      { href: 'index_search_ccg.html', title: 'Questões do Conscienciograma', description: 'Busca no Conscienciograma', illustration: SearchCcgIllustration },
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
      <nav className="fixed inset-x-0 top-0 z-50 h-[70px] border-b border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
          <a href="index.html" title="Voltar à página inicial" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <img src="/icon.png" alt="Cons-IA" className="h-8 w-8" />
          </a>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Vitrine de Apps</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Cons-IA · Toolbox de IA da Conscienciologia</div>
          </div>

          <button
            type="button"
            title="Toggle Theme"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
          </button>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-70px)] bg-gray-50 px-6 py-12 pt-[94px] dark:bg-gray-950">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vitrine de Apps</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Explore os módulos do Cons-IA, organizados como uma loja de aplicativos.</p>
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
