import { renderMarkdown } from '../lib/markdown';

interface ChatMessageProps {
  sender: 'user' | 'bot';
  content: string;
  isMarkdown?: boolean;
}

export function ChatMessage({ sender, content, isMarkdown = true }: ChatMessageProps) {
  if (sender === 'user') {
    return (
      <div className="ml-auto flex max-w-[80%] flex-row-reverse items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f6fff8] text-[#3a513a] shadow">
          <i className="fas fa-user" />
        </div>
        <div className="rounded-2xl bg-[#f6fff8] px-4 py-3 text-base text-[#3a513a]">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full items-start gap-0">
      <div className="w-full flex-1 rounded-2xl bg-white px-6 py-5 shadow-sm dark:bg-gray-800">
        {isMarkdown ? (
          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        ) : (
          content
        )}
      </div>
    </div>
  );
}
