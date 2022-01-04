import React from "react";
import { Div, Text, Icon, Image, SIZES } from '../../ui'
import { upload, empty } from '../../utils'

export default ({
    label, help, onChange, size = 'full', ...rest
}) => {
    const [img, setImg] = React.useState('')
    let w = SIZES.width - 48 - 16

    if(size === 'half'){
        w = ((SIZES.width - 12) / 2) - (48 / 2) - 16
    }

    return (
        <Div {...rest}>
            <Div mb={4}>
                <Text size={16} bold color={'muted'}>{label}</Text>
            </Div>
            <Div b={2} r={8} btype={'dashed'} bcolor={'muted'}>
                {!empty(img) ? (
                    <Div center p={8}>
                        <Image src={img} w={w} cover r={8} />
                        <Div 
                            absolute right={-12} top={-12} size={32} r={32} center 
                            bg={'white'}
                            onPress={() => {
                                setImg('')
                                onChange && onChange('')
                            }}
                        >
                            <Icon name={'close'} size={16} color={'muted'} />
                        </Div>
                    </Div>
                ) : (
                    <Div row center py={24}>
                        {/* <Div absolute top={0} left={0} bg={'mutedlight'} rtl={8} rbr={8}>
                            <Icon name={'plus'} color={'light'} size={24} />
                        </Div> */}

                        <Div 
                            bg={'white'} size={64} r={64} center  
                            onPress={() => upload(v => {
                                setImg(v)
                                onChange && onChange(v)
                            })}
                        >
                            <Icon name={'gallery'} color={'muted'} size={36} />
                        </Div>

                        <Div w={16} />

                        <Div 
                            bg={'white'} size={64} r={64} center
                            onPress={() => upload({type: 'camera'}, v => {
                                setImg(v)
                                onChange && onChange(v)
                            })}
                        >
                            <Icon name={'camera'} color={'muted'} size={36} />
                        </Div>
                    </Div>
                )}
            </Div>
            {!empty(help) && (
                <Div mt={3}>
                    <Text color={'muted'} size={12}>{help}</Text>
                </Div>
            )}
        </Div>
    )
}
