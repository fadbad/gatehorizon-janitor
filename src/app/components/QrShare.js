import React from "react";
// import { Share } from "react-native";
import Share from 'react-native-share';
import { Div, Text, Icon, Image, SIZES } from '../../ui'
import { useStore, useTranslation } from '../../utils'

export default ({qr, url, mobile, ...rest}) => {
    const { t } = useTranslation()
    const { user } = useStore()

    const message = `${user.name} invites you to access their property. ${url}`
    const title = `GateHorizon pass from ${user.name}`

    const getErrorString = (error, defaultValue) => {
        let e = defaultValue || 'Something went wrong. Please try again';
        if (typeof error === 'string') {
            e = error;
        } else if (error && error.message) {
            e = error.message;
        } else if (error && error.props) {
            e = error.props;
        }
        return e;
    }

    const onShare = async () => {
        try {
            await Share.open({
                title,
                // message,
                url: qr,
                failOnCancel: false,
            })
        } catch (error) {
            console.log(getErrorString(error))
        }
    }

    const onDownload = async () => {
        try {
            await Share.open({
                title,
                // message,
                url: qr,
                failOnCancel: false,
                saveToFiles: true,
                filename: 'GateHorizon'
            })
        } catch (error) {
            console.log(getErrorString(error))
        }
    }

    const onWhatsapp = async () => {
        try {
            await Share.shareSingle({
                title,
                message,
                url: qr,
                failOnCancel: false,
                social: Share.Social.WHATSAPP,
                whatsAppNumber: `${mobile}`,
                filename: 'GateHorizon'
            })
        } catch (error) {
            alert(getErrorString(error))
            console.log(error)
        }
    }

    const onEmail = async () => {
        try {
            await Share.shareSingle({
                title,
                subject: title,
                message,
                url: qr,
                failOnCancel: false,
                social: Share.Social.EMAIL,
                email: ''
            })
        } catch (error) {
            console.log(getErrorString(error))
        }
    }

    return (
        <Div center {...rest}>
            <Div center w={SIZES.width * 0.7}>
                <Image src={qr} size={SIZES.width * 0.7} rt={8} />
                <Div py={8} bg={'white'} fw row center rb={8}>
                    {/* <Icon size={36} name={'whatsapp'} color={'#25d366'} onPress={onWhatsapp} mr={24} /> */}
                    <Icon size={36} name={'email'} color={'red'} onPress={onEmail} mr={36} />
                    <Icon size={36} name={'download'} color={'teal'} onPress={onDownload} mr={36} />
                    <Icon size={36} name={'share'} color={'cyan'} onPress={onShare} />
                </Div>
            </Div>
        </Div>
    )
}
