import { useState, useEffect } from 'react';
import { Loadable, LoadableStatus } from './Loadable';

export function useQuery<T>(
  query: (...args: unknown[]) => Promise<T>,
  ...args: unknown[]
) {
  const [state, setState] = useState<Loadable<T>>({
    status: LoadableStatus.Idle,
  });

  useEffect(() => {
    setState({ status: LoadableStatus.Loading });

    const controller = new AbortController();

    query(...args, { signal: controller.signal })
      .then((data) => {
        setState({ status: LoadableStatus.Completed, data });
      })
      .catch((error) => {
        setState({ status: LoadableStatus.Failed, error });
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  return state;
}
