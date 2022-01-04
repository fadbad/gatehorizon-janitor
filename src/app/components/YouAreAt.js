import React from "react";
import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
} from 'react-native-reanimated';
import { 
    Div, Text, Icon, Image, SIZES,
    Sheet, List,
    IconComponent, DivComponent,
} from '../../ui'
import { isEmpty, useStore, useTranslation } from "../../utils";
import Properties from './Properties'

const IconAnim = Animated.createAnimatedComponent(IconComponent)
const DivAnim = Animated.createAnimatedComponent(DivComponent)

export default React.memo(({ text, rest }) => {
    const { 
        user_properties,
        user_property, 
        set_current_property,
        delete_current_property
    } = useStore()

    const { t } = useTranslation()

    const [open, setOpen] = React.useState(false)
    const [showProperties, setShowProperties] = React.useState(false)

    const rot = useDerivedValue(() => {
        return withSpring(open ? 180 : 0);
    })
    
    const arrowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate:  `${rot.value}deg` }],
        };
    }, [open]);

    return (
        <Div mb={24} {...rest}>    
            {!isEmpty(text) && (
                <Text color={'white'} mb={4} size={12}>
                    {text}
                </Text>
            )}
            <Div>
                <Div 
                    bg={'white'} h={36} r={5} px={12}
                    row center shadow={2}
                    onPress={() => setOpen(v => !v)}
                >
                    {!isEmpty(user_property) ? (
                        <Div row align={'center'} f={1}>
                            <Icon name={'pin'} size={24} color={open ? 'primary' : 'muted'} />
                            <Div ovh f={1} ml={6}>
                                <Text lh={16}>
                                    {user_property.compoundName}, {user_property.name}
                                </Text>
                                <Text color={'muted'} size={12} lh={12}>
                                    {user_property.cityName}
                                </Text>
                            </Div>
                        </Div>
                    ) : (
                        <Div f={1}>
                            <Text>{t('__SELECT__')}</Text>
                        </Div>
                    )}
                    
                    <IconAnim 
                        name={'down'} size={18} color={'muted'} 
                        style={[arrowStyle]} ml={6}
                    />

                </Div>

                {open && (
                    <DivAnim 
                        absolute top={36 + 3} left={0} right={0} fw
                    >
                        <Div fw bg={'white'} r={5} shadow={2} px={12}>
                            
                            {user_properties.map((p, i) => (
                                <Div key={`properties-list-${i}`}
                                    h={50} row center bb
                                    onPress={() => {
                                        set_current_property(p)
                                        setOpen(false)
                                    }}
                                >
                                    {/* <Icon name={'pin'} size={24} /> */}
                                    <Image src={p.compound?.avatar} size={24} r={24} />
                                    <Div f={1} ml={6}>
                                        <Text lh={16}>
                                            {p.compoundName}, {p.name}
                                        </Text>
                                        <Text color={'muted'} size={12}>
                                            {p.cityName}
                                        </Text>
                                    </Div>
                                    <Icon name={'right'} size={18} color={'muted'} />
                                </Div>

                            ))}

                            <Div h={42} justify={'center'}
                                onPress={() => setShowProperties(true)}
                            >
                                <Text size={13} color={'muted'}>{t('MANAGE_YOUR_PROPERTIES')}</Text>
                            </Div>

                            {/* DEV ONLY PURPOSE */}
                            {/* <Div 
                                px={12} py={3} r={8} mb={12} bg={'red'}
                                onPress={() => {
                                    delete_current_property()
                                    setOpen(false)
                                }}>
                                <Text color={'#fff'} size={12} bold center>
                                    DELETE (DEV VIEW ONLY)
                                </Text>
                            </Div> */}
                            {/* END DEV ONLY PURPOSE */}

                        </Div>
                    </DivAnim>
                )}

            </Div>
            
            <Properties 
                show={showProperties}
                hide={() => setShowProperties(false)}
            />
        </Div>
    )
})
