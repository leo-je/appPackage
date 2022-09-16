import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import { RouterInfo } from "../interface";
const modules = import.meta.glob('../**/*.vue')

const routes: Array<RouteRecordRaw> = []
const routerInfos: Array<RouterInfo> = [
    {
        path: '/',
        name: 'index',
        componentPath: '../view/index.vue',
        children: [
            {
                path: '/exportProcess',
                name: 'exportProcess',
                componentPath: '../view/exportProcess.vue',
            },
            {
                path: '/appPackage',
                name: 'appPackage',
                componentPath: '../view/appPackage.vue',
            },
            {
                path: '/exportDataSource',
                name: 'exportDataSource',
                componentPath: '../view/exportDataSource.vue',
            }
        ]
    },
    {
        path: '/401',
        name: '401',
        componentPath: '../view/401.vue',
    },
    {
        path: '/login',
        name: 'login',
        componentPath: '../view/login.vue',
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