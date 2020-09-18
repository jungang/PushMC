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
    const { roleTypes } = arg
    return new Promise(resolve => {
      const accessedRoutes = asyncRoutes

      accessedRoutes.forEach(topMenu => {
        const status = roleTypes.find(userPms => userPms.id === topMenu.id)
        if (!status) {
          topMenu.children = topMenu.children.filter(subMenu => {
            return roleTypes.find(userPms => userPms.id === subMenu.id)
          })
        }
      })
      const _accessedRoutes = accessedRoutes.filter(item => {
        // console.log(item)
        // console.log(item.children.length)
        return item.children.length > 0
      })

      commit('SET_ROUTES', _accessedRoutes)
      // console.log(accessedRoutes)
      resolve(_accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
