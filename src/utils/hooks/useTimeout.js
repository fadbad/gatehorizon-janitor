import useTimeoutFn from './useTimeoutFn';
import useUpdate from './useUpdate';

export default function useTimeout(ms) {
  	const update = useUpdate();
  	return useTimeoutFn(update, ms);
}
