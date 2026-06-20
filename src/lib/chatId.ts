const CHAT_ID_STORAGE_KEYS: Record<string, string> = {
  default: 'cons_chat_id',
  ragbot: 'cons_chat_id_ragbot',
};

function resolveChatIdKey(scope = 'default'): string {
  return CHAT_ID_STORAGE_KEYS[scope] || CHAT_ID_STORAGE_KEYS.default;
}

function resolveStorage(): Storage | null {
  try {
    if (window.sessionStorage) return window.sessionStorage;
  } catch {
    // ignore
  }
  return null;
}

function createUuid(): string {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateChatId(scope = 'default'): string {
  const key = resolveChatIdKey(scope);
  const storage = resolveStorage();
  if (!storage) return createUuid();

  let id: string | null = null;
  try {
    id = storage.getItem(key);
  } catch {
    // ignore
  }
  if (!id) {
    id = createUuid();
    try {
      storage.setItem(key, id);
    } catch {
      // ignore
    }
  }
  return id;
}

export function newConversationId(scope = 'default'): string {
  const id = createUuid();
  const key = resolveChatIdKey(scope);
  const storage = resolveStorage();
  try {
    storage?.setItem(key, id);
  } catch {
    // ignore
  }
  return id;
}

export async function ragbotReset(chatId: string): Promise<void> {
  const { API_BASE_URL } = await import('./config');
  try {
    await fetch(`${API_BASE_URL}/ragbot_reset`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId }),
    });
  } catch {
    // ignore failure, follow legacy "soga em frente mesmo assim" behavior
  }
}
