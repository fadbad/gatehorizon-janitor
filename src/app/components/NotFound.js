import React from "react";
import { Div, Text, Icon, SIZES } from '../../ui'
import { empty, isRTL, useTranslation } from "../../utils";
import ImgNotFound from '../assets/svgs/notfound.svg'

export default ({ text, before, after }) => {
    const {t} = useTranslation()
    return (
        <Div f={1} center>
            {!empty(before) && before}
            {!empty(text) && (
                <Div mt={12} center>
                    <Div px={12} py={6} bg={'white'} shadow={3} shadowColor={'#999'} r={8}>
                        <Text>
                            { isRTL ? t('NO_ITEMS_FOUND') : text }
                        </Text>
                    </Div>
                </Div>
            )}
            <ImgNotFound width={SIZES.width - 48} height={SIZES.width - 48} />
            {!empty(after) && after}
        </Div>
    )
}
