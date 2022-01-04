import React from 'react'
import { Platform, Alert, Dimensions, PermissionsAndroid } from 'react-native'
import _ from 'lodash'
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Config from '../../Config'
import Vars from '../../Vars'
import linking from './linking';

import * as geolib from '../lib/maps/geolib';
import Polyline from '../lib/maps/polyline';
import { showLocation } from "../lib/maps/map-link";


const { width, height } = Dimensions.get('window')

export { default as polyline } from '../lib/maps/polyline'
export { default as haversine } from '../lib/maps/haversine'

export const latitudeDelta = 0.04864195044303443;
export const longitudeDelta = latitudeDelta * (width / height);

const GKEY = Config.GOOGLE_MAPS

export const openMapAsync = async (lat, lng) => {
    const url = Platform.select({
        ios: `https://maps.apple.com/?ll=${lat},${lng}`,
        default: `https://maps.google.com/?q=${lat},${lng}`,
    })
    return linking.open(url)
}

const hasLocationPermissionIOS = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
        return true;
    }

    if (status === 'disabled' || status === 'denied') {
        Alert.alert(
            'Could not locate you!',
            'Turn Location Services ON to determine your location.',
            [
                { text: 'Go to Settings', onPress: () => linking.settings() },
                { text: "Don't Use Location", style: 'cancel' },
            ],
        );
    }
    return false;
};

export const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        const hasPermission = await hasLocationPermissionIOS();
        return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) return true;
    const hasPermission = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    return false;
};

export const GeoPosition = (highAccuracy = false) => {
    let options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000
    };

    if ( highAccuracy && Platform.OS === "android" ) {
        options = {
            enableHighAccuracy: true,
            timeout: 5000
        };
    }
    return new Promise((resolve, reject) => 
        Geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            options
        )
    );
}

export const locate = async () => {
    const status = await hasLocationPermission()
    if(!status) {
        Vars.setLocation(null, null)
        return { 
			latitude: null, 
			longitude: null,
			lat: null,
			lng: null,
		}
    }
    try {
        const pos = await GeoPosition();
        Vars.setLocation(pos.coords.latitude, pos.coords.longitude)
		return { 
			latitude: pos.coords.latitude, 
			longitude: pos.coords.longitude,
			lat: pos.coords.latitude,
			lng: pos.coords.longitude,
		}
    } catch(err) {
		console.log('LOCATION ERROR', err)
		Vars.setLocation(null, null)
        return { 
			latitude: null, 
			longitude: null,
			lat: null,
			lng: null,
		}
    }
}

export const watchPosition = (highAccuracy = false) => {

    const [lat, setLat] = React.useState(null)
    const [lng, setLng] = React.useState(null)
    const [err, setErr] = React.useState(null)

    React.useEffect(() => {
        Vars.setLocation(lat, lng)
    }, [lat, lng])

    let options = {
        accuracy: {
            android: 'balanced',
            ios: 'hundredMeters',
        },
        enableHighAccuracy: false,
        distanceFilter: 0, // default 100 (in meters)
        interval: 5000, // ms
        fastestInterval: 2000,
        showLocationDialog: true, // android only
        forceRequestLocation: true, // android only
        showsBackgroundLocationIndicator: false,
    };

	if ( highAccuracy ) {
		options = {
			accuracy: {
				android: 'high',
				ios: 'bestForNavigation',
			},
			enableHighAccuracy: Platform.OS === "android" ? true : false,
			distanceFilter: 10, // default 100 (in meters)
			interval: 2400, // ms
			fastestInterval: 2000,
			showLocationDialog: true, // android only
			forceRequestLocation: true, // android only
			showsBackgroundLocationIndicator: false,
		};
	}

    const watchId = Geolocation.watchPosition(
        (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude)
        },
        (error) => setErr(error),
        options
    )

    const clear = () => Geolocation.clearWatch(watchId);

    return [lat, lng, clear, err]
}

export const stopWatchingPosition = () => Geolocation.stopObserving()

export const toDeg = (value) => (value * 180) / Math.PI;
export const toRad = (value) => (value * Math.PI) / 180;

export const distance = (lat1, lng1, lat2, lng2, unit = 'km', fixed = 2) => {
    // UNIT: m (meter), km (kilometers), cm (centimeters), mm (millimeters), mi (miles), sm (seamiles), ft (foot), in (inch), yd (yards)
    var distance = geolib.getDistance(
        {latitude: parseFloat(lat1), longitude: parseFloat(lng1)},
        {latitude: parseFloat(lat2), longitude: parseFloat(lng2)}
    );
    return geolib.convertDistance(distance, unit).toFixed(fixed);
}

export const compassDirection = (lat1, lng1, lat2, lng2) => {
    var direction = geolib.getCompassDirection(
        {latitude: parseFloat(lat1), longitude: parseFloat(lng1)},
        {latitude: parseFloat(lat2), longitude: parseFloat(lng2)}
    );
    return direction.exact; // exact , rough
}

export const directions = (lat, lng, sourceLat, sourceLng) => {
    return showLocation({
        latitude: parseFloat(sourceLat),
        longitude: parseFloat(sourceLng),
        sourceLatitude: parseFloat(lat),
        sourceLongitude: parseFloat(lng),
    })
}

export const map_image_uri_google = (lat, lng, w = 400, h = 150) => {
    w = w * 2
    h = h * 2
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=${w}x${h}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${GKEY}`
}

export const map_image_uri_yandix = (lat, lng, w = 320, h = 200) => {
    w = w * 2
    w = w > 650 ? 650 : w
    h = h * 2
    w = w > 450 ? 450 : w
    const z = 10
    const type = 'map' // map, sat
    return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&size=${w},${h}&z=${z}&l=${type}&pt=${lng},${lat},comma`
}

export const map_image_uri__ = (lat, lng, w = 600, h = 300, type = 'streets') => {
    // types: light, dark, streets, streets-satellite, satellite, outdoors
    const key = 'pk.eyJ1IjoiYml0d2l6ZXIiLCJhIjoiY2swNzZvaXNuMDUxeDNucXc3bWoxYzA1dyJ9.lyV3MLXFUmf3QgQK20Cgcg'
    const z = 13
    const color = '0a1a5c'
    w = Math.round(w)
    h = Math.round(h)
    // const type = 'mapbox.emerald'
    type = `mapbox.${type}`
    return `https://api.mapbox.com/v4/${type}/pin-l-marker-stroked+${color}(${lng},${lat})/${lng},${lat},${z}/${w}x${h}@2x.png?access_token=${key}`
}

export const map_image_uri = async (lat, lng, w = 600, h = 300, z = 13, type = 'streets') => {
    // types: light, dark, streets, streets-satellite, satellite, outdoors
    const url = `https://api.bitwize.com.lb/mapbox/?lat=${lat}&lng=${lng}&w=${w}&h=${h}&type=${type}&z=${z}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.url || '';
}

export const direction_coords = async (lat1, lng1, lat2, lng2) => {
    try{
        const url =`https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lng1}&destination=${lat2},${lng2}&key=${GKEY}`;
        const resp = await fetch(url);
		const json = await resp.json();
        // console.log(json);

		const points = Polyline.decode(json.routes[0].overview_polyline.points);
		const coords = points.map(point => {
			return { latitude: point[0], longitude: point[1] };
		});
        return coords;
    } catch (err){
        console.log('direction_coords ERR', err)
        return false
    }
}
