import { defineStore } from 'pinia';
import axios from "axios";

export const useUserCountLogStore = defineStore('userCountLog', () => {

    function callUserCountLog(lnkgStatsTypeCd: string) {
        axios.post("/api/common/mergeUserCountLog", {lnkgStatsTypeCd:lnkgStatsTypeCd});
    }

    return {
        callUserCountLog,
    }
});