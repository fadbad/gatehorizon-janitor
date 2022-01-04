import React from 'react'
import { Div, COLORS, Spinner } from "../../ui";
import { add_query_args, Vars, Config, useRoute, useTranslation, useFocused } from "../../utils";
import { Header, LinearBg } from "../components";

import { WebView } from 'react-native-webview';

export default () => {
    const { t } = useTranslation()
    const focused = useFocused()

    let url = Config.URLS.support;
	const lang = Vars.getLang()
	url = add_query_args(url, { __lang: lang })

    const { params } = useRoute()
    const withBack = params?.withBack ?? false

    const [show, setShow] = React.useState(false)
    React.useEffect(() => {
        setTimeout(() => setShow(true), 300)
        return () => {
            setShow(false)
        }
    }, [])

    return (
        <Div f={1} bg={'secondary'}>
            {focused && <LinearBg />}
            <Header title={t('SUPPORT')} back={withBack} />
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
