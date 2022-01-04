import React from 'react'
import { Div, Text, Icon, Image } from '../../ui'
import { empty, useStore } from '../../utils'

export default () => {
    const { user } = useStore()

    return (
        <Div z={2}>
            <Div safe barcolor={'light'}>
                <Div h={80} row mx={24} center>
                    <Div size={40}>
                        <Image src={'logo'} size={40} contain color={'white'} />
                    </Div>
                    <Div f={1} align={'end'}>
                        <Div row align={'center'} justify={'end'}>
                            <Div align={'end'}>
                                <Text color={'white'} size={18}>
                                    {user.name}
                                </Text>
                                <Text color={'white'} size={14} lh={14}>
                                    {user.compoundName}
                                </Text>

                            </Div>
                            <Icon name={'user'} color={'primary'} size={40} ml={12} />
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
    )
}
