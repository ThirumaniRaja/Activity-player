var wordSelector_v2 = function() {
  var p = {
    text: false,
    optionHolderArr: [], //holder id for text container
    optionGroupArr: [[]], //Text id's
    correctAnswer: [], //correct ans array
    tickNcross: true, //if want tick n cross
    hideWrapper: true, //show/hide wrapper
    actWrapperId: 'activityWrapper', // activity wrapper ID
    pauseVideoAtInitial: true,
    timeInterval: 500, // in milliSeconds

    // if text is present in activity
    bottomBorder: true, //if want bottom border
    normalbottomBorderCss: '2px solid orange', //style for bottom border in normal state
    overbottomBorderCss: '2px solid orange', //style for bottom border in over state
    selectedbottomBorderCss: '2px solid orange', //style for bottom border in selected state
    disablebottomBorderCss: '2px solid orange', //style for bottom border in disable state

    selectedStateColor: 'orange', //default color after word selction
    normalStateColor: '', //normal state color
    overStateColor: '', //over state color
    disableStateColor: '', //disable state color

    tickAndCrossType: '', //tick n cross image type
    tickNcrossPosition: {}, //custom tick and cross position for individual tick
    allTickNcrossPosition: {}, //tick and cross position for all tick/cross
    FixTickNcrossPosition: '', //tick and cross position
    domObj: {}, //containing all dom Elements
    txtLeftPadding: 10, //padding-left for all text
    txtTopPadding: 0, //padding-right for all text
    //  singleTxtPadding:{'txt_id':{left:0,top:0}}   // if want to give single txt padding -
    maxSelection: 0, //for multipleChoice when restrict max selection

    initialStopFrame: '' // if want to load options early and activate at particular frame
    // tickAndCrossIndex   // index for tick and cross
    /*"navStartJson":{
			"highlightNext": false,
			"enableNext": true,
			"enableBack": true,
			"enableReplay": true,
			"playPauseButton": false,
			"iTextId":""
		},
		"navFbStartJson":{
			"highlightNext": false,
			"enableNext": true,
			"enableBack": true,
			"enableReplay": true,
			"playPauseButton": false,
			"iTextId":""
		},
		"navEndJson":{
			"highlightNext": true,
			"enableNext": true,
			"enableBack": true,
			"enableReplay": true,
			"playPauseButton": false,
			"iTextId":"txt_11"
		}*/
  };
  var counter = 0;

  var activityImageObj = new Object(); // storing all images
  var iFrameDoc;
  var serviceObj;
  var commonAssetPath;
  var objVideoPlayer;
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    objVideoPlayer = p._navController.getVideoManager();
    if (p.pauseVideoAtInitial) {
      objVideoPlayer.pauseVideo();
    }
    makeImgObject();
  };
  //========= add event listener here =======
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  //=====================
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

    if (p.tickAndCrossImgObj) {
      for (var i in p.tickAndCrossImgObj) {
        tempImgObj[i] = p._shellModel.getMediaPath() + p.tickAndCrossImgObj[i];
      }
    }
    preloadImages(tempImgObj);
  }
  // this function for creating image object for draw on option canvas and load images
  var loadImgCnt = 0,
    loadedImgCnt = 0;
  function preloadImages(_obj) {
    activityImageObj = new Object();
    loadedImgCnt = 0;
    loadImgCnt = 0;
    for (var i in _obj) {
      activityImageObj[i] = new Object();
      var _tempImg = new Image();
      _tempImg.onload = imgloaded;
      _tempImg.src = _obj[i];
      activityImageObj[i] = _tempImg;
      loadImgCnt++;
    }
    if (Object.keys(_obj).length == 0) {
      startActivity();
    }
  }

  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }
  var requestAnimID;
  function startActivity() {
    counter = 0;
    if (p.text) {
      setText();
    } else {
      if (p.tickNcross) {
        for (var i = 0; i < p.optionGroupArr.length; i++) {
          for (var j = 0; j < p.optionGroupArr[i].length; j++) {
            var _id = p.optionGroupArr[i][j];
            if (p.domObj[_id]) {
              createTickAndCross(p.domObj[_id], _id);
            }
          }
        }
      }
    }
    if (p.initialStopFrame) {
      p.endTime = p.initialStopFrame / p._shellModel.getFps();
      checkVideoTime();
    } else {
      bindEvents();
      //--- navigation buttons update at act load ----
      if (p.navStartJson) {
        p._navController.updateButtons(p.navStartJson);
      }
    }
  }
  // ==== check video time to pause video =====
  function checkVideoTime() {
    var currTime = objVideoPlayer.getVideoElement().currentTime;
    if (currTime >= p.endTime) {
      cancelAnimationFrame(requestAnimID);
      objVideoPlayer.pauseVideo();
      bindEvents();
      //--- navigation buttons update at act load ----
      if (p.navStartJson) {
        p._navController.updateButtons(p.navStartJson);
      }
    } else {
      requestAnimID = requestAnimFrame(function() {
        checkVideoTime();
      });
    }
  }
  //==== bind Div Events ====
  function bindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          addEvent(_elem);
        }
      }
    }
  }
  //==== unbind Div Events ====
  function unbindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          removeEvent(_elem);
        }
      }
    }
  }
  //=== add event to given element ===
  function addEvent(_elem) {
    if (p.text) {
      $(_elem)
        .off('mouseover mouseout click ', clickedEvent)
        .on('mouseover mouseout click', clickedEvent)
        .css('cursor', 'pointer');
    } else {
      $(_elem)
        .off('click', clickedEvent)
        .on('click', clickedEvent)
        .css('cursor', 'pointer');
    }
  }
  //=== remove event to given element ===
  function removeEvent(_elem) {
    if (p.text) {
      $(_elem)
        .off('mouseover mouseout click ', clickedEvent)
        .css('cursor', 'default');
    } else {
      $(_elem)
        .off('click', clickedEvent)
        .css('cursor', 'default');
    }
  }
  var selectedAnsArr = [];
  //===== click event listener  =====
  function clickedEvent(e) {
    var strLabel = '';
    var _id = e.currentTarget.id;
    var _target;
    if (_id) {
      _target = p.domObj[_id];
    }
    if (_target == undefined) return;
    //----- click event ----
    if (e.type == 'click') {
      removeEvent(p.domObj[_id]);
      if (p.tickNcross) {
        $(p.domObj[_id + '_tick']).show();
      }
      selectedAnsArr.push(_id);
      if (p.text) {
        setOptions(_target, 'selected');
      }
      checkAnswer(_id);
    } else if (e.type == 'mouseover') {
      strLabel = 'over';
      setOptions(_target, strLabel);
    } else if (e.type == 'mouseout') {
      strLabel = 'normal';
      setOptions(_target, strLabel);
    }
  }
  //==== check selected answer ====
  function checkAnswer(_id) {
    var _count = 0;
    for (var i = 0; i < selectedAnsArr.length; i++) {
      if (p.correctAnswer.indexOf(selectedAnsArr[i]) != -1) {
        _count++;
      }
    }
    if (p.click) {
      p.click({ currentClick: _id, selected: selectedAnsArr });
    }
    if (p.correctAnswer.length == _count) {
      console.log('right ans selected');
      unbindEvents();
      playFeedback('correct', 'correct');
    } else if (p.maxSelection != 0 && selectedAnsArr.length >= p.maxSelection) {
      console.log('maxSelection completed show feedBack');
      unbindEvents();
      playFeedback('correct', 'maxSel');
    }
  }
  var timeId;
  //===== play feedBack =====
  function playFeedback(_id, _status) {
    timeId = setTimeout(function() {
      console.log('hide wrapper and play video');

      var _fbParam;
      if (p.feedbackParam) {
        _fbParam = p.feedbackParam;
      }

      if (p.feedBack) {
        p.feedBack({
          _id: _id,
          status: _status,
          curSelected: selectedAnsArr,
          fbParam: _fbParam,
          domObj: p.domObj
        });
      }

      /* if(p.continueTimeLineVideo){
				if(p.fbStartFrame){
					objVideoPlayer.setVideoCurrentTime(p.fbStartFrame / p._shellModel.getFps());
					objVideoPlayer.playVideo();	
				}else{
					objVideoPlayer.playVideo();	
					//preloaderObj.hideLoader();
				}
				if(p.hideWrapper){
					$(p.domObj[p.actWrapperId]).hide();
				}	
			}else if(p.playTimelineVideo){
				if(p.timeLineVideoFrames){
					
					
				}
			} */
      if (p.navFbStartJson) {
        p._navController.updateButtons(p.navFbStartJson);
      }
    }, p.timeInterval);

    //var startTime = _start / p._shellModel.getFps();
    //p._shellModel.setExceptionDuration(_end - _start);
    //p.endTime = _end / p._shellModel.getFps();
    //p.callBack = _callback;
    //p.objVideoPlayer.setVideoCurrentTime(startTime);
  }
  //==========

  //====== set Text inside  div created in XML and id pass in optionHolderArr=====
  function setText() {
    if (p.optionGroupArr.length != p.optionHolderArr.length) {
      alert(
        'optionGroupArr length and optionHolderArr length mismatch, plese provide appropriate holder to set text'
      );
      alert('execution stopped here');
      return;
    }
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      var _parentOffset = $(p.domObj[p.optionHolderArr[i]]).offset();
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _id = p.optionGroupArr[i][j];
        var temp = p._shellModel.getTextValue(_id);
        if (temp) {
          var _div = iFrameDoc.createElement('div');
          var _leftPadding = 0;
          var _topPadding = 0;
          if (p.txtLeftPadding) {
            _leftPadding += Number(p.txtLeftPadding);
          }
          if (p.singleTxtPadding && p.singleTxtPadding[_id]) {
            if (p.singleTxtPadding[_id]['left']) {
              _leftPadding += Number(p.singleTxtPadding[_id]['left']);
            }
            if (p.singleTxtPadding[_id]['top']) {
              _topPadding += Number(p.singleTxtPadding[_id]['top']);
            }
          }
          var _lineHt = 0;
          if (p.lineHt != undefined) {
            _lineHt = p.lineHt;
          }
          $(_div).css({
            position: 'relative',
            display: 'inline-block',
            float: 'left',
            'margin-left': _leftPadding,
            'margin-top': _topPadding,
            'line-height': _lineHt + 'px'
          });
          $(_div)
            .appendTo(p.domObj[p.optionHolderArr[i]])
            .html(temp)
            .attr('id', _id + '_parent')
            .attr('group', i)
            .attr('status', 'false');
          var _tempSpan = $(_div).find('span');
          $(_tempSpan)
            .attr('id', _id)
            .attr('group', i)
            .attr('status', 'false');

          p.domObj[p.optionGroupArr[i][j] + '_parent'] = _div;
          //console.log(_tempSpan);
          p.domObj[p.optionGroupArr[i][j]] = _tempSpan[0];
          if (p.bottomBorder) {
            if (p.normalbottomBorderCss) {
              $(_tempSpan).css({
                'border-bottom': p.normalbottomBorderCss
              });
            }
          }
          // create tick/cross inside span
          if (p.tickNcross) {
            createTickAndCross(_div, _id);
          }
        }
      }
    }
  }
  //====== create tick and cross for each tick ========
  function createTickAndCross(_elem, _id) {
    var _div = iFrameDoc.createElement('div');
    $(_div).appendTo(_elem);
    var _img = 'cross';
    if (p.correctAnswer.indexOf(_id) != -1) {
      _img = 'tick';
    }
    $(_div)
      .css({
        width: activityImageObj[_img].width + 'px',
        height: activityImageObj[_img].height + 'px',
        'background-size': '100% 100%',
        'background-image': 'url(' + activityImageObj[_img].src + ')',
        'background-repeat': 'no-repeat',
        display: 'none',
        position: 'absolute'
      })
      .attr('id', _id + '_tick');
    //------------------
    if (p.tickAndCrossIndex) {
      $(_div).css('z-index', p.tickAndCrossIndex);
    }
    //-----------------
    var _imgHt = activityImageObj[_img].height;
    var _imgWd = activityImageObj[_img].width;
    var _left = 0;
    var _top = 0 - _imgHt / 2;

    //----- set tick/cross at lt(left-top-corner) , ct (center-top-middle) , rt(right-top-corner) -----
    if (p.FixTickNcrossPosition) {
      switch (p.FixTickNcrossPosition) {
        case 'lt':
          _left = _left - _imgWd / 2;
          _top = _top;
          break;
        case 'ct':
          _left = $(_elem).width() / 2 - _imgWd / 2;
          _top = _top;
          break;
        case 'rt':
          _left = $(_elem).width() - _imgWd / 2;
          _top = _top;
          break;
      }
    }
    //------- if want to specify position to individual tick/cross -----
    if (p.tickNcrossPosition) {
      if (p.tickNcrossPosition[_id]) {
        if (p.tickNcrossPosition[_id].x) {
          _left = p.tickNcrossPosition[_id].x;
        }
        if (p.tickNcrossPosition[_id].y) {
          _top = p.tickNcrossPosition[_id].y;
        }
      }
    }
    //==== if want specify same position according to it's parent for all tick/cross
    if (p.allTickNcrossPosition) {
      if (p.allTickNcrossPosition['x']) {
        _left = p.allTickNcrossPosition['x'];
      }
      if (p.allTickNcrossPosition['y']) {
        _top = p.allTickNcrossPosition['y'];
      }
    }
    //--- set left , top after all calculation ---
    $(_div).css({
      left: _left + 'px',
      top: _top + 'px'
    });
    p.domObj[_id + '_tick'] = _div;
  }

  // ====== bind events to options ======
  /* function bindEvents(){
		for(var i = 0; i < p.optionGroupArr.length; i++){
			for(var j = 0; j < p.optionGroupArr[i].length; j++){
				var _elem = p.domObj[p.optionGroupArr[i][j]];
				if(_elem){
					$(_elem).off('mouseover mouseout click ',mouseEvents).on('mouseover mouseout click',mouseEvents).css('cursor','pointer');
				}	
			}
		}	
	} */

  // ====== set options accordign to state =======
  function setOptions(_elem, _state) {
    if (_state == 'selected') {
      $(_elem).css({
        'background-color': p.selectedStateColor,
        'border-bottom': p.selectedbottomBorderCss
      });
    }
    if (_state == 'normal') {
      $(_elem).css({
        'border-bottom': p.normalbottomBorderCss,
        'background-color': p.normalStateColor
      });
    }
    if (_state == 'over') {
      $(_elem).css({
        'border-bottom': p.overbottomBorderCss,
        'background-color': p.overStateColor
      });
    }
  }

  //============ play feedback =============
  /*function gotoAndPlayFeedBack(_status , _id , _retStatus){
		console.log(_status , _id , "  : : _status : _id",_retStatus , "   :: _stat");
		if(p.navFbStartJson){
			p._navController.updateButtons(p.navFbStartJson);
		}
		var _audioPath;
		if(p.feedbackParam[_id]){
			_audioPath = p._shellModel.getMediaPath() + p.feedbackParam[_id];
		}
		disableAllOptions();
		disableSubmit();
		if(p.disableSolutionOnFb){
			disableSolution();
		}
		unbindSolutionEvent();
		 if(p.feedBack){
			p.feedBack({status : _status , popup : _id,audioPath:_audioPath, feedbackParam:p.feedbackParam,
			videoFb: p.feedbackParam["video_"+_id],_shellModel:p._shellModel,
			jsflObj : p.feedbackParam["jsfl_"+_id],
			curStatus: _id,curSelected:attemptedAnswersMc,retStatus:_retStatus
			});
		} 
	}	*/

  //===== remove all dom elements events and elments =====
  this.removeAll = function() {
    if (p) {
      unbindEvents();
      clearTimeout(timeId);
      timeId = null;
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
    }
  };

  //===== this function listenes feedBack completed from feedback class =====
  this.onFeedBackCompleted = function(_fb) {
    console.log(':: FeedBackCompleted ::');
  };

  // ------- activity over -----------
  function activityOver() {
    if (p.navEndJson) {
      p._navController.updateButtons(p.navEndJson);
    }
    // === dispatch event for actOver ======
    if (p['activityOver']) {
      p['activityOver']({
        status: 'ActivityOver'
      });
    }
  }
};
