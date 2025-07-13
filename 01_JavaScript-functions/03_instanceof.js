function _instanceof(instance, constructor) {
  // 获取实例的原型对象
  let prototype = Object.getPrototypeOf(instance)

  // 遍历实例的原型链, 逐层查找, 找到就返回true, 没有找到就返回false
  while (prototype) {
    if (prototype === constructor.prototype) return true
    prototype = Object.getPrototypeOf(prototype)
  }

  return false
}
