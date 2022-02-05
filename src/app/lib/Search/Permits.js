import React from "react";
import { Div, Text, Icon, Image } from '../../../ui'
import { useTranslation, empty, uuid, isEmpty } from '../../../utils'
import Date from "./Date";

const Item = ({ item, onPress }) => {
    const { t } = useTranslation()
    return (
        <Div 
            row bg={'white'} r={8} py={6} px={12} shadow={2} my={4}
            onPress={onPress} activeOpacity={1}
        >
            <Image src={item?.guest?.image} size={48} r={48} />
            <Div f={1} ml={16}>
                <Text>{item?.guest?.name}</Text>
                <Text size={12} color={'muted'}>{item?.guest?.mobile}</Text>
                <Text size={12} bold>{item?.property?.name}</Text>
                {!empty(item.expected_at) && (
                    <Date text={t('EXPECTED_AT')} date={item.expected_at} />
                )}
                {!empty(item.arrived_at) && (
                    <Date text={t('CHECKED_IN_AT')} date={item.arrived_at} />
                )}
                {!empty(item.left_at) && (
                    <Date text={t('CHECKED_OUT_AT')} date={item.left_at} />
                )}
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
