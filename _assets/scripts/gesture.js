function initGlobalGestureHandle(payload) {
  var xUp = null;
  var yUp = null;
  var xDown = null;
  var yDown = null;
  var threshold = payload.threshold || 150;

  function getTouches(evt) {
    return evt.touches || // browser API
      evt.originalEvent.touches; // jQuery
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;

    document.addEventListener('touchmove', handleTouchMove, false);
  };

  function handleTouchEnd(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    var absXDiff = Math.abs(xDiff);
    var absyDiff = Math.abs(yDiff);

    if (absXDiff > absyDiff) {
      if (absXDiff > threshold) {
        document.body.style.overflow = 'hidden';
        if (xDiff > 0) {
          payload.rightSwipe && payload.rightSwipe();
        } else {
          payload.leftSwipe && payload.leftSwipe();
        }
      }
    } else {
      if (absyDiff > threshold) {
        if (yDiff > 0) {
          payload.downSwipe && payload.downSwipe();
        } else {
          payload.upSwipe && payload.upSwipe();
        }
      }
    }

    xUp = null;
    yUp = null;
    xDown = null;
    yDown = null;
    document.removeEventListener('touchmove', handleTouchMove, false);
    document.body.style.overflow = 'scroll';
  }

  function handleTouchMove(evt) {
    xUp = evt.touches[0].clientX;
    yUp = evt.touches[0].clientY;
  };

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);
}

window.$docsify.plugins = [].concat((hook, vm) => {
  hook.mounted(function () {
    var isMobile = document.body.clientWidth <= 600;
    var sidebar = document.querySelector('.sidebar');
    var content = document.querySelector('.content');

    function fold () {
      document.body.classList.toggle('close');
      sidebar.style.transform = 'translateX(300px)';
      content.style.transform = 'translateX(300px)';
    }

    function unFold () {
      document.body.classList.toggle('close');
      sidebar.style.transform = 'translateX(0px)';
      content.style.transform = 'translateX(0px)';
    }
    if (isMobile) {
      function leftSwipe() {
        fold();
      }

      function rightSwipe() {
        unFold();
      }
      initGlobalGestureHandle({ rightSwipe: rightSwipe, leftSwipe: leftSwipe })
    }
  });
}, window.$docsify.plugins);