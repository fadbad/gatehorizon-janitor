import React from "react";
import { Div, Text, Icon } from '../../ui'
import { moment } from '../../utils'

export default ({ date, ...rest }) => (
    <Div r={8} bg={'white'} size={60} shadow={2} {...rest}>
        <Div bg={'red'} rt={8} center>
            <Text color={'white'} size={12} lh={16} bold>
                {moment(date).format('MMM')}
            </Text>
        </Div>
        <Div f={1} center bg={'white'} rb={8}>
            <Div absolute right={1} top={2}>
                <Text size={9} lh={9} bold color={'mutedlight'}>
                    {moment(date).format('YY')}
                </Text>
            </Div>

            <Text size={18} lh={22} bold color={'secondary'}>
                {moment(date).format('DD')}
            </Text>
            <Text size={12} lh={16} bold color={'secondary'}>
                {moment(date).format('HH:mm')}
            </Text>
        </Div>
    </Div>
)
