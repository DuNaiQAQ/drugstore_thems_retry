import {post,get} from '../utils/request'

const StoreHouseHelper= {
    get_out:()=>get('sh/get_out'),
    get_pur:()=>get('sh/get_pur'),
    out_add:(param)=>post('sh/out_add',param),
    pur_add:(param)=>post('sh/purchase',param),
    out_del:(id)=>post('sh/out_del',id),
    pur_del:(id)=>post('sh/purchase_del',id),
    out_change:(param)=>post('sh/changeout',param),
    pur_change:(param)=>post('sh/purchase_change',param),
}

export {StoreHouseHelper}

