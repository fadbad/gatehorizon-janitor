
import { Platform } from 'react-native'
import _ from 'lodash'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import Config from '../../Config';
import { useStorage } from '../hooks'

const storage = useStorage()

const basename = (path) => path.replace(/.*\//, '');

const base64 = async (imageUri, mime = 'image/jpeg') => {
    const filepath = Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '');
    const imageUriBase64 = await RNFS.readFile(filepath, 'base64');
    return `data:${mime};base64,${imageUriBase64}`;
}

const sendUpload = async (url, file, args = {}) => {

    let headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
    }

    let token = await storage.get('@Session:token');
    token = token ? `Bearer ${token}` : null

    if(token) headers.Authorization = token

    let data = []

    if(!isEmpty(file)){
        const path = isIOS ? file.path.replace('file://', '') : file.path
        data.push({
            name: 'file',
            filename: file.filename || basename(file.path),
            type: file.mime,
            data: RNFetchBlob.wrap( path )
        })
    }

    if(!isEmpty(args)){
        console.log('args', args)
        entries = Object.entries(args)
        entries.forEach(([key, value]) => {
            if(Array.isArray(value)){
                value.forEach(i => data.push({name: key+'[]', data: i}) )
            } else {
                data.push({name: key, data: value}) 
            }
        })
    }

    console.log('data', data)

    try {
        const res = await RNFetchBlob.fetch('POST', `${Config.API}/${url}`, headers, data)
        let status = res.info().status;
        if(status >= 200 && status < 400){
            return res.json()
        } else {
            return false
        }
    } catch(err){
        console.log(err);
        return false
    }
}

export {
    base64,
    sendUpload,
}
