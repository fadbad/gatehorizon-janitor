import { useCallback, useEffect, useRef } from "react";

export default function useTimeoutFn(fn, ms = 0) {
    const ready = useRef(false);
    const timeout = useRef();
    const callback = useRef(fn);

    const isReady = useCallback(() => ready.current, []);

    const set = useCallback(() => {
        ready.current = false;
        timeout.current && clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            ready.current = true;
            callback.current();
        }, ms);
    }, [ms]);

    const clear = useCallback(() => {
        ready.current = null;
        timeout.current && clearTimeout(timeout.current);
    }, []);

    // update ref when function changes
    useEffect(() => {
        callback.current = fn;
    }, [fn]);

    // set on mount, clear on unmount
    useEffect(() => {
        set();
        return clear;
    }, [ms]);

    return [isReady, clear, set];
}

/**
Calls given function after specified amount of milliseconds.

Several thing about it's work:

does not re-render component;
automatically cancel timeout on cancel;
automatically reset timeout on delay change;
reset function call will cancel previous timeout;
timeout will NOT be reset on function change. It will be called within the timeout, you have to reset it on your own when needed.
Usage
import * as React from 'react';
import { useTimeoutFn } from 'react-use';

const Demo = () => {
  const [state, setState] = React.useState('Not called yet');

  function fn() {
    setState(`called at ${Date.now()}`);
  }

  const [isReady, cancel, reset] = useTimeoutFn(fn, 5000);
  const cancelButtonClick = useCallback(() => {
    if (isReady() === false) {
      cancel();
      setState(`cancelled`);
    } else {
      reset();
      setState('Not called yet');
    }
  }, []);

  const readyState = isReady();

  return (
    <div>
      <div>{readyState !== null ? 'Function will be called in 5 seconds' : 'Timer cancelled'}</div>
      <button onClick={cancelButtonClick}> {readyState === false ? 'cancel' : 'restart'} timeout</button>
      <br />
      <div>Function state: {readyState === false ? 'Pending' : readyState ? 'Called' : 'Cancelled'}</div>
      <div>{state}</div>
    </div>
  );
};
Reference
const [
    isReady: () => boolean | null,
    cancel: () => void,
    reset: () => void,
] = useTimeoutFn(fn: Function, ms: number = 0);
 */
