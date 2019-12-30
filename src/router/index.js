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
  {
    path: '/source',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Source',
        component: () => import('@/views/source/index'),
        meta: { title: '数据源', icon: 'form' }
      }
    ]
  },

  {
    path: '/data-tag',
    component: Layout,
    children: [
      {
        path: '',
        name: 'DataTag',
        component: () => import('@/views/form/index'),
        meta: { title: '数据标注', icon: 'form' }
      }
    ]
  },

  {
    path: '/label-sort',
    component: Layout,
    children: [
      {
        path: '',
        name: 'LabelSort',
        component: () => import('@/views/form/index'),
        meta: { title: '标签分类', icon: 'form' }
      }
    ]
  },

  {
    path: '/business-channel',
    component: Layout,
    children: [
      {
        path: '',
        name: 'BusinessChannel',
        component: () => import('@/views/form/index'),
        meta: { title: '业务频道', icon: 'form' }
      }
    ]
  },

  {
    path: '/push-content',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Push content',
        component: () => import('@/views/form/index'),
        meta: { title: '推送内容', icon: 'form' }
      }
    ]
  },

  {
    path: '/push-channel',
    component: Layout,
    children: [
      {
        path: '',
        name: 'PushChannel',
        component: () => import('@/views/form/index'),
        meta: { title: '推送通道', icon: 'form' }
      }
    ]
  },

  {
    path: '/push-target',
    component: Layout,
    children: [
      {
        path: '',
        name: 'PushTarget',
        component: () => import('@/views/form/index'),
        meta: { title: '推送对象', icon: 'form' }
      }
    ]
  },

  {
    path: '/message-template',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MessageTemplate',
        component: () => import('@/views/form/index'),
        meta: { title: '消息模版', icon: 'form' }
      }
    ]
  },

  {
    path: '/message-push',
    component: Layout,
    redirect: '/message-push/table',
    name: 'MessagePush',
    meta: { title: '消息推送', icon: 'example' },
    children: [
      {
        path: 'channel-push',
        name: 'ChannelPush',
        component: () => import('@/views/table/index'),
        meta: { title: '渠道推送', icon: 'table' }
      },
      {
        path: 'content-push',
        name: 'ContentPush',
        component: () => import('@/views/tree/index'),
        meta: { title: '内容推送', icon: 'tree' }
      }
    ]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/example/table',
    name: 'Permission',
    meta: { title: '用户权限', icon: 'example' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/table/index'),
        meta: { title: '用户权限', icon: 'table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/tree/index'),
        meta: { title: '用户角色', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '推送统计', icon: 'form' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
