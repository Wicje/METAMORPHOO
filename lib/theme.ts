import { useSyncExternalStore } from 'react';

export type ThemeMode = 'obsidian' | 'bone';

let currentTheme: ThemeMode = 'obsidian';
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function applyThemeToDOM(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (theme === 'bone') {
    root.classList.add('theme-bone');
    root.classList.remove('theme-obsidian');
  } else {
    root.classList.add('theme-obsidian');
    root.classList.remove('theme-bone');
  }
}

export const themeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ThemeMode {
    if (typeof window === 'undefined') return 'obsidian';
    try {
      const saved = localStorage.getItem('metamorphoo_palette_theme') as ThemeMode | null;
      if (saved === 'bone' || saved === 'obsidian') {
        currentTheme = saved;
      }
      return currentTheme;
    } catch {
      return 'obsidian';
    }
  },
  getServerSnapshot(): ThemeMode {
    return 'obsidian';
  },
  setTheme(theme: ThemeMode) {
    currentTheme = theme;
    applyThemeToDOM(theme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_palette_theme', theme);
      } catch {
        // ignore
      }
    }
    emitChange();
  },
  toggleTheme() {
    const next = currentTheme === 'obsidian' ? 'bone' : 'obsidian';
    themeStore.setTheme(next);
  },
  init() {
    if (typeof window === 'undefined') return;
    const theme = themeStore.getSnapshot();
    applyThemeToDOM(theme);
  },
};

export function useTheme() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );
  return theme;
}
