import { defineStore } from 'pinia';
import axios from "axios";

export const useMenuLogStore = defineStore('menuLog', () => {

    function callMenuLog(url: string) {
        axios.post("/api/common/insertMenuLog", {url:url});
    }

    return {
        callMenuLog,
    }
});