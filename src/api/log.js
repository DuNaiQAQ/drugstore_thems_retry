import {get,post} from "../utils/request";

const LogHelper={
    getLog:()=>get("/log"),
    addLog:(param)=>post("/log",param)
}

export {LogHelper}