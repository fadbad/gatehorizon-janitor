import React from "react";
import { Div, Text, Icon, Image, List, SIZES } from '../../ui'
import { useStore, useTranslation, moment, useApi, useDebounce, useRoute, empty, isEmpty, useTimedToggle, useFocused } from '../../utils'
import { Header, LinearBg, NotFound, YouAreAt, AddPermit, SearchInput, Permit, DateCal } from "../components";

const Item = ({ item, onPress }) => {
    return (
        
        <Div row center my={4}>
            <DateCal date={item?.expected_at} mr={4} />
            
            <Div 
                row center bg={'white'} r={8} h={60} px={6} shadow={2}
                onPress={onPress} activeOpacity={1} f={1}
            >
                <Image src={item?.guest?.image} size={48} r={48} />
                <Div f={1} ml={16}>
                    <Div >
                        <Text bold>{item?.guest?.name}</Text>
                        <Text size={12} lh={14} color={'muted'}>
                            {item?.guest?.mobile}
                        </Text>
                    </Div>
                    {!isEmpty(item.reason) && (
                        <Text size={12} lh={16} lines={1} w={SIZES.width - 172}>
                            {item.reason}
                        </Text>
                    )}
                </Div>
            </Div>
            
        </Div>
    )
}

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { current_property_id } = useStore()
    const focused = useFocused()

    const { params } = useRoute()
    const withBack = params?.withBack ?? false

    const [showAdd, setShowAdd] = React.useState(false)

    const [permit, setPermit] = React.useState({})
    const [showPermit, setShowPermit] = React.useState(false)

    const [prepend, setPrepend] = React.useState(null)
    const __add = v => {
        setPrepend(v)
        setTimeout(() => setPrepend(null), 100)
    }
    
    const [deleteId, setDeleteId] = React.useState(null)
    const __delete = async (id) => {
        const res = await api.post('delete-permit', { id })
        if(res.result === 'success'){
            setDeleteId(id)
            setTimeout(() => setDeleteId(null), 100)
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const [reload, doReload] = useTimedToggle()
    const [search, setSearch] = React.useState('')

    useDebounce(doReload, 200, [search, current_property_id, focused]);

    return (
        <Div f={1} bg={'secondary'} keyboarddismiss>
            {focused && <LinearBg type="primary" />}
            <Header 
                back={withBack}
                title={t('PERMITS')}
                right={empty(current_property_id) ? null : (<Icon name={'plus'} size={32} color={'white'} onPress={() => setShowAdd(true)} />)} 
                more={(<YouAreAt />)}
            />
            <Div px={24} rt={24} bg={'secondary'}>
                <SearchInput onChange={ v => setSearch(v) } color={'white'} />
            </Div>

            <Div f={1} rt={24} pt={16} px={16} bg={'light'}>

                <Div absolute top={0} left={0} right={0} h={48} bg={'secondary'}>
                    <Div absoluteFill bg={'light'} rt={24} />
                </Div>

                {focused && <List
                    fetch={page => api.post('permits', { page, search, property_id: current_property_id })}
					autoTrigger={false} // triggers on useDebounce
                    render={({ item, index }) => (
                        <Item 
                            item={item} 
                            onDelete={() => __delete(item.id)} 
                            onPress={() => {
                                setPermit(item)
                                setShowPermit(true)
                            }}
                        />
                    )}
                    reload={reload}
                    empty={(<NotFound text={'No permits found'} />)}
                    prepend={prepend}
                    deleteId={deleteId}
                />}
            </Div>

            <Permit 
                item={permit} 
                show={showPermit} 
                hide={() => {
                    setShowPermit(false)
                    setPermit({})
                }} 
                onDelete={__delete}
            />

            <AddPermit 
                show={showAdd} 
                hide={() => setShowAdd(false)} 
                onChange={(v) => __add(v)} 
            />
        </Div>
    )
}
