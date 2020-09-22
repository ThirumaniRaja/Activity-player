/**
 * DND Component
 * Developed by: Sagar More
 * Start date: 02-09-2010
 */

var dragAndDrop = function() {
  /**
   * Inspectable Variables
   * */

  var p = {
    _dragItemsArr: [], //drag-id
    _dropItemsArr: [], //drop-id
    _correctAnswers: [], //[3,1,2]
    _noOfAttempts: 0, //1
    _allDropped: false,
    _customFnCall: '',
    _validationMethod: 'Individual', //Individual //Individual or group
    _visualFBMc: 'tick_Mc',
    _feedbackMc: 'feedbackMc',
    _validateBtn: '', //Submit Button
    _solutionBtn: '', //Solution Button
    _boundRect: [],
    _showTween: false,
    _tweenInterval: 1, //1
    target: 'activityWrapper',
    refToPlayer: null, //mc,
    overInstrTxt: '', //iText-id
    detectTransparency: false,
    leftPadding: 0,
    topPadding: 0,
    tickmarginLeft: 0,
    tickmarginTop: 0,
    resetAfterIncorrectFeedBack: true,
    tickAndCrossType: 'type1',
    submitImgType: '',
    solutionImgType: '',
    resetCorrectImage: false,
    boundingRect: [20, 120, 900, 500],
    answerAfterOver: false,
    _solBtnOnInit: false,
    _ansBtnOnInit: false,
    solutionTick: false,
    resetAfterMaxAttempt: false
    //_starDiv:"",
    //optionPosition:{},
    //multipleOptionImg:{},
    /*
		"updaterJsonStart": {
		  "highlightNext": false,
		  "enableNext": true,
		  "enableBack": true,
		  "enableReplay": true,
		  "playPauseButton": false,
		  "iTextId": ""
		},
		"navFbStartJson": {
		  "highlightNext": false,
		  "enableNext": true,
		  "enableBack": true,
		  "enableReplay": true,
		  "playPauseButton": false,
		  "iTextId": ""
		},
		"navFbEndJson": {
		  "highlightNext": false,
		  "enableNext": true,
		  "enableBack": true,
		  "enableReplay": true,
		  "playPauseButton": false,
		  "iTextId": ""
		},
		"updaterJsonEnd": {
		  "highlightNext": true,
		  "enableNext": true,
		  "enableBack": true,
		  "enableReplay": true,
		  "playPauseButton": false,
		  "iTextId": ""
		}
		*/
  };
  /**
   * Class variables
   */

  var dragObj = {};
  var dropObj = {};
  var attemptCnt = 0;
  var visFeedbackMC = '';
  var fbMC = null;
  var submitMC = null;
  var solutionMC = null;
  var addstar_mc = null;
  var boundingRect = []; //containment
  var rootRef = null;
  var allCorrect = false;
  var isUnlimitedAttempt = false;
  //var shp:Sprite = new Sprite();
  var myTweenX;
  var myTweenY;
  var audioObj = new AudioPlayerNormalClass();
  var activityImageObj = new Object(); // storing all images
  var commonAssetPath;
  var iFrameDoc;
  var browser;
  var correctCounter = 0;
  var incorrectCounter = 0;
  /**
   * init() method
   * initialize variables and set properties.
   */

  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }

    if (p.boundingRect && p.boundingRect.length == 4) {
      p.boundingRect[0] = Number(p.boundingRect[0]);
      p.boundingRect[1] = Number(p.boundingRect[1]);
      p.boundingRect[2] = Number(p.boundingRect[2]);
      p.boundingRect[3] = Number(p.boundingRect[3]);
    }
    attemptCnt = 0;
    var serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    //boundingRect = new Rectangle(Number(p._solutionBtn[0]), Number(p._solutionBtn[1]), Number(p._solutionBtn[2]), Number(p._solutionBtn[3]));
    makeImgObject();
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };

  this.onFeedBackCompleted = function(e) {
    addListners();
    var isAllDropped = true;
    var isAnyDropped = false;
    var anyCount = 0;
    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];
      if (mc.occupied) {
        anyCount++;
        isAnyDropped = true;
        if (p.resetAll) {
          if (mc.occupiedBy) {
            gotoAndStopDrag(mc.occupiedBy, '_normal');
            if (visFeedbackMC) gotoAndStopTick(mc.occupiedBy, 1);
          }
        }
        if (p.resetIncorrect) {
          if (!mc.isCorrectMcDropped) {
            gotoAndStopDrag(mc.occupiedBy, '_normal');
            if (visFeedbackMC) gotoAndStopTick(mc.occupiedBy, 1);
          }
        }
      } else {
        isAllDropped = false;
      }
    }

    if (attemptCnt >= p._noOfAttempts && p._noOfAttempts != 0 && isAllDropped) {
      var _flag = e.status == 'incorrect' ? true : false;
      if (p.resetAfterMaxAttempt) {
        resetIncorrectItems();
        setTimeout(function(_flag) {
          activityOver(_flag);
        }, 800);
      } else {
        activityOver(_flag);
      }
    } else {
      if (e.status == 'incorrect') {
        enableDisableSubmit(false);
        enableDisableSolution(false);

        if (p.resetAfterIncorrectFeedBack) resetIncorrectItems();
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      } else if (isAllDropped) {
        activityOver(false);
      } else if (e.status == 'answer') {
        activityOver(false);
      } else {
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      }
    }
    $(p.domObj['safetyDiv']).hide();
  };
  this.removeAll = function() {
    removeListners();
    enableDisableSubmit();
    enableDisableSolution();
    EventBus.removeEventListener(
      'activateLoadedMedia',
      configureListeners,
      this
    );
    for (var i in p.domObj) {
      $(p.domObj[i]).remove();
    }
    for (var i in activityImageObj) {
      activityImageObj[i].src = '';
      activityImageObj[i] = '';
    }
    activityImageObj = {};
    p = {};
    p = null;
    delete p;
  };
  //===========
  function startActivity() {
    //browser detect
    browserDetect();

    if (p._noOfAttempts <= 0) {
      isUnlimitedAttempt = true;
    }
    if (p._feedbackMc != '') {
      fbMC = p._feedbackMc;
    }

    if (p._validateBtn != '') {
      submitMC = p.domObj[p._validateBtn];
      if (p._ansBtnOnInit) {
        enableDisableSubmit(true);
      } else {
        enableDisableSubmit(false);
      }
    }
    if (p._solutionBtn != '') {
      solutionMC = p.domObj[p._solutionBtn];
      if (p._solBtnOnInit) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }
    //drag Listners, optionDivs, Events
    configureListeners();

    //for tickNCross
    if (p._visualFBMc) {
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        createTickAndCrossDiv(p.domObj[p._dragItemsArr[i]]);
      }
    }
    if (p._visualFBMc != '') {
      //tick and cross
      visFeedbackMC = p._visualFBMc;
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        gotoAndStopTick(p._dragItemsArr[i], '_correct', true);
      }
    }
    if (p.__maintainScore) {
      addstar_mc = new StarController(p);
      addstar_mc.init(p.domObj[p._starDiv]);
      //addstar_mc.init(p)
    }
  }

  /**
   * Configure listeners for drag items and set its properties
   */
  function configureListeners() {
    var _div = iFrameDoc.createElement('div');
    $(_div)
      .css({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '993px',
        height: '610px',
        display: 'none'
      })
      .attr('id', 'safetyDiv');

    $(p.domObj[p.target]).append(_div);
    p.domObj['safetyDiv'] = _div;

    for (var i = 0; i < p._dropItemsArr.length; i++) {
      dropObj[p._dropItemsArr[i]] = {};
      dropObj[p._dropItemsArr[i]].dropId = p._dropItemsArr[i];
      dropObj[p._dropItemsArr[i]].id = i + 1;
      dropObj[p._dropItemsArr[i]].occupied = false;
      dropObj[p._dropItemsArr[i]].isCorrectMcDropped = false;
      dropObj[p._dropItemsArr[i]].occupiedBy = null;

      $(p.domObj[p._dropItemsArr[i]]).css({
        'background-color': 'rgba(0,0,0,0)'
      });
    }
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      dragObj[p._dragItemsArr[i]] = {};
      dragObj[p._dragItemsArr[i]].dragId = p._dragItemsArr[i];
      dragObj[p._dragItemsArr[i]].id = i + 1;
      dragObj[p._dragItemsArr[i]].occupied = false;
      dragObj[p._dragItemsArr[i]].isCorrectMcDropped = false;
      dragObj[p._dragItemsArr[i]].isAlreadyDroppedInCorrectPos = false;
      dragObj[p._dragItemsArr[i]].mouseChildren = false;
      dragObj[p._dragItemsArr[i]].origX = parseFloat(
        $(p.domObj[p._dragItemsArr[i]]).css('left')
      );
      dragObj[p._dragItemsArr[i]].origY = parseFloat(
        $(p.domObj[p._dragItemsArr[i]]).css('top')
      );
    }
    //create OptionDiv
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      createOptionDiv(p.domObj[p._dragItemsArr[i]]);
    }

    //for events to bind
    //true for devices {touchEvents}
    if (browser) {
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        bindDevice(p._dragItemsArr[i]);
      }
    } //rest {mouseEvnets}
    else {
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        bindRest(p._dragItemsArr[i]);
      }
    }

    if (p.optionImgObj || p.multipleOptionImg) {
      setImages();
    }
    if (p.updaterJsonStart) {
      p._navController.updateButtons(p.updaterJsonStart);
    }
  }
  function createOptionDiv(_elem) {
    var _left = 0,
      _top = 0;
    var _width = (_height = 0);
    var _optionDiv;

    //imageType  = image instance in activityImageObj
    var _imageType;

    p.leftPadding = Number(p.leftPadding);
    p.topPadding = Number(p.topPadding);

    if (p.detectTransparency) {
      _optionDiv = iFrameDoc.createElement('canvas');
    } else {
      _optionDiv = iFrameDoc.createElement('div');
    }
    $(_elem).prepend(_optionDiv);

    if (p.optionPosition) {
      if (p.optionPosition[_elem.id]) {
        if (p.optionPosition[_elem.id].x) _left = p.optionPosition[_elem.id].x;
        if (p.optionPosition[_elem.id].y) _top = p.optionPosition[_elem.id].y;
      }
    }

    if (p.optionImgObj) {
      for (var i in p.optionImgObj) {
        _width = activityImageObj['option_' + i].width;
        _height = activityImageObj['option_' + i].height;
        _imageType = 'option_' + i;
        break;
      }

      /* if(activityImageObj["option_normal"])
			{
				
			}else if(activityImageObj["option_over"]){
				_width = activityImageObj["option_over"].width;
				_height = activityImageObj["option_over"].height;
			}else if(activityImageObj["option_selected"]){
				_width = activityImageObj["option_selected"].width;
				_height = activityImageObj["option_selected"].height;
			}else if(activityImageObj["option_disable"]){
				_width = activityImageObj["option_disable"].width;
				_height = activityImageObj["option_disable"].height;
			} 
			
			$(_optionDiv).css({
				"position":"absolute",
				"left": 0 + p.leftPadding +Number(_left) + "px",
				"top": 0 + p.topPadding + Number(_top) +"px",
				"pointer-events":"none",
				"width":_width + "px",
				"height":_height + "px",
			}).attr("id" , _elem.id+"_option");
			
			
			if(activityImageObj["option_normal"] && !p.detectTransparency)
				setBackground(_optionDiv , activityImageObj["option_normal"].src);
			if(p.detectTransparency && activityImageObj["option_normal"])
				drawImgOncanvas(_optionDiv,activityImageObj["option_normal"]);*/
    }
    if (p.multipleOptionImg) {
      if (p.multipleOptionImg[_elem.id]) {
        for (var i in p.multipleOptionImg[_elem.id]) {
          _width = activityImageObj[_elem.id + '_option_' + i].width;
          _height = activityImageObj[_elem.id + '_option_' + i].height;
          _imageType = _elem.id + '_option_' + i;
          break;
        }
      }
    }
    if (p.optionCustomcss) {
      for (var i in p.optionCustomcss)
        $(_optionDiv).css(i, p.optionCustomcss[i]);
    }

    if (p.detectTransparency) {
      _optionDiv.width = _width;
      _optionDiv.height = _height;
    }

    $(_optionDiv)
      .css({
        position: 'absolute',
        left: 0 + p.leftPadding + Number(_left) + 'px',
        top: 0 + p.topPadding + Number(_top) + 'px',
        'pointer-events': 'none',
        width: _width + 'px',
        height: _height + 'px'
      })
      .attr('id', _elem.id + '_option');

    if (activityImageObj[_imageType] && !p.detectTransparency) {
      setBackground(_optionDiv, activityImageObj[_imageType].src);
    }
    if (p.detectTransparency && activityImageObj[_imageType]) {
      drawImgOncanvas(_optionDiv, activityImageObj[_imageType]);
    }

    p.domObj[_elem.id + '_option'] = _optionDiv;
  }
  function drawImgOncanvas(_elem, _img) {
    if (_elem) {
      var _ctx = _elem.getContext('2d');
      _elem.width = _elem.width;
      _ctx.drawImage(_img, 0, 0, _img.width, _img.height);
    }
  }
  function createTickAndCrossDiv(_elem) {
    //var _top = parseFloat($(_elem).css('top'));
    //var _left = parseFloat($(_elem).css('left'));
    //var _height = parseFloat($(_elem).css('height'));
    var _div = iFrameDoc.createElement('div');
    $(_elem).append(_div);
    var _img = 'tick';

    $(_div)
      .css({
        position: 'absolute',
        width: activityImageObj[_img].width + 'px',
        height: activityImageObj[_img].height + 'px',
        'background-size': '100% 100%',
        'background-image': '',
        'background-repeat': 'no-repeat',
        display: 'none',
        'pointer-events': 'none'
      })
      .attr('id', _elem.id + '_tick');
    if (p.tickAndCrossIndex) $(_div).css('z-index', p.tickAndCrossIndex);
    var _left = 0,
      _top = 0;
    if (p.customtickAndCrossPosition) {
      if (p.customtickAndCrossPosition[_elem.id]) {
        if (p.customtickAndCrossPosition[_elem.id].x)
          _left = Number(p.customtickAndCrossPosition[_elem.id].x);
        if (p.customtickAndCrossPosition[_elem.id].y)
          _top = Number(p.customtickAndCrossPosition[_elem.id].y);
      }
    }
    if (p.tickAndCrossPosition) {
      $(_div).css({
        left: _left + Number(p.tickAndCrossPosition['x']) + 'px',
        top: _top + Number(p.tickAndCrossPosition['y']) + 'px'
      });
    } else {
      $(_div).css({
        top: 0 + Number(p.tickmarginTop) + _top + 'px',
        left:
          0 -
          activityImageObj['tick'].width -
          Number(p.tickmarginLeft) +
          _left +
          'px'
      });
    }
    if (p.TickandCrossCustomCss) {
      for (var i in p.TickandCrossCustomCss)
        $(_div).css(i, p.TickandCrossCustomCss[i]);
    }
    p.domObj[_elem.id + '_tick'] = _div;
  }
  // this function for creating image object
  var loadImgCnt = 0,
    lodedImgCnt = 0;
  function preloadImages(_obj) {
    activityImageObj = new Object();
    lodedImgCnt = 0;
    loadImgCnt = 0;
    for (var i in _obj) {
      activityImageObj[i] = new Object();
      var _tempImg = new Image();
      _tempImg.onload = imgloaded;
      _tempImg.src = _obj[i];
      activityImageObj[i] = _tempImg;
      loadImgCnt++;
    }
  }
  function imgloaded() {
    lodedImgCnt++;
    if (lodedImgCnt == loadImgCnt) {
      startActivity();
    }
  }
  function setImages() {
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      if (p.multipleOptionImg) {
        if (
          p.multipleOptionImg[p._dragItemsArr[i]] &&
          activityImageObj[p._dragItemsArr[i] + '_option_normal']
        ) {
          $(p.domObj[p._dragItemsArr[i] + '_option']).css({
            'background-image':
              'url(' +
              activityImageObj[p._dragItemsArr[i] + '_option_normal'].src +
              ')',
            'background-size': '100% 100%',
            'background-repeat': 'no-repeat'
          });
        } else {
          alert('Normal Image not found');
        }
      } else if (p.optionImgObj) {
        if (p.optionImgObj['normal'] && activityImageObj['option_normal']) {
          $(p.domObj[p._dragItemsArr[i] + '_option']).css({
            'background-image':
              'url(' + activityImageObj['option_normal'].src + ')',
            'background-size': '100% 100%',
            'background-repeat': 'no-repeat'
          });
        } else {
          alert('Normal Image not found');
        }
      }
    }
  }
  function CheckColor(x, y, ctx) {
    var cell = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    var hex = '#' + ('000000' + rgbToHex(cell[0], cell[1], cell[2])).slice(-6);
    if (hex != '#000000') {
      return true;
    } else {
      if (hex == '#000000' && cell[3] > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
  /**
   * method for start/stop drag
   * @param	e
   */
  var currentID, offsetX, offsetY, initalX, initalY;
  var eventBool = true;
  function dragListener(e) {
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        if (e.type == 'touchstart') {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          e.preventDefault();
        }

        currentID = e.currentTarget.id;
        $(p.domObj[currentID]).addClass('addPointer');
        $(iFrameDoc)
          .unbind('mousemove touchmove mouseup touchend', dragListener)
          .bind('mousemove touchmove mouseup touchend', dragListener);
        $(p.domObj[currentID])
          .unbind('mousemove touchmove', dragListener)
          .bind('mousemove touchmove', dragListener);
        initalX = parseFloat($(p.domObj[currentID]).css('left'));
        initalY = parseFloat($(p.domObj[currentID]).css('top'));

        //console.log("start",e.pageX,e.pageY,currentID)
        offsetX = e.pageX - $(p.domObj[currentID]).offset().left;
        offsetY = e.pageY - $(p.domObj[currentID]).offset().top;

        gotoAndStopDrag(currentID, '_down');
        if (dragObj[currentID].droppedOn) {
          dropObj[dragObj[currentID].droppedOn].occupied = false;
          dropObj[dragObj[currentID].droppedOn].occupiedBy = null;
          dragObj[currentID].droppedOn = null;
        }
        break;

      case 'mouseup':
      case 'touchend':
        $(iFrameDoc).unbind('mousemove touchmove', dragListener);

        if (currentID) {
          var tempID = currentID;
          gotoAndStopDrag(tempID, '_up');
          //$(p.domObj[tempID]).off("mousemove touchmove mouseout",dragListener)
          $(p.domObj[tempID]).removeClass('addPointer');
          if (!p._validateBtn) {
            $(p.domObj['safetyDiv']).show();
          }
          //var flag = onDrop(tempID);
          checkHit(tempID);
          //$(p.domObj[tempID]).css({"z-index":""})
          //if(droppedArr.length == p.dropDiv)
          {
            //eventBool = false;
            //$("#viewanswer").unbind("mousemove mouseout mousedown mouseup touchmove touchstart touchend",viewAns).css({"background":"url(images/viewanswer_D.png) no-repeat","background-size":"100% 100%","cursor":"default",})
            //for(var i in p.ansArr)
            {
              //	$("#"+i).unbind("mousemove mouseout mousedown mouseup touchmove touchstart touchend",mouseEvent)
            }
            //endOfTemplate();
          }
        }
        currentID = null;
        break;
      case 'mousemove':
      case 'touchmove':
        if (currentID) {
          if (e.type == 'touchmove') {
            e.pageX = e.originalEvent.changedTouches[0].pageX;
            e.pageY = e.originalEvent.changedTouches[0].pageY;
          }

          var mouseX = e.pageX - offsetX;
          var mouseY = e.pageY - offsetY;
          var x = $(p.domObj[currentID]).offset().left;
          var y = $(p.domObj[currentID]).offset().top;
          var width = $(p.domObj[currentID]).width();
          var height = $(p.domObj[currentID]).height();
          var win = windowLimit(mouseX, mouseY, width, height);
          mouseX = win.x;
          mouseY = win.y;
          $(p.domObj[currentID]).css({
            left: mouseX + 'px',
            top: mouseY + 'px',
            'z-index': '12'
          });

          gotoAndStopDrag(currentID, 1);
        } else {
          $(p.domObj[e.currentTarget.id]).addClass('addPointer');
          gotoAndStopDrag(e.currentTarget.id, '_over');
        }

        break;
      case 'mouseout':
        gotoAndStopDrag(e.currentTarget.id, '_normal');

        break;
    }
    e.preventDefault();
  }
  function dragListenerTrans(e) {
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        if (e.type == 'touchstart') {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          e.preventDefault();
        }

        currentID = e.currentTarget.id;
        var _ctx = p.domObj[currentID + '_option'].getContext('2d');
        offsetX = e.pageX - $(p.domObj[currentID]).offset().left;
        offsetY = e.pageY - $(p.domObj[currentID]).offset().top;
        if (CheckColor(offsetX, offsetY, _ctx)) {
          $(p.domObj[currentID]).addClass('addPointer');
          $(iFrameDoc)
            .unbind('mousemove touchmove mouseup touchend', dragListenerTrans)
            .bind('mousemove touchmove mouseup touchend', dragListenerTrans);
          $(p.domObj[currentID])
            .unbind('mousemove touchmove', dragListenerTrans)
            .bind('mousemove touchmove', dragListenerTrans);
          initalX = parseFloat($(p.domObj[currentID]).css('left'));
          initalY = parseFloat($(p.domObj[currentID]).css('top'));

          gotoAndStopDrag(currentID, '_down');

          if (dragObj[currentID].droppedOn) {
            dropObj[dragObj[currentID].droppedOn].occupied = false;
            dropObj[dragObj[currentID].droppedOn].occupiedBy = null;
            dragObj[currentID].droppedOn = null;
          }
        }
        break;

      case 'mouseup':
      case 'touchend':
        $(iFrameDoc).unbind('mousemove touchmove', dragListenerTrans);

        if (currentID) {
          var tempID = currentID;
          gotoAndStopDrag(tempID, '_up');
          //$(p.domObj[tempID]).off("mousemove touchmove mouseout",dragListenerTrans)
          $(p.domObj[tempID]).removeClass('addPointer');
          if (!p._validateBtn) {
            $(p.domObj['safetyDiv']).show();
          }
          checkHit(tempID);
        }
        currentID = null;
        break;
      case 'mousemove':
      case 'touchmove':
        if (currentID) {
          if (p.detectTransparency) {
            if (e.type == 'touchmove') {
              e.pageX = e.originalEvent.changedTouches[0].pageX;
              e.pageY = e.originalEvent.changedTouches[0].pageY;
            }
            var _ctx = p.domObj[currentID + '_option'].getContext('2d');
            if (CheckColor(offsetX, offsetY, _ctx)) {
              var mouseX = e.pageX - offsetX;
              var mouseY = e.pageY - offsetY;
              var x = $(p.domObj[currentID]).offset().left;
              var y = $(p.domObj[currentID]).offset().top;
              var width = $(p.domObj[currentID]).width();
              var height = $(p.domObj[currentID]).height();
              var win = windowLimit(mouseX, mouseY, width, height);
              mouseX = win.x;
              mouseY = win.y;
              $(p.domObj[currentID]).css({
                left: mouseX + 'px',
                top: mouseY + 'px',
                'z-index': '12'
              });

              gotoAndStopDrag(currentID, 1);
            }
          }
        } else {
          if (p.detectTransparency) {
            var _ctx = p.domObj[e.currentTarget.id + '_option'].getContext(
              '2d'
            );
            var _offsetX =
              e.pageX - $(p.domObj[e.currentTarget.id]).offset().left;
            var _offsetY =
              e.pageY - $(p.domObj[e.currentTarget.id]).offset().top;
            if (CheckColor(_offsetX, _offsetY, _ctx)) {
              $(p.domObj[e.currentTarget.id]).addClass('addPointer');
              gotoAndStopDrag(e.currentTarget.id, '_over');
            } else {
              $(p.domObj[e.currentTarget.id]).removeClass('addPointer');
              gotoAndStopDrag(e.currentTarget.id, '_normal');
            }
          }
        }

        break;
      case 'mouseout':
        var _ctx = p.domObj[e.currentTarget.id + '_option'].getContext('2d');
        var _offsetX = e.pageX - $(p.domObj[e.currentTarget.id]).offset().left;
        var _offsetY = e.pageY - $(p.domObj[e.currentTarget.id]).offset().top;
        if (!CheckColor(_offsetX, _offsetY, _ctx)) {
          gotoAndStopDrag(e.currentTarget.id, '_normal');
        }
        break;
    }
    e.preventDefault();
  }
  function windowLimit(_mouseX, _mouseY, _width, _height) {
    if (
      p.boundingRect &&
      p.boundingRect[0] &&
      p.boundingRect[1] &&
      p.boundingRect[2] &&
      p.boundingRect[3]
    ) {
      var minX = p.boundingRect[0];
      var minY = p.boundingRect[1];
      var maxX = p.boundingRect[2];
      var maxY = p.boundingRect[3];
      if (_mouseX + _width >= maxX) _mouseX = maxX - _width;
      else if (_mouseX <= minX) _mouseX = minX;
      if (_mouseY + _height >= maxY) _mouseY = maxY - _height;
      else if (_mouseY <= minY) _mouseY = minY;
    }
    return { x: _mouseX, y: _mouseY };
  }
  /**
   * method to enable/disable the submit/validate button
   * @param	_val - accepts true/false
   */
  function enableDisableSubmit(_val) {
    if (submitMC != null) {
      //submitMC.buttonMode = _val;
      if (_val) {
        gotoAndStopSubmit(submitMC, '_normal');
        $(submitMC).addClass('addPointer');
        $(submitMC)
          .unbind('click', validateDND)
          .bind('click', validateDND);
        $(submitMC)
          .unbind('mousemove mouseout', submitEvents)
          .bind('mousemove mouseout', submitEvents);
      } else {
        gotoAndStopSubmit(submitMC, '_disable');
        $(submitMC).removeClass('addPointer');
        $(submitMC).off('click', validateDND);
        $(submitMC).unbind('mousemove mouseout', submitEvents);
      }
    }
  }

  /**
   * method to enable/disable the solution button if available
   * @param	_val - accepts true/false
   */
  function enableDisableSolution(_val) {
    if (solutionMC != null) {
      //solutionMC.buttonMode = _val;
      if (_val) {
        $(solutionMC).addClass('addPointer');
        gotoAndStopSoln(solutionMC, '_normal');
        $(solutionMC)
          .unbind('click', showCorrectAnswer)
          .bind('click', showCorrectAnswer);
        $(solutionMC)
          .unbind('mousemove mouseout', solutionEvents)
          .bind('mousemove mouseout', solutionEvents);
      } else {
        $(solutionMC).removeClass('addPointer');
        gotoAndStopSoln(solutionMC, '_disable');
        $(solutionMC).unbind('click', showCorrectAnswer);
        $(solutionMC).unbind('mousemove mouseout', solutionEvents);
      }
    }
  }
  function solutionEvents(e) {
    switch (e.type) {
      case 'mousemove':
        gotoAndStopSoln(solutionMC, '_over');
        break;
      case 'mouseout':
        gotoAndStopSoln(solutionMC, '_normal');
        break;
    }
  }
  function submitEvents(e) {
    switch (e.type) {
      case 'mousemove':
        gotoAndStopSubmit(submitMC, '_over');
        break;
      case 'mouseout':
        gotoAndStopSubmit(submitMC, '_normal');
        break;
    }
  }
  //-------------------------------------------------------------
  function gotoAndStopTick(elem, state, _flag) {
    if (elem && activityImageObj) {
      switch (state) {
        case 1:
          $(p.domObj[elem + '_tick']).css({ display: 'none' });
          break;
        case '_correct':
          setBackground(p.domObj[elem + '_tick'], activityImageObj['tick'].src);
          if (!_flag) $(p.domObj[elem + '_tick']).css({ display: 'block' });
          break;
        case '_incorrect':
          setBackground(
            p.domObj[elem + '_tick'],
            activityImageObj['cross'].src
          );
          if (!_flag) $(p.domObj[elem + '_tick']).css({ display: 'block' });
          break;
      }
    }
  }
  function gotoAndStopDrag(elem, state) {
    if (p.optionImgObj && activityImageObj) {
      if (activityImageObj['option' + state]) {
        setBackground(
          p.domObj[elem + '_option'],
          activityImageObj['option' + state].src
        );
      }
    }

    if (p.multipleOptionImg && activityImageObj) {
      if (activityImageObj[elem + '_option' + state]) {
        setBackground(
          p.domObj[elem + '_option'],
          activityImageObj[elem + '_option' + state].src
        );
      }
    }
    /*if(p._imgObj && p._imgObj[elem] && p._imgObj[elem][state])
				setBackground(p.domObj[elem], p._imgObj[elem][state])*/
    /* switch(state)
		{
			case 1:
			case "_down":
			case "_up":
				setBackground(p.domObj[elem],elem)
			break;
			case "_disable":
				setBackground(p.domObj[elem],elem+"_disable")
			break;
			case "_over":
				setBackground(p.domObj[elem],elem+"_h")
			break;
			case "_selected":
				setBackground(p.domObj[elem],elem+"_selected")
			break;
		} */
  }
  function gotoAndStopSoln(_elem, _state) {
    if (solutionMC) {
      if (_state) {
        if (activityImageObj['solutionBtn' + _state])
          setBackground(_elem, activityImageObj['solutionBtn' + _state].src);
        //for submit button
        if (p.solutionCssObj) {
          if (p.solutionCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.solutionCssObj[_state]);
          }
        }
        //for font
        $($(_elem).find('span')[0]).css('color', '');
        for (var i in p.btncssObj) {
          $($(_elem).find('span')[0]).removeClass(p.btncssObj[i]);
        }

        $($(_elem).find('span')[0]).addClass(p.btncssObj[_state]);
      }
    }
  }
  function gotoAndStopSubmit(_elem, _state) {
    if (submitMC) {
      if (_state) {
        if (activityImageObj['submitBtn' + _state])
          setBackground(_elem, activityImageObj['submitBtn' + _state].src);
        //for submit button
        if (p.submitCssObj) {
          if (p.submitCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.submitCssObj[_state]);
          }
        }
        //for font
        $($(_elem).find('span')[0]).css('color', '');
        for (var i in p.btncssObj) {
          $($(_elem).find('span')[0]).removeClass(p.btncssObj[i]);
        }
        $($(_elem).find('span')[0]).addClass(p.btncssObj[_state]);
      }
    }
  }
  function setBackground(elem, img) {
    if (img) {
      $(elem).css({
        background: 'url(' + img + ') no-repeat',
        'background-size': '100% 100%'
      });
    }
  }

  function showCorrectAnswer(e, _flag) {
    if (e.type == 'click') {
      gotoAndPlayFb('answer', 'answer');
    }
    if (solutionMC) {
      enableDisableSolution(false);
    }
    if (submitMC) {
      enableDisableSubmit(false);
    }
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      var mc = p._dropItemsArr[i];
      dropObj[mc].itemsDropped = [];
    }

    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];
      var tmpoId = Number(mc.dropId.split('_')[1]);
      var corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
      for (var j = 0; j < corrAns.length; j++) {
        if (
          !mc.isCorrectMcDropped &&
          !dragObj[p._dragItemsArr[Number(corrAns[j]) - 1]]
            .isAlreadyDroppedInCorrectPos
        ) {
          mc.occupiedBy = p._dragItemsArr[Number(corrAns[j]) - 1];

          var dragMC = dragObj[mc.occupiedBy];

          if (!dragMC.isAlreadyDroppedInCorrectPos && !mc.isCorrectMcDropped) {
            dropObj[mc.dropId].itemsDropped.push(mc.occupiedBy);
            dropObj[mc.dropId].isCorrectMcDropped = true;
            dragObj[mc.occupiedBy].buttonMode = false;
            dragObj[mc.occupiedBy].isCorrect = true;
            dragObj[mc.occupiedBy].isAlreadyDroppedInCorrectPos = true;
            if (p.detectTransparency) {
              $(p.domObj[mc.occupiedBy]).unbind(
                'mousedown mouseup touchend touchstart',
                dragListenerTrans
              );
            } else {
              $(p.domObj[mc.occupiedBy]).unbind(
                'mousedown mouseup touchend touchstart',
                dragListener
              );
            }
          }
        }
      }
    }

    //for (i = 0; i < p._dropItemsArr.length; i++)
    for (var i in dropObj) {
      //mc = p._dropItemsArr[i];
      rearrangeDroppedItems(dropObj[i]);
      if (visFeedbackMC && _flag) gotoAndStopTick(dropObj[i].occupiedBy, 1);
      if (!p.solutionTick) gotoAndStopTick(dropObj[i].occupiedBy, 1);
      if (p.normalAfterMax) gotoAndStopDrag(dropObj[i].occupiedBy, '_normal');
    }

    /* if (p._customFnCall != "") 
		{
			var custFunction:Function = rootRef[p._customFnCall];
			custFunction();
		} */
  }
  function rearrangeDroppedItems(_mc) {
    var dropWidth = parseFloat($(p.domObj[_mc.dropId]).css('width')) / 2;
    var dropHeight = parseFloat($(p.domObj[_mc.dropId]).css('height')) / 2;
    $(p.domObj[_mc.itemsDropped[0]]).css({
      position: 'absolute',
      left:
        parseFloat($(p.domObj[_mc.dropId]).css('left')) +
        dropWidth -
        parseFloat($(p.domObj[_mc.itemsDropped[0]]).css('width')) / 2,
      top:
        parseFloat($(p.domObj[_mc.dropId]).css('top')) +
        dropHeight -
        parseFloat($(p.domObj[_mc.itemsDropped[0]]).css('height')) / 2
    });
  }
  /**
   * Method to check the hit test for dropped item
   * @param	_mc - the movieclip that is dropped on the stage
   */
  function checkHit(_mc) {
    var drop_mc;
    var mcx;
    var isDropped = false;
    var dragTop =
      $(p.domObj[_mc]).offset().top +
      parseFloat($(p.domObj[_mc]).css('height')) / 2;
    var dragLeft =
      $(p.domObj[_mc]).offset().left +
      parseFloat($(p.domObj[_mc]).css('width')) / 2;
    p._tempArr = [];
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      var mc = dropObj[p._dropItemsArr[i]];
      var dropLeft = $(p.domObj[mc.dropId]).offset().left;
      var dropTop = $(p.domObj[mc.dropId]).offset().top;
      var dropWidth = parseFloat($(p.domObj[mc.dropId]).css('width'));
      var dropHeight = parseFloat($(p.domObj[mc.dropId]).css('height'));
      if (
        dragLeft >= dropLeft &&
        dragLeft <= dropLeft + dropWidth &&
        (dragTop >= dropTop && dragTop <= dropTop + dropHeight)
      ) {
        if (!mc.occupied) p._tempArr.push(mc.dropId);
      }
      if (!p.dropPossArr) {
        p._tempArr.push(mc.dropId);
      }
    }

    for (var i = 0; i < p._tempArr.length; i++) {
      var mc = dropObj[p._tempArr[i]];
      //if not occupied
      if (!mc.occupied) {
        var dropLeft = $(p.domObj[mc.dropId]).offset().left;
        var dropTop = $(p.domObj[mc.dropId]).offset().top;
        var dropWidth = parseFloat($(p.domObj[mc.dropId]).css('width'));
        var dropHeight = parseFloat($(p.domObj[mc.dropId]).css('height'));

        if (
          dragLeft >= dropLeft &&
          dragLeft <= dropLeft + dropWidth &&
          (dragTop >= dropTop && dragTop <= dropTop + dropHeight)
        ) {
          var _pos = p._dropItemsArr.indexOf(p._tempArr[i]);

          if (
            p.dropPosArr &&
            p.dropPosArr[_pos] &&
            p.dropPosArr[_pos][0].x &&
            p.dropPosArr[_pos][0].y
          ) {
            $(p.domObj[_mc]).css({
              position: 'absolute',
              left: Number(p.dropPosArr[_pos][0].x) + 'px',
              top: Number(p.dropPosArr[_pos][0].y) + 'px',
              'z-index': ''
            });
          } else {
            $(p.domObj[_mc]).css({
              position: 'absolute',
              left:
                parseFloat($(p.domObj[mc.dropId]).css('left')) +
                dropWidth / 2 -
                parseFloat($(p.domObj[_mc]).css('width')) / 2,
              top:
                parseFloat($(p.domObj[mc.dropId]).css('top')) +
                dropHeight / 2 -
                parseFloat($(p.domObj[_mc]).css('height')) / 2,
              'z-index': ''
            });
          }
          dropObj[p._tempArr[i]].occupiedBy = _mc;
          dropObj[p._tempArr[i]].occupied = true;
          dragObj[_mc].droppedOn = mc.dropId;
          isDropped = true;
          drop_mc = mc;
          break;
        }
      } else {
        //if already occupied
        if (!mc.isCorrectMcDropped) {
          var dropLeft = $(p.domObj[mc.dropId]).offset().left;
          var dropTop = $(p.domObj[mc.dropId]).offset().top;
          var dropWidth = parseFloat($(p.domObj[mc.dropId]).css('width'));
          var dropHeight = parseFloat($(p.domObj[mc.dropId]).css('height'));
          var temp;
          if (
            dragLeft >= dropLeft &&
            dragLeft <= dropLeft + dropWidth &&
            (dragTop >= dropTop && dragTop <= dropTop + dropHeight)
          ) {
            if (p._showTween) {
              $(p.domObj[mc.occupiedBy]).animate(
                {
                  left: dragObj[mc.occupiedBy].origX + 'px',
                  top: dragObj[mc.occupiedBy].origY + 'px'
                },
                500,
                function() {
                  $(this).css({ 'z-index': '' });
                }
              );
            } else {
              $(p.domObj[mc.occupiedBy]).css({
                left: dragObj[mc.occupiedBy].origX + 'px',
                top: dragObj[mc.occupiedBy].origY + 'px',
                'z-index': ''
              });
            }

            if (
              p.dropPosArr &&
              p.dropPosArr[_pos] &&
              p.dropPosArr[_pos][0].x &&
              p.dropPosArr[_pos][0].y
            ) {
              $(p.domObj[_mc]).css({
                position: 'absolute',
                left: Number(p.dropPosArr[_pos][0].x) + 'px',
                top: Number(p.dropPosArr[_pos][0].y) + 'px',
                'z-index': ''
              });
            } else {
              $(p.domObj[_mc]).css({
                position: 'absolute',
                left:
                  parseFloat($(p.domObj[mc.dropId]).css('left')) +
                  dropWidth / 2 -
                  parseFloat($(p.domObj[_mc]).css('width')) / 2,
                top:
                  parseFloat($(p.domObj[mc.dropId]).css('top')) +
                  dropHeight / 2 -
                  parseFloat($(p.domObj[_mc]).css('height')) / 2,
                'z-index': ''
              });
            }
            if (p.detectTransparency) {
              $(p.domObj[mc.occupiedBy])
                .unbind('mousemove', dragListenerTrans)
                .bind('mousemove', dragListenerTrans);
            } else {
              $(p.domObj[mc.occupiedBy])
                .unbind('mousemove', dragListener)
                .bind('mousemove', dragListener);
            }
            dragObj[dropObj[p._dropItemsArr[i]].occupiedBy].droppedOn = null;
            dropObj[p._dropItemsArr[i]].occupiedBy = _mc;
            dropObj[p._dropItemsArr[i]].occupied = true;
            dragObj[_mc].droppedOn = mc.dropId;
            isDropped = true;
            drop_mc = mc;
            break;
          }
          /*if (_mc.hitTestObject(mc)) 
					{
						//reset the prev mc
						if(p._showTween)
						{
							//animate
							//rootRef.addChild(shp);
							//myTweenX = new Tween(mc.occupiedBy, "x", Strong.easeInOut, mc.occupiedBy.x,mc.occupiedBy.origX, p._tweenInterval, true);
							//myTweenY = new Tween(mc.occupiedBy, "y", Strong.easeInOut, mc.occupiedBy.y,mc.occupiedBy.origY, p._tweenInterval, true);
							//myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
						}
						else							
						{
							mc.occupiedBy.x = mc.occupiedBy.origX;							
							mc.occupiedBy.y = mc.occupiedBy.origY;
						}
						mc.occupiedBy.droppedOn = null;
						//update with the new mc
						mc.occupiedBy = _mc;
						mc.occupied = true;
						_mc.droppedOn = mc;
						_mc.x = mc.x;
						_mc.y = mc.y;
						isDropped = true;
						break;
					}*/
        }
      }
    }

    var isAllDropped = true;
    var isAnyDropped = false;
    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];
      if (mc.occupied) {
        isAnyDropped = true;
      } else {
        isAllDropped = false;
      }
    }
    if (p._allDropped) {
      if (submitMC != null) {
        if (isAllDropped) {
          //enable submit button
          enableDisableSubmit(true);
        } else {
          enableDisableSubmit(false);
        }
      } else if (isAllDropped) {
        if (drop_mc != null) {
          //validateDND(null);
        }
      }
    } else {
      if (submitMC != null) {
        enableDisableSubmit(true);
      } else {
        if (drop_mc != null) {
          validateCurrentDND(drop_mc);
        }
      }
      //enable submit button
    }

    if (!isDropped) {
      if (p._showTween) {
        //animate revert
        $(p.domObj[_mc]).animate(
          {
            left: dragObj[_mc].origX + 'px',
            top: dragObj[_mc].origY + 'px'
          },
          500,
          function() {
            $(this).css({ 'z-index': '' });
            $(p.domObj['safetyDiv']).hide();
          }
        );
      } else {
        $(p.domObj[_mc]).css({
          left: dragObj[_mc].origX + 'px',
          top: dragObj[_mc].origY + 'px',
          'z-index': ''
        });
        $(p.domObj['safetyDiv']).hide();
      }
      if (p.detectTransparency) {
        $(p.domObj[_mc])
          .unbind('mousemove', dragListenerTrans)
          .bind('mousemove', dragListenerTrans);
      } else {
        $(p.domObj[_mc])
          .unbind('mousemove', dragListener)
          .bind('mousemove', dragListener);
      }
      if (p._allDropped && !isAllDropped) {
        enableDisableSubmit(false);
      } else {
        if (isAnyDropped) {
          enableDisableSubmit(true);
        } else {
          enableDisableSubmit(false);
        }
      }
    }
  }

  var alreadyIncre = false;
  /**
   * Method to validate the dropped items with the correct answers
   * sets visual feedback as per option selected (group/individual)
   * @param	e
   */
  function validateCurrentDND(mc) {
    alreadyIncre = true;
    if (submitMC != null || p._allDropped) {
      if (attemptCnt <= p._noOfAttempts || isUnlimitedAttempt) {
        if (!isUnlimitedAttempt) {
          attemptCnt++;
        }
      }
    }
    correctCounter++;
    incorrectCounter++;
    if (incorrectCounter >= p._numberOfIncorrectFeedbacks) {
      incorrectCounter = p._numberOfIncorrectFeedbacks;
    }
    if (correctCounter >= p._numberOfCorrectFeedbacks) {
      correctCounter = p._numberOfCorrectFeedbacks;
    }
    var isCorrect = false;
    if (mc.occupied) {
      var tmpoId = Number(mc.dropId.split('_')[1]);
      var corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
      for (var j = 0; j < corrAns.length; j++) {
        var ans = Number(mc.occupiedBy.split('_')[1]);
        if (ans == corrAns[j]) {
          if (p.detectTransparency) {
            $(p.domObj[mc.occupiedBy]).off(
              'mousedown mouseup touchstart touchend',
              dragListenerTrans
            );
          } else {
            $(p.domObj[mc.occupiedBy]).off(
              'mousedown mouseup touchstart touchend',
              dragListener
            );
          }
          $(p.domObj[mc.occupiedBy]).removeClass('addPointer');
          //dragObj[mc.occupiedBy].buttonMode = false;
          dragObj[mc.occupiedBy].isCorrect = true;
          $(p.domObj[mc.occupiedBy]).css({ 'z-index': '' });
          if (visFeedbackMC != null) {
            if (p._validationMethod == 'Individual' && visFeedbackMC) {
              //set the visual fb
              //mc[visFeedbackMC].gotoAndStop("correct");
              gotoAndStopTick(mc.occupiedBy, '_correct');
            }
          }
          gotoAndStopDrag(mc.occupiedBy, '_correct');
          isCorrect = true;
        }
      }
    }

    if (!isCorrect) {
      if (p._validationMethod == 'Individual' && visFeedbackMC) {
        //set the visual fb
        //mc[visFeedbackMC].gotoAndStop("incorrect");
        gotoAndStopDrag(mc.occupiedBy, '_incorrect');
        gotoAndStopTick(mc.occupiedBy, '_incorrect');
      }
    }

    if (p._validationMethod == 'Group') {
      if (isCorrect) {
        if (visFeedbackMC != null) {
          //rootRef[visFeedbackMC].gotoAndStop("correct")
          gotoAndPlayFb('correct', 'correct' + correctCounter, mc);
        }
      } else {
        if (visFeedbackMC != null) {
          //rootRef[visFeedbackMC].gotoAndStop("incorrect");
          gotoAndPlayFb('incorrect', 'incorrect' + incorrectCounter, mc);
          //gotoAndStopDrag(mc.occupiedBy,"_incorrect")
        }
      }
    }

    if (fbMC) {
      //rootRef.setChildIndex(fbMC, rootRef.numChildren-1);
      if (isCorrect) {
        //fbMC.gotoAndPlay("correct");
        gotoAndPlayFb('correct', 'correct' + correctCounter, mc);
      } else {
        //fbMC.gotoAndPlay("incorrect" + attemptCnt);
        gotoAndPlayFb('incorrect', 'incorrect' + incorrectCounter, mc);
        gotoAndStopDrag(mc.occupiedBy, '_incorrect');
        gotoAndStopTick(mc.occupiedBy, '_incorrect');
      }
    } else {
      disableAll();
    }

    if (isCorrect) {
      validateDND(null);
    }
  }
  function disableAll() {
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      var mc = p._dropItemsArr[i];
      if (mc.occupied) {
        if (!dragObj[mc.occupiedBy].isCorrect) {
          if (p.detectTransparency) {
            $(p.domObj[mc.occupiedBy]).off(
              'mousedown mouseup mousemove touchend touchmove touchstart',
              dragListenerTrans
            );
          } else {
            $(p.domObj[mc.occupiedBy]).off(
              'mousedown mouseup mousemove touchend touchmove touchstart',
              dragListener
            );
          }
          //mc.occupiedBy.buttonMode = false;
        }
      }
    }

    if (solutionMC) {
      if (!allCorrect) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }

    /* if (p._customFnCall != "") 
		{
			if ((attemptCnt > p._noOfAttempts && !isUnlimitedAttempt) || allCorrect) 
			{
				var custFunction:Function = rootRef[p._customFnCall];
				custFunction();
			}
		} */
  }
  /**
   * Method to validate the dropped items with the correct answers
   * sets visual feedback as per option selected (group/individual)
   * @param	e
   */
  function validateDND(e) {
    if (!alreadyIncre) {
      if (submitMC != null || p._allDropped) {
        if (attemptCnt <= p._noOfAttempts || isUnlimitedAttempt) {
          if (!isUnlimitedAttempt) {
            attemptCnt++;
          }
        }
      }
    }

    correctCounter++;
    incorrectCounter++;
    if (incorrectCounter >= p._numberOfIncorrectFeedbacks) {
      incorrectCounter = p._numberOfIncorrectFeedbacks;
    }
    if (correctCounter >= p._numberOfCorrectFeedbacks) {
      correctCounter = p._numberOfCorrectFeedbacks;
    }
    enableDisableSubmit(false);
    allCorrect = true;
    var mc;
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];
      var isCorrect = false;
      if (mc.occupied) {
        var tmpoId = Number(mc.dropId.split('_')[1]);
        var corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
        for (var j = 0; j < corrAns.length; j++) {
          var ans = Number(mc.occupiedBy.split('_')[1]);
          if (ans == corrAns[j]) {
            if (p.detectTransparency) {
              $(p.domObj[mc.occupiedBy]).off(
                'mousedown mouseup mousemove touchend touchmove touchstart',
                dragListenerTrans
              );
            } else {
              $(p.domObj[mc.occupiedBy]).off(
                'mousedown mouseup mousemove touchend touchmove touchstart',
                dragListener
              );
            }
            $(p.domObj[mc.occupiedBy]).removeClass('addPointer');
            //mc.occupiedBy.buttonMode = false;
            dragObj[mc.occupiedBy].isCorrect = true;
            dragObj[mc.occupiedBy].isAlreadyDroppedInCorrectPos = true;
            dropObj[p._dropItemsArr[i]].isCorrectMcDropped = true;
            $(p.domObj[mc.occupiedBy]).css({ 'z-index': '' });

            if (visFeedbackMC != null) {
              if (p._validationMethodl == 'Individual' && visFeedbackMC) {
                //set the visual fb
                gotoAndStopTick(mc.occupiedBy, '_correct');
                //$(p.domObj[mc.occupiedBy+"_tick"]).css({"display":"block"})
              }
            }
            gotoAndStopDrag(mc.occupiedBy, '_correct');
            isCorrect = true;
          }
        }
      }
      if (!isCorrect) {
        allCorrect = false;
        if (mc.occupied) {
          dragObj[mc.occupiedBy].isCorrect = false;
          //if(visFeedbackMC != null) activate after feedback
          {
            if (p._validationMethodl == 'Individual') {
              //&& visFeedbackMC)
              //mc[visFeedbackMC].gotoAndStop("incorrect")
              //revert
              gotoAndStopDrag(mc.occupiedBy, '_incorrect');
              gotoAndStopTick(mc.occupiedBy, '_incorrect');
            }
          }
        }
      }
      if (submitMC != null || p._allDropped) {
        if (p._validationMethodl == 'Group') {
          if (allCorrect) {
            if (visFeedbackMC != null) {
              //rootRef[visFeedbackMC].gotoAndStop("correct")
              gotoAndStopTick(mc.occupiedBy, '_correct');
              //$(p.domObj[mc.occupiedBy+"_tick"]).css({"display":"block"});
            }
          } else {
            if (visFeedbackMC != null) {
              //rootRef[visFeedbackMC].gotoAndStop("incorrect")
              gotoAndStopTick(mc.occupiedBy, '_incorrect');
              //$(p.domObj[mc.occupiedBy+"_tick"]).css({"display":"block"});
            }
          }
        }
      }
    }

    if (submitMC != null || p._allDropped) {
      if (attemptCnt <= p._noOfAttempts || isUnlimitedAttempt) {
        if (fbMC) {
          //rootRef.setChildIndex(fbMC, rootRef.numChildren-1);

          if (allCorrect) {
            //fbMC.gotoAndPlay("correct");
            gotoAndPlayFb('correct', 'correct' + correctCounter);
          } else {
            //fbMC.gotoAndPlay("incorrect" + attemptCnt);
            gotoAndPlayFb('incorrect', 'incorrect' + incorrectCounter);
            if (solutionMC) {
              enableDisableSolution(true);
            }
          }
        } else {
          disableAll();
        }
        /* if(!isUnlimitedAttempt)
				{
					attemptCnt++;
				} */
      }
    }
  }
  function actionHandler(_ans) {
    if (p.__maintainScore) {
      if (addstar_mc != null) {
        //if((String(attemptedMultipleAnswersMc) == String(p.__correctAnswers)) || (String(attemptedAnswers) == String(p.__correctAnswers)))
        if (_ans == 'correct') {
          addstar_mc.updateAnswer(p.__questNo, 1);
        } else {
          addstar_mc.updateAnswer(p.__questNo, 0);
        }
      }
    }
  }
  //--------------------------------------------------------------------------------

  function gotoAndPlayFb(_status, _id, _mc) {
    //remove All listners
    removeListners();

    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }
    var _audiopath;
    if (p.feedbackParam[_id])
      _audiopath = p._shellModel.getMediaPath() + p.feedbackParam[_id];
    if (p.feedBack) {
      p.feedBack({
        status: _status,
        popup: _id,
        audioPath: _audiopath,
        feedbackParam: p.feedbackParam,
        videoFb: p.feedbackParam['video_' + _id],
        jsflObj: p.feedbackParam['jsfl_' + _id],
        _shellModel: p._shellModel,
        curStatus: _id,
        dragObj: dragObj,
        dropObj: dropObj,
        starRef: addstar_mc
      });
    }
  }
  /**
   * Method called on the close of feedback popup
   * need to call this method from the activity in the close button listener of feedback popup
   * This method resets the incorrectly placed items and enables solution button (if any) depending on the no. of try's
   */
  function resetIncorrectItems() {
    if (!allCorrect) {
      var i;
      var mc;
      if (attemptCnt <= p._noOfAttempts || isUnlimitedAttempt) {
        for (i = 0; i < p._dropItemsArr.length; i++) {
          mc = dropObj[p._dropItemsArr[i]];
          if (mc.occupied) {
            if (!dragObj[mc.occupiedBy].isCorrect) {
              if (visFeedbackMC != null) {
                if (p._validationMethodl == 'Individual' && visFeedbackMC) {
                  //reset visual fb mc
                  //mc[visFeedbackMC].gotoAndStop(1);
                  gotoAndStopTick(mc.occupiedBy, 1);
                }
              }
              if (p.optionImgObj) {
                if (activityImageObj['option_normal']) {
                  setBackground(
                    p.domObj[mc.occupiedBy + '_option'],
                    activityImageObj['option_normal'].src
                  );
                }
              }
              if (p.multipleOptionImg) {
                if (activityImageObj[mc.occupiedBy + '_option_normal']) {
                  setBackground(
                    p.domObj[mc.occupiedBy + '_option'],
                    activityImageObj[mc.occupiedBy + '_option_normal'].src
                  );
                }
              }
              if (p._showTween) {
                $(p.domObj[mc.occupiedBy]).animate(
                  {
                    left: dragObj[mc.occupiedBy].origX + 'px',
                    top: dragObj[mc.occupiedBy].origY + 'px'
                  },
                  500,
                  function() {
                    $(this).css({ 'z-index': '' });
                  }
                );
              } else {
                $(p.domObj[mc.occupiedBy]).css({
                  left: dragObj[mc.occupiedBy].origX + 'px',
                  top: dragObj[mc.occupiedBy].origY + 'px',
                  'z-index': ''
                });
              }
              if (p.detectTransparency) {
                $(p.domObj[mc.occupiedBy])
                  .unbind('mousemove', dragListenerTrans)
                  .bind('mousemove', dragListenerTrans);
              } else {
                $(p.domObj[mc.occupiedBy])
                  .unbind('mousemove', dragListener)
                  .bind('mousemove', dragListener);
              }
              dragObj[mc.occupiedBy].droppedOn = null;
              dropObj[p._dropItemsArr[i]].occupiedBy = null;
              dropObj[p._dropItemsArr[i]].occupied = null;
            } else {
              dropObj[p._dropItemsArr[i]].isCorrect = true;
            }
          }
        }
      } else {
        if (!solutionMC) {
          showCorrectAnswer({}, true);
        } else {
          for (i = 0; i < p._dropItemsArr.length; i++) {
            mc = mc = dropObj[p._dropItemsArr[i]];
            if (mc.occupied) {
              if (!dragObj[mc.occupiedBy].isCorrect) {
                if (p.detectTransparency) {
                  $(p.domObj[mc.occupiedBy]).off(
                    'mousedown mouseup touchend touchstart',
                    dragListenerTrans
                  );
                } else {
                  $(p.domObj[mc.occupiedBy]).off(
                    'mousedown mouseup touchend touchstart',
                    dragListener
                  );
                }
                //mc.occupiedBy.buttonMode = false;
              }
            }
          }
          //enableDisableSolution(true);
        }
      }
    }
    if (solutionMC) {
      if (!allCorrect) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }
    /* if (p._validationMethodl == "Group") 
		{
			if(visFeedbackMC != null)
			{
				rootRef[visFeedbackMC].gotoAndStop(1);
			}
		} */
    if (p._customFnCall != '') {
      if ((attemptCnt > p._noOfAttempts && !isUnlimitedAttempt) || allCorrect) {
        //var custFunction:Function = rootRef[p._customFnCall];
        //custFunction();
      }
    }
  }
  function activityOver(_flag) {
    enableDisableSubmit(false);
    enableDisableSolution(false);
    removeListners();
    var instText = '';
    //work in progress
    for (var j = 0; j < p._dragItemsArr.length; j++) {
      //console.log(dragObj[p._dragItemsArr[j]])
      //$(p.domObj[p._dragItemsArr[j]]).clearQueue();
      //$(p.domObj[p._dragItemsArr[j]]).stop();
    }

    if (p.answerAfterOver) {
      showCorrectAnswer({}, _flag);
    }
    if (p.updaterJsonEnd) {
      p._navController.updateButtons(p.updaterJsonEnd);
    }
    if (p['activityOver']) {
      p['activityOver']({
        status: 'ActivityOver'
      });
    }
  }
  function addListners() {
    var _Obj = [];
    if (browser) {
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        if (!dragObj[p._dragItemsArr[i]].isCorrect) {
          _Obj.push(p._dragItemsArr[i]);
        }
      }
      for (var j in _Obj) {
        bindDevice(_Obj[j]);
      }
    } else {
      for (var i = 0; i < p._dragItemsArr.length; i++) {
        if (!dragObj[p._dragItemsArr[i]].isCorrect) {
          _Obj.push(p._dragItemsArr[i]);
        }
      }
      for (var j in _Obj) {
        bindRest(_Obj[j]);
      }
    }
  }
  function bindDevice(_elem) {
    if (p.detectTransparency) {
      $(p.domObj[_elem])
        .unbind('touchstart touchend touchmove', dragListenerTrans)
        .bind('touchstart touchend touchmove', dragListenerTrans);
    } else {
      $(p.domObj[_elem])
        .unbind('touchstart touchend touchmove', dragListener)
        .bind('touchstart touchend touchmove', dragListener);
    }
  }
  function bindRest(_elem) {
    if (p.detectTransparency) {
      $(p.domObj[_elem])
        .unbind('mousedown mouseup mousemove mouseout', dragListenerTrans)
        .bind('mousedown mouseup mousemove mouseout', dragListenerTrans);
    } else {
      $(p.domObj[_elem])
        .unbind('mousedown mouseup mousemove mouseout', dragListener)
        .bind('mousedown mouseup mousemove mouseout', dragListener);
    }
  }

  function browserDetect() {
    if (BrowserDetectAdv.anyDevice()) {
      browser = true;
    } else {
      browser = false;
    }
  }
  function removeListners() {
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      if (p.detectTransparency) {
        $(p.domObj[p._dragItemsArr[i]]).unbind(
          'mousedown mouseup mousemove mouseout touchend touchmove touchstart',
          dragListenerTrans
        );
      } else {
        $(p.domObj[p._dragItemsArr[i]]).unbind(
          'mousedown mouseup mousemove mouseout touchend touchmove touchstart',
          dragListener
        );
      }
      $(p.domObj[p._dragItemsArr[i]]).removeClass('addPointer');
    }
  }
  function makeImgObject() {
    var tempImgObj = new Object();

    if (p.tickAndCrossType) {
      tempImgObj['tick'] =
        commonAssetPath +
        'commonAssets/images/tickandcross/' +
        p.tickAndCrossType +
        '/tick.png';
      tempImgObj['cross'] =
        commonAssetPath +
        'commonAssets/images/tickandcross/' +
        p.tickAndCrossType +
        '/cross.png';
    }
    if (p.submitImgType) {
      tempImgObj['submitBtn_normal'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.submitImgType +
        '/btn_normal.png';
      tempImgObj['submitBtn_over'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.submitImgType +
        '/btn_over.png';
      tempImgObj['submitBtn_selected'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.submitImgType +
        '/btn_over.png';
      tempImgObj['submitBtn_disable'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.submitImgType +
        '/btn_disable.png';
    }
    if (p.solutionImgType) {
      tempImgObj['solutionBtn_normal'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.solutionImgType +
        '/btn_normal.png';
      tempImgObj['solutionBtn_over'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.solutionImgType +
        '/btn_over.png';
      tempImgObj['solutionBtn_selected'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.solutionImgType +
        '/btn_over.png';
      tempImgObj['solutionBtn_disable'] =
        commonAssetPath +
        'commonAssets/images/buttons/' +
        p.solutionImgType +
        '/btn_disable.png';
    }
    if (p.optionImgObj) {
      for (var i in p.optionImgObj) {
        if (p.optionImgObj[i])
          tempImgObj['option_' + i] =
            p._shellModel.getMediaPath() + p.optionImgObj[i];
      }
    }
    if (p.multipleOptionImg) {
      for (var i = 0; i <= p._dragItemsArr.length; i++) {
        for (var j in p.multipleOptionImg[p._dragItemsArr[i]])
          tempImgObj[p._dragItemsArr[i] + '_option_' + j] =
            p._shellModel.getMediaPath() +
            p.multipleOptionImg[p._dragItemsArr[i]][j];
      }
    }
    if (p.submitImgObj) {
      for (var i in p.submitImgObj) {
        tempImgObj['submitBtn_' + i] =
          p._shellModel.getMediaPath() + p.submitImgObj[i];
      }
    }
    if (p.solutionImgObj) {
      for (var i in p.solutionImgObj) {
        tempImgObj['solutionBtn_' + i] =
          p._shellModel.getMediaPath() + p.solutionImgObj[i];
      }
    }
    if (p.tickAndCrossImgObj) {
      if (p.tickAndCrossImgObj['tick'])
        tempImgObj['tick'] =
          p._shellModel.getMediaPath() + p.tickAndCrossImgObj['tick'];
      if (p.tickAndCrossImgObj['cross'])
        tempImgObj['cross'] =
          p._shellModel.getMediaPath() + p.tickAndCrossImgObj['cross'];
    }

    preloadImages(tempImgObj);
  }
};
