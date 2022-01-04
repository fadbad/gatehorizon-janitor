import React from "react";
import { Div, Image, Spinner, Text, SIZES, COLORS } from '../../ui'
import { MotiView, MotiText } from "moti";

export default React.memo(() => {

    const [show, setShow] = React.useState(true)

    const transition = {
        type: 'spring',
        delay: 2000,
        duration: 1200
    }

    return !show ? null : (
        <MotiView
            from={{
                borderRadius: 0,
                translateY: 0,
                backgroundColor: COLORS.secondary,
            }}
            animate={{
                borderRadius: SIZES.width,
                translateY: SIZES.height,
                backgroundColor: COLORS.black,
            }}
            transition={transition}
            onDidAnimate={(
                styleProp,
                didAnimationFinish
            ) => {
                if(didAnimationFinish) setShow(false)
            }}
            style={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0, left: 0,
                width: SIZES.width,
                height: SIZES.height,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Image src={'logo'} h={90} />
            <Text bold size={18} color={'white'} mt={12} mb={24}>
                Gate Horizon
            </Text>
            <Div center >
                <Spinner color={'#fff'} size={'small'} />
            </Div>
        </MotiView>
    )
})
