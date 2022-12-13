import {post,get} from '../utils/request'

//员工类API
const FactoryHelper = {
    addfac:(param)=>post('factory/addfac',param),
    delfac:(id)=>post('factory/delfac',id),
    updatefac:(param)=>post('factory/updatefac',param),
    getfacinfo:()=>get('factory/getfac')
}

export {FactoryHelper}