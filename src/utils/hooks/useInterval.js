import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
    const savedCallback = useRef(() => {});

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (delay !== null) {
            const interval = setInterval(
                () => savedCallback.current(), delay || 0
            );
            return () => clearInterval(interval);
        }
        return undefined;
    }, [delay]);
};

export default useInterval;

/**
 * A declarative interval hook based on Dan Abramov's article on overreacted.io. The interval can be paused by setting the delay to null.

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);
  const [isRunning, toggleIsRunning] = useToggle(true);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div>
      <div>
        delay: <input value={delay} onChange={event => setDelay(Number(event.target.value))} />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={toggleIsRunning}>{isRunning ? 'stop' : 'start'}</button>
      </div>
    </div>
  );
};
 */
