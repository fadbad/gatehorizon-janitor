---

An easy way to open a location in a map app of the user's choice, based on the apps they have installed
on their device.

Currently supported apps:

* Apple Maps – `apple-maps`
* Google Maps – `google-maps`
* Citymapper – `citymapper`
* Uber – `uber`
* Lyft – `lyft`
* The Transit App – `transit`
* Waze – `waze`
* Yandex.Navi – `yandex`
* Moovit – `moovit`
* Yandex Maps – `yandex-maps`



## Installation

### 1. Install the package

```shell
npm i -S react-native-map-link         # or yarn add react-native-map-link
```

### 2. Update your Info.plist
To allow your app to detect if any of the directions apps are installed, an extra step is required on iOS. Your app needs to provide the `LSApplicationQueriesSchemes` key inside `ios/Info.plist` to specify the URL schemes with which the app can interact.

Just put this in your `Info.plist` depending on which apps you'd like to support. Omitting these might mean that the library can't detect some of the maps apps installed by the user.

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>comgooglemaps</string>
    <string>citymapper</string>
    <string>uber</string>
    <string>lyft</string>
    <string>transit</string>
    <string>waze</string>
    <string>yandexnavi</string>
    <string>moovit</string>
    <string>yandexmaps</string>
</array>
```

## Usage

Using the `showLocation` function will shown an action sheet on iOS and an alert on Android, without any custom styling:

```js
import { showLocation } from 'react-native-map-link'

showLocation({
    latitude: 38.8976763,
    longitude: -77.0387185,
    sourceLatitude: -8.0870631,  // optionally specify starting location for directions
    sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
    title: 'The White House',  // optional
    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
    googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
    alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
    dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
    dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
    cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
    // app: 'uber'  // optionally specify specific app to use
})
```

Notes:

* The `sourceLatitude/sourceLongitude` options only work if you specify both. Currently supports all apps except Waze.
