import React from "react";
import { Div, Text, Icon, List } from '../../ui'
import { moment, useTranslation, useRoute, useFocused, useApi, isEmpty } from '../../utils'
import { Header, NotFound, LinearBg } from "../components";

export default () => {
    const { t } = useTranslation()
    const api = useApi()
    const { params } = useRoute()
    const withBack = params?.withBack ?? false
    const focused = useFocused()

    return (
        <Div f={1} bg={'primary'}>
            
            {focused && <LinearBg type="primary" />}
            <Header title={t('NOTIFICATIONS')} back={withBack} />

            <Div f={1} rt={24} px={16} pt={16} bg={'light'}>
                {focused && <List
                    fetch={page => api.post('/notifications', { page })}
					autoTrigger={true}
                    render={({ item, index }) => (
                        <Div bg={'white'} mb={8} r={8} shadow={2} p={12} fw>
                            <Div mb={4}>
                                <Div row justify={'between'}>
                                    <Div f={1}>
                                        <Text size={13} lh={15} bold color={'muted'}>
                                            {item.compoundName}
                                        </Text>
                                        {!isEmpty(item.cityName) && (
                                            <Text size={12} lh={12} color={'mutedlight'}>
                                                {item.cityName}
                                            </Text>
                                        )}
                                    </Div>
                                    <Text size={12} lh={15} color={'muted'}>
                                        {moment(item.created_at).format('DD MMM, YY @ HH:mm')}
                                    </Text>
                                </Div>
                            </Div>
                            <Div>
                                <Text>
                                    {item.text}
                                </Text>
                            </Div>
                        </Div>
                    )}
                    empty={(<NotFound text={'No notifications found'} />)}
                />}
            </Div>
        </Div>
    )
}
