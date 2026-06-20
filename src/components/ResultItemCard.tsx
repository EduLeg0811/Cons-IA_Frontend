import { renderMarkdown, bookName } from '../lib/markdown';
import { MetadataBadge } from './MetadataBadge';
import type { FlattenedItem } from '../lib/formatters';

const VERBETES_URL = 'https://arquivos.enciclopediadaconscienciologia.org/verbetes/';

interface ResultItemCardProps {
  item: FlattenedItem;
  fullBadges?: boolean;
}

export function ResultItemCard({ item, fullBadges = false }: ResultItemCardProps) {
  const source = bookName(item.source);
  const text = item.mk_text || item.raw_text || '';

  if (item.source === 'EC') {
    const textCompleted = '**Definologia.** ' + text;
    const titleHtml = `<strong>${item.title}</strong> (${item.area}) ● <em>${item.author}</em> ● #${item.paragraph_number ?? ''} ● ${item.date}`;
    const arquivo = (item.title || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
    const pdfHref = VERBETES_URL + encodeURIComponent(arquivo) + '.pdf';
    return (
      <div className="mb-4">
        <div className="displaybox-header verbetopedia-header mb-2 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800">
          <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
        </div>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(textCompleted) }} />
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {source && <MetadataBadge variant="estilo1"><strong>{source}</strong></MetadataBadge>}
          {item.title && <MetadataBadge variant="estilo2"><strong>{item.title}</strong></MetadataBadge>}
          {item.pagina && <MetadataBadge variant="badge-page">pág. {item.pagina}</MetadataBadge>}
          {item.area && <MetadataBadge variant="estilo2"><em>{item.area}</em></MetadataBadge>}
          {item.paragraph_number && <MetadataBadge variant="estilo2"> #{item.paragraph_number}</MetadataBadge>}
          {item.theme && <MetadataBadge variant="estilo2">{item.theme}</MetadataBadge>}
          {item.author && <MetadataBadge variant="estilo2">{item.author}</MetadataBadge>}
          {item.date && <MetadataBadge variant="estilo2">{item.date}</MetadataBadge>}
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir PDF em nova aba"
            className="ml-1 text-red-600 hover:text-red-700"
          >
            <i className="fas fa-file-pdf" />
          </a>
        </div>
      </div>
    );
  }

  if (item.source === 'CCG') {
    const titleHtml = `<strong>${item.title}</strong> ● ${item.folha} ● #${item.paragraph_number ?? ''}`;
    return (
      <div className="mb-4">
        <div className="displaybox-header verbetopedia-header mb-2 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800">
          <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
        </div>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
        <div className="mt-1 flex flex-wrap gap-1">
          {source && <MetadataBadge variant="estilo1"><strong>{source}</strong></MetadataBadge>}
          {item.pagina && <MetadataBadge variant="estilo3">pág. {item.pagina}</MetadataBadge>}
        </div>
      </div>
    );
  }

  if (item.source === 'LO') {
    const textCompleted = item.title ? `**${item.title}.** ${text}` : text;
    return (
      <div className="mb-4">
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(textCompleted) }} />
        <div className="mt-1 flex flex-wrap gap-1">
          {source && <MetadataBadge variant="estilo1"><strong>{source}</strong></MetadataBadge>}
          {item.title && <MetadataBadge variant="estilo2"><strong>{item.title}</strong></MetadataBadge>}
          {item.pagina && <MetadataBadge variant="badge-page">pág. {item.pagina}</MetadataBadge>}
          {fullBadges && item.paragraph_number && (
            <MetadataBadge variant="estilo2"> #{item.paragraph_number}</MetadataBadge>
          )}
        </div>
      </div>
    );
  }

  if (item.source === 'DAC') {
    return (
      <div className="mb-4">
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
        <div className="mt-1 flex flex-wrap gap-1">
          {source && <MetadataBadge variant="estilo1"><strong>{source}</strong></MetadataBadge>}
          {item.title && <MetadataBadge variant="estilo2"><strong>{item.title}</strong></MetadataBadge>}
          {item.pagina && <MetadataBadge variant="estilo3">pág. {item.pagina}</MetadataBadge>}
          {fullBadges && item.argument && <MetadataBadge variant="estilo2">{item.argument}</MetadataBadge>}
        </div>
      </div>
    );
  }

  // Default formatter (TNP, DUPLA, PROEXIS, 700EXP, 200TEAT, TEMAS, HSR, HSP, PROJ, ...)
  return (
    <div className="mb-4">
      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
      <div className="mt-1 flex flex-wrap gap-1">
        {source && <MetadataBadge variant="estilo1"><strong>{source}</strong></MetadataBadge>}
        {item.title && <MetadataBadge variant="estilo2"><strong>{item.title}</strong></MetadataBadge>}
        {item.pagina && <MetadataBadge variant="estilo3">pág. {item.pagina}</MetadataBadge>}
      </div>
    </div>
  );
}
