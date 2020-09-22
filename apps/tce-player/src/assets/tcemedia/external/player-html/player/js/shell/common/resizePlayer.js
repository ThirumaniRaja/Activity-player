var shellWidth = 993;
var shellHeight = 610;

var resizeWindow = function(_iFrameRef, _maxHeight, _left, _top) {
  var self = this;
  var _bool = false;

  var iFrameTop = 30;
  //var bufferHeight = (30 + 50 + 60);
  //this.bufferHeight = 140;
  this.bufferHeight = 0;
  var newShellHeight;
  var newShellWidth;
  var agent;
  var scale = 1;

  window.transitionRequired = true;

  window.onresize = function(event) {
    self.onResize();
  };

  this.init = function() {};
  self.onResize = function() {
    var scaleupRequired = false;
    var ele = document.getElementById('parentId');

    shellWidth = 993;
    shellHeight = 610;
    agent = navigator.userAgent.toLowerCase();
    scale = '';

    if (ele !== null) {
      actWid = ele.clientWidth; //Number($(window).width());
      actHgt = ele.clientHeight; //window.innerHeight;
    } else {
      actWid = 993;
      actHgt = 610; //window.innerHeight;
    }

    if (actHgt < actWid) {
      //console.log("IF resize-----")
      
      newShellHeight = actHgt - this.bufferHeight;
      scale = Number(shellHeight / newShellHeight).toFixed(2);
      newShellWidth = (shellWidth / shellHeight) * newShellHeight;
      var _aleft = actWid / 2 - Number(newShellWidth) / 2;
      if (_aleft < 0) {
        newShellWidth = actWid;
        scale = Number(shellWidth / newShellWidth).toFixed(2);
        newShellHeight = (shellHeight / shellWidth) * newShellWidth;
      }
      if (_bool) {
        
        var _nscale = 1 / scale;
        if (_nscale < 0.6) {
          _nscale = 0.6;
        }
        $(_iFrameRef).css({
          width: shellWidth * _nscale + 'px',
          height: shellHeight * _nscale + 'px'
        });
        setTimeout(onResizeFn, 100);
      } else {
        
        $(_iFrameRef).css({
          //transition: 'all 0.1s ease-out',
          
          transform:
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)',
          '-ms-transform':
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)',
          '-webkit-transform':
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)',
            transition: 'all 0.1s ease-out',
        });
      }
    } else {
      //console.log("ELSE resize-----")
      
      newShellWidth = actWid;
      scale = Number(shellWidth / newShellWidth).toFixed(2);
      newShellHeight =
        (shellHeight / shellWidth) * newShellWidth - this.bufferHeight;
      if (_bool) {
        var _nscale = 1 / scale;
        if (_nscale < 0.6) {
          _nscale = 0.6;
        }
        $(_iFrameRef).css({
          width: shellWidth * _nscale + 'px',
          height: shellHeight * _nscale + 'px'
        });
        setTimeout(onResizeFn(), 100);
      } else {
        
        $(_iFrameRef).css({
          transition: 'scale 0.5s ease-in-out 0.2s',
          transform:
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)',
          '-ms-transform':
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)',
          '-webkit-transform':
            'translate(-' +
            shellWidth / 2 +
            'px,-' +
            shellHeight / 2 +
            'px) scale(' +
            1 / scale +
            ',' +
            1 / scale +
            ') translate(' +
            shellWidth / 2 +
            'px,' +
            shellHeight / 2 +
            'px)'
        });
      }
    }
    var myLeft = actWid / 2 - Number(newShellWidth) / 2;
    if (_aleft < 0) {
      _aleft = 0;
    }
    $(_iFrameRef).css({
      top: '0',
      bottom: '0',
      left: _aleft,
      right: '0'
    });


    var scaleVal = scale;
    var _left = $(window).width() / 2 - Number(newShellWidth) / 2;
    var _top = iFrameTop; //(window.innerHeight / 2) - (Number(newShellHeight) / 2);
    //$(_iFrameRef).css("left", _left);
    //$(_iFrameRef).css("top", _top);
    //console.log("RESIZE PLAYER");
  };
};
