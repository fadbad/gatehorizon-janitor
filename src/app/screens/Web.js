import React from 'react'
import { Div, Text, Icon, COLORS, Spinner } from "../../ui";
import { useRoute, add_query_args, Vars, useFocused } from "../../utils";
import { Header } from "../components";

import { WebView } from 'react-native-webview';

export default () => {
    const { params } = useRoute()
    let { url, title } = params
    const focused = useFocused()

	const lang = Vars.getLang()
	url = add_query_args(url, { __lang: lang })

    const [show, setShow] = React.useState(false)
    React.useEffect(() => {
        setTimeout(() => setShow(true), 300)
        return () => {
            setShow(false)
        }
    }, [])

    return (
        <Div f={1} bg={'secondary'}>
            <Header title={title} back />
            <Div f={1} rt={24} bg={'light'}>
                <Div absoluteFill center>
                    <Spinner color={'secondary'} />
                </Div>
                {(show && focused) && (<WebView 
                    source={{uri: url}} 
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={false}
                    style={{
                        flex: 1, 
                        backgroundColor: COLORS.light,
                        borderTopLeftRadius: 24, 
                        borderTopRightRadius: 24
                    }}
                />)}
            </Div>

        </Div>
    )
}
