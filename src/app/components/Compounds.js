import React from "react";
import { Div, Text, Icon, Image, Sheet, List, Spinner } from '../../ui'
import { useStore, useApi, useTimedToggle, useTranslation } from '../../utils'

export default ({item, show, hide}) => {
    const api = useApi()
    const { t } = useTranslation()
    const [reload, doReload] = useTimedToggle()

    React.useEffect(() => {
        if(show) doReload()
    }, [show])

    return (
        <Sheet
            scrollable
            show={show}
            hide={hide}
            bg={'light'}
            radius={24}
        >
            <Div f={1}>
                <Div row center px={24} py={12} bb>
                    <Div f={1}>
                        <Text h4>
                            {t('SUPPORTED_COMPOUNDS')}
                        </Text>
                    </Div>
                    <Icon name={'down'} onPress={hide} />
                </Div>
                <Div p={24}>
                    <List 
                        fetch={page => api.post('get-compounds', { page })}
                        autoTrigger={false}
                        render={({ item, index }) => (
                            <Div bb py={6} mb={6} row center>
                                <Image src={item.avatar} size={48} r={48} />
                                <Div f={1} ml={8}>
                                    <Text>{item.fullName}</Text>
                                    <Text color={'muted'} size={13}>
                                        {item.phone}
                                    </Text>
                                </Div>
                            </Div>
                        )}
                        empty={(<Div><Text>{t('NO_COMPOUNDS_FOUND')}</Text></Div>)}
                        reload={reload}
                    />
                </Div>
            </Div>
        </Sheet>
    )
}
