import { useSyncExternalStore } from 'react';
import { Look, Item } from './types';
import { LAUNCH_LOOKS, ARCHIVE_VAULT_LOOKS } from './data';

export interface CatalogState {
  customLaunchLooks: Look[];
  customArchiveLooks: Look[];
  activeSeasonTitle: string;
}

let catalogMemory: CatalogState = {
  customLaunchLooks: LAUNCH_LOOKS,
  customArchiveLooks: ARCHIVE_VAULT_LOOKS,
  activeSeasonTitle: 'VOLUME 01 — THE INAUGURAL WARDROBE (2025/2026)',
};

let rawCatalogString = '';
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

export const catalogStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): CatalogState {
    if (typeof window === 'undefined') return catalogMemory;
    try {
      const saved = localStorage.getItem('metamorphoo_catalog_custom');
      if (saved && saved !== rawCatalogString) {
        rawCatalogString = saved;
        const parsed = JSON.parse(saved);
        catalogMemory = {
          customLaunchLooks: parsed.customLaunchLooks || LAUNCH_LOOKS,
          customArchiveLooks: parsed.customArchiveLooks || ARCHIVE_VAULT_LOOKS,
          activeSeasonTitle: parsed.activeSeasonTitle || 'VOLUME 01 — THE INAUGURAL WARDROBE (2025/2026)',
        };
      }
    } catch {
      // ignore
    }
    return catalogMemory;
  },
  getServerSnapshot(): CatalogState {
    return catalogMemory;
  },
  addLook(look: Look, isArchive = false) {
    const current = catalogStore.getSnapshot();
    if (isArchive) {
      const updated = [look, ...current.customArchiveLooks.filter((l) => l.id !== look.id)];
      catalogStore.save({ ...current, customArchiveLooks: updated });
    } else {
      const updated = [look, ...current.customLaunchLooks.filter((l) => l.id !== look.id)];
      catalogStore.save({ ...current, customLaunchLooks: updated });
    }
  },
  updateLook(look: Look) {
    const current = catalogStore.getSnapshot();
    const inLaunch = current.customLaunchLooks.some((l) => l.id === look.id);
    if (inLaunch) {
      const updated = current.customLaunchLooks.map((l) => (l.id === look.id ? look : l));
      catalogStore.save({ ...current, customLaunchLooks: updated });
    } else {
      const updated = current.customArchiveLooks.map((l) => (l.id === look.id ? look : l));
      catalogStore.save({ ...current, customArchiveLooks: updated });
    }
  },
  deleteLook(lookId: string) {
    const current = catalogStore.getSnapshot();
    const updatedLaunch = current.customLaunchLooks.filter((l) => l.id !== lookId);
    const updatedArchive = current.customArchiveLooks.filter((l) => l.id !== lookId);
    catalogStore.save({
      ...current,
      customLaunchLooks: updatedLaunch,
      customArchiveLooks: updatedArchive,
    });
  },
  resetToDefaults() {
    const defaultState: CatalogState = {
      customLaunchLooks: LAUNCH_LOOKS,
      customArchiveLooks: ARCHIVE_VAULT_LOOKS,
      activeSeasonTitle: 'VOLUME 01 — THE INAUGURAL WARDROBE (2025/2026)',
    };
    catalogStore.save(defaultState);
  },
  save(state: CatalogState) {
    catalogMemory = state;
    rawCatalogString = JSON.stringify(state);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_catalog_custom', rawCatalogString);
      } catch {
        // ignore
      }
    }
    emitChange();
  },
};

export function useCatalog() {
  const state = useSyncExternalStore(
    catalogStore.subscribe,
    catalogStore.getSnapshot,
    catalogStore.getServerSnapshot
  );
  return state;
}
