import { useSyncExternalStore } from 'react';
import { CartItem } from './types';

let memoryCart: CartItem[] = [];
let rawCartString = '';
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const emptyArray: CartItem[] = [];

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): CartItem[] {
    if (typeof window === 'undefined') return emptyArray;
    try {
      const saved = localStorage.getItem('metamorphoo_wardrobe') || '[]';
      if (saved !== rawCartString) {
        rawCartString = saved;
        memoryCart = JSON.parse(saved);
      }
      return memoryCart;
    } catch {
      return emptyArray;
    }
  },
  getServerSnapshot(): CartItem[] {
    return emptyArray;
  },
  setCart(items: CartItem[]) {
    memoryCart = items;
    rawCartString = JSON.stringify(items);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_wardrobe', rawCartString);
      } catch {
        // ignore
      }
    }
    emitChange();
  },
};

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  return [items, cartStore.setCart] as const;
}
