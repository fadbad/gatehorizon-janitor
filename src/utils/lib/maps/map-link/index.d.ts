import * as React from 'react';
import { ViewStyle, StyleProp, ImageStyle, TextStyle } from 'react-native';

interface Options {
    latitude: number | string
    longitude: number | string
    sourceLatitude?: number
    sourceLongitude?: number
    alwaysIncludeGoogle?: boolean
    googleForceLatLon?: boolean
    googlePlaceId?: string
    title?: string
    app?: string
    dialogTitle?: string
    dialogMessage?: string
    cancelText?: string
    appsWhiteList?: string[]
}

export function showLocation(options: Options): Promise<void>;
