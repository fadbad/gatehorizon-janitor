import React from 'react'
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import FBSDK from 'react-native-fbsdk'
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication'

import Config from '../../Config'

import { useStorage } from '../hooks'
const storage = useStorage()

const { LoginManager, GraphRequest, GraphRequestManager } = FBSDK

GoogleSignin.configure({ iosClientId: Config.GOOGLE_APPID })

export const AppleBtn = (props) => <AppleButton {...props} />
export const hasAppleAuth = appleAuth.isSupported

export const loginByApple = async (callback = null) => {
    try {

        const res = await appleAuth.performRequest({
          requestedOperation: 1,
          requestedScopes: [0, 1],
        });
        console.log('appleAuthRequestResponse', res);
        // const credentialState = await appleAuth.getCredentialStateForUser(res.user);
        // console.log('credentialState', credentialState);
        if(res.realUserStatus === 1){
            const i = {
                first_name: res.fullName.givenName,
                last_name: res.fullName.familyName,
                name: `${res.fullName.givenName} ${res.fullName.familyName}`,
                email: res.email,
                provider_id: res.user,
                provider: 'apple'
            }
            if(res.email){
                await storage.save('@Apple:Auth', i);
                callback && callback(i)
            } else {
                const a = await storage.get('@Apple:Auth')
                if(a){
                    callback && callback(a)
                } else {
                    // alert('Could not authenticate you...')
                    const now = Date.now();
                    callback && callback({
                        first_name: '',
                        last_name: '',
                        name: ``,
                        email: now+'@apple.com',
                        provider_id: now,
                        provider: 'apple'
                    })
                }
            }
        }
    } catch (err) { 
        // alert(err.code === '1001' ? 'Operation Cancelled' : err)
        alert(err.message)
    }
}

export const loginByFacebook = (callback = null, error = null) => {
    LoginManager.logInWithPermissions([
        'public_profile',
        'email'
    ]).then((result) => {
        if(result.isCancelled){
            // alert('loging cancelled')
        } else {
            const infoRequest = new GraphRequest('/me', {
                parameters: {
                    'fields': { 'string' : 'email,first_name,last_name,picture' }
                }
            }, (err, res) => {
                if(err) {
                    error && error(err)
                } else {
                    const i = {
                        first_name: res.first_name,
                        last_name: res.last_name,
                        name: `${res.first_name} ${res.last_name}`,
                        image: `https://graph.facebook.com/${res.id}/picture?type=large`,
                        email: res.email,
                        provider_id: res.id,
                        provider: 'facebook'
                    }
                    callback && callback(i)
                }
            });
            new GraphRequestManager().addRequest(infoRequest).start();
        }
    }, function(err){
        error && error(err)
    })
}

export const loginByGoogle = async (callback = null, error = null) => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const { user } = userInfo
        const i = {
            first_name: user.givenName,
            last_name: user.familyName,
            name: `${user.givenName} ${user.familyName}`,
            image: user.photo,
            email: user.email,
            provider_id: user.id,
            provider: 'google'
        }
        callback && callback(i)
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // alert('Cancelled')
        } else if (error.code === statusCodes.IN_PROGRESS) {
            error && error('Operation is already IN-PROGRESS')
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            error && error('play services not available or outdated')
        } else {
            error && error('Error Occured', error)
        }
    }
}
