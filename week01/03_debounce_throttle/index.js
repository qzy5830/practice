// 防抖
function debounce(callback, delay, immediate) {
  let timer = null

  // 立即执行
  let invoke = false

  function _debounce(...args) {
    if (timer) clearTimeout(timer)

    // 立即执行
    if (!invoke && immediate) {
      callback.apply(this, args)
      invoke = true
      return
    }

    timer = setTimeout(() => {
      callback.apply(this, args)
      timer = null
      invoke = false
    }, delay)
  }

  _debounce.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
      invoke = false
    }
  }

  return _debounce
}

// 节流
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
