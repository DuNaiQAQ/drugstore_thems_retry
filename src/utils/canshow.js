import {UserHelper} from "../api/user";

function canshow(rules) {
    UserHelper.getRule().then((info)=>{
        if(info.code===200){
            if(info.message==="admin"){
                return true;
            }else if(rules==="all") {
                return true;
            } else{
                return false;
            }
        }else{
            return false;
        }
    })
}

export {canshow}