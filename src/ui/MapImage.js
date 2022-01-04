import React, { useState, useEffect } from "react";
import Image from './Image'
import { blank_image, empty } from '../utils'

export default ({
    lat, lng, color = 'ff0000', z = 13, type = 'streets', w = 600, h = 300, ...rest
}) => {
    // types: light, dark, streets, streets-satellite, satellite, outdoors
    const [url, setUrl] = useState('')

    const boot = async () => {
        const url = `https://api.bitwize.com.lb/mapbox/?lat=${lat}&lng=${lng}&w=${w}&h=${h}&type=${type}&z=${z}`;
        const res = await fetch(url);
        const json = await res.json();
        setUrl(json.url || '')
    }

    useEffect(() => {
        boot()
    }, [, lat, lng])

    return empty(url) ? (
        <Image src={blank_image} w={w} h={h} {...rest} />
    ) : (
        <Image src={url} w={w} h={h} {...rest} />
    )
}
