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
