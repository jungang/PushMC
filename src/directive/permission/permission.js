import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const hasPermission = store.state.permission.permissions.find(item => item === value)
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
