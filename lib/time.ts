'use client';

import { useSyncExternalStore } from 'react';

const timeStore = {
  subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {};
    const timer = setInterval(callback, 60000);
    return () => clearInterval(timer);
  },
  getSnapshot() {
    return typeof window !== 'undefined' ? Date.now() : 0;
  },
  getServerSnapshot() {
    return 0;
  },
};

export function useCurrentTime(): number {
  return useSyncExternalStore(
    timeStore.subscribe,
    timeStore.getSnapshot,
    timeStore.getServerSnapshot
  );
}
