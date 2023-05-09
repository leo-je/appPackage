import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import { RouterInfo } from "../interface";
const modules = import.meta.glob('../**/*.vue')

const routes: Array<RouteRecordRaw> = []
const routerInfos: Array<RouterInfo> = [
    {
        path: '/pc',
        name: 'pc-index',
        componentPath: '../view/pc/index.vue',
        children: [
            {
                path: '/pc/exportProcess',
                name: 'pc-exportProcess',
                componentPath: '../view/pc/exportProcess.vue',
            },
            {
                path: '/pc/appPackage',
                name: 'pc-appPackage',
                componentPath: '../view/pc/appPackage.vue',
            },
            {
                path: '/pc/exportDataSource',
                name: 'pc-exportDataSource',
                componentPath: '../view/pc/exportDataSource.vue',
            }
        ]
    },
    {
        path: '/mb',
        name: 'mb-index',
        componentPath: '../view/mb/index.vue',
        children: [
            {
                path: '/mb/exportProcess',
                name: 'mb-exportProcess',
                componentPath: '../view/mb/exportProcess.vue',
            },
            {
                path: '/mb/appPackage',
                name: 'mb-appPackage',
                componentPath: '../view/mb/appPackage.vue',
            },
            {
                path: '/mb/exportDataSource',
                name: 'mb-exportDataSource',
                componentPath: '../view/mb/exportDataSource.vue',
            }
        ]
    },
    {
        path: '/401',
        name: '401',
        componentPath: '../view/pc/401.vue',
    },
    {
        path: '/mbcomm/login',
        name: 'mb-login',
        componentPath: '../view/mb/login.vue',
    },
    {
        path: '/pccomm/login',
        name: 'pc-login',
        componentPath: '../view/pc/login.vue',
    }

]
const getRow = (routerInfo: RouterInfo): RouteRecordRaw => {
    let view = modules[routerInfo.componentPath ? routerInfo.componentPath.replace("@", "..").replace("src", "..") : "../view/commonView.vue"]
    const row: RouteRecordRaw = {
        path: routerInfo.path ? routerInfo.path : "",
        name: routerInfo.name,
        component: view,
        children: []
    }
    if (routerInfo.children != null && routerInfo.children.length > 0) {
        const ch: RouteRecordRaw[] = []
        routerInfo.children.forEach(c => {
            ch.push(getRow(c))
        })
        row.children = ch
    }
    return row;
}

if (routerInfos) {
    routerInfos.forEach(routerInfo => {
        if (!routerInfo.componentPath) return;
        const row = getRow(routerInfo)
        routes.push(row)
    })
}

console.log(routes)

let router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    let path = null
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        if (to.path.indexOf('/pc') !== -1) {
            path = to.path.replace('/pc', '/mb')
        } else {
            if (to.path.indexOf('/mb') !== -1) {
                //next();
            } else
                path = '/mb'
        }
    } else {
        if (to.path.indexOf('/mb') !== -1) {
            path = to.path.replace('/mb', '/pc')
        } else {
            if (to.path.indexOf('/pc') !== -1) {
                //next();
            } else
                path = '/pc'
        }
    }
    if (path) {
        next({ path: path })
    } else {
        next()
    }
})

export default router;

export function setRouter(data: RouterInfo) {
    console.log("setRouter==============>" + router)
    let routerInfos = data.children;
    let routes2: Array<RouteRecordRaw> = []
    if (routerInfos) {
        routerInfos.forEach((routerInfo) => {
            const row = getRow(routerInfo)
            routes2.push(row)
        })
    }
    routes2.forEach(r => {
        router.addRoute(r)
    })
    let dd = router.getRoutes()
    console.log("setRouter==============>" + dd)
    router.push({ path: "/" })
    return router
}

export function getRouter(): Router {
    return router
}