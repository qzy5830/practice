function deepCopy(originValue, wm = new WeakMap()) {
  // Set
  if (originValue.constructor === Set) {
    const set = new Set()
    for (const setItem of originValue) {
      set.add(deepCopy(setItem, wm))
    }
    return set
  }

  // Map
  if (originValue.constructor === Map) {
    const map = new Map()
    for (const [mapKey, mapValue] of originValue) {
      map.set(deepCopy(mapKey, wm), deepCopy(mapValue, wm))
    }
    return map
  }

  // Date
  if (originValue.constructor === Date) {
    return new Date(originValue.getTime())
  }

  // RegExp
  if (originValue.constructor === RegExp) {
    const regExp = new RegExp(originValue.source, originValue.flags)
    regExp.lastIndex = originValue.lastIndex
    return regExp
  }

  // Symbol值
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }

  // null/undefined/function/原始类型
  if (
    originValue === null ||
    originValue === undefined ||
    typeof originValue !== 'object'
  ) {
    return originValue
  }

  // 是否保存过原始对象(解决循环引用)
  if (wm.get(originValue)) {
    return wm.get(originValue)
  }

  // 对象/数组
  const newValue = Array.isArray(originValue) ? [] : {}

  // 保存原始对象(循环引用)
  wm.set(originValue, newValue)

  // 遍历实例属性
  for (const key in originValue) {
    if (originValue.hasOwnProperty(key)) {
      newValue[key] = deepCopy(originValue[key], wm)
    }
  }

  // 遍历SymbolKeys
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const symbolKey of symbolKeys) {
    newValue[Symbol(symbolKey.description)] = deepCopy(
      originValue[symbolKey],
      wm
    )
  }

  return newValue
}
