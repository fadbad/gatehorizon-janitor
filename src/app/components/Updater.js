import React from "react";
import { Div, Text, Icon, Image, Modal } from '../../ui'
import { useVersionCheck } from '../../utils'

export default () => {

    const {
        hasUpdate, 
        currentVersion, 
        newVersion, 
        update_link,
        update_cb
    } = useVersionCheck()

    return (
        <Modal isVisible={hasUpdate}>
            <Div safe f={1} bg={'secondary'} center>
                <Div p={24}>
                    <Image src={'logo'} h={60} color={'white'} />
                    <Div mt={24}>
                        <Text h3 color={'white'}>
                            Gate Horizon new verion {newVersion} released
                        </Text>
                        <Text color={'white'} my={12}>
                            It's highly recommended to download the latest release
                        </Text>
                        <Text size={12} color={'muted'}>
                            Current version: {currentVersion}
                        </Text>
                        <Text size={12} color={'muted'}>
                            New version: {newVersion}
                        </Text>
                        <Text size={12} color={'muted'}>
                            Link: {update_link}
                        </Text>
                    </Div>

                    <Div mt={24} row>
                        <Div onPress={update_cb} px={24} py={12} r={8} bg={'primary'}>
                            <Text color={'white'} bold>Update Now</Text>
                        </Div>
                    </Div>

                </Div>
            </Div>
        </Modal>
    )
}
