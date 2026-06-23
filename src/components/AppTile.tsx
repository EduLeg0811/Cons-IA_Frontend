import type { ComponentType } from 'react';

type Category = 'apps' | 'biblio' | 'bots' | 'search' | 'utils';

export const CATEGORY_COLORS: Record<Category, { primary: string; secondary: string }> = {
  apps: { primary: '#7c3aed', secondary: '#a855f7' },
  biblio: { primary: '#edc93a', secondary: '#f6da5b' },
  bots: { primary: '#10b981', secondary: '#34d399' },
  search: { primary: '#0ea5e9', secondary: '#38bdf8' },
  utils: { primary: '#f87171', secondary: '#fca5a5' },
};

const RING_CLASSES: Record<Category, string> = {
  apps: 'focus-visible:ring-apps-primary',
  biblio: 'focus-visible:ring-biblio-primary',
  bots: 'focus-visible:ring-bots-primary',
  search: 'focus-visible:ring-search-primary',
  utils: 'focus-visible:ring-utils-primary',
};

export interface IllustrationProps {
  primary: string;
  secondary: string;
}

interface AppTileProps {
  href: string;
  title: string;
  description: string;
  illustration?: ComponentType<IllustrationProps>;
  image?: string;
  category: Category;
  external?: boolean;
  onClick?: () => void;
}

export function AppTile({ href, title, description, illustration: Illustration, image, category, external = false, onClick }: AppTileProps) {
  const colors = CATEGORY_COLORS[category];

  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm outline-none transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 ${RING_CLASSES[category]}`}
    >
      {external && (
        <span className="absolute right-3 top-3 z-10 text-xs text-gray-400 opacity-70">
          <i className="fas fa-arrow-up-right-from-square" />
        </span>
      )}

      <div className="relative flex flex-[0_0_65%] min-h-0 items-center justify-center bg-white">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-110"
          />
        ) : Illustration ? (
          <span className="transition-transform duration-200 group-hover:scale-110">
            <Illustration primary={colors.primary} secondary={colors.secondary} />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-gray-100 p-4 text-left dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </a>
  );
}
