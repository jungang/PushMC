import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true, info: '' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: 'dashboard',
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    id: 10,
    index: 10,
    path: '/manage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'MessagePush',
    meta: {
      title: '推送管理',
      icon: 'example',
      activeMenu: '/channel-push',
      info: ''

    },
    children: [
      {
        id: 11,
        path: 'source',
        name: 'ChannelPush',
        component: () => import('@/views/source/index'),
        meta: { title: '数据源', icon: 'table', info: '' }
      },
      {
        id: 12,
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: { title: '标签分类', icon: 'table', info: '' }
      },
      {
        id: 13,
        path: 'source/edit',
        name: 'Edit',
        component: () => import('@/views/dataTag/edit'),
        meta: { title: '标注', icon: 'form', info: '' },
        hidden: true
      },
      {
        id: 14,
        path: '/business-channel',
        name: 'BusinessChannel',
        component: () => import('@/views/businessChannel/index'),
        meta: { title: '推送频道', icon: 'form', info: 'channel' }
      },
      {
        id: 15,
        path: 'push-channel',
        name: 'PushChannel',
        component: () => import('@/views/pushChannel/index'),
        meta: { title: '推送通道', icon: 'table', info: '' }
      },
      {
        id: 16,
        path: 'push-target',
        name: 'PushTarget',
        component: () => import('@/views/pushTarget/index'),
        meta: { title: '推送对象', icon: 'form', info: 'target' }
      },
      {
        id: 17,
        path: 'channel-push',
        name: 'ChannelPush',
        component: () => import('@/views/channelPush/index'),
        props: {
          type: 'business'
        },
        meta: { title: '消息推送', icon: 'table', info: 'push_channel' }
      }
    ]
  },

  {
    id: 20,
    index: 20,
    path: '/content',
    component: Layout,
    redirect: 'noRedirect',
    name: 'MessagePush',
    meta: { title: '内容管理', icon: 'example', info: '' },
    children: [
      {
        id: 21,
        path: 'push-content',
        name: 'Push content',
        component: () => import('@/views/pushContent/index'),
        meta: { title: '推送内容', icon: 'form', info: '' }
      },
      {
        id: 22,
        path: 'examine-content',
        name: 'Examine',
        component: () => import('@/views/examine/index'),
        meta: { title: '内容审批', icon: 'form', info: '' }
      }
    ]
  },
  {
    id: 30,
    index: 20,
    path: '/permission',
    component: Layout,
    redirect: 'noRedirect',
    name: 'MessagePush',
    meta: { title: '运营监控', icon: 'example', info: '' },
    children: [
      {
        id: 31,
        path: 'user',
        name: 'User',
        component: () => import('@/views/permission/index'),
        meta: { title: '用户权限', icon: 'table', info: '' }
      },
      {
        id: 32,
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '推送统计', icon: 'form', info: '' }
      }
    ]
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
