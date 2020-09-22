/* 
stage: canvas id where the animation to be played.
timeline: json file extracted from the tool.
images: images.json created by the image_compression tool.
fps: frame rate for the animation.
progress: callback function trigerred while loading with percent.
ready: callback function trigerred once loaded.
*/
var AnimationManager = function(_obj) {
  var pObj = {
    stage: '',
    id: '',
    timeline: '',
    images: '',
    fps: 24,
    scale: 1,
    progress: function() {},
    ready: function() {}
  };
  //=================================
  for (var i in _obj) {
    pObj[i] = _obj[i];
  }
  //=================================
  var thisObj = this;
  var jsonObj, allImages, imgObj, totalImages, lastIndex, totalFrames;
  var curFrame = 1;
  var segment = new Object();
  var scaleLevel = pObj.scale;
  var globalAnimClassObject;
  //=================================
  var cnv = pObj.stage;
  cnv.width = pObj.width;
  cnv.height = pObj.height;
  var ctx = cnv.getContext('2d');
  loadImgData();
  //=================================
  // PRIVATE FUNCTIONS
  //=================================
  function loadImgData() {
    globalAnimClassObject = new GlobalAnimClass();
    loadAssets(pObj.images, pObj.progress, function(e) {
      allImages = new Object();
      allImages = JSON.parse(e.target.responseText);
      loadPageData();
    });
  }
  //=================================
  function loadPageData() {
    loadAssets(pObj.timeline, pObj.progress, function(e) {
      jsonObj = JSON.parse(e.target.responseText);
      //
      imgObj = new Object();
      totalImages = 0;
      //
      for (var i in jsonObj.preloadarr) {
        var _obj = jsonObj.preloadarr[i];
        var _file = _obj.p.split('/').reverse()[0];
        totalImages++;
        //
        imgObj[i] = new Object();
        imgObj[i].x = _obj.x;
        imgObj[i].y = _obj.y;
        imgObj[i].w = _obj.w;
        imgObj[i].h = _obj.h;
        imgObj[i].img = new Image();
        imgObj[i].img.onload = imagesLoaded;
        imgObj[i].img.src = allImages[_file];
      }
      allImages = null;
      //
      totalFrames = 0;
      for (var i in jsonObj.mainTimeLine) {
        totalFrames++;
      }
    });
  }
  //=================================
  function loadAssets(_path, _progress, _complete) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener('progress', loadAssetCB, false);
    oReq.addEventListener('load', _complete, false);
    oReq.addEventListener('error', loadAssetCB, false);
    oReq.addEventListener('abort', loadAssetCB, false);
    oReq.open('GET', _path, true);
    oReq.send();
  }
  //=================================
  function loadAssetCB(e) {}
  //=================================
  function imagesLoaded(e) {
    totalImages--;
    if (totalImages == 0) {
      pObj.ready();
    }
  }
  //=================================
  //=================================
  function drawFrame(_curIndex) {
    if (jsonObj.mainTimeLine['f_' + _curIndex] != undefined) {
      var _arr = jsonObj.mainTimeLine['f_' + _curIndex].o;
      cnv.width = cnv.width;
      for (var i = _arr.length - 1; i >= 0; i--) {
        var _o = _arr[i];
        if (_o.i != undefined) {
          var _ii = _o.i.split('_');
          var _fr = jsonObj.mainTimeLine['f_' + _ii[1]].o;
          for (var _k = 0; _k < _fr.length; _k++) {
            if (jsonObj.mainTimeLine['f_' + _ii[1]].o[_k].l == _ii[0]) {
              _o = jsonObj.mainTimeLine['f_' + _ii[1]].o[_k];
              break;
            }
          }
        }
        ctx.save();
        /*
				n: Name
				x: x position
				y: y position
				w: width
				h: height
				a: SkewX
				b: SkewY
				c: ScaleX
				d: ScaleY
				o: Alpha
				*/
        if (_o.r) {
          ctx.translate(_o.x * scaleLevel, _o.y * scaleLevel);
          ctx.rotate((_o.r * Math.PI) / 180);
          ctx.translate(-1 * (_o.x * scaleLevel), -1 * (_o.y * scaleLevel));
        } else {
          if (_o.a == 180 || _o.b == 180) {
            ctx.translate(
              _o.b == 180 ? _o.x * scaleLevel : 0,
              _o.a == 180 ? _o.y * scaleLevel : 0
            );
            ctx.scale(_o.b == 180 ? -1 : 1, _o.a == 180 ? -1 : 1);
            ctx.translate(
              _o.b == 180 ? -1 * (_o.x * scaleLevel) : 0,
              _o.a == 180 ? -1 * (_o.y * scaleLevel) : 0
            );
          }
          if ((_o.a > 0 && _o.a < 180) || (_o.b > 0 && _o.b < 180)) {
            ctx.translate(_o.x * scaleLevel, _o.y * scaleLevel);
            ctx.rotate((_o.b * Math.PI) / 180);
            ctx.translate(-1 * (_o.x * scaleLevel), -1 * (_o.y * scaleLevel));
          }
        }

        ctx.globalAlpha = _o.o;

        /*if(_o.shadowColor)
				{
					ctx.shadowColor = _o.shadowColor;
					ctx.shadowBlur = _o.shadowBlur * 3;
				}*/
        if (imgObj[_o.n]) {
          ctx.drawImage(
            imgObj[_o.n].img,
            (_o.x - imgObj[_o.n].x * _o.c) * scaleLevel,
            (_o.y - imgObj[_o.n].y * _o.d) * scaleLevel,
            _o.w * scaleLevel,
            _o.h * scaleLevel
          );
        } else {
          ////console.log(_o.n+" not found...");
        }

        ctx.restore();
      }
    }
    //-------------------------
    lastIndex = _curIndex;
  }
  //=================================
  function playMovie() {
    if (typeof segment.start != 'undefined') {
      curFrame = segment.start;
    }
    globalAnimClassObject.start({
      /*id:"jsfl"*/ id: pObj.id,
      fps: pObj.fps,
      frame: function() {
        drawFrame(curFrame);
        //
        if (typeof segment.frame == 'function') {
          segment.frame(curFrame);
        }
        //
        if (typeof segment.end != 'undefined') {
          if (curFrame >= segment.end) {
            onEndAnim();
          }
        } else {
          if (curFrame >= totalFrames) {
            onEndAnim();
          }
        }
        //
        curFrame++;
      }
    });
  }
  //=================================
  function onEndAnim() {
    if (segment.loop) {
      if (typeof segment.start != 'undefined') {
        curFrame = segment.start;
      } else {
        curFrame = 0;
      }
    } else {
      if (typeof segment.stop == 'function') {
        segment.stop(curFrame);
      }
      thisObj.stop();
    }
  }
  //=================================
  // PUBLIC FUNCTIONS
  //=================================
  /*
	playSegment:
	start: Optional. The animation will start from this frame. If not provided, the animation will start from the current frame.
	end: Optional. The animation will end at this frame. If not provided, the animation will continue till the last frame. if the current frame is more than the end frame then it will not play unless the loop is true.
	loop: Optional. Default false. To make the animation play in loop.
	frame: Optional. Callback function will be trigerred on each frame change.
	stop: Optional. Callback function will be trigerred on when the animation will end. This will not triger in case of loop is set to true.
	*/
  this.playSegment = function(_obj) {
    thisObj.stop();
    segment = new Object();
    for (var i in _obj) {
      segment[i] = _obj[i];
    }
    //
    if (typeof _obj['fps'] != 'undefined') {
      pObj['fps'] = _obj['fps'];
    } else {
      pObj['fps'] = 24;
    }
    //
    playMovie();
  };
  //=================================
  this.gotoAndStop = function(_frame) {
    thisObj.stop();
    curFrame = _frame;
    drawFrame(curFrame);
  };
  //=================================
  this.stop = function() {
    globalAnimClassObject.stop(/*"jsfl"*/ pObj.id);
  };

  this.setFrame = function(num) {
    drawFrame(num);
  };
  //=================================
};
