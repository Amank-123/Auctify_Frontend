// timeSync.js

import { api } from "../services/axios";

let timeOffset = 0;

export const syncServerTime = async () => {
    try {
        const start = Date.now();

        const res = await api.get("/api/time");

        const end = Date.now();

        const serverTime = res.data.serverTime;

        // network latency compensation (basic)
        const latency = (end - start) / 2;

        timeOffset = serverTime + latency - end;
    } catch (err) {
        console.error("Time sync failed", err);
    }
};

export const getCurrentTime = () => {
    return Date.now() + timeOffset;
};
