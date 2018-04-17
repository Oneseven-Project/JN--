export function isLogin () {
  const app = getApp()
  let suerInfo = app && app.globalData && app.globalData.userInfo || null
  if (!suerInfo) {
    return false
  } else {
    return true
  }
}
export function getTime (time) {
  let date = new Date(time)
  return date.getTime()
}