import React from 'react'
import { IMAGES } from "../app/assets";
import Image from './Image'
import Div from './Div'
import Text from './Text'
import { useNavigation, useTranslation } from '../utils'



export default ({title}) => {
    const nav = useNavigation()
	const { t } = useTranslation()

	const MSGS = [
		t('NO_ITEMS_1'),
		t('NO_ITEMS_2'),
		t('NO_ITEMS_3'),
		t('NO_ITEMS_4'),
	]

    return (
        <Div f={1} center mx={50}>

            <Image src={IMAGES.no} h={100} />

            {(title) && (
                <Div mt={24}>
                    <Text bold center size={16}>{title}</Text>
                </Div>
            )}

            <Text center mt={12}>
                {
                    MSGS[Math.floor(Math.random()*MSGS.length)]
                }
            </Text>
            
            <Div mt={30}>
                <Div bg={'red'} px={16} py={8} r={4}
                    onPress={() => nav.navigate('Home')}
                >
                    <Text color={'#fff'} bold>
						{t('ORDER_NOW')}
					</Text>
                </Div>
            </Div>
        </Div>
    )
}
