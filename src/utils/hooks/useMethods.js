import { Reducer, useMemo, useReducer } from "react";

const useMethods = (createMethods, initialState) => {
    const reducer = useMemo(
        () => (reducerState, action) => {
            return createMethods(reducerState)[action.type](...action.payload);
        },
        [createMethods]
    );

    const [state, dispatch] = useReducer(reducer, initialState);

    const wrappedMethods = useMemo(() => {
        const actionTypes = Object.keys(createMethods(initialState));

        return actionTypes.reduce((acc, type) => {
            acc[type] = (...payload) => dispatch({ type, payload });
            return acc;
        }, {});
    }, [createMethods, initialState]);

    return [state, wrappedMethods];
};

export default useMethods;

/*
const initialState = {
  count: 0,
};

function createMethods(state) {
  return {
    reset() {
      return initialState;
    },
    increment() {
      return { ...state, count: state.count + 1 };
    },
    decrement() {
      return { ...state, count: state.count - 1 };
    },
  };
}

const Demo = () => {
  const [state, methods] = useMethods(createMethods, initialState);

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={methods.decrement}>-</button>
      <button onClick={methods.increment}>+</button>
    </>
  );
};
*/
