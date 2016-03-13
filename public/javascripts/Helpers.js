var Helpers;

Helpers = {

  /*
  Returns an object's values.
  @example Will return [1, 2] for {a: 1, b: 2}
  @param obj {Object}
   */
  objectValues: function(obj) {
    return Object.keys(obj).map(function(k) {
      return obj[k];
    });
  }
};
