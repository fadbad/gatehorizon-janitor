import { useCallback, useEffect, useRef } from "react";

export default function useMountedState() {
    const mountedRef = useRef(false);
    const get = useCallback(() => mountedRef.current, []);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    });

    return get;
}

/**
Lifecycle hook providing ability to check component's mount state.
Gives a function that will return true if component mounted and false otherwise.

Usage
import * as React from 'react';
import {useMountedState} from 'react-use';

const Demo = () => {
  const isMounted = useMountedState();

  React.useEffect(() => {
    setTimeout(() => {
      if (isMounted()) {
        // ...
      } else {
        // ...
      }
    }, 1000);
  });
};
 */
