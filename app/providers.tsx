'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';
import { makeStore } from './store';

export function Providers({ children } : { children : any}) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}