'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (!storeRef.current) return;
    return setupListeners(storeRef.current.dispatch);
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
