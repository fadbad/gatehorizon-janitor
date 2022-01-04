import React from 'react'
import { Platform, TextInput, FlatList, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import axios from 'axios';
import Config from '../../Config'
import { Box, Text } from "src/ui/design";
import { useReducer, useDebounce } from '../hooks';
import { isEmpty, uuid, isRTL } from "./functions";

const GKEY = Config.GOOGLE_MAPS

const GooglePlacesRow = ({item, onPress}) => {
    const [loading, setLoading] = React.useState(false)

    const fetchRow = async (place_id) => {
        const res = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${GKEY}`)
        if(res.status >= 200 && res.status < 400){
            return res.data.result
        }
        return []
    }

    return (
        <Box row center p={8} bb
            onPress={async () => {
                setLoading(true)
                const details = await fetchRow(item.place_id)
                setLoading(false)
                onPress && onPress( 
                    details.geometry.location.lat, 
                    details.geometry.location.lng, 
                    item.description || details.formatted_address,
                    details.geometry 
                )
            }}
        >
            {loading && (<Box mr={5}><ActivityIndicator size={'small'} /></Box>)}
            <Box f={1}>
                <Text lines={1} size={18}>
                    {item.description || item.formatted_address || item.name}
                </Text>
            </Box>
            
        </Box>
    )
}

export default GooglePlaces = ({style, textStyle, onPress, autoFocus, placeholder}) => {
    const [state, setState] = useReducer({ text: '', rows: [], show: false, loading: false })
    const TEXTREF = React.useRef()

    const req = async (text) => {
        setState({loading: true})
        const input = encodeURIComponent(text)
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GKEY}`
        const res = await axios.get( url )
        setState({loading: false})
        if(res.status >= 200 && res.status < 400){
            setState({rows: res.data.predictions || []})
        }
    }

    const __text = useDebounce(state.text, 500)
    React.useEffect(() => {
        if(__text && __text.length > 2) {
            setState({show: true})
            req(__text)
        } else {
            setState({show: false})
        }
    }, [__text])

    return (
        <Box fw>
            <Box h={44} bg={'#fff'} radius={5} b px={10} py={5} style={style} row center>
                <TextInput 
                    ref={TEXTREF}
                    editable={true}
                    returnKeyType={'search'}
                    keyboardAppearance={'default'}
                    autoFocus={autoFocus || false}
                    autoCorrect={false}
                    value={state.text}
                    placeholder={placeholder || 'Search Location'}
                    onSubmitEditing={() => {}}
                    placeholderTextColor={'#A8A8A8'}
                    underlineColorAndroid={'transparent'}
                    // clearButtonMode={"while-editing"}
                    onChangeText={ text => setState({ text }) }
                    style={[{
                        minHeight: 28,
                        padding: 8,
                        fontSize: 15,
                        flex: 1,
                        ...Platform.select({
                            android: { textAlign: isRTL ? 'right' : 'left' },
                            ios: { writingDirection: isRTL ? 'rtl' : 'ltr' },
                        }),
                    }, textStyle]}
                />
                {state.loading && (<ActivityIndicator size={'small'} />)}
            </Box>
            {(state.show && !isEmpty(state.rows)) && (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    scrollEnabled={true}
                    style={[]}
                    data={state.rows}
                    keyExtractor={() => uuid()}
                    renderItem={({ item }) => <GooglePlacesRow item={item} onPress={onPress} /> }
                />
            )}
        </Box>
    )
}
