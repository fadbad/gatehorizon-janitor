import { useEffect } from 'react';
import useAsyncFn from './useAsyncFn';

export default function useAsync( fn, deps = [] ) {
  	const [state, callback] = useAsyncFn(fn, deps, {
    	loading: true,
  	});

 	useEffect(() => {
    	callback();
  	}, [callback]);

  	return state;
}

/*
React hook that resolves an async function or a function that returns a promise;

const Demo = ({url}) => {
  const state = useAsync(async () => {
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
    </div>
  );
};
*/
