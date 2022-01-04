import useNotications from './useNotications'
import useToast from './useToast'
import useUser from './useUser'

export default () => {
    return {
        ...useNotications(),
        ...useToast(),
        ...useUser(),
    }
}
