Helpers = {
  ###
  Returns an object's values.
  @example Will return [1, 2] for {a: 1, b: 2}
  @param obj {Object}
  ###
  objectValues: (obj) ->
    Object.keys(obj).map((k) -> obj[k])
}
