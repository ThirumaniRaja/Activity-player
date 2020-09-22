/* This module is used to display the Slider and link it with Video media. This can be instantiate by any module which needs to display the media with slider element.
While initialization it takes the parameter like
sliderId - Div ID for the Slider, 
animType - video, 
duration - total duration of the media, 
minVal - minimum value of the media, 
timeDisplay - boolean value, true if current time display is required to display as tooltip, 
videoObj - reference of the video element.

"displaySlider" needs to be called when the slider neds to display with the basic position/alignment parameters.
xPos, yPos, width, height, color
*/
var VideoSliderClass = function(_parentRef) {
  var sliderElement;
  var sliderPos = 0;
  var animationType;
  var mediaDuration = 0;
  var sliderCreated = false;
  var minimumVal = 0;
  var maximumVal = 0;
  var jumpVal = 0;
  var currentTimeDisplay = false;
  var mouseDownValue;
  var mouseUpValue;
  var sliderDisableStatus = false;
  var videoObjRef;
  var parentRef = _parentRef;
  var myToolTip;
  var navigationType;
  var startPoint = 0;
  var vidCurrentNum;
  var THIS = this;
  var obj = {};
  var mouseX = null;
  //===================Public Functions ==========================
  this.init = function(
    sliderElem,
    animType,
    duration,
    minVal,
    timeDisplay,
    videoObj,
    customToolTipDiv,
    customToolTipArrowDiv,
    sNavigationType
  ) {
    //console.log(sliderElem, animType, duration, minVal, timeDisplay, videoObj, customToolTipDiv, customToolTipArrowDiv);
    trace('init');
    sliderElement = sliderElem;
    animationType = animType;
    mediaDuration = duration;
    minimumVal = minVal;
    currentTimeDisplay = timeDisplay;
    videoObjRef = videoObj; // audioObj may come for JSFL.
    if (customToolTipDiv && customToolTipArrowDiv) {
      myToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);
    }
    navigationType = sNavigationType;
    //console.log(navigationType);
  };
  //
  this.setSliderValue = function(minVal, maxValue, startPos) {
    trace('setSliderValue');
    var _ref = this;

    minimumVal = minVal;
    maximumVal = maxValue;
    jumpVal = startPos;

    $(sliderElement).slider({
      orientation: 'horizontal',
      min: navigationType == 'navPanelStepAnimation' ? 0 : minimumVal, //Model.getSegStartFrame()/Model.getFps(),
      max: maximumVal,
      value: navigationType == 'navPanelStepAnimation' ? null : jumpVal,
      step: 0.001,
      start: function(event, ui) {
        slideStart = true;
        _ref.controlVideoSliderVal(ui.value, 1);
      },
      slide: function(event, ui) {
        //mouseDownValue = ui.value;
        slideStart = true;
        _ref.controlVideoSliderVal(ui.value, 1);
        displayToolTip();
        //console.log('------------------')
      },
      stop: function(event, ui) {
        //mouseUpValue = ui.value;
        slideStart = false;
        if (myToolTip) {
          myToolTip.hideToolTip();
        }
        _ref.controlVideoSliderVal(ui.value, 2);
      }
    });
    if (navigationType != 'navPanelStepAnimation') {
    }
  };
  //=============================================
  this.updateVideoDuration = function(_duration) {
    trace('updateVideoDuration');
    //console.log("updateVideoDuration :: "+_duration);
    mediaDuration = _duration;
    $(sliderElement).slider({
      max: mediaDuration
    });
  };
  //=============================================
  this.displaySlider = function(xPos, yPos, width, height, color) {
    trace('displaySlider');
    var _ref = this;
    if (!sliderCreated) {
      //console.log("displaySlider :: "+mediaDuration);
      if (xPos && yPos && width && height && color) {
        setSliderPosition(xPos, yPos, width, height, color);
      }
      sliderCreated = true;
      ////console.clear();
      ////console.log(minimumVal, mediaDuration);
      _ref.setSliderValue(minimumVal, mediaDuration, 0);

      $(sliderElement)
        .children('.ui-slider-handle')
        .unbind('mouseover')
        .bind('mouseover', function(e) {
          var txt = '';
          if (!sliderDisableStatus) {
            // = display current time for animation only ==
            if (animationType == 'video') {
              mouseX = e.pageX - parseInt($(sliderElement).css('left'));
              displayToolTip();
            }
          }
        });

      $(sliderElement)
        .children('.ui-slider-handle')
        .unbind('mousemove')
        .bind('mousemove', function(e) {
          if (!sliderDisableStatus) {
            // = display current time for animation only ==
            if (animationType == 'video') {
              mouseX = e.pageX - parseInt($(sliderElement).css('left'));
              //console.log(mouseX);
            }
          }
        });

      $(sliderElement)
        .children('.ui-slider-handle')
        .unbind('mouseout')
        .bind('mouseout', function(e) {
          if (myToolTip) {
            myToolTip.hideToolTip();
            mouseX = null;
          }
        });

      $(sliderElement)
        .children('.ui-slider-handle')
        .unbind('mousedown')
        .bind('mousedown', function() {
          $(this).css({ outline: 'none' });
        });
    } else {
      $(sliderElement).slider('option', 'min', minimumVal);
      $(sliderElement).slider('option', 'max', mediaDuration);
      ////console.log("mediaDuration "+mediaDuration);
    }
    //this.audioDuration = mediaDuration;
  };
  //=============================================
  this.updateGlobalValues = function(sPointArr, ePointArr, cFrameN) {
    trace('updateGlobalValues');
    obj['startpoint'] = sPointArr;
    obj['stoppoint'] = ePointArr;
    obj['currentframe'] = cFrameN;
    obj['diff'] =
      obj['stoppoint'][obj['currentframe']] -
      obj['startpoint'][obj['currentframe']];
    obj['avgSliderWd'] =
      parseInt($(sliderElement).css('width')) / obj['startpoint'].length;
    //console.log(obj);
  };
  //=============================================
  this.updateSlider = function(val) {
    trace('updateSlider');
    if (navigationType == 'navPanelStepAnimation') {
      var tFrame = val * 24 - obj['startpoint'][obj['currentframe']];
      var nPos = obj['avgSliderWd'] * obj['currentframe'];
      var cal = nPos + (tFrame * obj['avgSliderWd']) / obj['diff'];
      if (sliderCreated) {
        THIS.setSliderPos(cal + 'px');
      }
    } else {
      if (sliderCreated) {
        $(sliderElement).slider('option', 'value', val);
        if (mouseX) {
          //console.log(mouseX);
          if (
            mouseX <
            parseInt(
              $(sliderElement)
                .children('.ui-slider-handle')
                .css('left')
            )
          ) {
            $(sliderElement)
              .children('.ui-slider-handle')
              .trigger('mouseout');
          }
        }
      }
    }
  };
  //=============================================
  this.getSliderPos = function() {
    trace('getSliderPos');
    return parseInt(
      $(sliderElement)
        .children('.ui-slider-handle')
        .css('left')
    );
  };
  //=============================================
  this.setSliderPos = function(val) {
    //console.log("setSliderPos");
    $(sliderElement)
      .children('.ui-slider-handle')
      .css('left', val);
  };
  //=============================================
  this.setMinVal = function(val) {
    trace('setMinVal');
    minimumVal = val;
    //$(sliderElement).slider( "option", "min", minimumVal );
  };
  //=============================================
  this.setMaxVal = function(val) {
    trace('setMaxVal');
    maximumVal = val;
    //$(sliderElement).slider( "option", "max", maximumVal );
    //$(sliderElement).slider('refresh');
  };
  //=============================================
  this.setStartVal = function(val) {
    trace('setVal');
    //$(sliderElement).slider("option", "value", val);
    setTimeout(function() {
      sliderPos =
        (parseInt(
          $(sliderElement)
            .children('.ui-slider-handle')
            .css('left')
        ) *
          100) /
        parseInt($(sliderElement).css('width'));
      //console.log(sliderPos);
    }, 50);
  };
  //=============================================
  this.enableSlider = function() {
    trace('enableSlider');
    sliderDisableStatus = false;
    $(sliderElement).slider('enable');
    $(sliderElement).css('cursor', 'pointer');
  };
  //=============================================
  this.disableSlider = function() {
    trace('disableSlider');
    sliderDisableStatus = true;
    $(sliderElement).slider('disable');
    $(sliderElement).css('cursor', 'default');
  };
  //=============================================
  this.hideSlider = function(bool) {
    trace('hideSlider');
    if (bool) {
      $(sliderElement)
        .parent()
        .show();
    } else {
      $(sliderElement)
        .parent()
        .hide();
    }
  };
  //=============================================
  this.removeSlider = function() {
    trace('removeSlider');
    sliderCreated = false;
    $(sliderElement).hide();
  };
  //=============================================
  this.controlVideoSliderVal = function(val, caseType) {
    console.log('controlVideoSliderVal :: ' + caseType);
    var sliderMouseDown;
    switch (caseType) {
      case 0:
        sliderMouseDown = true;
        $(sliderElement)
          .children('.ui-slider-handle')
          .css({ outline: 'none' });
        //
        break;
      case 1:
        sliderMouseDown = true;
        if (animationType == 'video') {
          videoObjRef.pauseVideo();
          EventBus.dispatch('slider_slide_start', this, parentRef);
          videoObjRef.setVideoCurrentTime(val);
          this.updateSlider(val);
          /*
						// ==== Listener implementation to be added in class which instantiate the slider === //
						function sliderDragStart() {
						}
						EventBus.addEventListener("slider_slide_start", sliderDragStart, this);
						*/
        } else if (animationType == 'jsfl') {
          videoObjRef.pauseAudio();
          EventBus.dispatch('slider_slide_start', this, parentRef);
          /*
						// ==== Listener implementation to be added in class which instantiate the slider === //
						function sliderDragStart() {
						}
						EventBus.addEventListener("slider_slide_start", sliderDragStart, this);
						*/
        }
        $(sliderElement)
          .children('.ui-slider-handle')
          .css({ outline: 'none' });

        break;
      case 2:
        sliderMouseDown = false;
        if (animationType == 'video') {
          if (navigationType != 'navPanelStepAnimation') {
            videoObjRef.setVideoCurrentTime(val);
            this.updateSlider(val);
          }
          EventBus.dispatch(
            'slider_drag_complete',
            this,
            parentRef,
            val,
            parseInt(
              $(sliderElement)
                .children('.ui-slider-handle')
                .css('left')
            )
          );
        } else if (animationType == 'jsfl') {
          videoObjRef.setAudioCurrentTime(val);
          this.updateSlider(val);
          EventBus.dispatch(
            'slider_drag_complete',
            this,
            parentRef,
            val,
            parseInt(
              $(sliderElement)
                .children('.ui-slider-handle')
                .css('left')
            )
          );
        }
        $(sliderElement)
          .children('.ui-slider-handle')
          .css({ outline: 'none' });

        break;
    }
  };
  //=============================================
  this.showSlider = function() {
    trace('showSlider');
    $(sliderElement).css({
      position: 'absolute',
      display: 'block'
    });
  };
  //=============================================
  this.setMediaDuration = function(val) {
    trace('setMediaDuration');
    mediaDuration = val;
  };
  //=============================================
  this.destroy = function() {
    trace('destroy');
    sliderElement = null;
    animationType = null;
    mediaDuration = null;
    sliderCreated = null;
    minimumVal = null;
    currentTimeDisplay = null;
    mouseDownValue = null;
    mouseUpValue = null;
    sliderDisableStatus = null;
    videoObjRef = null;
    parentRef = null;
    myToolTip = null;
  };

  //=================== Private Functions ==========================
  function displayToolTip() {
    //trace("displayToolTip");
    //console.log("displayToolTip");
    if (currentTimeDisplay) {
      myToolTip.hideToolTip();
      var offset = minimumVal; //Number(Model.getSegStartFrame()/Model.getFps());
      var currentTimeDisplayPercent = Math.round(
        ($(sliderElement)
          .children('.ui-slider-handle')
          .position().left /
          $(sliderElement).width()) *
          100
      );
      txt =
        formatTimeForTooltip(
          (currentTimeDisplayPercent * (mediaDuration - offset)) / 100
        ) +
        ' / ' +
        formatTimeForTooltip(mediaDuration - offset);
      // = display current time for animation only ==
      if (myToolTip) {
        myToolTip.showToolTip(
          $(sliderElement).offset().top - 5,
          $(sliderElement).offset().left +
            $(sliderElement)
              .children('.ui-slider-handle')
              .position().left -
            5,
          $(sliderElement)
            .children('.ui-slider-handle')
            .width(),
          txt
        );
      }
    }
  }
  //=============================================
  function setSliderPosition(_xPos, _yPos, _width, _height, _backColor) {
    trace('setSliderPosition');
    $(sliderElement).css({
      position: 'absolute',
      display: 'block',
      left: _xPos,
      top: _yPos,
      width: _width,
      height: _height,
      background: _backColor
    });
  }
  //=============================================
  function formatTimeForTooltip(num) {
    trace('formatTimeForTooltip');
    var minutes = Math.floor(num / 60);
    var seconds = Math.floor(num - minutes * 60);
    var modMin = minutes <= 9 ? '0' + minutes : minutes;
    var modSec = seconds <= 9 ? '0' + seconds : seconds;
    return modMin + ' : ' + modSec;
  }
  //=============================================
  function trace(sMsg) {
    //console.log(sMsg);
  }
};
