import React from "react";
import { Div, Text, Icon, Image } from '../../../ui'
import { useTranslation, empty, moment } from '../../../utils'

export default ({ text, date, ...rest }) => {
    const { t } = useTranslation()
    return (
        <Div row {...rest}>
            <Text color={'muted'} size={12}>
                {text}:
            </Text>
            <Text ml={4} bold size={12}>
                {moment(date).format('DD MMM, YY @ HH:mm')}
            </Text>
        </Div>
    )
}
