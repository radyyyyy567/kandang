import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'register',
        path: `${AUTH_PREFIX_PATH}/register`,
        component: React.lazy(() => import('views/auth-views/authentication/register')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    }
]

export const protectedRoutes = [
    {
        key: 'user-list',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/pages/user-list')),
    },
    {
        key: 'user-list',
        path: `${APP_PREFIX_PATH}/user-list`,
        component: React.lazy(() => import('views/app-views/pages/user-list')),
    },
    {
        key: 'position',
        path: `${APP_PREFIX_PATH}/position`,
        component: React.lazy(() => import('views/app-views/pages/position')),
    },
    {
        key: 'division',
        path: `${APP_PREFIX_PATH}/division`,
        component: React.lazy(() => import('views/app-views/pages/division')),
    },
    {
        key: 'farm',
        path: `${APP_PREFIX_PATH}/farm`,
        component: React.lazy(() => import('views/app-views/pages/farm')),
    },
    {
        key: 'henhouse',
        path: `${APP_PREFIX_PATH}/henhouse`,
        component: React.lazy(() => import('views/app-views/pages/henhouse')),
    },

    {
        key: 'product',
        path: `${APP_PREFIX_PATH}/product`,
        component: React.lazy(() => import('views/app-views/pages/product')),
    },
    {
        key: 'uprove',
        path: `${APP_PREFIX_PATH}/pages/uprove`,
        component: React.lazy(() => import('views/app-views/pages/uprove')),
    },
]   