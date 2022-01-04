import React from "react";
import { Div, Text, Icon, Image, Sheet, List } from '../../ui'
import { useStore, useTranslation, useApi, useTimedToggle} from '../../utils'

export default ({item, show, hide, onDelete}) => {

    const { t } = useTranslation()
    const api = useApi()
    const { current_property_id } = useStore()
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
            {show && <Div px={24} py={12} f={1}>
                <Div row center>
                    <Image src={item.image} size={64} r={64} />
                    <Div f={1} ml={24}>
                        <Text size={24} lh={24} bold>{item.name}</Text>
                        <Text size={16}>{item.mobile}</Text>
                        <Text size={16}>{t(item?.relation?.toUpperCase())}</Text>
                    </Div>

                    <Div absolute right={0} top={0} onPress={hide}>
                        <Icon name={'close-filled'} size={24} color={'muted'} />
                    </Div>
                </Div>
                <Div f={1} my={12} r={24}>
                    <List 

                    />
                </Div>
                <Div center onPress={() => {
                    onDelete && onDelete(item.id)
                    hide && hide()
                }}>
                    <Text color={'red'}>{t('DELETE')}</Text>
                </Div>
            </Div>}
        </Sheet>
    )
}
