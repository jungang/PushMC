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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    id: '10',
    index: 1,
    path: '/source',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Source',
        component: () => import('@/views/source/index'),
        meta: {
          title: '数据源',
          icon: 'form'
        }
      }
    ]
  },

  {
    index: 20,
    path: '/data-tag',
    component: Layout,
    redirect: '/data-tag/list',
    name: 'DataTag',
    meta: { title: '数据标注', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/dataTag/index'),
        meta: { title: '数据标注', icon: 'form' }
      },
      {
        path: 'edit',
        name: 'Edit',
        component: () => import('@/views/dataTag/edit'),
        meta: { title: '标注', icon: 'form' },
        hidden: true
      }
    ]
  },

  {
    index: 30,
    path: '/category',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: {
          title: '标签分类',
          icon: 'form'
        }
      }
    ]
  },

  {
    index: 40,
    path: '/business-channel',
    component: Layout,
    children: [
      {
        path: '/business-channel',
        name: 'BusinessChannel',
        component: () => import('@/views/businessChannel/index'),
        meta: { title: '业务频道', icon: 'form' }
      }
    ]
  },

  {
    index: 50,
    path: '/push-content',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Push content',
        component: () => import('@/views/pushContent/index'),
        meta: { title: '推送内容', icon: 'form' }
      }
    ]
  },
  {
    index: 60,
    path: '/examine',
    component: Layout,
    meta: {
      title: '',
      icon: 'nested',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'Examine',
        component: () => import('@/views/examine/index'),
        meta: {
          title: '内容审批',
          icon: 'form'
        }
      }
    ]
  },

  {
    index: 70,
    path: '/push-channel',
    component: Layout,
    children: [
      {
        path: '',
        name: 'PushChannel',
        component: () => import('@/views/pushChannel/index'),
        meta: { title: '推送通道', icon: 'form' }
      }
    ]
  },

  {
    index: 80,
    path: '/push-target',
    component: Layout,
    children: [
      {
        path: '',
        name: 'PushTarget',
        component: () => import('@/views/pushTarget/index'),
        meta: { title: '推送对象', icon: 'form' }
      }
    ]
  },

  {
    index: 90,
    path: '/message-template',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MessageTemplate',
        component: () => import('@/views/messageTemplate/index'),
        meta: { title: '消息模版', icon: 'form' }
      }
    ]
  },

  {
    index: 100,
    path: '/message-push',
    component: Layout,
    redirect: '/channel-push',
    name: 'MessagePush',
    meta: { title: '消息推送', icon: 'example' },
    children: [
      {
        path: '/channel-push',
        name: 'ChannelPush',
        component: () => import('@/views/channelPush/index'),
        meta: { title: '频道推送', icon: 'table' }
      },
      {
        path: '/pipe-push',
        name: 'PipePush',
        component: () => import('@/views/pipePush/index'),
        meta: { title: '渠道推送', icon: 'table' }
      },
      {
        path: '/content-push',
        name: 'ContentPush',
        component: () => import('@/views/contentPush/index'),
        meta: { title: '内容推送', icon: 'tree' }
      }
    ]
  },

  {
    index: 110,
    path: '/permission',
    component: Layout,
    redirect: '/example/table',
    name: 'Permission',
    meta: { title: '用户权限', icon: 'example' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/permission/index'),
        meta: { title: '用户角色', icon: 'table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/permission/role'),
        meta: { title: '用户权限', icon: 'tree' }
      }
    ]
  },

  {
    index: 120,
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/index',
    children: [
      {
        path: 'index',
        name: 'Statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '推送统计', icon: 'form' }
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
