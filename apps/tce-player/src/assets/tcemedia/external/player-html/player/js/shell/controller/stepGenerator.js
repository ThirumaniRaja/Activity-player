/* This Module is used to generate dots on the slider component for Step animation media . Events are added on the newly generated step points
 */
var StepGenerator = function(_classRef) {
  var startPoint;
  var stopPoint;
  var stepTitle;
  var totalFrames;
  var sliderWidth;
  var parentClass = _classRef;
  var myToolTip;
  var isEnable = true;
  var _parentElem = '';
  var navigationType = '';
  //---- Public Functions -----
  this.init = function(
    startPt,
    stopPt,
    titles,
    frames,
    width,
    customToolTipDiv,
    customToolTipArrowDiv,
    sNavigationType
  ) {
    startPoint = startPt;
    stopPoint = stopPt;
    stepTitle = titles;
    totalFrames = frames;
    sliderWidth = width;
    myToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);
    navigationType = sNavigationType;
  };

  this.addToDom = function(parentElm) {
    _parentElem = parentElm;
    var elementArray = generateStepPoint();
    for (var i = 0; i < elementArray.length; i++) {
      $(parentElm).append(elementArray[i]);
    }
    addEventsToChilds(parentElm);
  };
  this.destroy = function() {
    startPoint = null;
    stopPoint = null;
    stepTitle = null;
    totalFrames = null;
    sliderWidth = null;
    parentClass = null;
    myToolTip = null;
  };
  this.enable = function(e) {
    isEnable = true;
  };
  this.disable = function(e) {
    isEnable = false;
  };
  this.getPoints = function(nSliderPos) {
    var nId = -1;
    var counter = 0;
    var element = generateStepPoint();
    for (var j = 0; j < startPoint.length; j++) {
      if (
        parseInt(
          $(_parentElem)
            .find('#step_' + j)
            .css('left')
        ) >= nSliderPos
      ) {
        console.log(
          parseInt(
            $(_parentElem)
              .find('#step_' + j)
              .css('left')
          ),
          nSliderPos
        );
        if (j != 0) {
          nId = j - 1;
        } else {
          nId = j;
        }

        break;
      }
      if (nSliderPos == 0) {
        nId = 0;
        break;
      }
    }
    if (nId == -1) {
      nId = startPoint.length - 1;
    }
    return [
      Number(startPoint[nId]),
      Number(stopPoint[nId]),
      Number(nId),
      nId * (sliderWidth / startPoint.length),
      (nId + 1) * (sliderWidth / startPoint.length)
    ];
  };
  //---- End of Public Functions -----

  //---- Private Functions -----
  function addEventsToChilds(parentElm) {
    var _ref = this;
    var childCount = $(parentElm).children().length;
    for (var i = 0; i < childCount; i++) {
      $(parentElm)
        .children()
        .eq(i)
        .bind('click', function() {
          var idNum = this.id.split('_');
          if (idNum[0] != 'stepLine') {
            myToolTip.hideToolTip();
            if (isEnable) {
              //console.log(startPoint[Number(idNum[1])], stopPoint[Number(idNum[1])]);
              gotoAndPlayMedia(
                idNum,
                startPoint[Number(idNum[1])],
                stopPoint[Number(idNum[1])]
              );
            }
          }
        });
      $(parentElm)
        .children()
        .eq(i)
        .bind('mouseover', function() {
          var idNum = this.id.split('_');
          var left = 0;
          if (idNum[0] == 'stepLine') {
            left = 7;
            $(this).css('opacity', '0.2');
          }
          myToolTip.showToolTip(
            $(this).position().top +
              $(this)
                .parent()
                .position().top,
            left +
              $(this).position().left +
              $(this)
                .parent()
                .position().left,
            $(this).width(),
            stepTitle[Number(idNum[1])]
          );
        });
      $(parentElm)
        .children()
        .eq(i)
        .bind('mouseout', function() {
          var idNum = this.id.split('_');
          if (idNum[0] == 'stepLine') {
            $(this).css('opacity', '0.01');
            //return false;
          }
          myToolTip.hideToolTip();
        });
    }
  }

  function gotoAndPlayMedia(nId, sFrameNum, eFrameNum) {
    EventBus.dispatch(
      'jumpStep',
      this,
      parentClass,
      sFrameNum,
      eFrameNum,
      Number(nId[1])
    );
    /* event captured by ShellController */
  }

  function generateStepPoint() {
    var element = new Array();
    for (var i = 0; i < startPoint.length; i++) {
      // Original Code
      //var leftVal = Math.floor(sliderWidth*startPoint[i]/totalFrames) +"px";
      // Changed One
      var leftVal = Math.floor((sliderWidth / startPoint.length) * i) + 'px';
      //console.log(Math.floor(sliderWidth/startPoint.length));
      //element.push("<div id='stepLine_"+i+"' class='nav-stepLineClass' style='left:"+leftVal+"; width:"+(Math.floor(sliderWidth*stopPoint[i]/totalFrames)-Math.floor(sliderWidth*startPoint[i]/totalFrames))+"px'></div>");
      element.push(
        "<div id='stepLine_" +
          i +
          "' class='nav-stepLineClass' style='left:" +
          leftVal +
          '; width:' +
          Math.ceil(sliderWidth / startPoint.length) +
          "px !important'></div>"
      );

      element.push(
        "<div id='step_" +
          i +
          "' class='nav-stepClass' style='left:" +
          leftVal +
          "'></div>"
      );
    }
    return element;
  }
  //---- End of Private Functions -----
};
