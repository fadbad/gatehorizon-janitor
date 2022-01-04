import AsyncStorage from '@react-native-community/async-storage';

export default () => {

    return {
        async get(key) {
            if(!Array.isArray(key)) {
                const value = await AsyncStorage.getItem(key);
                return JSON.parse(value);
            } else {
                const values = await AsyncStorage.multiGet(key);
                return values.map(value => JSON.parse(value[1]) );
            }
        },

        async save(key, value) {
            if(!Array.isArray(key)) {
                await AsyncStorage.setItem(key, JSON.stringify(value));
            } else {
                const pairs = key.map( pair => [pair[0], JSON.stringify(pair[1])] );
                await AsyncStorage.multiSet(pairs);
            }
        },

        async update(key, value) {
            const item = await Storage.get(key);
            value = typeof value === 'string' ? value : _.merge({}, item, value);
            await AsyncStorage.setItem(key, JSON.stringify(value));
        },

        async delete(key) {
            if (Array.isArray(key)) {
                await AsyncStorage.multiRemove(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        },

        async keys() {
            const keys = await AsyncStorage.getAllKeys();
            return keys;
        },

        async push(key, value) {
            const currentValue = await Storage.get(key);
            if (currentValue === null) {
                await Storage.save(key, [value]);
            }
            if (Array.isArray(currentValue)) {
                await Storage.save(key, [...currentValue, value]);
            }
            throw new Error(`Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`);
        }
    }
};
