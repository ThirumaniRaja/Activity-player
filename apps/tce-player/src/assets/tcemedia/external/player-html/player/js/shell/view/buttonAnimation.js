/* This module is a temporary module and is used to create highlighting effect of Play button using canvan animation */

var buttonAnimation = function(_ref) {
  var navControlObj = _ref;
  var globalAnimClassObject = new GlobalAnimClass();
  var p = {
    top: 0,
    left: 0,
    target: 'body'
  };
  var ImageArr = [];
  var cvs, context;
  var count = -1;
  var myToolTip;

  // ====== Private functions ========
  function stopDiv(e) {
    navControlObj.setPauseState();
    navControlObj.managePlayPause();
    $(cvs).css('display', 'none');
  }

  function createButton() {
    cvs = document.createElement('canvas');
    context = cvs.getContext('2d');
    $(p.target).append(cvs);
    $(cvs).css({
      position: 'absolute',
      top: p.top + 'px',
      left: p.left + 'px',
      display: 'none'
    });
    cvs.width = ImageArr[0].width;
    cvs.height = ImageArr[0].height;
    $(cvs).click(stopDiv);
    $(cvs).bind('mouseover', function() {
      displayTootlip();
    });
    $(cvs).bind('mouseout', function() {
      removeTootlip();
    });
  }
  function displayTootlip() {
    myToolTip.showToolTip(
      $(cvs).position().top,
      $(cvs).position().left - 2,
      $(cvs).width(),
      'Play'
    );
  }
  function removeTootlip() {
    myToolTip.hideToolTip();
  }
  function loopCall() {
    globalAnimClassObject.start({
      id: 'button',
      fps: 12,
      frame: nextImage
    });
  }
  function nextImage() {
    count++;
    cvs.width = cvs.width;
    context.drawImage(
      ImageArr[count],
      0,
      0,
      ImageArr[count].width,
      ImageArr[count].height
    );
    if (count == 14) count = -1;
  }
  // ====== End Private functions ========

  // ====== Public functions ========
  this.init = function(_imageArr, _obj, _tooTipObj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    var counter = 0;
    for (var i = 0; i < _imageArr.length; i++) {
      var images = new Image();
      images.src = _imageArr[i];
      ImageArr.push(images);
      images.onload = function() {
        counter++;
        if (counter == _imageArr.length) {
          createButton();
          loopCall();
        }
      };
    }
    myToolTip = _tooTipObj;
  };
  this.reset = function() {
    globalAnimClassObject.stop('button');
    context.drawImage(ImageArr[0], 0, 0, ImageArr[0].width, ImageArr[0].height);
    count = -1;
  };
  this.show = function() {
    $(cvs).css('display', 'block');
  };
  this.hide = function() {
    $(cvs).css('display', 'none');
  };
  this.start = function() {
    globalAnimClassObject.start({
      id: 'button',
      fps: 12,
      frame: nextImage
    });
  };
  this.destroy = function() {
    globalAnimClassObject.stop('button');
    globalAnimClassObject = null;
    for (var i = 0; i < ImageArr.length; i++) {
      ImageArr[i].src = '';
    }
    ImageArr = null;
    $(cvs).unbind();
    $(cvs).remove();
    cvs = null;
    context;
    count = null;
    myToolTip = null;
  };
  // ====== End Public functions ========
};
