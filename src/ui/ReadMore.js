import React, { useState, useCallback } from 'react'
import Text from './Text'
import Div from './Div'

export default ({
    text,
    lines = 3,
    more = 'Read more...',
    hide = 'Hide',
    divProps,
    ...rest
}) => {
    
    const [textShown, setTextShown] = useState(false); 
    const [lengthMore,setLengthMore] = useState(false);
    const toggleNumberOfLines = () => setTextShown(!textShown);
    
    const onTextLayout = useCallback(e =>{
        setLengthMore(e.nativeEvent.lines.length > lines);
    },[]);

    return (
        <Div {...divProps}>
            <Text
                onTextLayout={onTextLayout}
                lines={textShown ? undefined : lines}
                {...rest}
            >
                {text}
            </Text>
            
            {lengthMore && (
                <Text
                    onPress={toggleNumberOfLines}
                    bold {...rest}
                >
                    {textShown ? hide : more}
                </Text>     
            )}
          </Div>
      )
}
