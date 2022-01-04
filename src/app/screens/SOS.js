import React from "react";
import { Div, Text, Icon, SIZES, MapImage, Linear, COLORS } from '../../ui'
import { useStore, empty, locate, fade, darken, useTranslation, isRTL } from "../../utils";
import { Header, YouAreAt, SlideToUnlock } from "../components";

export default () => {

    const { t } = useTranslation()
    const { current_property_id } = useStore()

    const [lat, setLat] = React.useState(null)
    const [lng, setLng] = React.useState(null)

    const boot = async () => {
        const pos = await locate()
        setLat(pos.lat)
        setLng(pos.lng)
    }

    React.useEffect(() => { boot() }, [])

    return (
        <Div f={1} bg={'primary'}>
            <Header title={t('SOS')} back more={(
                <YouAreAt />
            )} />
            {(empty(lat) || empty(lng)) ? (
                <Div f={1} rt={30} center bg={'secondary'}>
                    <Text h3 color={'white'}>
                        {t('UNABLE_TO_LOCATE_YOU')}
                    </Text>
                </Div>
            ) : (
                <Div f={1} rt={30}>
                    <Div h={SIZES.width}>
                        <MapImage 
                            lat={lat} lng={lng} w={SIZES.width} h={SIZES.width} 
                            cover rt={30} 
                        />
                        <Linear 
                            fw h={50} bottom
                            colors={[
                                fade(COLORS.secondary, 1),
                                fade(COLORS.secondary, 0.4),
                                COLORS.secondary
                            ]}
                        />
                    </Div>
                    <Div f={1} bg={'secondary'} p={24}>
                        <Div center mb={12}>
                            <Text color={'white'}>
                                Lat: {lat}, Lng: {lng}
                            </Text>
                        </Div>
                        <SlideToUnlock 
                            onEndReached={() => alert('SOS')}
                            sliderElement={
                                <Div 
                                    w={90} h={50} center
                                >
                                    <Linear 
                                        full 
                                        from={COLORS.primary} 
                                        to={darken(COLORS.primary, 0.3)} 
                                        r={10}
                                    />
                                    <Icon name={'arrow-slide'} size={32} color={'white'} noflip />
                                </Div>
                            }
                            containerStyle={{
                                margin: 8,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '95%',
                                padding: 5,
                            }}
                            childrenContainer={{
                                alignSelf: isRTL ? 'flex-start' : 'flex-end',
                                paddingRight: isRTL ? 0 : 70,
                                paddingLeft: isRTL ? 70 : 0,
                            }}
                        >
                            <Text right size={18} bold color={'secondary'}>
                                {t('SLIDE_TO_SOS')}
                            </Text>
                        </SlideToUnlock>
                    </Div>
                </Div>
            )}
        </Div>
    )
}
