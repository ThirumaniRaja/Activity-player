var mcq_v3 = function() {
  var p = {
    optionGroupArr: [],
    correctAnswer: [],
    maxNumberOfTries: 0,
    numberOfCorrectFeedbacks: 1,
    numberOfIncorrectFeedbacks: 2,
    // parameters for adjust left top of glow
    leftPadding: -10,
    topPadding: -10,
    glowWidth: '105%',
    glowHeight: '105%',
    glowBorder: '5px solid #FFFFFF',
    glowRadius: 20, // glow radius
    hitAreaRadius: 20, // hitArea radius
    //custom parameters added
    domObj: new Object()
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
  var correctFeedbackCounter = 0;
  var incorrectFeedbackCounter = 0;
  var activityImageObj = new Object(); // storing all images
  var iFrameDoc;
  var serviceObj;
  var commonAssetPath;
  //=============
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    //console.log("inside init")
    serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    makeImgObject();
  };
  //=============
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  //=============
  function startActivity() {
    if (p.navStartJson) {
      p._navController.updateButtons(p.navStartJson);
    }
    counter = 0;
    correctFeedbackCounter = 0;
    incorrectFeedbackCounter = 0;
    prepareOptions();
    bindEvents();
  }
  function prepareOptions() {
    if (p.optionGroupArr.length > 0) {
      // check for some div inside array
      for (var i = 0; i < p.optionGroupArr.length; i++) {
        for (var j = 0; j < p.optionGroupArr[i].length; j++) {
          if (p.domObj[p.optionGroupArr[i][j]]) {
            p.domObj[p.optionGroupArr[i][j]].setAttribute(
              'data-id',
              p.optionGroupArr[i][0]
            );
            $(p.domObj[p.optionGroupArr[i][j]]).css({
              'background-color': 'rgba(0,0,0,0)'
            });
          }
        }
        if (p.domObj[p.optionGroupArr[i][0]]) {
          $(p.domObj[p.optionGroupArr[i][0]]).css({
            'border-radius': p.hitAreaRadius + 'px'
          });
          crateOptionDiv(p.domObj[p.optionGroupArr[i][0]]);
        }
      }
    }
  }

  function crateOptionDiv(hitArea) {
    var _div = document.createElement('div');
    $(hitArea).append(_div);
    //
    var _left = 0;
    var _top = 0;
    if (p.leftPadding) {
      _left += p.leftPadding;
    }
    if (p.topPadding) {
      _top += p.topPadding;
    }

    if (p.optionPosition) {
      if (p.optionPosition[hitArea.id]) {
        if (p.optionPosition[hitArea.id].x)
          _left = p.optionPosition[hitArea.id].x;
        if (p.optionPosition[hitArea.id].y)
          _top = p.optionPosition[hitArea.id].y;
      }
    }

    $(_div)
      .css({
        position: 'absolute',
        left: _left,
        top: _top,
        width: p.glowWidth,
        height: p.glowHeight,
        'border-radius': p.glowRadius,
        'pointer-events': 'none',
        cursor: 'pointer',
        border: p.glowBorder,
        display: 'none'
      })
      .attr('id', hitArea.id + '_innerDiv')
      .attr('data-id', hitArea.id);
    p.domObj[hitArea.id + '_innerDiv'] = _div;
  }
  function bindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        if (p.domObj[p.optionGroupArr[i][j]]) {
          $(p.domObj[p.optionGroupArr[i][j]])
            .unbind('mouseover mouseout click', mouseEvents)
            .bind('mouseover mouseout click', mouseEvents)
            .css({ cursor: 'pointer' });
        }
      }
    }
  }
  function unbindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        if (p.domObj[p.optionGroupArr[i][j]]) {
          $(p.domObj[p.optionGroupArr[i][j]])
            .unbind('mouseover mouseout click', mouseEvents)
            .css({ cursor: '' });
        }
      }
    }
  }
  function mouseEvents(e) {
    var _id = p.domObj[e.currentTarget.id].getAttribute('data-id');
    if (e.type == 'mouseover') {
      hideAllGlow();
      //console.log(_id , "  :: data id");
      $(p.domObj[_id + '_innerDiv']).css({
        display: 'block'
      });
    }
    if (e.type == 'mouseout') {
      hideAllGlow();
    }
    if (e.type == 'click') {
      hideAllGlow();
      unbindEvents();
      //console.log((p.domObj[e.currentTarget.id]).getAttribute('data-id') , "  :: data id");
      checkForValidation(_id);
    }
  }

  function checkForValidation(_id) {
    correctFeedbackCounter++;
    incorrectFeedbackCounter++;
    if (incorrectFeedbackCounter >= p.numberOfIncorrectFeedbacks) {
      incorrectFeedbackCounter = p.numberOfIncorrectFeedbacks;
    }
    if (correctFeedbackCounter >= p.numberOfCorrectFeedbacks) {
      correctFeedbackCounter = p.numberOfCorrectFeedbacks;
    }

    if (p.maxNumberOfTries != 0) {
      counter++;
      if (counter <= p.maxNumberOfTries) {
        validateAnswer(_id);
      }
    } else {
      validateAnswer(_id);
    }
  }
  function validateAnswer(_id) {
    if (p.correctAnswer.indexOf(_id) != -1) {
      //console.log("correct Feedback");
      gotoAndPlayFeedBack('correct', 'correct' + correctFeedbackCounter, _id);
    } else {
      //console.log("inCorrect Feedback");
      gotoAndPlayFeedBack(
        'inCorrect',
        'inCorrect' + incorrectFeedbackCounter,
        _id
      );
      //AddScore();
    }
  }
  function hideAllGlow() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      if (p.domObj[p.optionGroupArr[i][0]]) {
        $(p.domObj[p.optionGroupArr[i][0] + '_innerDiv']).css({
          display: 'none'
        });
      }
    }
  }

  function gotoAndPlayFeedBack(_status, _id, _curSelected) {
    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }
    var _audioPath;
    if (p.feedbackParam[_id])
      _audioPath = p._shellModel.getMediaPath() + p.feedbackParam[_id];
    unbindEvents();
    if (p.feedBack)
      p.feedBack({
        status: _status,
        popup: _id,
        audioPath: _audioPath,
        feedbackParam: p.feedbackParam,
        videoFb: p.feedbackParam['video_' + _id],
        _shellModel: p._shellModel,
        jsflObj: p.feedbackParam['jsfl_' + _id],
        curStatus: _id,
        curSelected: _curSelected
      });
  }
  //   this function listenes feedBack completed from feedback class
  this.onFeedBackCompleted = function(_fb) {
    if (counter >= p.maxNumberOfTries && p.maxNumberOfTries != 0) {
      activityOver(_fb.status, _fb.curStatus);
    } else {
      if (_fb.status == 'inCorrect') {
        bindEvents();
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      } else {
        activityOver(_fb.status, _fb.curStatus);
      }
    }
  };
  this.removeAll = function() {
    hideAllGlow();
    unbindEvents();
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
  function activityOver(_status, _curStatus) {
    hideAllGlow();
    unbindEvents();
    var instText = '';
    if (p.navEndJson) {
      p._navController.updateButtons(p.navEndJson);
    }
    //for customFn
    if (p['activityOver'])
      p['activityOver']({
        status: 'ActivityOver',
        fbStatus: _status,
        curStatus: _curStatus
      });
  }

  function makeImgObject() {
    var tempImgObj = new Object();
    if (p.optionImgObj) {
      for (var i in p.optionImgObj) {
        if (p.optionImgObj[i])
          tempImgObj['option_' + i] =
            p._shellModel.getMediaPath() + p.optionImgObj[i];
      }
    }
    if (p.multipleOptionImg) {
      for (var i in p.multipleOptionImg) {
        for (var j in p.multipleOptionImg[i]) {
          tempImgObj[i + '_option_' + j] =
            p._shellModel.getMediaPath() + p.multipleOptionImg[i][j];
        }
      }
    }
    preloadImages(tempImgObj);
  }
  // this function for creating image object for draw on option canvas and load images
  var loadImgCnt = 0,
    loadedImgCnt = 0;
  function preloadImages(_obj) {
    //console.log("inasde" , _obj)
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
      //console.log("no dfbghdsjk",Object.keys(_obj).length)
      startActivity();
    }
  }
  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
      //console.LOG("START")
    }
  }
};
