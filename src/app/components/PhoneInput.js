import React from "react";
import { FlatList } from 'react-native'
import { Div, Text, Icon, Image, Flag, Modal } from '../../ui'
import { _, isRTL, validPhone, countriesJson, country_code_by_iso, fuse, useReducer, useTranslation } from '../../utils'

import SearchInput from "./SearchInput";
import Input from './Input'

const dropDown =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";

const Item = ({country, i, setState}) => (
    <Div 
        row center key={`country-${i}`} py={6} px={16} bb
        onPress={() => setState({
            allCountries: countriesJson,
            code: country.code,
            showModal: false
        })}
    >
        <Flag name={country.code} />
        <Div f={1} mx={12}>
            <Text>{isRTL ? country.ar : country.en}</Text>
            <Text size={12}>{isRTL ? country.en : country.ar}</Text>
        </Div>
        <Icon name={'right'} color={'muted'} size={16} />
    </Div>
)

export default ({code = 'sa', number, label, onChange, forwardedRef}) => {
    const {t} = useTranslation()
    const LIST = React.useRef()

    const scrollToTop = () => {
        LIST.current?.scrollToOffset({offset: 0, animated: true})
    }

    const getSortedCountries = _.sortBy(countriesJson, o => isRTL ? o.ar : o.en)

    const [state, setState] = useReducer({
        showModal: false,
        code: code,
        dialCode: '966',
        allCountries: getSortedCountries,
        error: ''
    })

    React.useEffect(() => {
        setState({ dialCode: country_code_by_iso(state.code)})
    }, [state.code]) 

    return (
        <>
        
        <Input 
            type={'phone'}
            autoCorrect={false}
            forwardedRef={forwardedRef}
            prefix={state.dialCode}
            label={label}
            value={number}
            error={state.error}
            onChange={v => {
                const num = `${state.dialCode}${v}`
                const valid = validPhone(num, state.code)
                let error
                if(!valid){
                    error = t('INVALID_PHONE_NUMBER')
                } else {
                    error = ''
                }
                setState({error})
                onChange && onChange(num, error)
            }}

            left={() => (
                <Div row center onPress={() => setState({showModal: true})} mt={16} mr={12}>
                    <Flag name={state.code} />
                    <Image src={dropDown} size={12} color={'muted'} />
                </Div>
            )}
        />

        <Modal isVisible={state.showModal}>
            <Div f={1} safe bg={'secondary'}>
                <Div row center px={16}>
                    <Div f={1}>
                        <SearchInput 
                            color={'white'}
                            onChange={v => {
                                if(v.length){
                                    const newData = fuse(countriesJson, ['en', 'ar', 'code']).search(v)
                                    setState({allCountries: newData})
                                } else {
                                    setState({allCountries: countriesJson})
                                }
                                scrollToTop()
                            }}
                        />
                    </Div>
                    <Icon name={'down'} color={'white'} size={16} ml={16} onPress={() => setState({showModal: false})} />
                </Div>
                <Div bg={'light'} f={1}>
                    <Div scroll forwardedRef={LIST}>
                        {state.allCountries.map((item, index) => (
                            <Item 
                                key={item.code}
                                country={item} 
                                i={index} 
                                setState={setState} 
                            />
                        ))}
                    </Div>

                </Div>
            </Div>
        </Modal>
        </>
    )
}
