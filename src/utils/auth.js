import Qs from 'qs'
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  const query = Qs.parse(location.hash.substring(1).split('?')[1])
  query.token && setToken(query.token)
  return Cookies.get(TokenKey) || query.token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
