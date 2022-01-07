import React from "react";
import { Div, Text, Icon, Image, SIZES, Modal, Gallery } from '../../ui'
import { useTranslation, isEmpty } from '../../utils'
import Btn from './Btn'

export default ({item, code, onAccept, onReject, loadingAccept}) => {
    const { t } = useTranslation()
    const user = item?.user ?? {}
    const property = item?.property ?? {}

    const IMGS = [
        {
            url: item.image, 
            text: item.name, 
        }
    ]

    const [showZoom, setShowZoom] = React.useState(false)

    return (
        <Div 
            f={1} p={24} 
        > 
            <Div mb={12}>
                <Text h3>
                    {t('PERMANENT_GUEST')}
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
                    <Div onPress={() => setShowZoom(true) }>
                        <Image src={item.image} size={60} r={60} />
                    </Div>
                    <Div f={1} mx={8}>
                        <Text>{item.name}</Text>
                        <Text>{t(item?.relation?.toUpperCase())}</Text>
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
            
            <Div py={12} row center>
                <Div f={1} onPress={onReject}>
                    <Btn bg={'red'} text={t('REJECT')} />
                </Div>
                <Div w={12} />
                <Div f={1} onPress={onAccept}>
                    <Btn bg={'primary'} text={t('ACCEPT')} loading={loadingAccept} />
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
