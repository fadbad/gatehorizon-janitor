class VARS {
    token = ''
    lang = 'en'
    lat = null
    lng = null
    
    properties = []
    property = {}

    setToken = (token) => this.token = token
    getToken = () => this.token

    setLang = lang => this.lang = lang 
    getLang = () => this.lang

    setLocation = (lat, lng) => {
        this.lat = lat
        this.lng = lng
    }
    getLocation = () => {
        return {lat: this.lat, lng: this.lng}
    }

    setProperties = v => this.properties = v
    getProperties = () => this.properties

    setProperty = v => this.property = v
    getProperty = () => this.property
}

const Vars = new VARS()

export default Vars
