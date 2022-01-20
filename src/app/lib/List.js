import React from "react";
import { Div, Text, Icon, Image, Sheet, List } from '../../ui'
import { useApi, useTimedToggle, moment, useTranslation, useDebounce } from '../../utils'
import { SearchInput } from "../components";
import Permit from './Permit'

const PermitItem = ({ item, onPress }) => {
    const { t } = useTranslation()
    return (
        <Div 
            row bg={'white'} r={8} py={6} px={16} shadow={2} mx={12} my={4}
            onPress={onPress} activeOpacity={1}
        >
            <Image src={item?.guest?.image} size={48} r={48} />
            <Div f={1} ml={16}>
                <Text>{item?.guest?.name}</Text>
                <Text size={12} color={'muted'}>{item?.guest?.mobile}</Text>
                <Text size={12} bold>{item?.property?.name}</Text>
                <Div row>
                    <Text color={'muted'} size={12}>
                        {t('CHECKED_IN_AT')}:
                    </Text>
                    <Text ml={4} bold size={12}>
                        {moment(item.arrived_at).format('DD MMM, YY @ HH:mm')}
                    </Text>
                </Div>
            </Div>
        </Div>
    )
}

export default ({
    show, hide, onCheckOut, loadingOut
}) => {
    const { t } = useTranslation()
    const api = useApi()
    const [reload, doReload] = useTimedToggle()
    const [search, setSearch] = React.useState('')
    const [permit, setPermit] = React.useState({})
    const [showPermit, setShowPermit] = React.useState(false)

    React.useEffect(() => {
        show && doReload()
    }, [show])

    useDebounce(doReload, 350, [search]);

    return (
        <Sheet
            show={show} 
            hide={hide}
            scrollable 
            radius={24}
            bg={'light'}
        >   
            <Div row center px={16} py={4}>
                <Div f={1}>
                    <Text h4>{t('NOT_CHECKOUT_PERMITS')}</Text>
                </Div>
                <Icon name={'down'} onPress={hide} />
            </Div>
            <Div mx={16}>
                <SearchInput onChange={ v => setSearch(v) } />
            </Div>
            <List 
                fetch={page => api.post('permits', { page, search })}
                autoTrigger={false}
                render={({ item, index }) => (
                    <PermitItem item={item} onPress={() => {
                        setPermit(item)
                        setShowPermit(true)
                    }} />
                )}
                empty={(<Text my={36} center>{t('NO_PERMITS_FOUND')}</Text>)}
                reload={reload}
            />

            <Sheet
                show={showPermit} 
                hide={() => setShowPermit(false)}
                scrollable 
                inset={120}
                radius={24}
                bg={'light'}
            >
                {showPermit && (
                    <Div f={1}>
                        <Div row center px={24}>
                            <Div f={1}>
                                <Text h4>{t('PERMIT')}</Text>
                            </Div>
                            <Icon name={'down'} onPress={() => setShowPermit(false)} />
                        </Div>
                        <Permit 
                            px={24} py={8}
                            item={permit}
                            onCheckOut={onCheckOut}
                            loadingOut={loadingOut}
                            noHeader={true}
                        />
                    </Div>
                )}
            </Sheet>
        </Sheet>
    )
}
