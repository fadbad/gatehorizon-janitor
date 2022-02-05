import React from "react";
import { Div, Text, Icon, Image, SIZES, Modal, Gallery } from '../../ui'
import { useTranslation, useApi } from '../../utils'
import { Btn } from '../components'

export default ({item, code, onReset, noHeader}) => {
    const { t } = useTranslation()
    const api = useApi()
    const type = 'staff'

    const [loadingIn, setLoadingIn] = React.useState(false)
    const [loadingOut, setLoadingOut] = React.useState(false)

    const onCheckIn = async () => {
        setLoadingIn(true)
        const res = await api.post('/check-in-out', {
            mode: 'in',
            id: item?.id,
            type
        })
        setLoadingIn(false)
        if(res.result === 'success'){
            onReset && onReset()
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const onCheckOut = async () => {
        setLoadingOut(true)
        const res = await api.post('/check-in-out', {
            mode: 'out',
            id: item?.id,
            type
        })
        setLoadingOut(false)
        if(res.result === 'success'){
            onReset && onReset()
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const IMGS = [
        {
            url: item.avatar, 
            text: item.name, 
        }
    ]

    const [showZoom, setShowZoom] = React.useState(false)

    return (
        <Div 
            f={1} p={24} 
        > 
            {!noHeader && (<Div mb={12}>
                <Text h3>
                    {t('EMPLOYEE')}
                </Text>
                <Text size={12}>{code}</Text>
            </Div>)} 
            

            <Div scroll>

                <Div row center mb={12}>
                    <Div onPress={() => setShowZoom(true) }>
                        <Image src={item.avatar} size={60} r={60} />
                    </Div>
                    <Div f={1} mx={8}>
                        <Text>{item.name}</Text>
                        <Text>{item.mobile}</Text>
                    </Div>
                </Div>

                {IMGS.map((img, i) => (
                    <Div 
                        bg={'dark'} r={8} center mb={12} key={i} 
                        onPress={() => setShowZoom(true) }
                    >
                        <Image src={img.url} w={SIZES.width - 48} rt={8} />
                        <Text size={12} color={'white'}>
                            {img.text}
                        </Text>
                    </Div>
                ))}

                
            </Div>
            
            <Div pt={12}>
                <Div mb={12} onPress={onCheckIn}>
                    <Btn bg={'primary'} text={t('CHECK_IN')} loading={loadingIn} />
                </Div>
                <Div mb={12} onPress={onCheckOut}>
                    <Btn bg={'cyan'} text={t('CHECK_OUT')} loading={loadingOut} />
                </Div>
            </Div>
            
            <Modal isVisible={showZoom}>
                <Div f={1}>
                    <Gallery 
                        imageUrls={IMGS}
                        index={0}
                        onSwipeDown={() => setShowZoom(false)}
                    />
                    <Div 
                        absolute top={34} right={10} 
                        onPress={() => setShowZoom(false)}
                    >
                        <Icon name={'close'} size={24} color={'#ffffff65'} />
                    </Div>

                </Div>
            </Modal>
        </Div>
    )
}
