import React from "react";
import { Div } from '../../ui'

export default ({ status = 'pending', size=24, ...rest}) => {
    let bg = 'muted'
    switch (status){
        case 'accepted': bg = 'primary'; break;
        case 'arrived': bg = 'cyan'; break;
        case 'rejected': bg = 'red'; break;
        case 'pending': bg = 'orange'; break;
        case 'expired': bg = 'pink'; break;
    }
    return (
        <Div bg={bg} size={size} r={size} {...rest} />
    )
}
