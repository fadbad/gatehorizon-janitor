import useBoarded from './useBoarded'
import useNotications from './useNotications'
import useToast from './useToast'
import useUser from './useUser'

import useMisc from './useMisc'

import useProperty from './useProperty'

export default () => {
    return {
        ...useBoarded(),
        ...useNotications(),
        ...useToast(),
        ...useUser(),

        ...useMisc(),
        ...useProperty(),
    }
}
