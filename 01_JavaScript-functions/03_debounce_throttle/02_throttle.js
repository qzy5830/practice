function throttle(
  callback,
  interval,
  { leading = true, trailing = true } = {}
) {
  let startTime = 0

  let timer = null

  function _throttle(...args) {
    const nowTime = Date.now()

    // 头部执行控制
    if (!leading && !startTime) startTime = nowTime

    const waitTime = interval - (nowTime - startTime)

    if (waitTime <= 0) {
      callback.apply(this, args)
      startTime = nowTime
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      return
    }

    if (trailing && !timer) {
      timer = setTimeout(() => {
        callback.apply(this, args)
        timer = null
        startTime = !leading ? 0 : Date.now()
      }, waitTime)
    }
  }

  _throttle.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
      startTime = 0
    }
  }

  return _throttle
}
