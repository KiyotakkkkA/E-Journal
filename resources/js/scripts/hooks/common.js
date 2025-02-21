import { useCallback } from "react";

export const useSyncData = () => {
    return useCallback((data, type, isLoading, store) => {
        if (data && !isLoading && data !== store[type]) {
            store.syncData(data, type);
        }
    }, []);
};
