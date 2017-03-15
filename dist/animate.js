define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.animate = animate;
  exports.inSine = inSine;
  // http://codereview.stackexchange.com/questions/106946/simple-animation-method-with-requestanimationframe-code-structure
  function animate(options) {
    options = options || {};

    // defaults
    var duration = options.duration || 500,
        ease = options.easing || function (a) {
      return a;
    },
        // basic linear easing
    onProgress = options.onProgress || function () {},
        onComplete = options.onComplete || function () {},
        from = options.from || {},
        to = options.to || {};

    // runtime variables
    var startTime = Date.now();

    function update() {
      var deltaTime = Date.now() - startTime,
          progress = Math.min(deltaTime / duration, 1),
          factor = ease(progress),
          values = {},
          property = void 0;

      for (property in from) {
        if (from.hasOwnProperty(property) && to.hasOwnProperty(property)) {
          values[property] = from[property] + (to[property] - from[property]) * factor;
        }
      }

      onProgress(values);

      if (progress === 1) {
        onComplete(deltaTime);
      } else {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function inSine(t) {
    return -Math.cos(t * Math.PI / 2) + 1;
  }
});
//# sourceMappingURL=animate.js.map