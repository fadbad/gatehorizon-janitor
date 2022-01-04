import { t } from "i18next";
import React from "react";
import { Div, Text, Icon, Image, Sheet, List, Spinner } from '../../ui'
import { useStore, isEmpty } from '../../utils'
import Compounds from './Compounds'

export default ({show, hide}) => {

    const { 
        fetch_user_properties, 
        user_properties,
        set_current_property,
    } = useStore()

    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [showCompounds, setShowCompounds] = React.useState(false)

    const boot = async () => {
        console.log('START')
        setLoading(true)
        const items = await fetch_user_properties()
        setData(items)
        setLoading(false)
    }

    React.useEffect(() => {
        if(show) boot()
    }, [show])

    return (
        <Sheet
            show={show}
            hide={hide}
            bg={'light'}
            radius={24}
        >
            <Div row center px={24} py={12} bb>
                <Div f={1}>
                    <Text h4>Your Properties</Text>
                </Div>
                <Icon name={'down'} onPress={hide} />
            </Div>
                
            <Div px={24} py={12}>
                <Div mb={12}>
                    <Text>
                        {t('FETCHING_OUR_SUPPORTED_COMPOUNDS')}
                    </Text>
                    <Div onPress={() => setShowCompounds(true)}>
                        <Text color={'blue'} bold>
                            {t('VIEW_OUR_SUPPORTED_COMPOUNDS')}
                        </Text>
                    </Div>
                </Div>
                {loading ? (
                    <Div py={24} center><Spinner /></Div>
                ) : isEmpty(data) ? (
                    <Div>
                        <Text>
                            {t('NO_PROPERTY_ASSIGNED')}
                        </Text>
                    </Div>
                ) : (
                    <Div>
                        {data.map((item, index) => (
                            <Div key={`pp-${index}`} bb py={6} mb={6} row center>
                                <Image src={item?.compound?.avatar} size={48} r={48} />
                                <Div f={1} ml={8}>
                                    <Text>{item.fullName}</Text>
                                </Div>
                            </Div>
                        ))}
                    </Div>
                )}
            </Div>

            <Compounds 
                show={showCompounds} 
                hide={() => setShowCompounds(false)} 
            />
        </Sheet>
    )
}
