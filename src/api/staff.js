import {post,get} from '../utils/request'

//员工类API
const StaffHelper = {
    getTypes:()=>post('staff/getTypeList'),
    getAllStaff:()=>get('staff/getStaffList'),
    addStaff:(info)=>post('staff/addStaff',info),
    deleteStaff:(id)=>post('staff/deletestaff',id),
    updateInfo:(info)=>post('staff/changeInfo',info),
    addType:(info)=>post('staff/addType',info),
    deleteType:(id)=>post('staff/deleteType',id),
    updateType:(info)=>post('staff/updateType',info),
}

export {StaffHelper}