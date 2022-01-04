import React, {useEffect, useRef} from 'react';
import { View, Animated } from 'react-native';
import RefreshControl from './RefreshControl';
import _ from 'lodash'
import Spinner from './Spinner'

const useReducer = (defaults = {}) => {
    const [state, setState] = React.useReducer((o, n) => ({...o, ...n}), defaults)
    return [state, setState]
}
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const List = ({
    fetch, 
    data, 
    render, 
    header, 
    footer, 
    empty, 
    columns, 
    horizontal, 
    style, 
    color, 
    reload, 
    trigger, 
    autoTrigger, 
    scrollToTop,
    itemHeight, 
    footerHeight, 
    id, 
    spinnerSize, 
    onScroll,
    callback,
    flex,
    noPagination,
    contentContainerStyle,
    prepend,
    append,
    deleteId,
    ...rest
}) => {
    const LISTREF = useRef(null)
    const [state, setState] = useReducer({
        data: data || [], page: 1, total: 1, loaded: false, loadingMore: false,
    })

    color = color || '#000';

    const fetchData = async (page = 1) => {
        if(data) {
            setState({data, loaded: true})
            return
        }

        const res = await fetch(page);
        if(noPagination){
            setState({
                data: page > 1 ? [...state.data, ...res] : res,
                page: page,
                total: 1,
                loaded: true
            })
    
            const DATA = res || []
            callback && callback({
                page,
                total: DATA.length || 0,
                total_pages: 1,
            })
        } else {
            setState({
                data: page > 1 ? [...state.data, ...res.data] : res.data,
                page: page,
                total: parseInt(res.last_page || 1),
                loaded: true
            })
    
            const DATA = res.data || []
            callback && callback({
                page,
                total: res.total || DATA.length || 0,
                total_pages: res.last_page || 1,
            })
        }
    }

    const loadNext = async () => {
        if(state.total <= state.page) return;
        setState({loadingMore: true})
        await fetchData(state.page + 1)
        setState({loadingMore: false})
        console.log('LOADING NEXT', state.page + 1)
    }

    const __scrollToTop = () => {
        LISTREF.current && LISTREF.current.scrollToOffset({animated: true, offset: 0});
    }

    const __reload = async () => {
        __scrollToTop()
        await delay(100)
        await fetchData()
    }

    useEffect(() => { data && fetchData() }, [data])
    useEffect(() => { scrollToTop && __scrollToTop() }, [scrollToTop])
    useEffect(() => { reload && __reload() }, [reload])
    useEffect(() => { autoTrigger && fetchData() }, [])
    useEffect(() => { 
        if(trigger){
            setState({loaded: false})
            fetchData()
        }   
    }, [trigger])

    useEffect(() => {
        if(!_.isEmpty(prepend)){
            const newData = [...state.data]
            setState({ data: [prepend, ...newData]})
        }
        setTimeout(() => prepend = null, 100)
    }, [prepend])

    useEffect(() => {
        if(!_.isEmpty(append)){
            const newData = [...state.data]
            setState({ data: [...newData, append]})
        }
        setTimeout(() => append = null, 100)
    }, [append])

    useEffect(() => {
        if(deleteId){
            const newData = [...state.data]
            const index = newData.findIndex(x => x.id === deleteId);
            newData.splice(index, 1);
            setState({ data: newData });
            deleteId = null
        }
    }, [deleteId])

    const SCROLL = new Animated.ValueXY()

    const getItemLayout = itemHeight ? (data, index) => (
        {length: itemHeight, offset: itemHeight * index, index}
    ) : null

    return !state.loaded ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Spinner size={'small'} color={color} /> 
        </View>
    ) : (
        <Animated.FlatList
            ref={LISTREF}
            key={id}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={state.data}
            keyExtractor={(item, index) => {
                if(!_.isEmpty(item.id)) return item.id.toString()
                return index.toString()
            }}
            horizontal={horizontal || false}
            numColumns={columns || 1}
            renderItem={render}
            refreshControl={
                <RefreshControl callback={() => fetchData()} tintColor={color} />
            }
            onEndReached={() => loadNext()}
            onEndReachedThreshold={0.65}
            ListHeaderComponent={header}
            ListFooterComponent={footer ? footer(state.loadingMore) : (
                <View style={{
                    height: footerHeight || 50,
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    {state.loadingMore && (
                        <View style={{paddingVertical: 15}}>
                            <Spinner size={'small'} color={color} />
                        </View>
                    )}
                </View>
            )}
            ListEmptyComponent={empty || null}
            style={style}

            scrollEventThrottle={16}
            onScroll={onScroll ? Animated.event(
                [{ nativeEvent: { contentOffset: {
                    x: SCROLL.x,
                    y: SCROLL.y
                } } }],
                {
                    useNativeDriver: true,
                    listener: (e) => {
                        onScroll(horizontal ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y)
                    }
                }
            ) : null}
            // bounces={onScroll ? false : true}

            getItemLayout={getItemLayout}
            removeClippedSubviews={false}

            contentContainerStyle={[flex ? {flex: 1} : null, contentContainerStyle]}

            {...rest}
        />
    )

}

export default React.memo(List)
