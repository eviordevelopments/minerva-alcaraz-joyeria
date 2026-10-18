// Safe Storage Utility
// Handles iOS / Android WebViews (Instagram, Facebook, TikTok) and Private Browsing
// where localStorage or sessionStorage may throw SecurityError / QuotaExceededError.

const memoryStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback to memory
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback to memory
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback
    }
    delete memoryStorage[key];
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {
      // Fallback
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback
    }
    delete memoryStorage[key];
  },
};

// Zustand persist StateStorage adapter (immune to iOS / Android WebView SecurityErrors)
export const zustandSafeStorage = {
  getItem: (key: string): string | null => {
    return safeLocalStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    safeLocalStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    safeLocalStorage.removeItem(key);
  },
};
