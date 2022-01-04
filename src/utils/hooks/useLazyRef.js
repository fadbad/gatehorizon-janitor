import React from "react";

export default function useLazyRef(callback) {
    const lazyRef = React.useRef();

    if (lazyRef.current === undefined) {
        lazyRef.current = callback();
    }

    return lazyRef;
}
