import React from "react";
import { Div, Text, Icon, Image, List } from '../../ui'
import { useTranslation, useDebounce, useApi, useRoute, useStore, useTimedToggle, empty, useFocused } from "../../utils";
import { Header, LinearBg, NotFound, AddGuest, Guest, SearchInput } from "../components";

const Item = ({ item, onPress }) => (
    <Div 
        row center bg={'white'} r={8} h={60} px={6} shadow={2} my={4}
        onPress={onPress} activeOpacity={1}
    >
        <Image src={item.image} size={48} r={48} />
        <Div f={1} ml={16}>
            <Text>{item.name}</Text>
            <Text size={12} color={'muted'}>{item.mobile}</Text>
        </Div>
    </Div>
)

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { current_property_id } = useStore()
    const focused = useFocused()

    const { params } = useRoute()
    const withBack = params?.withBack ?? false

    const [showAdd, setShowAdd] = React.useState(false)
    const [guest, setGuest] = React.useState({})
    const [showGuest, setShowGuest] = React.useState(false)
    
    const [prepend, setPrepend] = React.useState(null)
    const __add = v => {
        setPrepend(v)
        setTimeout(() => setPrepend(null), 100)
    }
    
    const [deleteId, setDeleteId] = React.useState(null)
    const __delete = async (id) => {
        const res = await api.post('delete-guest', { id })
        if(res.result === 'success'){
            setDeleteId(id)
            setTimeout(() => setDeleteId(null), 100)
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const [reload, doReload] = useTimedToggle()
    const [search, setSearch] = React.useState('')

    useDebounce(doReload, 200, [search, focused]);

    return (
        <Div f={1} bg={'secondary'} keyboarddismiss>
            {focused && <LinearBg type="secondary" />}
            <Header 
                back={withBack}
                title={t('GUESTS')}
                right={empty(current_property_id) ? null : (
                    <Icon 
                        name={'plus'} size={32} color={'white'}
                        onPress={() => setShowAdd(true)}
                    />
                )} 
            />

            <Div px={24} rt={24} bg={'primary'}>
                <SearchInput onChange={ v => setSearch(v) } />
            </Div>


            <Div f={1} px={16} pt={16} bg={'light'} keyboarddismiss>
                
                <Div absolute top={0} left={0} right={0} h={48} bg={'primary'}>
                    <Div absoluteFill bg={'light'} rt={24} />
                </Div>

                {focused && (<List
                    fetch={page => api.post('guests', { page, search })}
					autoTrigger={false} // triggers on useDebounce
                    render={({ item, index }) => (
                        <Item 
                            item={item} 
                            onDelete={() => __delete(item.id)} 
                            onPress={() => {
                                setShowGuest(true)
                                setGuest(item)
                            }} 
                        />
                    )}
                    empty={(<NotFound text={'No guests found'} />)}
                    reload={reload}
                    prepend={prepend}
                    deleteId={deleteId}
                />)}
            </Div>

            <AddGuest 
                show={showAdd} 
                hide={() => setShowAdd(false)} 
                onChange={(v) => __add(v)} 
            />

            <Guest 
                item={guest} 
                bg={'primary'} 
                show={showGuest} 
                onDelete={__delete}
                hide={() => {
                    setShowGuest(false)
                    setGuest({})
                }} 
            />
        </Div>
    )
}
