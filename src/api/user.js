import {post,get} from '../utils/request'

const UserHelper= {
    //用户登录
    login:(params,contenttype)=>post('/user/login',params),
    getRule:()=>get('user/getrole'),
    changePass:(info)=>post('user/changePass',info),
    changePass_admin:(info)=>post('user/changePass_admin',info),
    logout_admin:()=>get('user/logout_admin'),
    logout_user:()=>get('user/logout_user'),
    getHomeInfo:()=>get('user/getHome'),
    getWarning:()=>get('user/getWarning')
}

export {UserHelper}

