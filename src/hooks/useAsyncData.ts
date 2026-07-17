import { useEffect, useRef, useState } from 'react';

export interface AsyncDataState<T> {
  data: T;
  error: Error | null;
  isLoading: boolean;
  reload: () => void;
}

export function useAsyncData<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
  initialData: T,
): AsyncDataState<T> {
  const loadRef = useRef(load);
  loadRef.current = load;
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<Omit<AsyncDataState<T>, 'reload'>>({
    data: initialData,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, error: null, isLoading: true }));

    loadRef.current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState((previous) => ({
            ...previous,
            error: error instanceof Error ? error : new Error('資料載入失敗'),
            isLoading: false,
          }));
        }
      });

    return () => controller.abort();
  }, [key, reloadToken]);

  return {
    ...state,
    reload: () => setReloadToken((value) => value + 1),
  };
}
