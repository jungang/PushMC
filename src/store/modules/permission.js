import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      // console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  generateAsyncRouter: function({ commit }, arg) {
    const { roles, roleTypes } = arg
    return new Promise(resolve => {
      let accessedRoutes = []
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        roleTypes.forEach(item => {
          asyncRoutes.forEach(item2 => {
            if (item.path === item2.path) accessedRoutes.push(item2)
            if (item2.children.length > 1) {
              item2.children.forEach(item3 => (item.path === item3.path) || accessedRoutes.push(item2))
            }
          })
        })

        accessedRoutes = Array.from(new Set(accessedRoutes)) // 去重
        // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

        accessedRoutes.sort((a, b) => a.index - b.index) // 排序
      }
      commit('SET_ROUTES', accessedRoutes)
      // console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
