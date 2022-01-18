import React from "react";
import { Div, Text, Icon, Image, SIZES, Spinner } from '../../ui'
import { useTranslation, isEmpty } from '../../utils'
import { Btn, DateCal } from '../components'

export default ({item, code, onCheckIn, onCheckOut, loadingIn, loadingOut}) => {
    const { t } = useTranslation()
    const user = item?.user ?? {}
    const property = item?.property ?? {}
    const guests = item?.group_guests ?? []
    const reason = item?.group_reason ?? ''
    const size = item?.group_size ?? 0
    
    const accepted = !isEmpty(item?.accepted_at)
    const rejected = !isEmpty(item?.rejected_at)
    const allowed = accepted && !rejected

    return (
        <Div 
            f={1} p={24} 
            // onPress={() => setProcess('idle')}
        > 
            <Div mb={12}>
                <Text h3>{t('GROUP_PERMIT')}</Text>
                <Text h4>{t('FOR_GUESTS', {size})}</Text>
                <Text size={12}>{code}</Text>
            </Div>  
            

            <Div scroll>  

                <Div row center bg={'white'} r={8} p={12} mb={12}>
                    <Image src={user.avatar} size={48} r={48} />
                    <Div f={1} ml={8}>
                        <Div row justify={'between'}>
                            <Div>
                                <Text bold>{user.name}</Text>
                                <Text>{user.mobile}</Text>
                            </Div>
                            <Text>{property.name}</Text>
                        </Div>
                    </Div>
                </Div>

                <Div row mb={12}>
                    <DateCal date={item?.expected_at} />
                    <Div f={1} ml={16}>
                        {!isEmpty(reason) && (
                            <Div mb={12}>
                                <Text>{t('REASON')}: {reason}</Text>
                            </Div>
                        )}

                        {guests.map((guest, index) => {
                            const show = !isEmpty(guest?.name) && !isEmpty(guest?.mobile)
                            return !show ? null : (
                                <Div mb={8} pb={8} bb key={`GG-${index}`}>
                                    <Text bold>{guest?.name ?? '---'}</Text>
                                    <Text>{guest?.mobile ?? '---'}</Text>
                                </Div>
                            )
                        })}
                    </Div>
                </Div>

            </Div>
            {!!rejected && (
                <Div my={12} bg={'red'} p={8} r={8} center>
                    <Text h4>{t('REJECTED')}</Text>
                    <Text>{item?.reject_reason ?? ''}</Text>
                </Div>
            )}
            {!accepted && (
                <Div my={12} bg={'pink'} p={8} r={8} center>
                    <Text h4 color={'white'}>{t('NOT_ACCEPTED_YET')}</Text>
                </Div>
            )}
            {!!allowed && (
                <Div pt={12}>
                    <Div mb={12} onPress={onCheckIn}>
                        <Btn bg={'primary'} text={t('CHECK_IN')} loading={loadingIn} />
                    </Div>
                    <Div mb={12} onPress={onCheckOut}>
                        <Btn bg={'cyan'} text={t('CHECK_OUT')} loading={loadingOut} />
                    </Div>
                </Div>
            )}
        </Div>
    )
}
