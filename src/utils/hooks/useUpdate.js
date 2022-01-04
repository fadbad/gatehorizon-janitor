import { useReducer } from 'react';

const updateReducer = (num) => (num + 1) % 1;

export default function useUpdate() {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}

/**
React utility hook that returns a function that forces component to re-render when called.

Usage

const Demo = () => {
  const update = useUpdate();
  return (
    <>
      <div>Time: {Date.now()}</div>
      <button onClick={update}>Update</button>
    </>
  );
};
 */
