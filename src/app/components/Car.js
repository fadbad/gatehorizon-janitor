import { t } from "i18next";
import React from "react";
import { Div, Text, Icon } from '../../ui'
import { isRTL, isEmpty } from '../../utils'

export default ({ car, size = 15, ...rest }) => {

    const make = isRTL ? (car.make?.ar ?? '') : (car.make?.en ?? '')
    const type = isRTL ? (car.type?.ar ?? '') : (car.type?.en ?? '')
    const color = isRTL ? (car.color?.ar ?? '') : (car.color?.en ?? '')
    const plate = car?.plate ?? ''
    const year = car?.year ?? ''

    const top = [ make, type, color ]
    const top_filtered = top.filter(e => e)
    const top_display = top_filtered.join(' - ')

    return (
        <Div {...rest}>
            <Text size={size} lh={size} mb={3}>{top_display}</Text>
            <Div row align={'center'}>
                {!isEmpty(plate) && (
                    <Text size={size - 2} lh={size - 2} color={'muted'} mr={8}>
                        # {plate}
                    </Text>
                )}

                {!isEmpty(year) && (
                    <Text size={size - 2} lh={size - 2} color={'muted'} mr={8}>
                        {t('CAR_YEAR')}: {year}
                    </Text>
                )}
            </Div>
        </Div>
    )
}
