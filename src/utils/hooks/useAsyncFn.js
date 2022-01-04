import { useCallback, useRef, useState } from 'react';
import useMountedState from './useMountedState';

export default function useAsyncFn(fn, deps = [], initialState = {loading: false}){
	const lastCallId = useRef(0);
	const isMounted = useMountedState();
	const [state, set] = useState(initialState);

	const callback = useCallback((...args) => {
    	const callId = ++lastCallId.current;
    	set((prevState) => ({ ...prevState, loading: true }));

    	return fn(...args).then(
			(value) => {
				isMounted() && callId === lastCallId.current && set({ value, loading: false });

				return value;
			},
			(error) => {
				isMounted() && callId === lastCallId.current && set({ error, loading: false });

				return error;
			}
    	);
  	}, deps);

  	return [state, callback];
}

/**
 * React hook that returns state and a callback for an async function or a function that returns a promise. The state is of the same shape as useAsync.
 
 const Demo = ({url}) => {
  const [state, fetch] = useAsyncFn(async () => {
    const response = await fetch(url);
    const result = await response.text();
    return result
  }, [url]);

  return (
    <div>
      {state.loading
        ? <div>Loading...</div>
        : state.error
          ? <div>Error: {state.error.message}</div>
          : <div>Value: {state.value}</div>
      }
      <button onClick={() => fetch()}>Start loading</button>
    </div>
  );
};
 */
