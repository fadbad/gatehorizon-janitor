import axios from 'axios';
import Config from '../../Config'

const GKEY = Config.GOOGLE_MAPS

export default () =>{
    return {

        _requests: [],

        async get(lat, lng) {
            if(!lat || !lng) return
            const res = await this.fetch(lat, lng)
            return res[0] || this.emptyResult()
        },

        cancel(){
            this._requests.map(source => source.cancel('ABORTED BY SEQUENCE'));
            this._requests = [];
        },

        async fetch(lat, lng){
            this.cancel();

            const CancelToken = axios.CancelToken.source();
            this._requests.push(CancelToken)
            const url = `https://maps.google.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GKEY}`
            try {
                const res = await axios.get( url, {
                    cancelToken: CancelToken.token
                } )
                if(res.status >= 200 && res.status < 400){
                    return res.data.results.map(this.format)
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log(err.message);
                }
                return []
            }
            return [];
        },

        emptyResult() {
            return {
                formatted_address: '',
                lat: 0,
                lng: 0,
                place_id: null,
                confidence: 0,
                accuracy: '',
                // address_components: [],
                country: '',
                country_code: '',
                city: '',
                zipcode: '',
                street_name: '',
                street_number: '',
                premise: '',
                subpremise: '',
                establishment: '',
                neighborhood: '',
                level_1: '',
                level_2: '',
                level_3: '',
                level_4: '',
                level_5: '',
            }
        },

        format(result) {
            var confidenceLookup = {
                ROOFTOP: 1,
                RANGE_INTERPOLATED: 0.9,
                GEOMETRIC_CENTER: 0.7,
                APPROXIMATE: 0.5
            };
            
            var obj = {
                formatted_address: result.formatted_address || '',
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                place_id: result.place_id || null,
                confidence: confidenceLookup[result.geometry.location_type] || 0,
                accuracy: result.geometry.location_type,
                // address_components: result.address_components,
            };
            
            for (var i = 0; i < result.address_components.length; i++) {
                for (var x = 0; x < result.address_components[i].types.length; x++) {
                    var COMP = result.address_components[i];
                    var addressType = COMP.types[x];
                    switch (addressType) {
                        case 'country':
                            obj.country = COMP.long_name;
                            obj.country_code = COMP.short_name;
                        break;
                        case 'locality': case 'postal_town': obj.city = COMP.long_name; break;
                        case 'postal_code': obj.zipcode = COMP.long_name; break;
                        case 'route': obj.street_name = COMP.long_name; break;
                        case 'street_number': obj.street_number = COMP.long_name; break;
                        case 'premise': obj.premise = COMP.long_name; break;
                        case 'subpremise': obj.subpremise = COMP.long_name; break;
                        case 'establishment': obj.establishment = COMP.long_name; break;
                        case 'sublocality_level_1': case 'political': case 'sublocality': case 'neighborhood':
                            if(!obj.neighborhood) obj.neighborhood = COMP.long_name;
                        break;
                        case 'administrative_area_level_1': obj.level_1 = COMP.long_name; break;
                        case 'administrative_area_level_2': obj.level_2 = COMP.long_name; break;
                        case 'administrative_area_level_3': obj.level_3 = COMP.long_name; break;
                        case 'administrative_area_level_4': obj.level_4 = COMP.long_name; break;
                        case 'administrative_area_level_5': obj.level_5 = COMP.long_name; break;
                    }
                }
            }
            return obj;
        }
    }
}
