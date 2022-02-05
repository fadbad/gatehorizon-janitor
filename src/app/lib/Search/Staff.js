import React from "react";
import { Div, Text, Icon, Image } from '../../../ui'
import { useTranslation, empty, uuid, isEmpty } from '../../../utils'

const Item = ({ item, onPress }) => {
    const { t } = useTranslation()
    console.log(item)
    return (
        <Div 
            row bg={'white'} r={8} py={6} px={12} shadow={2} my={4}
            onPress={onPress} activeOpacity={1}
        >
            <Image src={item?.avatar} size={48} r={48} />
            <Div f={1} ml={16}>
                <Text>{item?.name}</Text>
                <Text size={12} color={'muted'}>{item?.mobile}</Text>
            </Div>
        </Div>
    )
}

export default ({ items, onPress }) => {
    const { t } = useTranslation()
    return isEmpty(items) ? (
        <Div center py={50}>
            <Text>{t('NO_ITEMS_FOUND')}</Text>
        </Div>
    ) : (
        <Div>
            {items.map((item, index) => (
                <Item key={uuid()} item={item} onPress={() => onPress(item)} />
            ))}
        </Div>
    )
}
