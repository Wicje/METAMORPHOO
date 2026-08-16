import { useSyncExternalStore } from 'react';

export interface SavedLook {
  lookId: string;
  savedAt: number;
}

export interface SavedItem {
  itemId: string;
  lookId: string;
  lookName: string;
  savedAt: number;
}

export interface LedgerState {
  savedLooks: SavedLook[];
  savedItems: SavedItem[];
}

let ledgerMemory: LedgerState = {
  savedLooks: [],
  savedItems: [],
};
let rawLedgerString = '';
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

const defaultState: LedgerState = { savedLooks: [], savedItems: [] };

export const ledgerStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): LedgerState {
    if (typeof window === 'undefined') return defaultState;
    try {
      const saved = localStorage.getItem('metamorphoo_private_ledger') || '{"savedLooks":[],"savedItems":[]}';
      if (saved !== rawLedgerString) {
        rawLedgerString = saved;
        ledgerMemory = JSON.parse(saved);
      }
      return ledgerMemory;
    } catch {
      return defaultState;
    }
  },
  getServerSnapshot(): LedgerState {
    return defaultState;
  },
  toggleSaveLook(lookId: string) {
    const current = ledgerStore.getSnapshot();
    const exists = current.savedLooks.some((l) => l.lookId === lookId);
    const updatedLooks = exists
      ? current.savedLooks.filter((l) => l.lookId !== lookId)
      : [{ lookId, savedAt: Date.now() }, ...current.savedLooks];

    ledgerStore.save({ ...current, savedLooks: updatedLooks });
  },
  toggleSaveItem(itemId: string, lookId: string, lookName: string) {
    const current = ledgerStore.getSnapshot();
    const exists = current.savedItems.some((i) => i.itemId === itemId);
    const updatedItems = exists
      ? current.savedItems.filter((i) => i.itemId !== itemId)
      : [{ itemId, lookId, lookName, savedAt: Date.now() }, ...current.savedItems];

    ledgerStore.save({ ...current, savedItems: updatedItems });
  },
  clearLedger() {
    ledgerStore.save({ savedLooks: [], savedItems: [] });
  },
  save(state: LedgerState) {
    ledgerMemory = state;
    rawLedgerString = JSON.stringify(state);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_private_ledger', rawLedgerString);
      } catch {
        // ignore
      }
    }
    emitChange();
  },
};

export function useLedger() {
  const state = useSyncExternalStore(
    ledgerStore.subscribe,
    ledgerStore.getSnapshot,
    ledgerStore.getServerSnapshot
  );
  return state;
}
