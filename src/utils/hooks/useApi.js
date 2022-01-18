import _axios from 'axios'
import Config from '../../Config'
import Vars from '../../Vars'
import useEvents from './useEvents';

const events = useEvents()

const add_query_args = (uri, params, nocache = false) => {
    params = params || {};
    if(nocache) params._ = Date.now();
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    for (var key in params) {
        if(params.hasOwnProperty(key)){
            uri += separator + key + '=' + encodeURIComponent(params[key]);
            separator = '&';
        }
    }
    return uri;
}

const axios = _axios.create({baseURL: Config.API, timeout: 30000});
axios.defaults.headers.common['Accept'] = 'application/json';

const Api = async (method, url, data, headers) => {
    data = data || null;
    headers = headers || {}
    let token = Vars.getToken()
    const lang = Vars.getLang()

    token = token ? `Bearer ${token}` : null
    axios.defaults.headers.common['Authorization'] = token;
    
    url = url.replace(Config.API, '');
    method = method ? method.toLowerCase() : 'post'

    data = data ? {...data, __lang: lang} : {__lang: lang}

    if(method === 'get') url = add_query_args(url, data, true)

    console.log('API', { URL: url, DATA: data, headers: headers })
    try {
        const response = await axios[method](url, data, { headers: headers })
        if(response.status >= 200 && response.status < 400){
            console.log('RES', response.data )
            return response.data
        } else {
            return false
        }
    } catch (err) {
        console.log(err.message);
        events.publish('network_error')
        return false
    }
}

export default () => {
    return {
        post: async (url, data, headers) => await Api('POST', url, data, headers),
        get: async (url, data, headers) => await Api('GET', url, data, headers),
        patch: async (url, data, headers) => await Api('PATCH', url, data, headers),
        delete: async (url, data, headers) => await Api('DELETE', url, data, headers),
    }
}
