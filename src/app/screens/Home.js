import React from "react";
import { Div, Text, Icon, Image, Spinner } from '../../ui'
import { useStore, useApi, useTranslation } from '../../utils'

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { user, user_logout } = useStore()

    return (
        <Div f={1} bg={'light'} center>
            <Text>Home</Text>
            <Div onPress={user_logout}>
                <Text>Logout</Text>
            </Div>
        </Div>
    )
}
