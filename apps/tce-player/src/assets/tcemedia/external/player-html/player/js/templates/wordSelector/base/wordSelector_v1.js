var wordSelector_v1 = function() {
  var p = {
    div: false, //create div or span

    questionType: 'SingleChoice', //
    maxNumberOfTries: 0, //max no of attempt
    optionHolderArr: [], //holder id for text container
    optionGroupArr: [[]], //Text id's
    correctAnswer: [], //correct ans array
    submitBtn: '', //submit btn ID
    solutionBtn: '', //solution btn ID
    tickNcross: true, //if want tick n cross
    numberOfCorrectFeedback: 1, //no of correct feedbacks
    numberOfIncorrectFeedback: 1, //no of inCorrect feedbacks
    numberOfCombinationFeedback: 1, //no of inCorrect feedbacks
    individualFb: false, //for different feedback for each option
    combinationFb: false, //combination of correct/incorrect ans
    bottomBorder: true, //if want bottom border
    normalbottomBorderCss: '2px solid orange', //style for bottom border in normal state
    overbottomBorderCss: '2px solid orange', //style for bottom border in over state
    selectedbottomBorderCss: '2px solid orange', //style for bottom border in selected state
    disablebottomBorderCss: '2px solid orange', //style for bottom border in disable state
    selectedStateColor: 'orange', //default color after word selction
    normalStateColor: '', //normal state color
    overStateColor: '', //normal state color
    disableStateColor: '', //disable state color
    tickAndCrossDivID: '', // provide id of tickAndCrossDiv to place tick and cross

    maintainScore: false, //for star
    questNo: 0, //question no.
    submitImgType: '', //submit button Image
    solutionImgType: '', //solution button Image
    tickAndCrossType: '', //tick n cross image type
    tickNcrossPosition: {}, //custom tick and cross position for individual tick
    allTickNcrossPosition: {}, //tick and cross position for all tick/cross
    FixTickNcrossPosition: '', //tick and cross position
    resetIncorrect: true, //reset incorrect options after incorrect feedback
    resetAll: true, //reset all options including correct option after incorrect feedback
    resetIncorrectTnC: true, //reset incorrect cross after incorrect feedback
    resetAllTnC: true, //reset all tick and cross including correct option after incorrect feedback
    domObj: {}, //containing all dom Elements
    enableSubmitCount: 2, //enable submit button after selecting 2 or more options (for multiplechoice)
    showAllCorrectTick: false, //if want to show correct tick after max number of tries
    showCorrectAnsSelected: false, //if want to show correct options selected after max number of tries
    txtLeftPadding: 10, //padding-left for all text
    txtTopPadding: 0, //padding-right for all text
    //  singleTxtPadding:{'txt_id':{left:0,top:0}}   // if want to give single txt padding -
    maxSelection: 0, //for multipleChoice when restrict max selection
    showSolutionTick: true, // if want to show correct tick after show solution
    optionDisableOnFb: false, // set disable state after feedback (correct/incorrect)
    showOnlyCorrectAfterSolution: true, // Set only correct options selected after show solution
    showCorrectAfterSolution: false, // show correct option selected after show solution with current wrong selected
    onValidationCnt: false, // check for user once givent the answer

    // submit button background image parameters
    submitLeft: -6,
    submitTop: -11,
    submitWidth: 134,
    submitHeight: 52,
    // solution button background image parameters
    solutionLeft: -6,
    solutionTop: -11,
    solutionWidth: 179,
    solutionHeight: 52,

    enableSolutionButton: true, // enable solution button initially
    //after click on solution button
    setOnlyCorrectAns: true,
    setOnlyCorrectTnC: false,
    hideTnCAfterSolution: false
    //submitImgObj  // images for submit button

    //resetAllOptionsAfterIncorrectFeedBack:false,    // reset all options after incorrect feedBack
    //resetIncorrectOptionsAfterIncorrectFeedBack:false,   // reset only incorrect options after incorrect feedBack

    //resetAllTnCAfterIncorrectFeedBack:false, // reset all tick and cross
    //resetOnlyIncorrectTnCAfterIncorrectFB:true,   // reset only inocrrect options

    // tickAndCrossIndex   // index for tick and cross
    //submitCssObj  // type 2 submit button(css)
    //solutionCssObj  // type 2 submit button(css)
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
  var combinationFeedbackCounter = 0;
  var ansValidationCounter = 0;

  var optionSetArr = [];
  var submitBool = false;
  var showSolBool = false;
  var attemptedAnswers = [];
  var currentOption;
  var multiSubmitBool = false;
  var attemptedAnswersMc = [];
  var multipleChoiceBool = false;
  var showSolActivateBool = false;
  var attemptedMultipleAnswersMc = [];
  var addstar_mc;

  var activityImageObj = new Object(); // storing all images
  var iFrameDoc;
  var serviceObj;
  var commonAssetPath;
  var globalOffset = new Object();
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    globalOffset = $(p._shellModel.getiFrameRef()).offset();
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    makeImgObject();
  };
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
      for (var i in p.multipleOptionImg) {
        for (var j in p.multipleOptionImg[i]) {
          tempImgObj[i + '_option_' + j] =
            p._shellModel.getMediaPath() + p.multipleOptionImg[i][j];
        }
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
  function startActivity() {
    counter = 0;
    correctFeedbackCounter = 0;
    incorrectFeedbackCounter = 0;
    ansValidationCounter = 0;
    if (p.submitBtn) {
      createSubmitArea(p.domObj[p.submitBtn]);
      gotoAndStopSubmit(p.domObj[p.submitBtn + '_img'], 'disable');
    }
    if (p.solutionBtn) {
      createSolutionArea(p.domObj[p.solutionBtn]);
      if (p.enableSolutionButton) {
        // if required solution button enable initially
        enableSolution();
      } else {
        gotoAndStopSolution(p.domObj[p.solutionBtn + '_img'], 'disable');
      }
    }
    setText();
  }
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
          if (p.div) {
            var _div = iFrameDoc.createElement('div');
          } else {
            var _div = iFrameDoc.createElement('span');
          }

          var _leftPadding = 0;
          var _topPadding = 0;
          if (p.lineHt) {
            $(_div).css({
              'line-height': p.lineHt + 'px'
            });
          }
          if (p.txtLeftPadding) {
            _leftPadding += Number(p.txtLeftPadding);
          }
          if (p.txtTopPadding) {
            _topPadding += Number(p.txtTopPadding);
          }
          if (p.singleTxtPadding && p.singleTxtPadding[_id]) {
            if (p.singleTxtPadding[_id]['left']) {
              _leftPadding += Number(p.singleTxtPadding[_id]['left']);
            }
            if (p.singleTxtPadding[_id]['top']) {
              _topPadding += Number(p.singleTxtPadding[_id]['top']);
            }
          }
          if (p.div) {
            $(_div).css({
              position: 'relative',
              float: 'left',
              display: 'inline-block',
              'margin-left': _leftPadding,
              'margin-top': _topPadding
            });
          } else {
            $(_div).css({
              //"position":"relative",
              //"float":"left",
              //"display": "inline",
              'margin-left': _leftPadding,
              'margin-top': _topPadding
            });
          }

          //$(_span).appendTo(p.domObj[p.optionHolderArr[i]]).html(temp).attr('id',_id+"_parent").attr('group',i).attr('status','false');
          $(_div)
            .appendTo(p.domObj[p.optionHolderArr[i]])
            .html(temp)
            .attr('id', _id + '_parent')
            .attr('group', i)
            .attr('status', 'false');
          //console.log($($(_span).find('span')[0]).offset() , $(_span).offset());
          var _tempSpan = $(_div).find('span');
          $(_tempSpan)
            .attr('id', _id)
            .attr('group', i)
            .attr('status', 'false');
          /*$(_tempSpan).css({
						"float":"left",
						"clear":"both",
					}).attr('id',_id).attr('group',i).attr('status','false');
					p.domObj[p.optionGroupArr[i][j]+"_parent"] = _span; */
          //p.domObj[p.optionGroupArr[i][j]] = _tempSpan[0];
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
    bindEvents();
    if (p.navStartJson) {
      p._navController.updateButtons(p.navStartJson);
    }
  }
  //====== create tick and cross for each tick ========
  function createTickAndCross(_elem, _id) {
    var _div = iFrameDoc.createElement('div');
    $(_div).appendTo(_elem);
    /*if(p.tickAndCrossDivID){
			$(_div).appendTo(_elem);
		}else{
			$(_div).appendTo('body');
		}*/
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
        //"visibility":"hidden",
        //"float":"left",
        //"clear":"both"
      })
      .attr('id', _id + '_tick');
    if (p.tickAndCrossIndex) {
      $(_div).css('z-index', p.tickAndCrossIndex);
    }
    //var _offset = getOffset(_elem);
    //var _left =  ($(_elem).position().left + _leftPadding + _parentOffset.left - activityImageObj[_img].width/2)  , _top = ($(_elem).position().top + _topPadding + _parentOffset.top - activityImageObj[_img].height/2);
    var _left = 0;
    var _top = 0 - activityImageObj[_img].height / 2;
    //  if specified position of tick and cross
    if (p.FixTickNcrossPosition) {
      if (p.FixTickNcrossPosition == 'lt') {
        _left = _left - activityImageObj[_img].width / 2;
        _top = _top;
      }
      if (p.FixTickNcrossPosition == 'ct') {
        _left +=
          parseInt($(_elem).css('width')) / 2 -
          activityImageObj[_img].width / 2;
      }
    }
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
    if (p.allTickNcrossPosition) {
      if (p.allTickNcrossPosition['x']) {
        _left += p.allTickNcrossPosition['x'];
      }
      if (p.allTickNcrossPosition['y']) {
        _top += p.allTickNcrossPosition['y'];
      }
    }
    $(_div).css({
      left: _left + 'px',
      top: _top + 'px'
    });
    p.domObj[_id + '_tick'] = _div;
  }
  //=======================
  function getOffset(_elem) {
    return {
      top: $(_elem).offset().top - globalOffset.top,
      left: $(_elem).offset().left - globalOffset.left
    };
  }
  // ====== bind events to options ======
  function bindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          $(_elem)
            .off('mouseover mouseout click ', mouseEvents)
            .on('mouseover mouseout click', mouseEvents)
            .css('cursor', 'pointer');
        }
      }
    }
  }
  // ====== unbind events to options ======
  function unbindEvents() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          $(_elem)
            .off('mouseover mouseout click ', mouseEvents)
            .css('cursor', 'default');
        }
      }
    }
  }
  function mouseEvents(e) {
    var strLabel = '';
    var _group = $(this).attr('group');
    var _id = e.currentTarget.id;
    var _target;
    if (_group && _id) {
      _target = p.domObj[_id];
    }
    if (_target == undefined) return;
    // check for maxSelection for multplechoice
    if (p.maxSelection != 0) {
      if (_group) {
        if (
          attemptedAnswersMc[_group] &&
          attemptedAnswersMc[_group].length >= p.maxSelection
        ) {
          if (_target.getAttribute('status') == 'false') {
            $(_target).css('cursor', 'default');
            return;
          }
        }
      }
    }
    var strLabel = '';
    if (e.type == 'mouseover') {
      if (p.questionType == 'SingleChoice') {
        if (_target.getAttribute('status') == 'true') {
          $(_target).css('cursor', 'default');
          strLabel = 'selected';
        } else {
          $(_target).css('cursor', 'pointer');
          strLabel = 'over';
        }
      }
      if (p.questionType == 'MultipleChoice') {
        $(_target).css('cursor', 'pointer');
      }
    }
    //--------------------
    if (e.type == 'mouseout') {
      if (p.questionType == 'SingleChoice') {
        if (_target.getAttribute('status') == 'true') {
          strLabel = 'selected';
        } else {
          strLabel = 'normal';
        }
      } else {
        if (_target.getAttribute('status') == 'true') {
          strLabel += 'selected';
        } else {
          strLabel += 'normal';
        }
      }
    }
    // ----------
    if (e.type != 'click') {
      setOptions(_target, strLabel);
    }
    // ---- option selection -----
    if (e.type == 'click') {
      if (p.questionType == 'SingleChoice') {
        attemptedAnswers[_group] = _target.id;
        resetOptions(_group);
        _target.setAttribute('status', 'true');
        setOptions(_target, 'selected');
        $(_target).css('cursor', 'default');
      }
      if (p.questionType == 'MultipleChoice') {
        if (!(_target.getAttribute('status') == 'true')) {
          if (typeof attemptedAnswers[_group] == 'undefined') {
            attemptedAnswers[_group] = new Array();
          }
          attemptedAnswers[_group].push(_target.id);
          _target.setAttribute('status', 'true');
          setOptions(_target, 'selected');
        } else if (_target.getAttribute('status') == 'true') {
          if (attemptedAnswers[_group]) {
            attemptedAnswers[_group].splice(
              attemptedAnswers[_group].indexOf(_target.id),
              1
            );
          }
          _target.setAttribute('status', 'false');
          setOptions(_target, 'normal');
        }
      }
      getSelectedAns();
      checkForSubmit();
    }
  }
  //======= check for submit enable =======
  function checkForSubmit() {
    if (p.submitBtn) {
      if (p.questionType == 'SingleChoice') {
        var _count = 0;
        for (var i = 0; i < attemptedAnswersMc.length; i++) {
          if (attemptedAnswersMc[i]) {
            for (var j = 0; j < attemptedAnswersMc[i].length; j++) {
              if (attemptedAnswersMc[i][j]) {
                _count++;
              }
            }
          }
        }
        if (_count == p.correctAnswer.length) {
          enableSubmit();
        }
      } else {
        // for MultipleChoice
        // check when to enable submit button in case of multiple choice question
        var _bool = true;
        for (var i = 0; i < attemptedAnswersMc.length; i++) {
          if (attemptedAnswersMc[i].length < p.enableSubmitCount) {
            _bool = false;
          }
        }

        if (_bool) {
          enableSubmit();
        } else {
          disableSubmit();
        }
      }
    } else {
      if (getArrLen(attemptedAnswers) == p.correctAnswer.length) {
        checkForValidation();
      }
    }
  }
  function getArrLen(_arr) {
    var _count = 0;
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i]) {
        _count++;
      }
    }
    return _count;
  }
  //========= enable submit button ==========
  function enableSubmit() {
    if (p.submitBtn) {
      gotoAndStopSubmit(p.domObj[p.submitBtn + '_img'], 'normal');
      addSubmitEvent();
    }
  }
  //========= add submit button event ==========
  function addSubmitEvent() {
    $(p.domObj[p.submitBtn])
      .off('mouseover mouseout click', submitEvent)
      .on('mouseover mouseout click', submitEvent)
      .css('cursor', 'pointer');
  }
  //========= submit button event Listener==========
  function submitEvent(e) {
    //=============================
    if (e.type == 'mouseover') {
      gotoAndStopSubmit(p.domObj[p.submitBtn + '_img'], 'over');
    }
    if (e.type == 'mouseout') {
      gotoAndStopSubmit(p.domObj[p.submitBtn + '_img'], 'normal');
    }
    //=============================
    if (e.type == 'click') {
      checkForValidation();
      disableSubmit();
    }
  }
  // ========== disable submit Button ==========
  function disableSubmit() {
    if (p.submitBtn) {
      gotoAndStopSubmit(p.domObj[p.submitBtn + '_img'], 'disable');
      $(p.domObj[p.submitBtn])
        .off('mouseover mouseout click', submitEvent)
        .css('cursor', 'default');
    }
  }
  //========= enable submit button ==========
  function enableSolution() {
    if (p.solutionBtn) {
      gotoAndStopSolution(p.domObj[p.solutionBtn + '_img'], 'normal');
      bindSolutionEvent();
    }
  }
  //========= add solution button event ==========
  function bindSolutionEvent() {
    $(p.domObj[p.solutionBtn])
      .off('mouseover mouseout click', solutionEvent)
      .on('mouseover mouseout click', solutionEvent)
      .css('cursor', 'pointer');
  }
  //========= add solution button event ==========
  function unbindSolutionEvent() {
    $(p.domObj[p.solutionBtn])
      .off('mouseover mouseout click', solutionEvent)
      .css('cursor', '');
  }
  //========= solution button event Listener==========
  function solutionEvent(e) {
    //-------------
    if (e.type == 'mouseover') {
      gotoAndStopSolution(p.domObj[p.solutionBtn + '_img'], 'over');
    }
    if (e.type == 'mouseout') {
      gotoAndStopSolution(p.domObj[p.solutionBtn + '_img'], 'normal');
    }
    //-----------------
    if (e.type == 'click') {
      disableSolution();
      disableAllOptions();
      if (p.setOnlyCorrectAns) {
        resetAllOptions();
      }
      //
      if (p.hideTnCAfterSolution) {
        hideAllTicks();
      }
      //
      if (p.setOnlyCorrectTnC) {
        hideAllTicks();
        showCorrectTick();
      }
      if (p.showSolutionTick) {
        showCorrectTick();
      }
      setCorrectAnsSelected();
      gotoAndPlayFeedBack('solution', 'solution', 'solution');
      //if(p.showOnlyCorrectAfterSolution){
      //	show_AfterSolution(true);
      //}
      //if(p.showCorrectAfterSolution){
      //	show_AfterSolution(false);
      //}
    }
  }
  // ========== disable solution Button ==========
  function disableSolution() {
    if (p.solutionBtn) {
      gotoAndStopSolution(p.domObj[p.solutionBtn + '_img'], 'disable');
      $(p.domObj[p.solutionBtn])
        .off('mouseover mouseout click', solutionEvent)
        .css('cursor', 'default');
    }
  }
  //====== set all correct answers selected =====
  function setCorrectAnsSelected() {
    for (var i = 0; i < p.correctAnswer.length; i++) {
      var _elem = p.domObj[p.correctAnswer[i]];
      if (_elem) {
        setOptions(_elem, 'selected');
      }
    }
  }
  //====== set all correct answers selected =====
  function showCorrectTick() {
    for (var i = 0; i < p.correctAnswer.length; i++) {
      var _elem = p.domObj[p.correctAnswer[i] + '_tick'];
      if (_elem) {
        $(_elem).show();
      }
    }
  }
  // ======  Check for correct/incorrect answers =========
  function checkForValidation() {
    showSolActivateBool = true;
    //addshowSolListener();     //  add event to show solution
    correctFeedbackCounter++;
    incorrectFeedbackCounter++;
    ansValidationCounter++;
    if (incorrectFeedbackCounter >= p.numberOfIncorrectFeedback) {
      incorrectFeedbackCounter = p.numberOfIncorrectFeedback;
    }
    if (correctFeedbackCounter >= p.numberOfCorrectFeedback) {
      correctFeedbackCounter = p.numberOfCorrectFeedback;
    }

    if (p.maxNumberOfTries != 0) {
      counter++;
      if (counter < p.maxNumberOfTries) {
        validateAnswer();
      } else if (counter == p.maxNumberOfTries) {
        validateAnswer();
        if (p.showAllCorrectTick) {
          showAllCorrectAnswerTick();
        }
        if (p.showCorrectAnsSelected) {
          setCorrectAnsSelected();
        }
      }
    } else {
      validateAnswer();
    }
  }
  // ===== reset current group options =======
  function resetOptions(_grp) {
    var tempArr = p.optionGroupArr[_grp];
    for (var i = 0; i < tempArr.length; i++) {
      var _elem = p.domObj[tempArr[i]];
      if (_elem) {
        setOptions(_elem, 'normal');
        _elem.setAttribute('status', 'false');
        $(_elem).css('cursor', 'pointer');
      }
    }
  }
  // ===== reset All options =======
  function resetAllOptions() {
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          setOptions(_elem, 'normal');
          _elem.setAttribute('status', 'false');
          $(_elem).css('cursor', 'pointer');
        }
      }
    }
  }
  // ===== reset All options =======
  function resetIncorrectOptions() {
    /*for(var i = 0; i < p.optionGroupArr.length; i++){
			for(var j = 0; j < p.optionGroupArr[i].length; j++){
				var _elem = p.domObj[p.optionGroupArr[i][j]];
				if(_elem){
					if((_elem.getAttribute('status') == "true") && (p.correctAnswer.indexOf(p.optionGroupArr[i][j]) != -1)){
							console.log("right answer :: do not reset");
					}else{
						setOptions(_elem , "normal");
						_elem.setAttribute('status' , 'false');
						$(_elem).css('cursor','pointer');
					}
				}	
			}
		}*/

    if (p.questionType == 'SingleChoice') {
      for (var i = 0; i < p.optionGroupArr.length; i++) {
        if (attemptedAnswersMc[i] && attemptedAnswersMc[i].length > 0) {
          if (p.correctAnswer.indexOf(attemptedAnswersMc[i][0]) == -1) {
            // incorrect group in case of group
            for (var j = 0; j < p.optionGroupArr[i].length; j++) {
              var _mc = p.domObj[p.optionGroupArr[i][j]];
              if (_mc) {
                setOptions(_mc, 'normal');
                _mc.setAttribute('status', 'false');
                attemptedAnswersMc[i] = new Array();
                addEvent(_mc);
              }
            }
          } else {
            for (var j = 0; j < p.optionGroupArr[i].length; j++) {
              var _mc = p.domObj[p.optionGroupArr[i][j]];
              if (_mc) {
                removeEvent(_mc);
              }
            }
          }
        }
      }
    } else {
      // for multipleChoice
      for (var i = 0; i < p.optionGroupArr.length; i++) {
        if (attemptedAnswersMc[i] && attemptedAnswersMc[i].length > 0) {
          var _rightAns = checkAnswers(attemptedAnswersMc[i], p.correctAnswer);
          for (var j = 0; j < p.optionGroupArr[i].length; j++) {
            var _elem = p.domObj[p.optionGroupArr[i][j]];
            if (_rightAns) {
              if (_elem) {
                removeEvent(_elem);
              }
            } else {
              addEvent(_elem);
              setOptions(_elem, 'normal');
              _elem.setAttribute('status', 'false');
              attemptedAnswersMc[i].splice(
                attemptedAnswersMc[i].indexOf(p.optionGroupArr[i][j]),
                1
              );
            }
          }
        }
      }
    }
  }
  //===== check for all answers are correct in case of multiple choice group===
  function checkAnswers(_attempted, _ansArr) {
    var _count = 0;
    for (var i = 0; i < _attempted.length; i++) {
      if (_ansArr.indexOf(_attempted[i]) != -1) {
        _count++;
      }
    }
    if (_count == _attempted.length) {
      return true;
    } else {
      return false;
    }
  }
  //==== remove Events of individual options =======
  function removeEvent(_elem) {
    $(_elem)
      .off('mouseover mouseout click ', mouseEvents)
      .css('cursor', 'default');
  }
  //==== remove Events of individual options =======
  function addEvent(_elem) {
    $(_elem)
      .off('mouseover mouseout click ', mouseEvents)
      .on('mouseover mouseout click', mouseEvents)
      .css('cursor', 'pointer');
  }
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
  //======= create div for submit button image ===
  function createSubmitArea(_target) {
    var _div = iFrameDoc.createElement('div');
    $(_target).prepend(_div);
    $(_div)
      .css({
        position: 'absolute',
        left: p.submitLeft,
        top: p.submitTop,
        //"width":p.submitWidth,
        width: activityImageObj['submitBtn_normal'].width,
        //"height":p.submitHeight,
        height: activityImageObj['submitBtn_normal'].height,
        'pointer-events': 'none'
      })
      .attr('id', _target.id + '_img');
    p.domObj[_target.id + '_img'] = _div;
  }
  //======= create div for solution button image ===
  function createSolutionArea(_target) {
    var _div = iFrameDoc.createElement('div');
    $(_target).prepend(_div);
    $(_div)
      .css({
        position: 'absolute',
        left: p.solutionLeft,
        top: p.solutionTop,
        //"width":p.solutionWidth,
        width: activityImageObj['solutionBtn_normal'].width,
        //"height":p.solutionHeight,
        height: activityImageObj['solutionBtn_normal'].height,
        'pointer-events': 'none'
      })
      .attr('id', _target.id + '_img');
    p.domObj[_target.id + '_img'] = _div;
  }
  //========= add event listener here =======
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  //====== set background of submit button =========
  function gotoAndStopSubmit(_elem, _state) {
    if (p.submitBtn) {
      if (_state) {
        if (activityImageObj['submitBtn_' + _state]) {
          setBackground(_elem, activityImageObj['submitBtn_' + _state].src);
        }
        if (p.submitCssObj) {
          if (p.submitCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.submitCssObj[_state]);
          }
        }
      }
    }
  }
  //====== set background of solution button =========
  function gotoAndStopSolution(_elem, _state) {
    if (p.solutionBtn) {
      if (_state) {
        if (activityImageObj['solutionBtn_' + _state]) {
          setBackground(_elem, activityImageObj['solutionBtn_' + _state].src);
        }
        if (p.solutionCssObj) {
          if (p.solutionCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.solutionCssObj[_state]);
          }
        }
      }
    }
  }
  function setBackground(_elem, _url) {
    $(_elem).css({
      'background-image': 'url(' + _url + ')',
      'background-repeat': 'no-repeat',
      'background-size': '100% 100%'
    });
  }
  //==== show All correct ticks after max no of tries =====
  function showAllCorrectAnswerTick() {
    for (var i = 0; i < p.correctAnswer.length; i++) {
      var _elem = p.domObj[p.correctAnswer[i] + '_tick'];
      if (_elem) {
        $(_elem).show();
      }
    }
  }

  //========== get selected answers used to show correct/incorrect feedbak=======
  function getSelectedAnswers() {
    var _arr = [];
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          if ($(_elem).attr('status') == 'true') {
            _arr.push(_elem.id);
          }
        }
      }
    }
    return _arr;
  }
  //========== get selected answers to manage reset options=======
  function getSelectedAns() {
    attemptedAnswersMc = [];
    for (var i = 0; i < p.optionGroupArr.length; i++) {
      attemptedAnswersMc[i] = new Array();
      for (var j = 0; j < p.optionGroupArr[i].length; j++) {
        var _elem = p.domObj[p.optionGroupArr[i][j]];
        if (_elem) {
          if (_elem.getAttribute('status') == 'true') {
            attemptedAnswersMc[i].push(_elem.id);
          }
        }
      }
    }
    return attemptedAnswersMc;
  }
  // private function validateAnswer
  var selectedAns = [];
  function validateAnswer() {
    hideAllTicks(); //  hide all tick and cross
    selectedAns = [];
    selectedAns = getSelectedAnswers().slice(0);
    //console.log(selectedAns, "  :: selectedAns");
    var _count = 0;
    var _checkForWrong = true;
    var checkForComb = false;
    for (var i = 0; i < selectedAns.length; i++) {
      if (p.correctAnswer.indexOf(selectedAns[i]) != -1) {
        // correct answers
        _count++;
        checkForComb = true;
      } else {
        _checkForWrong = false; // incorrect answers
      }
    }
    if (p.tickNcross) {
      showTickNCross(selectedAns);
    }
    // show Feebackes =====
    if (_count == p.correctAnswer.length && _checkForWrong) {
      //console.log("show right Feedback");
      //======= individual feedback for each option =====
      if (p.individualFb) {
        gotoAndPlayFeedBack(
          selectedAns[0] + '_Fb',
          selectedAns[0] + '_Fb',
          'correct'
        );
      } else {
        gotoAndPlayFeedBack(
          'correct',
          'correct' + correctFeedbackCounter,
          'correct'
        );
      }
    } else {
      //console.log("show wrong Feedback");
      var fbBool = true;
      //======= individual feedback for each option =====
      if (p.individualFb) {
        fbBool = false;
        gotoAndPlayFeedBack(
          selectedAns[0] + '_Fb',
          selectedAns[0] + '_Fb',
          'incorrect'
        );
      }
      if (p.combinationFb) {
        fbBool = false;
      }

      if (!_checkForWrong && checkForComb && p.combinationFb) {
        //console.log("insdeededed checkForComb")
        combinationFeedbackCounter++;
        if (combinationFeedbackCounter >= p.numberOfCombinationFeedback) {
          combinationFeedbackCounter = p.numberOfCombinationFeedback;
        }
        gotoAndPlayFeedBack(
          'combination',
          'combination' + combinationFeedbackCounter,
          'incorrect'
        );
      } else if (!_checkForWrong && !checkForComb && p.combinationFb) {
        gotoAndPlayFeedBack(
          'incorrect',
          'incorrect' + incorrectFeedbackCounter,
          'incorrect'
        );
      }
      if (fbBool) {
        gotoAndPlayFeedBack(
          'incorrect',
          'incorrect' + incorrectFeedbackCounter,
          'incorrect'
        );
      }
    }
  }
  // ===== show tick n cross of selected answers =====
  function showTickNCross(_arr) {
    for (var i = 0; i < _arr.length; i++) {
      var _elem = p.domObj[_arr[i] + '_tick'];
      if (_elem) {
        $(_elem).show();
      }
    }
  }
  //============ play feedback =============
  function gotoAndPlayFeedBack(_status, _id, _retStatus) {
    console.log(_status, _id, '  : : _status : _id', _retStatus, '   :: _stat');
    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }
    var _audioPath;
    if (p.feedbackParam[_id]) {
      _audioPath = p._shellModel.getMediaPath() + p.feedbackParam[_id];
    }
    disableAllOptions();
    disableSubmit();
    if (p.disableSolutionOnFb) {
      disableSolution();
    }
    unbindSolutionEvent();
    if (p.feedBack) {
      p.feedBack({
        status: _status,
        popup: _id,
        audioPath: _audioPath,
        feedbackParam: p.feedbackParam,
        videoFb: p.feedbackParam['video_' + _id],
        _shellModel: p._shellModel,
        jsflObj: p.feedbackParam['jsfl_' + _id],
        curStatus: _id,
        curSelected: attemptedAnswersMc,
        retStatus: _retStatus
      });
    }
  }
  //--------- hide all tick/cross --------
  function hideAllTicks() {
    if (p.tickNcross) {
      for (var i = 0; i < p.optionGroupArr.length; i++) {
        for (var j = 0; j < p.optionGroupArr[i].length; j++) {
          var _elem = p.domObj[p.optionGroupArr[i][j] + '_tick'];
          if (_elem) {
            $(_elem).hide();
          }
        }
      }
    }
  }
  //====== hide only Incorrect cross =====
  function hideIncorrectTicks() {
    if (p.tickNcross) {
      for (var i = 0; i < p.optionGroupArr.length; i++) {
        for (var j = 0; j < p.optionGroupArr[i].length; j++) {
          var _elem = p.domObj[p.optionGroupArr[i][j]];
          if (_elem) {
            if (
              _elem.getAttribute('status') == 'true' &&
              p.correctAnswer.indexOf(p.optionGroupArr[i][j]) != -1
            ) {
              //console.log("right answer");
            } else {
              $(p.domObj[p.optionGroupArr[i][j] + '_tick']).hide();
            }
          }
        }
      }
    }
  }

  function show_AfterSolution(_bool) {
    // if true showOnlyCorrectAfterSolution(reset incorrect) else showCorrectAfterSolution
    for (var i = 0; i < p.__radioGroupArr.length; i++) {
      for (var j = 0; j < p.__radioGroupArr[i].length; j++) {
        var _mc = p.domObj[p.__radioGroupArr[i][j]];
        if (_mc) {
          if (p.__correctAnswers.indexOf(p.__radioGroupArr[i][j]) != -1) {
            _mc.setAttribute('_status', 'true');
            if (p.detectTransparency) {
              gotoAndStopRadioCanas(
                p.domObj[p.__radioGroupArr[i][j] + '_option'],
                'selected'
              );
            } else {
              gotoAndStopRadio(
                p.domObj[p.__radioGroupArr[i][j] + '_option'],
                'selected'
              );
            }
          } else {
            if (_bool) {
              _mc.setAttribute('_status', 'false');
              if (p.detectTransparency) {
                gotoAndStopRadioCanas(
                  p.domObj[p.__radioGroupArr[i][j] + '_option'],
                  'disable'
                );
              } else {
                gotoAndStopRadio(
                  p.domObj[p.__radioGroupArr[i][j] + '_option'],
                  'disable'
                );
              }
            }
          }
        }
      }
    }
  }
  function setOptionsDisable() {
    for (var i = 0; i < p.__radioGroupArr.length; i++) {
      for (var j = 0; j < p.__radioGroupArr[i].length; j++) {
        var _mc = p.domObj[p.__radioGroupArr[i][j]];
        if (_mc) {
          if (_mc.getAttribute('_status') == 'false') {
            if (p.detectTransparency) {
              gotoAndStopRadioCanas(p.domObj[_mc.id + '_option'], 'disable');
            } else {
              gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'disable');
            }
          }
        }
      }
    }
  }
  // --- disable unbind events of all options --------
  function disableAllOptions() {
    unbindEvents();
    // if want to set options disable on when playing feedback do code here
  }
  //===== remove all dom elements events and elments =====
  this.removeAll = function() {
    /* disableAllOptions();
		disableSubmit();
		disableShowSolution();
		EventBus.removeEventListener('activateLoadedMedia',bindEvents, this);
		for(var i in p.domObj)
		{
			$(p.domObj[i]).remove();
		}
		for(var i in activityImageObj)
		{
			activityImageObj[i].src = "";
			activityImageObj[i] = "";
		}
			activityImageObj = {};
			p = {};
			p = null;
			delete p; */
  };

  //   this function listenes feedBack completed from feedback class
  this.onFeedBackCompleted = function(_fb) {
    if (counter >= p.__maxNumberOfTries && p.__maxNumberOfTries != 0) {
      activityOver(_fb.status, _fb.curStatus, _fb.retStatus);
    } else {
      if (_fb.retStatus == 'incorrect') {
        enableAllOptions();
        enableSolution();
        if (p.resetOnlyIncorrectTnCAfterIncorrectFB) {
          hideIncorrectTicks();
        } else if (p.resetAllTnCAfterIncorrectFeedBack) {
          hideAllTicks();
        }

        if (p.resetOnlyincorrectOptionsAfterIncorrectFeedBack) {
          resetIncorrectOptions();
        } else if (p.resetAllOptionsAfterIncorrectFeedBack) {
          resetAllOptions();
        }

        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      } else {
        activityOver(_fb.status, _fb.curStatus, _fb.retStatus);
      }
    }
  };
  // ----- add event to all options ------
  function enableAllOptions() {
    bindEvents();
  }
  // ------- activity over -----------
  function activityOver(_status, _curStatus, _retStatus) {
    disableSubmit();
    disableSolution();
    //setOptionsDisable();
    if (p.navEndJson) {
      p._navController.updateButtons(p.navEndJson);
    }
    // === dispatch event for actOver ======
    if (p['activityOver']) {
      p['activityOver']({
        status: 'ActivityOver',
        fbStatus: _status,
        curStatus: _curStatus,
        retStatus: _retStatus
      });
    }
  }
};
