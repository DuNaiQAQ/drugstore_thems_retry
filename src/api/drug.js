import {post,get} from '../utils/request'

const DrugHelper= {
    add_druginfo:(param)=>post('drug/adddrug',param),
    del_druginfo:(id)=>post('drug/deldrug',id),
    update_druginfo:(param)=>post('drug/updatedrug',param),
    get_druginfo:(param)=>get('drug/getdrugs',param),
    get_category:()=>get('drug/getcategory'),
    get_category_form:()=>get('drug/getcategory_form'),
    add_category:(param)=>post('drug/addcategory',param),
    del_category:(id)=>post('drug/delcategory',id),
    update_category:(param)=>post('drug/updatecategory',param),
    search_info:(param)=>post('drug/searching',param),
}

export {DrugHelper}