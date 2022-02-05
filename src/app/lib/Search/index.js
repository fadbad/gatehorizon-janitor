import React from "react";
import { Div, Text, Icon, Sheet } from '../../../ui'
import { useApi, useTranslation, useDebounce } from '../../../utils'
import { SearchInput, ButtonGroup } from "../../components";
import { Permit, Permanent, Employee } from "../../lib";
import Permits from "./Permits";
import Permanents from "./Permanents";
import Staff from "./Staff";

export default ({
    show, hide
}) => {
    const { t } = useTranslation()
    const api = useApi()
    const ref = React.useRef(null);
    
    const [search, setSearch] = React.useState('')
    const [selected, setSelected] = React.useState('permits')
    const [permit, setPermit] = React.useState({})
    const [showPermit, setShowPermit] = React.useState(false)

    const [loading, setLoading] = React.useState(false);
    const [permits, setPermits] = React.useState([]);
    const [permanents, setPermanents] = React.useState([]);
    const [staff, setStaff] = React.useState([]);

    const PermitComponent = React.useMemo(() => {
        return selected === 'permits' ? Permit : selected === 'permanents' ? Permanent : Employee
    }, [selected])

    const permitHeader = React.useMemo(() => {
        return selected === 'permits' ? t('PERMIT') : selected === 'permanents' ? t('PERMANENT') : t('EMPLOYEE')
    }, [selected])

    const canPerform = search.length < 7 ? false : true

    const doSearch = async () => {
        if(!canPerform) {
            setPermits([])
            setPermanents([])
            setStaff([])
            return false
        }
        setLoading(true)
        const res = await api.post('/permits', { search })
        setLoading(false)
        if(res.result === 'success'){
            setPermits(res.permits ?? [])
            setPermanents(res.permanents ?? [])
            setStaff(res.staff ?? [])
        } else {
            alert(res.message ?? 'Unable to communicate with server')
        }
    }

    React.useEffect(() => {
        show && setTimeout(() => ref?.current?.focus(), 300)
        !show && setSearch('')
    }, [show])

    useDebounce(doSearch, 350, [search]);

    return (
        <Sheet
            show={show} 
            hide={hide}
            scrollable 
            radius={24}
            bg={'light'}
        >   
            <Div row center px={16}>
                <Div f={1} mr={12}>
                    <SearchInput 
                        forwardedRef={ref}
                        type={'number'}
                        onChange={ v => setSearch(v) } 
                        loading={loading}
                    />
                </Div>
                <Icon name={'down'} onPress={hide} />
            </Div>
            <Div px={16} pb={12}>
                <Text size={11} color={'muted'}>
                    Search by mobile number.
                </Text>
            </Div>
            {canPerform && <Div px={16}>
                <ButtonGroup 
                    options={[
                        {
                            value: 'permits', 
                            text: `Permits`,
                            badge: permits?.length
                        },
                        {
                            value: 'permanents', 
                            text: `Permanents`,
                            badge: permanents?.length
                        },
                        {
                            value: 'staff', 
                            text: `Staff`,
                            badge: staff?.length
                        },
                    ]}
                    value={selected}
                    onChange={v => setSelected(v)}
                />
                <Div h={8} />

                {(selected === 'permits') && (
                    <Permits 
                        items={permits}
                        onPress={(v) => {
                            setPermit(v)
                            setShowPermit(true)
                        }}
                    />
                )}

                {(selected === 'permanents') && (
                    <Permanents 
                        items={permanents}
                        onPress={(v) => {
                            setPermit(v)
                            setShowPermit(true)
                        }}
                    />
                )}

                {(selected === 'staff') && (
                    <Staff 
                        items={staff}
                        onPress={(v) => {
                            setPermit(v)
                            setShowPermit(true)
                        }}
                    />
                )}

            </Div>}

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
                                <Text h4>{permitHeader}</Text>
                            </Div>
                            <Icon name={'down'} onPress={() => setShowPermit(false)} />
                        </Div>
                        <PermitComponent 
                            px={24} py={8}
                            item={permit}
                            noHeader={true}
                            onReset={() => setShowPermit(false)}
                        />
                    </Div>
                )}
            </Sheet>
        </Sheet>
    )
}
