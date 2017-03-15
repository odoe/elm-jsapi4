// http://codereview.stackexchange.com/questions/106946/simple-animation-method-with-requestanimationframe-code-structure
export function animate(options) {
  options = options || {};

  // defaults
  const duration = options.duration || 500,
    ease = options.easing || function (a) { return a }, // basic linear easing
    onProgress = options.onProgress || function () { },
    onComplete = options.onComplete || function () { },
    from = options.from || {},
    to = options.to || {};

  // runtime variables
  const startTime = Date.now();

  function update() {
    let deltaTime = Date.now() - startTime,
      progress = Math.min(deltaTime / duration, 1),
      factor = ease(progress),
      values = {},
      property;

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

export function inSine(t) {
  return -Math.cos(t * Math.PI / 2) + 1;
}
