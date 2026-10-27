export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme_preference';

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // storage unavailable; fall through to system preference
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.style.colorScheme = mode;
}

export const themeState = $state<{ mode: ThemeMode }>({ mode: readStoredTheme() });

export function initTheme() {
  applyTheme(themeState.mode);
}

export function setTheme(mode: ThemeMode) {
  themeState.mode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore persistence failure
  }
  applyTheme(mode);
}

export function toggleTheme() {
  setTheme(themeState.mode === 'dark' ? 'light' : 'dark');
}
