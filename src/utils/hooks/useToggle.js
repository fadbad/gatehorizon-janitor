import { useReducer } from 'react';

const toggleReducer = (state, nextValue) => 
	typeof nextValue === 'boolean' ? nextValue : !state;

// initialValue: BOOLEAN
const useToggle = (initialValue) => {
  	return useReducer(toggleReducer, initialValue);
};

export default useToggle;

/**
React state hook that tracks value of a boolean.

Usage
import {useToggle} from 'react-use';

const Demo = () => {
  const [on, toggle] = useToggle(true);

  return (
    <div>
      <div>{on ? 'ON' : 'OFF'}</div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => toggle(true)}>set ON</button>
      <button onClick={() => toggle(false)}>set OFF</button>
    </div>
  );
};
 */
