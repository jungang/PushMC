import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // console.log(hasRoles)
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          console.log('40-roles:', roles)
          let roleTypes = [] // 权限数组，含多个角色
          roles.forEach(item => {
            // console.log(item)

            // console.log(item.smPermissions)

            if (item.smPermissions) {
              item.smPermissions.forEach(item2 => {
                roleTypes.push(item2)
              })
            }
          })

          console.log('roleTypes:', roleTypes)
          store.state.permission.permissions = roleTypes.map(item => item.id)
          // const { roleTypes } = await store.dispatch('user/getPermission', roles)

          roleTypes = Array.from(new Set(roleTypes)) // 去重

          // console.log('roleTypes:', roleTypes)
          // generate accessible routes map based on roles

          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          const accessRoutes = await store.dispatch('permission/generateAsyncRouter', { roles, roleTypes })

          // console.log(accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log('token errrrrrrrrrrrrror')
          console.log(error)
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
