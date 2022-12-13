import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/basepages/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/basepages/User.vue')
            }, {
                path: '/allstaff',
                name: 'allstaff',
                meta: {
                    title:'所有员工信息'
                },
                component: () => import('../views/employee/AllStaff.vue')
            },{
                path: '/stafftype',
                name: 'stafftype',
                meta: {
                    title: '职工类别'
                },
                component: () => import('../views/employee/StaffType.vue')
            },{
                path: '/alldrug',
                name: 'alldrug',
                meta:{
                    title:'添加员工',
                },
                component: () => import ('../views/drugs/AllDrug.vue')
            },{
                path: '/purchase',
                name: 'purchase',
                meta:{
                    title:'入库信息管理',
                },
                component: () => import ('../views/storehouse/In.vue')
            },{
                path: '/out',
                name: 'out',
                meta:{
                    title:'出库信息管理',
                },
                component: () => import ('../views/storehouse/Out.vue')
            },{
                path: '/factory',
                name: 'factory',
                meta:{
                    title:'制造商信息管理',
                },
                component: () => import ('../views/factory/FactoryInfo.vue')
            },{
                path: '/factory',
                name: 'factory',
                meta:{
                    title:'制造商信息管理',
                },
                component: () => import ('../views/factory/FactoryInfo.vue')
            },{
                path: '/drugs',
                name: 'drugs',
                meta:{
                    title:'药品信息管理',
                },
                component: () => import ('../views/drugs/AllDrug.vue')
            },{
                path: '/drugtype',
                name: 'drugtype',
                meta:{
                    title:'药品类别管理',
                },
                component: () => import ('../views/drugs/DrugCategory.vue')
            },{
                path: '/sell',
                name: 'sell',
                meta:{
                    title:'药品查找以及收银',
                },
                component: () => import ('../views/drugs/Sell.vue')
            },{
                path: '/log',
                name: 'log',
                meta:{
                    title:'日志查看',
                },
                component: () => import ('../views/log/log.vue')
            },{
                path: '/buy',
                name: 'buy',
                meta:{
                    title:'用户购买统计',
                },
                component: () => import ('../views/money/user_sell.vue')
            },{
                path: '/allmoney',
                name: 'allmoney',
                meta:{
                    title:'所有收银统计',
                },
                component: () => import ('../views/money/psinfo.vue')
            },{
                path: '/allcustomer',
                name: 'allcustomer',
                meta:{
                    title:'所有收银统计',
                },
                component: () => import ('../views/users/AllCoustmer.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/login/Login.vue")
    }, {
        path: "/user_find",
        name: "user_find",
        meta: {
            title: '用户主界面'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/users/user_finddrug.vue")
    }, {
        path: "/user_info",
        name: "user_info",
        meta: {
            title: '用户主界面'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/users/user_userinfo.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;