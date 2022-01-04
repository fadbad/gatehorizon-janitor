import { useState, useRef } from "react";

export default () => {
    const toast_ref = useRef();

    const toast_show = (text, args = {}) => {
        duration = args.duration || 6000
        position = args.position || 'top'
        bg = args.bg || '#fff'
        color = args.color || '#111'
        onPress = args.onPress || null
        toast_ref.current?.show(text, duration, position, bg, color, onPress)
    }

    return {
        toast_ref,
        toast_show
    }
}
