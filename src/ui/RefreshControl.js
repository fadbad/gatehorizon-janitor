import React, { useState, useCallback } from "react";
import { RefreshControl } from "react-native";

export default ({ callback, style, children, ...params }) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleOnRefresh = useCallback(async () => {
        setRefreshing(true);
        if (callback) {
            try {
                await callback()
            } catch (e) {
                console.log(e)
            }
        }
        setRefreshing(false)
    }, [callback]);

    return (
        <RefreshControl
            children={children}
            style={style}
            refreshing={refreshing}
            onRefresh={handleOnRefresh}
            {...params}
        />
    );
};
