import React from "react";
import Emoji from './Emoji';

export default ({ name, style, size }) => {
    return name ? (
        <Emoji name={`flag-${name.toLowerCase()}`} size={size || 24} style={style} />
    ): null;
}
