//////////////////////////////////////////////////////////////////
// Developed By: Mitr Learning & Media							//
// Name: CommonComponent										//
// Description: All required common components.			 		//
// Date Created: 07/05/2014										//
// Date Modified: 07/05/2014									//
// Version: 1.0:												//
//////////////////////////////////////////////////////////////////

//================================================================================
//////////////////////////////////////////////////////////////////
// Developed By: Mitr Learning & Media							//
// Name: GLOBALFUNCCLS											//
// Description: All global open functions can be found here.	//
// platform.													//
// Date Created: 07/05/2014										//
// Date Modified: 07/05/2014									//
// Version: 1.0:												//
//////////////////////////////////////////////////////////////////
//================================================================
//================================================================
//================================================================
var BrowserDetect = {
  Android: function() {
    return navigator.userAgent.match(/Android/i) ? true : false;
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
  },
  iOS7: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) &&
      navigator.userAgent.match(/CPU OS 7/i)
      ? true
      : false;
  },
  Surface: function() {
    return navigator.userAgent.match(/Trident/i) &&
      navigator.userAgent.match(/Touch/i)
      ? true
      : false;
  },
  any: function() {
    return (
      BrowserDetect.Android() ||
      BrowserDetect.BlackBerry() ||
      BrowserDetect.iOS()
    );
  },
  ie9: function() {
    return navigator.userAgent.match(/MSIE 9.0/i) ? true : false;
  },
  ie10: function() {
    return navigator.userAgent.match(/MSIE 10.0/i) ? true : false;
  },
  ie: function() {
    return navigator.userAgent.match(/MSIE/i) ||
      navigator.userAgent.match(/Trident/i)
      ? true
      : false;
  },
  FF: function() {
    return typeof InstallTrigger !== 'undefined';
  },
  SafariMAC: function() {
    return (
      /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor) &&
      !BrowserDetect.any()
    );
  }
};
//================================================================================
//================================================================================
//================================================================================
// GlobalAnimClass is accepts objects
// id: Required to stop the particular animation.
// fps (optional): Frame per second.
// delay (optional): if delay given then fps will not work.
// start (optional): Callback when the animation starts.
// frame (optional): Callback when the animation is playing.
// stop (optional): Callback when the animation stops.
//================================================================================
var GlobalAnimClass = function() {
  var animObjects = new Object();
  var _thisObj = this;
  var animPlaying = false;
  var requestId;
  //================================================================
  this.start = function(_obj) {
    // if (_obj.id)
    {
      animObjects = _obj;
      if (!_obj.immediate) {
        animObjects.oldDate = new Date();
      }
      animObjects.lastFrame = null;
      animObjects.start ? animObjects.start() : null;
    }
    if (!animPlaying) {
      animPlaying = true;
      enterFrame();
    }
  };
  //================================================================
  this.stop = function(_id) {
    // if (_id)
    {
      if (animObjects) {
        animObjects.stop ? animObjects.stop() : null;
        animObjects != undefined ? delete animObjects : null;
      }
    }
    if (objectSize(animObjects) == 0) {
    }
    animPlaying = false;
    cancelAnimationFrame(requestId);
  };
  //================================================================
  this.reset = function(_id) {
    animObjects.resetVal = true;
  };
  //================================================================
  function enterFrame() {
    var _newDate = new Date();
    //--------------------------
    // for (var i in animObjects)
    {
      if (animObjects.delay != undefined) {
        //i == "processNextGame" ? console.log((_newDate - animObjects.oldDate)+" >= "+animObjects.delay) : null;
        if (
          typeof animObjects.oldDate == 'undefined' ||
          _newDate - animObjects.oldDate >= animObjects.delay
        ) {
          animObjects.oldDate = _newDate;
          animObjects.frame ? animObjects.frame(i) : null;
        }
      } else if (animObjects.fps != undefined) {
        var _curFrame = Math.ceil(
          (_newDate - animObjects.oldDate) / ((1 / animObjects.fps) * 1000)
        );
        if (animObjects.lastFrame != _curFrame) {
          if (animObjects.resetVal) {
            animObjects.oldDate = new Date();
            _curFrame = 1;
            animObjects.resetVal = null;
          }
          animObjects.lastFrame = _curFrame;
          animObjects.frame
            ? animObjects.frame({ id: i, frame: _curFrame })
            : null;
        }
      }
    }
    //--------------------------
    if (animPlaying) {
      requestId = requestAnimationFrame(enterFrame);
    }
  }
  //================================================================
  function objectSize(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }
  //================================================================
  //================================================================
  (function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame =
        window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  })();
  //================================================================
  //================================================================
};
//var globalAnimClassObject = new GlobalAnimClass();
//================================================================================
//================================================================================
var PreloadImagesCls = function() {
  var imgObj = new Object();
  var totalImages = 0;
  var imagesLoaded = 0;
  var callBack, preLoadDiv;
  //================================================================================
  this.loadImages = function(_arr, _cb) {
    callBack = _cb;
    totalImages = _arr.length;
    for (var i = 0; i < _arr.length; i++) {
      var j = _arr[i]
        .split('/')
        .reverse()[0]
        .split('.')[0];
      imgObj[j] = new Image();
      imgObj[j].onload = loadedFn;
      imgObj[j].src = _arr[i];
    }
    //--------------------------------
    preLoadDiv = document.createElement('div');
    $('body').append(preLoadDiv);
    $(preLoadDiv).css({
      background: 'url(../com/images/loading.gif) no-repeat',
      width: globalResizeCalc(1024) + 'px',
      height: globalResizeCalc(696) + 'px',
      'background-position': 'center'
    });
  };
  //================================================================================
  this.getImage = function(_img) {
    return imgObj[_img];
  };
  //================================================================================
  function loadedFn() {
    imagesLoaded++;
    if (imagesLoaded >= totalImages - 1) {
      $(preLoadDiv).remove();
      $(preLoadDiv).hide();
      if (callBack) {
        callBack();
        callBack = null;
      }
    }
  }
};
//================================================================================
//================================================================================
//================================================================================
$(window).mouseup(function(e) {
  /* if(document.getElementById("myframe").contentWindow)
	{
		document.getElementById("myframe").contentWindow.onWindowMouseUp();
	} */
});
//================================================================================
//================================================================================
//================================================================================
var applePreloadCls = function() {
  var p = {
    segments: 10,
    color: '#FFFFFF',
    radius: 20,
    offset: 8,
    fps: 12,
    height: 4
  };
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var mainAngle = 0;
  var interval_obj = new GlobalAnimClass();
  //==========================================
  this.show = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    //
    if (p.target && p.target.length > 0) {
      p.target.append(canvas);
      canvas.width = p.radius * 2;
      canvas.height = p.radius * 2;
      $(canvas).css({
        position: 'absolute',
        left: '50%',
        top: '50%',
        'margin-left': '-' + p.radius + 'px',
        'margin-top': '-' + p.radius + 'px'
      });
      //
      createSegments();
      interval_obj.start({ id: 'preload', fps: p.fps, frame: createSegments });
    }
  };
  //==========================================
  this.hide = function() {
    interval_obj.stop('preload');
    canvas.width = canvas.width;
    $(canvas).remove();
    mainAngle = 0;
  };
  //==========================================
  //==========================================
  function createSegments() {
    canvas.width = canvas.width;
    var _angle = 360 / p.segments;
    var _alpha = 1 / p.segments;
    for (var i = 0; i < p.segments; i++) {
      context.save();
      context.fillStyle = p.color;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(((mainAngle + _angle * i) * Math.PI) / 180);
      context.translate(-1 * (canvas.width / 2), -1 * (canvas.height / 2));
      context.globalAlpha = _alpha * (i + 1);
      context.fillRect(
        canvas.width / 2 + p.offset,
        canvas.height / 2 - p.height / 2,
        p.radius - p.offset,
        p.height
      );
      context.restore();
    }
    mainAngle += _angle;
  }
};
//================================================================================
//================================================================================
//================================================================================
function dispatchEvent(_obj) {
  _obj.target = _obj.type;
  _obj.type = 'evtdispatch';
  $.event.trigger(_obj);
}
//================================================================================
//================================================================================
function globalBtnMessage() {
  alert('This functionality is not available in this version.');
}
//================================================================================
