import React from "react";
import { Div, Text, Icon, Image, SIZES, Modal, Gallery } from '../../ui'
import { useTranslation, isEmpty } from '../../utils'
import DateCal from "./DateCal";
import Btn from "./Btn";

export default ({item, code, onAccept, onReject}) => {
    const { t } = useTranslation()
    const user = item?.user ?? {}
    const property = item?.property ?? {}
    const guest = item?.guest ?? {}
    const images = guest.images ?? []

    const IMGS = []
    IMGS.push({
        url: guest.image, 
        text: guest.name, 
    })
    !isEmpty(images.id_front) && IMGS.push({
        url: images.id_front, 
        text: t('ID_FRONT'),
    })
    !isEmpty(images.id_back) && IMGS.push({
        url: images.id_back, 
        text: t('ID_BACK'), 
    })
    !isEmpty(images.passport) && IMGS.push({
        url: images.passport, 
        text: t('PASSPORT'), 
    })
    !isEmpty(images.passport_visa) && IMGS.push({
        url: images.passport_visa, 
        text: t('PASSPORT_VISA'), 
    })

    const [showZoom, setShowZoom] = React.useState(false)
    const [index, setIndex] = React.useState(0)

    return (
        <Div 
            f={1} p={24} 
            // onPress={() => setProcess('idle')}
        > 
            <Div mb={12}>
                <Text h3>
                    {t('PERMIT')}
                </Text>
                <Text size={12}>{code}</Text>
            </Div>  
            

            <Div scroll>  

                <Div row center bg={'white'} r={8} p={12} mb={12}>
                    <Image src={user.avatar} size={48} r={48} />
                    <Div f={1} ml={8}>
                        <Div row justify={'between'}>
                            <Div>
                                <Text>{user.name}</Text>
                                <Text>{user.mobile}</Text>
                            </Div>
                            <Text>{property.name}</Text>
                        </Div>
                    </Div>
                </Div>

                <Div row center mb={12}>
                    <Div onPress={() => {
                        setIndex(0)
                        setShowZoom(true)
                    }}>
                        <Image src={guest.image} size={60} r={60} />
                    </Div>
                    <Div f={1} mx={8}>
                        <Text>{guest.name}</Text>
                        <Text>{!guest.above18 ? t('UNDER_18_YEARS') : t(guest?.type?.toUpperCase())}</Text>
                        <Text>{guest.mobile}</Text>
                    </Div>
                    <DateCal date={item?.expected_at} />
                </Div>

                {!isEmpty(item.reason) && (
                    <Div mb={12}>
                        <Text>{t('REASON')}: {item.reason}</Text>
                    </Div>
                )}

                {IMGS.map((img, i) => (
                    <Div 
                        bg={'dark'} r={8} center mb={12} key={i} 
                        onPress={() => {
                            setIndex(i)
                            setShowZoom(true)
                        }}
                    >
                        <Image src={img.url} w={SIZES.width - 48} rt={8} />
                        <Text size={12} color={'white'}>
                            {img.text}
                        </Text>
                    </Div>
                ))}

                
            </Div>
            
            <Div py={12} row center>
                <Div f={1} onPress={onReject}>
                    <Btn bg={'red'} text={t('REJECT')} />
                </Div>
                <Div w={12} />
                <Div f={1} onPress={onAccept}>
                    <Btn bg={'primary'} text={t('ACCEPT')} />
                </Div>
            </Div>
            
            <Modal isVisible={showZoom}>
                <Div f={1}>
                    <Gallery 
                        imageUrls={IMGS}
                        index={index}
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
