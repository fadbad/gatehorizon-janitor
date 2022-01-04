let events = {};

export default () => {
    return {
        subscribe(event, listener) {
            console.log('subscribe', event)
            if (!events.hasOwnProperty.call(events, event)) events[event] = [];
            const index = events[event].push(listener) - 1;
            return {
                unsubscribe() {
                    delete events[event][index];
                }
            };
        },
    
        publish(event, args) {
            console.log('publish', event)
            if (!events.hasOwnProperty.call(events, event)) return;
            events[event].forEach(fn => fn(args));
        }
    }
}
