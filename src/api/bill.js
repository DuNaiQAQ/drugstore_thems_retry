import {post,get} from "../utils/request";

const BillHelper={
    getItems_admin:()=>get('bill/getitems_admin'),
    getItems_user:()=>get('bill/getitems_user'),
    addItem_admin:(param)=>post('bill/additem_admin',param),
    addItem_user:(param)=>post('bill/additem_user',param),
    setSell_admin:()=>get('bill/setsell_admin'),
    setSell_user:()=>get('bill/setsell_user'),
    getBillInfo:()=>get('bill/getinfo'),
    getSellInfo:()=>get('bill/getsellinfo'),
    delitem_admin:(param)=>post('bill/delitem_admin',param),
    delitem_user:(param)=>post('bill/delitem_user',param),
    get_five_days:()=>get('bill/get_five_days'),
    get_five_month:()=>get('bill/get_five_month')
}

export {BillHelper}