import { api } from "../services/axios";

let timeOffset = 0;

export const syncServerTime = async () => {
    try {
        const start = Date.now();

        const res = await api.get("/api/time");

        const end = Date.now();

        // //console.log("FULL RESPONSE:", res.data);

        const serverTime = res.data.serverTime;

        // //console.log("SERVER TIME:", serverTime);

        const latency = (end - start) / 2;

        timeOffset = serverTime + latency - end;

        //console.log({
        //     start,
        //     end,
        //     latency,
        //     offset: timeOffset,
        //     system: Date.now(),
        //     synced: Date.now() + timeOffset,
        // });
    } catch (err) {
        //console.error("Time sync failed", err);
    }
};

export const getCurrentTime = () => {
    return Date.now() + timeOffset;
};
