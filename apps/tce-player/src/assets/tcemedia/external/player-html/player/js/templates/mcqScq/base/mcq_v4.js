var mcq_v4 = function() {
  var p = {
    vRef: 'OFF', // [Inspectable(name="08 Visual Reference",enumeration="OFF, ON - Tick/Cross",defaultValue="OFF")]
    submitMc: '', // [Inspectable(name="05 SubmitBtn MC Instance",type="String")]
    solutionMc: '', // [Inspectable(name="06 SolutionBtn MC Instance",type="String")]
    questionType: 'SingleChoice', //[Inspectable(name="01 Type of question",enumeration="SingleChoice,MultipleChoice",defaultValue="SingleChoice")]

    radioGroupArr: [], // [Inspectable(name="03 Question MC Instance",type="Array")]
    correctAnswers: [], // [Inspectable(name="04 Answers MC Instance",type="Array")]
    maxNumberOfTries: 0, //[Inspectable(name="02 Maximum Attempt",type="int",defaultValue=0)]
    fbSelFlag: false, //[Inspectable(name = "09 Feedback as per selection", type = "Boolean")]
    showIndividualAnimation: false, //[Inspectable(name="12 Show Individual Status",type="Boolean")]
    numberOfCorrectFeedbacks: 1, //	[Inspectable(name="13 Number Of Correct Feedbacks",type="int",defaultValue=1)]
    numberOfIncorrectFeedbacks: 1, // [Inspectable(name="14 Number Of Incorrect Feedbacks",type="int",defaultValue=2)]
    resetIncorrectItemsGroup: true, //[Inspectable(name="15 Reset Incorrect(Group)",type="Boolean",defaultValue=true)]
    questNo: 0, // [Inspectable(name="17 Question Number",type="int",defaultValue=0)]
    maintainScore: false, //[Inspectable(name = "16 Maintain Score", type = "Boolean")]

    //custom parameters added
    domObj: new Object(),
    enableSubmitCount: 2,
    showAllCorrectTick: false, // if want to show correct tick after max number of tries
    showCorrectAnsSelected: false, // if want to show correct options selected after max number of tries
    _starDiv: '', //for stars in activity
    btncssObj: {
      normal: 'mcq_normal',
      over: 'mcq_over',
      selected: 'mcq_selected',
      disable: 'mcq_disable'
    },
    tickmarginLeft: 0,
    tickmarginTop: 0,
    radioLeftPadding: 0,
    radioTopPadding: 1,
    maxSelection: 0, // this is for mcms when restrict max selection
    detectTransparency: false, // detect transparency for images as a option
    showSolutionTick: true, // if want to show correct tick after show solution
    optionDisableOnFb: false,
    showOnlyCorrectAfterSolution: true, // Set only correct options selected after show solution
    showCorrectAfterSolution: false, // show correct option selected after show solution with current wrong selected
    onValidationCnt: false, // check for user once givent the answer
    //optionImgObj   // same images for option
    // submitImgObj  // images for submit button
    //multipleOptionImg:{},  // images object as per option
    //enableSolutionButton:false,
    //resetOptionsAfterIncorrectFeedBack:false,
    //resetAllOptionsAfterIncorrectFeedBack:false,
    //resetTickandCrossAfterIncorrectFeedBack:false,   // reset only incorrect answers
    //resetAllTickandCrossAfterIncorrectFeedBack:false, // reset all tick and cross

    // tickAndCrossPosition:{x:10,y:10},  if needed custom position of tick and cross
    //optionCustomcss:{},  // if needed custom css for option e.g."optionCustomcss":{"transform":"rotate(135deg)"},
    //TickandCrossCustomCss   // if needed custom css for option "TickandCrossCustomCss":{"transform":"rotate(-135deg)"},
    //customtickAndCrossPosition   // individual tick and cross position
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
    //===== parameters for individual FB and combination feedback =====
    individualFb: false,
    combinationFb: false,
    numberOfCombinationFeedback: 0
  };

  var counter = 0;
  var correctFeedbackCounter = 0;
  var incorrectFeedbackCounter = 0;
  // counter added for combinationFeedback
  var combinationFeedbackCounter = 0;
  //
  var ansValidationCounter = 0;
  var fbMC;
  var sbMC;
  var solMC;
  var vRefBool = false;
  var optionSetArr = [];
  var submitBool = false;
  var showSolBool = false;
  var attemptedAnswers = [];
  //var currentOption:MovieClip;
  var currentOption;
  var multiSubmitBool = false;
  var attemptedAnswersMc = [];
  var multipleChoiceBool = false;
  var showSolActivateBool = false;
  var attemptedMultipleAnswersMc = [];
  var addstar_mc;
  //var addStar:CustomEvent;
  var activityImageObj = new Object(); // storing all images
  var iFrameDoc;
  var serviceObj;
  var commonAssetPath;
  var shellController;
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    //console.log("inside init")
    serviceObj = p._shellModel.getServiceObj();
    shellController = p._navController.getShellController();
    commonAssetPath = serviceObj.getCommonAssetPath();
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    makeImgObject();
  };
  //===== bind event to options =======
  function bindEvents() {
    if (p.detectTransparency) {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        for (var j = 0; j < p.radioGroupArr[i].length; j++) {
          var _mc = p.domObj[p.radioGroupArr[i][j]];
          if (_mc) {
            addCanvasListeners(_mc);
          }
        }
      }
    } else {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        for (var j = 0; j < p.radioGroupArr[i].length; j++) {
          var _mc = p.domObj[p.radioGroupArr[i][j]];
          if (_mc) {
            addListeners(_mc);
          }
        }
      }
    }
    if (p.navStartJson) {
      // navigation button json
      p._navController.updateButtons(p.navStartJson);
    }
  }
  //==== add event to canvas in case of detectTransparency ======
  function addCanvasListeners(_elem) {
    if (BrowserDetectAdv.anyDevice()) {
      $(_elem)
        .off('touchstart', canvasEvents)
        .on('touchstart', canvasEvents);
    } else {
      $(_elem)
        .off('mousemove mousedown mouseout', canvasEvents)
        .on('mousemove mousedown mouseout', canvasEvents);
    }
  }
  // ========  return option id in case of detectTransparency =====
  function getCurrentCanvasId(_arr, _pageX, _pageY) {
    var _id;
    for (var i = 0; i < _arr.length; i++) {
      var mc = p.domObj[_arr[i] + '_option'];
      if (mc) {
        var ctx = mc.getContext('2d');
        var _x = Math.round(_pageX - $(mc).offset().left);
        var _y = Math.round(_pageY - $(mc).offset().top);
        var imgData = ctx.getImageData(_x, _y, 1, 1).data;
        if (CheckColor(_x, _y, ctx)) {
          _id = _arr[i];
          break;
        }
      }
    }
    return _id;
  }

  //===== check for color detection on mouseevents =========
  function CheckColor(x, y, ctx) {
    var cell = ctx.getImageData(x, y, 1, 1).data;
    var hex = '#' + ('000000' + rgbToHex(cell[0], cell[1], cell[2])).slice(-6);
    if (hex != '#000000') {
      return true;
    } else {
      if (hex == '#000000' && cell[3] > 2) {
        return true;
      } else {
        return false;
      }
    }
  }
  // ==== convert rgb to hex
  function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  //===== set state of all canvas =====
  function resetCanvas(_arr, _notReset) {
    for (var i = 0; i < _arr.length; i++) {
      if (_notReset) {
        if (_arr[i] != _notReset && p.domObj[_arr[i]]) {
          gotoAndStopRadioCanas(p.domObj[_arr[i] + '_option'], 'normal');
          p.domObj[_arr[i]].setAttribute('_status', 'false');
        }
      } else {
        if (
          p.domObj[_arr[i]] &&
          p.domObj[_arr[i]].getAttribute('_status') == 'false'
        ) {
          gotoAndStopRadioCanas(p.domObj[_arr[i] + '_option'], 'normal');
        }
        if (p.resetAllOptionsAfterIncorrectFeedBack) {
          if (
            p.domObj[_arr[i]] &&
            p.domObj[_arr[i]].getAttribute('_status') == 'true'
          ) {
            gotoAndStopRadioCanas(p.domObj[_arr[i] + '_option'], 'normal');
            p.domObj[_arr[i]].setAttribute('_status', 'false');
          }
        }
      }
    }
  }

  var currentCanvasOption = [];

  // ==== canvas event lisener in case of detectTransparency ======
  function canvasEvents(e) {
    if (e.type == 'touchstart') {
      e.pageX = e.originalEvent.changedTouches[0].pageX;
      e.pageY = e.originalEvent.changedTouches[0].pageY;
    }
    // check for maxSelection in case of multiple choice question
    if (p.maxSelection != 0) {
      var grp = p.domObj[e.currentTarget.id].getAttribute('_group');
      if (grp) {
        if (
          attemptedAnswersMc[grp] &&
          attemptedAnswersMc[grp].length >= p.maxSelection
        ) {
          if (p.domObj[e.currentTarget.id].getAttribute('_status') == 'false') {
            $(p.domObj[e.currentTarget.id]).removeClass('addPointer');
            return;
          }
        }
      }
    }
    var _target = p.domObj[e.currentTarget.id + '_option'];

    if (_target) {
      var _currentGroup = e.currentTarget.getAttribute('_group');
      var _ctx = _target.getContext('2d');
      var imgData = _ctx.getImageData(
        Math.round(e.pageX - $(_target).offset().left),
        Math.round(e.pageY - $(_target).offset().top),
        1,
        1
      ).data;
      if (e.type == 'mousemove') {
        if (!multipleChoice()) {
          resetCanvas(
            p.radioGroupArr[Number(_currentGroup)],
            currentCanvasOption[Number(_currentGroup)]
          );
          var _temp = getCurrentCanvasId(
            p.radioGroupArr[Number(_currentGroup)],
            e.pageX,
            e.pageY
          );
          if (_temp) {
            if (p.domObj[_temp].getAttribute('_status') == 'false') {
              $(p.domObj[e.currentTarget.id]).addClass('addPointer');
              gotoAndStopRadioCanas(p.domObj[_temp + '_option'], 'over');
            }
          } else {
            $(p.domObj[e.currentTarget.id]).removeClass('addPointer');
          }
        } else {
          resetCanvas(p.radioGroupArr[Number(_currentGroup)]);
          var _temp = getCurrentCanvasId(
            p.radioGroupArr[Number(_currentGroup)],
            e.pageX,
            e.pageY
          );
          if (_temp) {
            $(p.domObj[e.currentTarget.id]).addClass('addPointer');
            if (
              p.domObj[e.currentTarget.id].getAttribute('_status') == 'false'
            ) {
              gotoAndStopRadioCanas(p.domObj[_temp + '_option'], 'over');
            }
          } else {
            $(p.domObj[e.currentTarget.id]).removeClass('addPointer');
          }
        }
      }
      if (e.type == 'mousedown' || e.type == 'touchstart') {
        var optionSelected = false;
        if (!multipleChoice()) {
          var _temp = getCurrentCanvasId(
            p.radioGroupArr[Number(_currentGroup)],
            e.pageX,
            e.pageY
          );
          if (_temp) {
            currentCanvasOption[Number(_currentGroup)] = _temp;
            gotoAndStopRadioCanas(p.domObj[_temp + '_option'], 'selected');
            optionSelected = true;
            p.domObj[_temp].setAttribute('_status', 'true');
          }
          if (optionSelected) {
            resetCanvas(
              p.radioGroupArr[Number(_currentGroup)],
              currentCanvasOption[Number(_currentGroup)]
            );
          }
        } else {
          var _temp = getCurrentCanvasId(
            p.radioGroupArr[Number(_currentGroup)],
            e.pageX,
            e.pageY
          );
          if (_temp) {
            if (p.domObj[_temp].getAttribute('_status') == 'false') {
              gotoAndStopRadioCanas(p.domObj[_temp + '_option'], 'selected');
              p.domObj[_temp].setAttribute('_status', 'true');
            } else {
              gotoAndStopRadioCanas(p.domObj[_temp + '_option'], 'normal');
              p.domObj[_temp].setAttribute('_status', 'false');
            }
            optionSelected = true;
          }
          if (optionSelected) {
            resetCanvas(p.radioGroupArr[Number(_currentGroup)]);
          }
        }
        if (optionSelected) {
          getAttemptedAns();
          if (p.submitMc != '') {
            addSubmitListener();
          }
          if (p.submitMc == '' && !multipleChoice()) {
            // if submit button not present
            checkForValidation();
          }
        }
      }
      if (e.type == 'mouseout') {
        if (!multipleChoice()) {
          resetCanvas(
            p.radioGroupArr[Number(_currentGroup)],
            currentCanvasOption[Number(_currentGroup)]
          );
        } else {
          resetCanvas(p.radioGroupArr[Number(_currentGroup)]);
        }
      }
    }
  }
  // ======== start point of activiry set all variables,button states initially ======
  function startActivity() {
    counter = 0;
    correctFeedbackCounter = 0;
    incorrectFeedbackCounter = 0;
    ansValidationCounter = 0;
    submitBool = true;
    showSolBool = true;
    multiSubmitBool = true;
    showSolActivateBool = false;
    assignListeners();
    if (p.submitMc != '') {
      sbMC = p.domObj[p.submitMc];
      gotoAndStopSubmit(sbMC, 'disable');
    }
    if (p.solutionMc != '') {
      solMC = p.domObj[p.solutionMc];
      if (p.enableSolutionButton) {
        // if required solution button enable initially
        enableShowSolution();
      } else {
        gotoAndStopSolution(solMC, 'disable');
      }
    }
    bindEvents();
  }

  //==== this function craete option and tick/cross div inside hitArea
  function assignListeners() {
    optionSetArr = new Array();
    attemptedAnswers = new Array();
    attemptedAnswersMc = new Array();
    var tempMc = new Object();
    tempMc._group = -1;
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      var tempStr = String(p.radioGroupArr[i]);
      var tempArr = tempStr.split(',');
      optionSetArr.push(tempArr);
      for (var j = 0; j < optionSetArr[i].length; j++) {
        var _mc = p.domObj[optionSetArr[i][j]];
        if (_mc) {
          $(_mc).css('background-color', 'rgba(0,0,0,0)');
          _mc.setAttribute('_status', 'false');
          _mc.setAttribute('_group', i);
          createOptionDiv(_mc);
          if (p.validateMc) {
            createTickAndCrossDiv(_mc);
            _mc.setAttribute('_validatemc', 'true');
          }
        }
      }
    }
    // ==  for starActivity
    if (p.maintainScore) {
      //addstar_mc = new StarController(p);
      //addstar_mc.init(p.domObj[p._starDiv])
      //addstar_mc.init(p)
    }
  }
  //==== this function create div inside hitArea given in xml and set images/radio buttons inside that hitArea
  function createOptionDiv(_elem) {
    var _optionDiv;
    if (p.detectTransparency) {
      _optionDiv = iFrameDoc.createElement('canvas');
    } else {
      _optionDiv = iFrameDoc.createElement('div');
    }
    $(_elem).prepend(_optionDiv);
    var _left = 0,
      _top = 0;
    if (p.optionPosition) {
      // if given individual left top to any option
      if (p.optionPosition[_elem.id]) {
        if (p.optionPosition[_elem.id].x) _left = p.optionPosition[_elem.id].x;
        if (p.optionPosition[_elem.id].y) _top = p.optionPosition[_elem.id].y;
      }
    }
    if (p.optionImgType) {
      // set css for radioButtons (type1,type2,type3,type4)
      $(_optionDiv)
        .css({
          position: 'absolute',
          left: 0 + p.radioLeftPadding + Number(_left) + 'px',
          top: 0 + p.radioTopPadding + Number(_top) + 'px',
          'pointer-events': 'none',
          width: '26px',
          height: '26px'
        })
        .attr('id', _elem.id + '_option')
        .attr('type', p.optionImgType)
        .addClass('RadioBtn_' + p.optionImgType);
    }

    if (p.customRadioCSS) {
      //  if want to specify custom css for radio buttons
      // if want to specify custom width height for option div
      var _wd = 26,
        _ht = 26;
      if (p.optionWidth) {
        _wd = p.optionWidth;
      }
      if (p.optionHeight) {
        _ht = p.optionHeight;
      }
      if (p.OptionWdHt) {
        if (p.ptionWdHt[_elem.id]) {
          if (p.OptionWdHt[_elem.id].width) _wd = p.OptionWdHt[_elem.id].width;
          if (p.OptionWdHt[_elem.id].height)
            _ht = p.OptionWdHt[_elem.id].height;
        }
      }
      $(_optionDiv)
        .css({
          position: 'absolute',
          left: 0 + p.radioLeftPadding + Number(_left) + 'px',
          top: 0 + p.radioTopPadding + Number(_top) + 'px',
          'pointer-events': 'none',
          width: _wd + 'px',
          height: _ht + 'px'
        })
        .attr('id', _elem.id + '_option')
        .attr('type', 'customType')
        .addClass(p.customRadioCSS['normal']);
    }
    if (p.optionImgObj) {
      var _width, _height;
      for (var i in p.optionImgObj) {
        // find height and width of option image
        if (p.optionImgObj[i]) {
          _width = activityImageObj['option_' + i].width;
          _height = activityImageObj['option_' + i].height;
          break;
        }
      }
      if (p.optionCustomWdHt) {
        if (p.optionCustomWdHt[_elem.id]) {
          if (p.optionCustomWdHt[_elem.id].width) {
            _width = p.optionCustomWdHt[_elem.id].width;
          }
          if (p.optionCustomWdHt[_elem.id].height) {
            _height = p.optionCustomWdHt[_elem.id].height;
          }
        }
      }
      $(_optionDiv)
        .css({
          // set css for actual radio button div or image div
          position: 'absolute',
          left: 0 + p.radioLeftPadding + Number(_left) + 'px',
          top: 0 + p.radioTopPadding + Number(_top) + 'px',
          'pointer-events': 'none',
          width: _width + 'px',
          height: _height + 'px'
        })
        .attr('id', _elem.id + '_option');

      if (p.detectTransparency) {
        // set width and height to canvas in case of transparency
        _optionDiv.width = _width;
        _optionDiv.height = _height;
      }

      if (activityImageObj['option_normal'] && !p.detectTransparency) {
        // set normal image to option if present
        setBackground(_optionDiv, activityImageObj['option_normal'].src);
      }
      if (p.detectTransparency && activityImageObj['option_normal']) {
        // draw normal image to option if present
        drawImgOncanvas(_optionDiv, activityImageObj['option_normal']);
      }
    }
    if (p.multipleOptionImg) {
      var _width = 0,
        _height = 0;
      if (p.multipleOptionImg[_elem.id]) {
        // find height with of image of option image
        for (var i in p.multipleOptionImg[_elem.id]) {
          _width = activityImageObj[_elem.id + '_option_' + i].width;
          _height = activityImageObj[_elem.id + '_option_' + i].height;
          break;
        }
      }

      $(_optionDiv)
        .css({
          position: 'absolute',
          left: 0 + p.radioLeftPadding + Number(_left) + 'px',
          top: 0 + p.radioTopPadding + Number(_top) + 'px',
          'pointer-events': 'none',
          width: _width + 'px',
          height: _height + 'px'
        })
        .attr('id', _elem.id + '_option');
      if (p.detectTransparency) {
        _optionDiv.width = _width;
        _optionDiv.height = _height;
      }
      if (
        activityImageObj[_elem.id + '_option_normal'] &&
        !p.detectTransparency
      ) {
        setBackground(
          _optionDiv,
          activityImageObj[_elem.id + '_option_normal'].src
        );
      }
      if (
        p.detectTransparency &&
        activityImageObj[_elem.id + '_option_normal']
      ) {
        drawImgOncanvas(
          _optionDiv,
          activityImageObj[_elem.id + '_option_normal']
        );
      }
    }
    if (p.optionCustomcss) {
      // set custom css to inner option div
      for (var i in p.optionCustomcss) {
        $(_optionDiv).css(i, p.optionCustomcss[i]);
      }
    }
    p.domObj[_elem.id + '_option'] = _optionDiv;
  }

  //================ Add event lisener ==========
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };

  //===set option buttons image state accorndiglly state pass to this function _state param and draw it on canvas in case of transparency ===
  function gotoAndStopRadioCanas(_elem, _state) {
    if (_state != '') {
      if (p.optionImgObj) {
        // if same images for all options and detect transparency
        switch (_state) {
          case 'normal':
            if (activityImageObj['option_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj['option_' + _state]);
            }
            break;
          case 'over':
            if (activityImageObj['option_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj['option_' + _state]);
            }
            break;
          case 'selected':
            if (activityImageObj['option_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj['option_' + _state]);
            }
            break;
          case 'disable':
            if (activityImageObj['option_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj['option_' + _state]);
            }
            break;
        }
      }

      if (p.multipleOptionImg) {
        // if different images for each options and detect transparency
        switch (_state) {
          case 'normal':
            if (activityImageObj[_elem.id + '_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj[_elem.id + '_' + _state]);
            }
            break;
          case 'over':
            if (activityImageObj[_elem.id + '_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj[_elem.id + '_' + _state]);
            }
            break;
          case 'selected':
            if (activityImageObj[_elem.id + '_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj[_elem.id + '_' + _state]);
            }
            break;
          case 'disable':
            if (activityImageObj[_elem.id + '_' + _state]) {
              drawImgOncanvas(_elem, activityImageObj[_elem.id + '_' + _state]);
            }
            break;
        }
      }
    }
  }
  //===== draw images on canvas in case of detect transparency =====
  function drawImgOncanvas(_elem, _img) {
    if (_elem) {
      var _ctx = _elem.getContext('2d');
      _elem.width = _elem.width;
      _ctx.drawImage(_img, 0, 0, _img.width, _img.height);
    }
  }
  //===== set the option state accorndiglly state pass to this function _state param (no transparency)====
  function gotoAndStopRadio(_elem, _state) {
    if (_state != '') {
      if (p.optionImgType) {
        // add/remove classes accroding to state for type1,type2,type3,type4
        $(_elem).removeClass('RadioBtnSelected_' + p.optionImgType);
        $(_elem).removeClass('RadioBtnOver_' + p.optionImgType);
        $(_elem).removeClass('RadioBtnDisable_' + p.optionImgType);
        switch (_state) {
          case 'normal':
            break;
          case 'over':
            $(_elem).addClass('RadioBtnOver_' + p.optionImgType);
            break;
          case 'selected':
            $(_elem).addClass('RadioBtnSelected_' + p.optionImgType);
            break;
          case 'disable':
            $(_elem).addClass('RadioBtnDisable_' + p.optionImgType);
            break;
        }
      }

      if (p.customRadioCSS) {
        // if custom radio css classes are given
        for (var i in p.customRadioCSS) {
          $(_elem).removeClass(p.customRadioCSS[i]);
        }
        $(_elem).addClass(p.customRadioCSS[_state]);
      }

      if (p.optionImgObj) {
        // set images accorndig to state
        switch (_state) {
          case 'normal':
            if (activityImageObj['option_' + _state]) {
              setBackground(_elem, activityImageObj['option_' + _state].src);
            } else {
              setBackground(_elem, '');
            }
            break;
          case 'over':
            if (activityImageObj['option_' + _state]) {
              setBackground(_elem, activityImageObj['option_' + _state].src);
            }
            break;
          case 'selected':
            if (activityImageObj['option_' + _state]) {
              setBackground(_elem, activityImageObj['option_' + _state].src);
            }
            break;
          case 'disable':
            if (activityImageObj['option_' + _state]) {
              setBackground(_elem, activityImageObj['option_' + _state].src);
            }
            break;
        }
      }

      if (p.multipleOptionImg) {
        // set images accorndig to state of option
        switch (_state) {
          case 'normal':
            if (activityImageObj[_elem.id + '_' + _state]) {
              setBackground(
                _elem,
                activityImageObj[_elem.id + '_' + _state].src
              );
            } else {
              setBackground(_elem, '');
            }
            break;
          case 'over':
            if (activityImageObj[_elem.id + '_' + _state]) {
              setBackground(
                _elem,
                activityImageObj[_elem.id + '_' + _state].src
              );
            }
            break;
          case 'selected':
            if (activityImageObj[_elem.id + '_' + _state]) {
              setBackground(
                _elem,
                activityImageObj[_elem.id + '_' + _state].src
              );
            }
            break;
          case 'disable':
            if (activityImageObj[_elem.id + '_' + _state]) {
              setBackground(
                _elem,
                activityImageObj[_elem.id + '_' + _state].src
              );
            }
            break;
        }
      }
      if (p.optionTextCss) {
        // specify custom color for text on button
        var _tempElem = p.domObj[_elem.id.replace('_option', '')];
        $($(_tempElem).find('span')[0]).css('color', '');
        for (var i in p.optionTextCss) {
          $($(_tempElem).find('span')[0]).removeClass(p.optionTextCss[i]);
        }
        $($(_tempElem).find('span')[0]).addClass(p.optionTextCss[_state]);
      }
    }
  }

  //====== set solution button state======
  function gotoAndStopSolution(_elem, _state) {
    if (p.solutionMc) {
      if (_state != '') {
        //setBackground(_elem , p['solutionImg_'+_state].src);
        if (activityImageObj['solutionBtn_' + _state]) {
          // this will set background-image of solution button
          setBackground(_elem, activityImageObj['solutionBtn_' + _state].src);
        }
        //====this will set css of solution button if given ======
        if (p.solutionCssObj) {
          if (p.solutionCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.solutionCssObj[_state]);
          }
        }
        // ======== this is set color of solution button text==========
        $($(_elem).find('span')[0]).css('color', '');
        for (var i in p.btncssObj) {
          $($(_elem).find('span')[0]).removeClass(p.btncssObj[i]);
        }
        $($(_elem).find('span')[0]).addClass(p.btncssObj[_state]);
      }
    }
  }

  //====== set submit button state======
  function gotoAndStopSubmit(_elem, _state) {
    if (p.submitMc) {
      if (_state) {
        //setBackground(_elem , p['submitImg_'+_state]);
        if (activityImageObj['submitBtn_' + _state]) {
          // this will set background-image of submit button
          setBackground(_elem, activityImageObj['submitBtn_' + _state].src);
        }
        //====this will set css of submit button if given ======
        if (p.submitCssObj) {
          if (p.submitCssObj[_state]) {
            $(_elem).removeClass();
            $(_elem).addClass(p.submitCssObj[_state]);
          }
        }
        // ======== this is set color of submit button text==========
        $($(_elem).find('span')[0]).css('color', '');
        for (var i in p.btncssObj) {
          $($(_elem).find('span')[0]).removeClass(p.btncssObj[i]);
        }
        $($(_elem).find('span')[0]).addClass(p.btncssObj[_state]);
      }
    }
  }

  // ========= this function show/hide tick and cross ====
  function gotoAndStopTicknCross(_id, _symbol, _display) {
    var tempId = _id + '_tick';
    if (_display == 'hide') {
      $(p.domObj[tempId]).hide();
    } else {
      $(p.domObj[tempId]).show();
    }
  }
  //=== set background image to given element and image
  function setBackground(_elem, _url) {
    $(_elem).css({
      'background-image': 'url(' + _url + ')',
      'background-repeat': 'no-repeat',
      'background-size': '100% 100%'
    });
  }
  //===== craete tick and cross div inside heat Area and set images of it ===
  function createTickAndCrossDiv(_elem) {
    var _div = iFrameDoc.createElement('div');
    $(_elem).append(_div);
    var _img = 'cross';
    if (p.correctAnswers.indexOf(_elem.id) != -1) {
      _img = 'tick';
    }
    $(_div)
      .css({
        position: 'absolute',
        width: activityImageObj[_img].width + 'px',
        height: activityImageObj[_img].height + 'px',
        'background-size': '100% 100%',
        'background-image': 'url(' + activityImageObj[_img].src + ')',
        'background-repeat': 'no-repeat',
        display: 'none',
        'pointer-events': 'none'
      })
      .attr('id', _elem.id + '_tick');
    //==== if want to specify z-index to tick and Cross
    if (p.tickAndCrossIndex) {
      $(_div).css('z-index', p.tickAndCrossIndex);
    }

    var _left = 0,
      _top = 0;
    if (p.customtickAndCrossPosition) {
      // individual x,y to options
      if (p.customtickAndCrossPosition[_elem.id]) {
        if (p.customtickAndCrossPosition[_elem.id].x) {
          _left = p.customtickAndCrossPosition[_elem.id].x;
        }
        if (p.customtickAndCrossPosition[_elem.id].y) {
          _top = p.customtickAndCrossPosition[_elem.id].y;
        }
      }
    }
    if (p.tickAndCrossPosition) {
      // if want to specify position of all tick and cross accroding to option
      $(_div).css({
        left: _left + p.tickAndCrossPosition['x'] + 'px',
        top: _top + p.tickAndCrossPosition['y'] + 'px'
      });
    } else {
      // if not specify tickAndCrossPosition then automatically set at left side of option with top=0 , and left = optionLeft - imageWidth of tick/cross
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
    //  if specify custom css to TickandCross div
    if (p.TickandCrossCustomCss) {
      for (var i in p.TickandCrossCustomCss) {
        $(_div).css(i, p.TickandCrossCustomCss[i]);
      }
    }
    p.domObj[_elem.id + '_tick'] = _div;
  }
  //===== add event to option div ====
  function addListeners(_elem) {
    $(_elem).addClass('addPointer');
    if (BrowserDetectAdv.anyDevice()) {
      $(_elem)
        .off('touchstart', addEventListeners)
        .on('touchstart', addEventListeners);
    } else {
      $(_elem)
        .off('mouseover mouseout mousedown mouseup', addEventListeners)
        .on(
          'mouseover mouseout mousedown touchstart mouseup',
          addEventListeners
        );
    }
  }
  //======== // this function used for check whether text or radio button is clicked , returns id of radiobutton not in use ==
  function checkforRadio(_id) {
    var _str;
    if (_id != p.submitMc) {
      _str = _id;
      if (_id.indexOf('_option') != -1) {
        _str = _str.replace('_option', '');
      }
      if (_id.indexOf('_txt') != -1) {
        _str = _str.replace('_txt', '');
      }
    }
    return _str;
  }

  //===  mouse event liseners of option div  ============
  function addEventListeners(e) {
    var strLabel = '';
    var _target = p.domObj[e.currentTarget.id];
    if (_target == undefined) return;
    // check for maxSelection
    if (p.maxSelection != 0) {
      var grp = _target.getAttribute('_group');
      if (grp) {
        if (
          attemptedAnswersMc[grp] &&
          attemptedAnswersMc[grp].length >= p.maxSelection
        ) {
          if (_target.getAttribute('_status') == 'false') {
            $(p.domObj[_target.id]).removeClass('addPointer');
            return;
          }
        }
      }
    }

    if (_target.id != p.submitMc) {
      if (_target.getAttribute('_status') == 'true' && !multipleChoice()) {
        $(p.domObj[_target.id]).removeClass('addPointer');
        return;
      }
    }
    switch (e.type) {
      case 'mouseup':
        if (!multipleChoice()) {
          if (!(_target.getAttribute('_status') == 'true')) {
            strLabel = 'normal';
          } else {
            strLabel += 'selected';
          }
        } else {
          if (!(_target.getAttribute('_status') == 'true')) {
            strLabel += 'normal';
          }
          if (_target.getAttribute('_status') == 'undefined') {
            strLabel += 'selected';
          }
        }
        break;
      case 'mouseover':
        if (!multipleChoice()) {
          if (!(_target.getAttribute('_status') == 'true')) {
            strLabel += 'over';
          } else {
            strLabel += 'selected';
          }
        } else {
          if (_target.getAttribute('_status') == 'true') {
            $(p.domObj[_target.id]).addClass('addPointer');
            strLabel += 'selected';
          } else {
            $(p.domObj[_target.id]).addClass('addPointer');
            strLabel += 'over';
          }
        }
        break;
      case 'mousedown':
        strLabel += 'selected';
        break;
      case 'touchstart':
        strLabel += 'selected';
        break;
      case 'mouseout':
        if (!multipleChoice()) {
          if (!(_target.getAttribute('_status') == 'true')) {
            strLabel += 'normal';
          } else {
            strLabel += 'selected';
          }
        } else {
          if (_target.getAttribute('_status') == 'true') {
            strLabel += 'selected';
          } else {
            strLabel += 'normal';
          }
        }
        break;
    }
    // check for it is not submit button , it is option button
    if (_target.id != p.submitMc) {
      gotoAndStopRadio(p.domObj[_target.id + '_option'], strLabel);
    }
    // submit button event
    if (_target.id == p.submitMc) {
      gotoAndStopSubmit(_target, strLabel);
    }

    // check for click on option
    if (_target.id != p.submitMc) {
      if (e.type == 'mousedown' || e.type == 'touchstart') {
        currentOption = _target;
        var currentGroup = parseInt(currentOption.getAttribute('_group'));
        if (!multipleChoice()) {
          attemptedAnswers[currentGroup] = currentOption.id;
          // attemptedAnswers[currentGroup] = result;
          //attemptedAnswersMc[currentGroup] = currentOption;
          resetRadioOptions();
          _target.setAttribute('_status', 'true');
          gotoAndStopRadio(p.domObj[_target.id + '_option'], 'selected');
          $(_target).removeClass('addPointer');
        }
        if (multipleChoice()) {
          if (!(_target.getAttribute('_status') == 'true')) {
            if (typeof attemptedAnswers[currentGroup] == 'undefined')
              attemptedAnswers[currentGroup] = new Array();
            attemptedAnswers[currentGroup].push(currentOption.id);
            // attemptedAnswersMc.push(currentOption.id);
            //attemptedAnswersMc.push(currentOption.id);
            _target.setAttribute('_status', 'true');
            gotoAndStopRadio(p.domObj[_target.id + '_option'], 'selected');
          } else if (_target.getAttribute('_status') == 'true') {
            if (attemptedAnswers[currentGroup]) {
              attemptedAnswers[currentGroup].splice(
                attemptedAnswers[currentGroup].indexOf(currentOption.id),
                1
              );
            }
            //attemptedAnswersMc.splice(attemptedAnswersMc.indexOf(_target.id) , 1);
            _target.setAttribute('_status', 'false');
            gotoAndStopRadio(p.domObj[_target.id + '_option'], 'normal');
          }
        }
        getAttemptedAns();
        if (p.submitMc != '') {
          addSubmitListener();
        }
      }
    }
    // if submit button present
    if (_target.id == p.submitMc) {
      if (e.type == 'mousedown' || e.type == 'touchstart') {
        checkForValidation();
      }
    }
    // if submit button not present
    if (p.submitMc == '' && !multipleChoice()) {
      if (e.type == 'mousedown' || e.type == 'touchstart') {
        checkForValidation();
      }
    }
  }

  // this function return array of selected answers
  function getAttemptedAns() {
    attemptedAnswersMc = [];
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      attemptedAnswersMc[i] = new Array();
      for (var j = 0; j < p.radioGroupArr[i].length; j++) {
        var mc = p.domObj[p.radioGroupArr[i][j]];
        if (mc) {
          if (mc.getAttribute('_status') == 'true') {
            attemptedAnswersMc[i].push(mc.id);
          }
        }
      }
    }
    return attemptedAnswersMc;
  }
  // =====  this function increments feedback counters
  function checkForValidation() {
    //clearAllAnimation();
    //SoundMixer.stopAll();
    showSolActivateBool = true;
    addshowSolListener();
    correctFeedbackCounter++;
    incorrectFeedbackCounter++;
    ansValidationCounter++;
    // check for number of correct and incorrect feedback
    if (incorrectFeedbackCounter >= p.numberOfIncorrectFeedbacks) {
      incorrectFeedbackCounter = p.numberOfIncorrectFeedbacks;
    }
    if (correctFeedbackCounter >= p.numberOfCorrectFeedbacks) {
      correctFeedbackCounter = p.numberOfCorrectFeedbacks;
    }
    //  if limited attempts
    if (p.maxNumberOfTries != 0) {
      counter++;
      if (counter < p.maxNumberOfTries) {
        validateAnswer();
        //actionHandler();
      } else if (counter == p.maxNumberOfTries) {
        validateAnswer();
        //actionHandler();
        if (p.showAllCorrectTick) {
          showAllCorrectAnswerTick();
        }
        if (p.showCorrectAnsSelected) {
          setAllCorrectOptionsSelected();
        }
      }
    }
    //  ==== if unlimited attempts ===
    else {
      validateAnswer();
      //actionHandler();
    }
  }

  //====== set all option state to normal =====
  function resetRadioOptions() {
    if (currentOption) {
      var currentGroup = parseInt(currentOption.getAttribute('_group'));
      var tempStr = String(p.radioGroupArr[currentGroup]);
      var tempArr = tempStr.split(',');
      for (var i = 0; i < tempArr.length; i++) {
        var _mc = p.domObj[String(tempArr[i])];
        if (_mc) {
          gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'normal');
          _mc.setAttribute('_status', 'false');
          $(_mc).addClass('addPointer');
        }
      }
    }
  }

  //=== show all correct ticks front of corret options =====
  function showAllCorrectAnswerTick() {
    for (var i = 0; i < p.correctAnswers.length; i++) {
      var _mc = p.domObj[p.correctAnswers[i]];
      if (_mc) {
        gotoAndStopTicknCross(_mc.id, 'tick');
      }
    }
  }

  //  ===== set all correct answers selected =====
  function setAllCorrectOptionsSelected() {
    for (var i = 0; i < p.correctAnswers.length; i++) {
      var _mc = p.domObj[p.correctAnswers[i] + '_option'];
      if (_mc) {
        if (p.detectTransparency) {
          gotoAndStopRadioCanas(_mc, 'selected');
        } else {
          gotoAndStopRadio(_mc, 'selected');
        }
      }
    }
  }

  // ==== this function check for bind events to submit button =======
  function addSubmitListener() {
    if (!multipleChoice()) {
      var tempBool = false;
      var _count = 0;
      for (var i = 0; i < attemptedAnswersMc.length; i++) {
        if (attemptedAnswersMc[i]) {
          for (var j = 0; j < attemptedAnswersMc[i].length; j++) {
            if (attemptedAnswersMc[i][j]) _count++;
          }
        }
      }
      if (_count == p.correctAnswers.length) {
        tempBool = true;
      }
      if (tempBool) {
        // if (submitBool)
        // {
        // submitBool = false;
        // tempBool = false;
        enableSubmit();
        // showSolBool = true;
        if (showSolActivateBool) addshowSolListener();
        // }
      }
      if (!multiSubmitBool) {
        // for dissabling and enabling submit button on selection and deselection of options in multiple choice
        /* submitBool = true;				
				if (p.__submitMc != "")
				{
					disableSubmit();
				}	
				if(p.__solutionMc != null)
				{	
					$(p.domObj[p.__solutionMc]).off("mousedown", showSolution);	
					showSolBool = true;
				} */
      }
    }
    if (multipleChoice()) {
      // if(attemptedAnswersMc.length >= 2)
      var countArr = new Array();
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
        if (showSolActivateBool) {
          enableShowSolution();
        }
      }
    }
  }

  //== this function check validates the all selcted answers =====
  function validateAnswer() {
    hideAllTicks();
    //if(p.__showIndividualAnimation){
    attemptedMultipleAnswersMc = new Array();
    // this for loop push selcted answers inside attemptedMultipleAnswersMc array
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      for (var j = 0; j < p.radioGroupArr[i].length; j++) {
        var _mc = p.domObj[String(p.radioGroupArr[i][j])];
        if (_mc) {
          if (_mc.getAttribute('_status') == 'true') {
            attemptedMultipleAnswersMc.push(p.radioGroupArr[i][j]);
          }
        }
      }
    }
    // this for loop check for correct/incorrect answers ans show wrong/right answers
    for (var i = 0; i < attemptedMultipleAnswersMc.length; i++) {
      if (p.correctAnswers.indexOf(attemptedMultipleAnswersMc[i]) != -1) {
        var _mc = p.domObj[String(attemptedMultipleAnswersMc[i])];
        if (_mc.getAttribute('_validatemc') != null) {
          gotoAndStopTicknCross(_mc.id, 'tick');
        }
      } else {
        var _mc = p.domObj[String(attemptedMultipleAnswersMc[i])];
        if (_mc.getAttribute('_validatemc') != null) {
          gotoAndStopTicknCross(_mc.id, 'cross');
        }
      }
    }
    //}
    //=====================
    var _count = 0;
    var _checkForWrong = true;
    var checkForComb = false;
    var selectedAns = attemptedMultipleAnswersMc.slice(0);

    for (var i = 0; i < selectedAns.length; i++) {
      if (p.correctAnswers.indexOf(selectedAns[i]) != -1) {
        // correct answers
        _count++;
        checkForComb = true;
      } else {
        _checkForWrong = false; // incorrect answers
      }
    }
    /* if(p.tickNcross){
			showTickNCross(selectedAns);
		} */
    // show Feebackes =====
    if (_count == p.correctAnswers.length && _checkForWrong) {
      console.log('show right Feedback');
      //======= individual feedback for each option =====
      actionHandler('correct'); // adding star
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
      console.log('show wrong Feedback');
      actionHandler('inCorrect'); // adding star
      var fbBool = true;
      //======= individual feedback for each option =====
      if (p.individualFb) {
        fbBool = false;
        console.log('from Hreerrer');
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
        // for incorrect fb if all are incorrect  -- Sagar
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

  // ===  hide all tick marks ======
  function hideAllTicks() {
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      for (var j = 0; j < p.radioGroupArr[i].length; j++) {
        var _mc = p.domObj[String(p.radioGroupArr[i][j])];
        if (_mc) {
          gotoAndStopTicknCross(_mc.id, '', 'hide');
        }
      }
    }
  }

  // == this function set status of current question for maintaning score in star activity
  function actionHandler(_ans) {
    if (p.maintainScore) {
      if (addstar_mc != null) {
        //if((String(attemptedMultipleAnswersMc) == String(p.__correctAnswers)) || (String(attemptedAnswers) == String(p.__correctAnswers)))
        if (_ans == 'correct') {
          //addstar_mc.updateAnswer(p.questNo,1);
          p._shellModel.setPageData(p.questNo, { value: 1, glow: true });
          shellController.updateStar();
        } else {
          //addstar_mc.updateAnswer(p.questNo,0);
          p._shellModel.setPageData(p.questNo, { value: 0, glow: false });
          shellController.updateStar();
        }
      }
    }
  }

  // ==== remove events of given elements in case of normal mcq ====
  function removeListeners(_elem) {
    $(_elem)
      .off('mouseup mouseover mousedown mouseout touchstart', addEventListeners)
      .removeClass('addPointer');
    $(_elem).removeClass('addPointer');
  }
  // ==== remove events of given elements in case of detectTransparency ====
  function removeCanvasListeners(_elem) {
    $(_elem).off('mousemove mousedown mouseout touchstart', canvasEvents);
    $(_elem).removeClass('addPointer');
  }

  //===== enable show solution button =======
  function enableShowSolution() {
    if (p.solutionMc) {
      gotoAndStopSolution(solMC, 'normal');
      $(solMC).addClass('addPointer');
      $(solMC)
        .off('mousedown mouseover mouseout', showSolution)
        .on('mousedown mouseover mouseout', showSolution);
    }
  }
  //===== disable show solution button =======
  function disableShowSolution() {
    if (p.solutionMc) {
      gotoAndStopSolution(solMC, 'disable');
      $(solMC).removeClass('addPointer');
      $(solMC).off('mousedown mouseover mouseout', showSolution);
    }
  }

  // ====== add event to solution button =======
  function addshowSolListener() {
    if (p.solutionMc != '') enableShowSolution();
  }

  // ====== solution button event =======
  function showSolution(e) {
    if (e.type == 'mousedown') {
      disableAllOptions();
      //if(p.detectTransparency){
      //	for(var i = 0 ;i < p.__radioGroupArr.length ; i++)
      //		resetCanvas(p.__radioGroupArr[i]);
      //}else{
      //	resetRadioOptions();
      //}
      var tempcorrectAnswersArr = String(p.correctAnswers).split(',');
      for (var k = 0; k < tempcorrectAnswersArr.length; k++) {
        var tempMc = p.domObj[String(tempcorrectAnswersArr[k])];
        if (tempMc) {
          if (p.detectTransparency) {
            gotoAndStopRadioCanas(p.domObj[tempMc.id + '_option'], 'selected');
          } else {
            gotoAndStopRadio(p.domObj[tempMc.id + '_option'], 'selected');
          }
          if (p.showSolutionTick) {
            gotoAndStopTicknCross(tempMc.id, 'tick');
          }
          //tempMc.setAttribute('_status','true');
        }
      }

      if (p.solutionMc != null) {
        $(solMC).off('mousedown mouseover mouseout', showSolution);
        gotoAndStopSolution(solMC, 'disable');
      }

      if (p.submitMc != '') {
        disableSubmit();
      }

      //callFrmComp();
      // check for user at least once given ans of current question
      if (p.onValidationCnt) {
        if (ansValidationCounter > 0) allocateVisRef();
      } else {
        allocateVisRef();
      }
      setOptionsDisable();
      gotoAndPlayFeedBack('solution', 'solution', 'solution');
      if (p.showOnlyCorrectAfterSolution) {
        show_AfterSolution(true);
      }
      if (p.showCorrectAfterSolution) {
        show_AfterSolution(false);
      }
      //if(p.resetIncorrectItemsGroup)
      //resetIncorrectItems();
    }
    if (e.type == 'mouseover') {
      gotoAndStopSolution(solMC, 'over');
    }
    if (e.type == 'mouseout') {
      gotoAndStopSolution(solMC, 'normal');
    }
  }

  // == show correct ans after click on solution ======
  function show_AfterSolution(_bool) {
    // if true showOnlyCorrectAfterSolution(reset incorrect) else showCorrectAfterSolution
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      for (var j = 0; j < p.radioGroupArr[i].length; j++) {
        var _mc = p.domObj[p.radioGroupArr[i][j]];
        if (_mc) {
          if (p.correctAnswers.indexOf(p.radioGroupArr[i][j]) != -1) {
            _mc.setAttribute('_status', 'true');
            if (p.detectTransparency) {
              gotoAndStopRadioCanas(
                p.domObj[p.radioGroupArr[i][j] + '_option'],
                'selected'
              );
            } else {
              gotoAndStopRadio(
                p.domObj[p.radioGroupArr[i][j] + '_option'],
                'selected'
              );
            }
          } else {
            if (_bool) {
              _mc.setAttribute('_status', 'false');
              if (p.detectTransparency) {
                gotoAndStopRadioCanas(
                  p.domObj[p.radioGroupArr[i][j] + '_option'],
                  'disable'
                );
              } else {
                gotoAndStopRadio(
                  p.domObj[p.radioGroupArr[i][j] + '_option'],
                  'disable'
                );
              }
            }
          }
        }
      }
    }
  }

  // ==== set options disable ====
  function setOptionsDisable() {
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      for (var j = 0; j < p.radioGroupArr[i].length; j++) {
        var _mc = p.domObj[p.radioGroupArr[i][j]];
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

  // ======= remover events of all options ======
  function disableAllOptions() {
    var __tempOptionSetArr = new Array();
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      var tempStr = String(p.radioGroupArr[i]);
      var tempArr = tempStr.split(',');
      __tempOptionSetArr.push(tempArr);
      for (var j = 0; j < __tempOptionSetArr[i].length; j++) {
        var _mc = p.domObj[String(__tempOptionSetArr[i][j])];
        if (_mc) {
          if (p.detectTransparency) {
            removeCanvasListeners(_mc);
          } else {
            removeListeners(_mc);
            if (p.optionDisableOnFb && _mc.getAttribute('_status') == 'false') {
              gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'disable');
            }
            // if(_mc.getAttribute('_status') == "false")
            // gotoAndStopRadio(p.domObj[_mc.id+"_option"],'disable');
          }
        }
      }
    }
  }
  //==== remove all the evnets of all options,buttons and make all images null and remove dom elements
  this.removeAll = function() {
    if (p) {
      disableAllOptions();
      disableSubmit();
      disableShowSolution();
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

  function resetIncorrectItems() {
    if (p.resetIncorrectItemsGroup) {
      if (!multipleChoice()) {
        for (var k = 0; k < p.correctAnswers.length; k++) {
          if (attemptedAnswers[k] != p.correctAnswers[k]) {
            if (p.domObj[attemptedAnswers[k]]) {
              var currentGroup = parseInt(
                p.domObj[attemptedAnswers[k]].getAttribute('_group')
              );
              var tempStr = String(p.radioGroupArr[currentGroup]);
              var tempArr = tempStr.split(',');
              for (var i = 0; i < tempArr.length; i++) {
                if (attemptedAnswers[k] == tempArr[i]) {
                  var _mc = p.domObj[String(tempArr[i])];
                  if (_mc) {
                    _mc.setAttribute('_status', 'false');
                    if (p.detectTransparency) {
                      gotoAndStopRadioCanas(
                        p.domObj[_mc.id + '_option'],
                        'normal'
                      );
                    } else {
                      gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'normal');
                    }
                    /* if(_mc.getAttribute('_validatemc') != null)
										{
											gotoAndStopTicknCross(_mc.id , "cross");
										} */
                  }
                }
              }
            }
          } else {
            if (p.domObj[attemptedAnswers[k]]) {
              var currentGroup = parseInt(
                p.domObj[attemptedAnswers[k]].getAttribute('_group')
              );
              var tempStr = String(p.radioGroupArr[currentGroup]);
              var tempArr = tempStr.split(',');
              for (i = 0; i < tempArr.length; i++) {
                var _mc = p.domObj[String(tempArr[i])];
                removeListeners(_mc);
                //if(attemptedAnswers[k] == _mc.id)
                if (attemptedAnswers[k] == tempArr[i]) {
                  if (p.detectTransparency) {
                    gotoAndStopRadioCanas(
                      p.domObj[_mc.id + '_option'],
                      'selected'
                    );
                  } else {
                    gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'selected');
                  }
                }
              }
            }
          }
        }
      }

      if (multipleChoice()) {
        for (var i = 0; i < attemptedAnswersMc.length; i++) {
          if (attemptedAnswersMc[i]) {
            for (var j = 0; j < attemptedAnswersMc[i].length; j++) {
              if (p.correctAnswers.indexOf(attemptedAnswersMc[i][j]) == -1) {
                gotoAndStopTicknCross(
                  p.domObj[attemptedAnswersMc[i][j]],
                  'cross'
                );
                if (p.detectTransparency) {
                  gotoAndStopRadioCanas(
                    p.domObj[attemptedAnswersMc[i][j]],
                    'normal'
                  );
                } else {
                  gotoAndStopRadio(
                    p.domObj[attemptedAnswersMc[i][j]],
                    'normal'
                  );
                }
                if (p.domObj[attemptedAnswersMc[i][j]]) {
                  p.domObj[attemptedAnswersMc[i][j]].setAttribute(
                    '_status',
                    'false'
                  );
                }
                attemptedAnswersMc[i].splice(j, 1);
                if (j > 0) j--;
              }
            }
          }
        }
      }

      if (p.submitMc != '') {
        //addSubmitListener(__refToStage);
        //addSubmitListener();
      }
    }
  }

  //  ====== this function plays feedback ========
  function gotoAndPlayFeedBack(_status, _id, _retStatus) {
    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }
    var _audioPath;
    if (p.feedbackParam[_id]) {
      _audioPath = p._shellModel.getMediaPath() + p.feedbackParam[_id];
    }
    disableAllOptions();
    disableSubmit();
    disableShowSolution();
    // event dispatch from here to brain
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
        starRef: addstar_mc,
        retStatus: _retStatus
      });
    }
  }
  //   this function listenes feedBack completed from feedback class
  this.onFeedBackCompleted = function(_fb) {
    if (counter >= p.maxNumberOfTries && p.maxNumberOfTries != 0) {
      activityOver(_fb.status, _fb.curStatus, _fb.retStatus);
    } else {
      if (_fb.retStatus == 'incorrect') {
        enableAllOptions();
        enableShowSolution();
        /* if(p.fbSelFlag){   // need to check 
					clearVisRef();
				} */
        if (p.resetTickandCrossAfterIncorrectFeedBack) {
          resetTickAndCross();
        }
        if (p.resetOptionsAfterIncorrectFeedBack) {
          resetOptions();
        }
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      } else {
        activityOver(_fb.status, _fb.curStatus, _fb.retStatus);
      }
    }
  };

  // ===== add event to all options =====
  function enableAllOptions() {
    var __tempOptionSetArr = new Array();
    for (var i = 0; i < p.radioGroupArr.length; i++) {
      var tempStr = String(p.radioGroupArr[i]);
      var tempArr = tempStr.split(',');
      __tempOptionSetArr.push(tempArr);
      for (var j = 0; j < __tempOptionSetArr[i].length; j++) {
        var _mc = p.domObj[String(__tempOptionSetArr[i][j])];
        if (_mc) {
          if (p.detectTransparency) {
            addCanvasListeners(_mc);
          } else {
            addListeners(_mc);
          }
        }
      }
    }
  }
  // ===== this function used for disable all options and nuttons & unbind all events after activity over =====

  function activityOver(_status, _curStatus, _retStatus) {
    disableSubmit();
    disableShowSolution();
    setOptionsDisable();
    var instText = '';
    if (p.navEndJson) {
      p._navController.updateButtons(p.navEndJson);
    }

    // ===== disaptch activityOver event ====
    if (p['activityOver']) {
      p['activityOver']({
        status: 'ActivityOver',
        fbStatus: _status,
        curStatus: _curStatus,
        retStatus: _retStatus
      });
    }
  }

  // ======== show hide tick and cross ======
  function allocateVisRef() {
    if (visualReference()) {
      var __tempOptionSetArr = new Array();
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        var tempStr = String(p.radioGroupArr[i]);
        var tempArr = tempStr.split(',');
        __tempOptionSetArr.push(tempArr);
        for (var j = 0; j < __tempOptionSetArr[i].length; j++) {
          var _mc = p.domObj[String(__tempOptionSetArr[i][j])];
          if (_mc) {
            if (counter == p.maxNumberOfTries) {
              removeListeners(_mc);
            }
            if (_mc.getAttribute('_status') == 'true') {
              gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'selected');
              if (_mc.getAttribute('_validatemc') != null) {
                gotoAndStopTicknCross(_mc.id, 'cross');
              }
            }
          }
        }
      }
      //var tempcorrectAnswersArr = String(correctAnswers).split(",");
      var tempcorrectAnswersArr = String(p.correctAnswers).split(',');
      for (var k = 0; k < tempcorrectAnswersArr.length; k++) {
        var tempMc = p.domObj[String(tempcorrectAnswersArr[k])];
        if (tempMc.getAttribute('_status') == 'true') {
          if (attemptedMultipleAnswersMc == null) {
            attemptedMultipleAnswersMc = new Array();
          }
          //attemptedMultipleAnswersMc.push(_mc.name)
          attemptedMultipleAnswersMc.push(tempMc.id);
        }

        if (tempMc.getAttribute('_validatemc') != null) {
          if (p.maxNumberOfTries != 0) {
            if (counter == p.maxNumberOfTries) {
              gotoAndStopTicknCross(tempMc.id, 'tick');
            }
          } else {
            gotoAndStopTicknCross(tempMc.id, 'tick');
          }
        }
      }
    }
  }

  // === hide tick and cross =====
  function clearVisRef() {
    if (visualReference()) {
      var __tempOptionSetArr = new Array();
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        var tempStr = String(p.radioGroupArr[i]);
        var tempArr = tempStr.split(',');
        __tempOptionSetArr.push(tempArr);
        for (var j = 0; j < __tempOptionSetArr[i].length; j++) {
          var _mc = p.domObj[String(__tempOptionSetArr[i][j])];
          if (_mc) {
            gotoAndStopTicknCross(_mc.id, '', 'hide');
          }
        }
      }
    }
  }
  // this function return whether current activity is SingleChoice/MultipleChoice
  function multipleChoice() {
    if (p.questionType == 'SingleChoice') {
      multipleChoiceBool = false;
    } else {
      multipleChoiceBool = true;
    }
    return multipleChoiceBool;
  }

  // ======== check for show/hide tick and cross =====
  function visualReference() {
    if (p.vRef == 'OFF') {
      vRefBool = false;
    } else {
      vRefBool = true;
    }
    return vRefBool;
  }

  //==== reste options After Incorrect FeedBack ======
  function resetOptions() {
    if (!multipleChoice()) {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        if (attemptedAnswersMc[i] && attemptedAnswersMc[i].length > 0) {
          if (p.correctAnswers.indexOf(attemptedAnswersMc[i][0]) == -1) {
            for (var j = 0; j < p.radioGroupArr[i].length; j++) {
              var _mc = p.domObj[p.radioGroupArr[i][j]];
              if (_mc) {
                if (p.detectTransparency) {
                  gotoAndStopRadioCanas(p.domObj[_mc.id + '_option'], 'normal');
                } else {
                  gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'normal');
                }
                _mc.setAttribute('_status', 'false');
                attemptedAnswersMc[i] = new Array();
                currentCanvasOption[i] = '';
              }
            }
          } else {
            for (var j = 0; j < p.radioGroupArr[i].length; j++) {
              var _mc = p.domObj[p.radioGroupArr[i][j]];
              if (_mc) {
                if (p.detectTransparency) {
                  removeCanvasListeners(_mc);
                } else {
                  removeListeners(_mc);
                }
              }
            }
          }
        }
      }
    } else {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        for (var j = 0; j < p.radioGroupArr[i].length; j++) {
          var _mc = p.domObj[p.radioGroupArr[i][j]];
          if (_mc) {
            if (
              _mc.getAttribute('_status') == 'true' &&
              p.correctAnswers.indexOf(p.radioGroupArr[i][j]) != -1
            ) {
              if (p.resetAllOptionsAfterIncorrectFeedBack) {
                if (p.detectTransparency) {
                  gotoAndStopRadioCanas(p.domObj[_mc.id + '_option'], 'normal');
                } else {
                  gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'normal');
                }
                _mc.setAttribute('_status', 'false');
                attemptedAnswersMc[i].splice(
                  attemptedAnswersMc[i].indexOf(p.radioGroupArr[i][j]),
                  1
                );
              }
            } else {
              if (p.detectTransparency) {
                gotoAndStopRadioCanas(p.domObj[_mc.id + '_option'], 'normal');
              } else {
                gotoAndStopRadio(p.domObj[_mc.id + '_option'], 'normal');
              }
              _mc.setAttribute('_status', 'false');
              attemptedAnswersMc[i].splice(
                attemptedAnswersMc[i].indexOf(p.radioGroupArr[i][j]),
                1
              );
            }
          }
        }
      }
    }

    submitBool = true;
    if (p.submitMc != '') {
      removeListeners(sbMC);
    }
  }

  //======= reset tick and cross ========
  function resetTickAndCross() {
    if (!multipleChoice()) {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        if (attemptedAnswersMc[i] && attemptedAnswersMc[i].length > 0) {
          if (p.correctAnswers.indexOf(attemptedAnswersMc[i][0]) == -1) {
            for (var j = 0; j < p.radioGroupArr[i].length; j++) {
              var _mc = p.domObj[p.radioGroupArr[i][j]];
              if (_mc) {
                gotoAndStopTicknCross(_mc.id, '', 'hide');
              }
            }
          }
        }
      }
    } else {
      for (var i = 0; i < p.radioGroupArr.length; i++) {
        for (var j = 0; j < p.radioGroupArr[i].length; j++) {
          var _mc = p.domObj[p.radioGroupArr[i][j]];
          if (_mc) {
            if (
              _mc.getAttribute('_status') == 'true' &&
              p.correctAnswers.indexOf(p.radioGroupArr[i][j]) != -1
            ) {
              if (p.resetAllTickandCrossAfterIncorrectFeedBack) {
                gotoAndStopTicknCross(_mc.id, '', 'hide');
              }
            } else {
              gotoAndStopTicknCross(_mc.id, '', 'hide');
            }
          }
        }
      }
    }
  }
  // ==== not in use =====
  function callFrmComp() {}

  // ===== Disable submit button ====
  function disableSubmit() {
    submitBool = true;
    if (p.submitMc != '') {
      //removeListeners(sbMC);
      removeListeners(sbMC);
      gotoAndStopSubmit(sbMC, 'disable');
    }
  }

  // ===== Enable submit button ====
  function enableSubmit() {
    if (p.submitMc != '') {
      gotoAndStopSubmit(sbMC, 'normal');
      addListeners(sbMC);
    }
  }

  // ===== make image object of required images ========
  function makeImgObject() {
    var tempImgObj = new Object();
    /* if(p.optionImgType)
			{
				tempImgObj["option_normal"] = "commonAssets/images/radioButtons/"+p.optionImgType+"/option_normal.png";
				tempImgObj["option_over"] = "commonAssets/images/radioButtons/"+p.optionImgType+"/option_over.png";
				tempImgObj["option_selected"] = "commonAssets/images/radioButtons/"+p.optionImgType+"/option_selected.png";
				tempImgObj["option_disable"] = "commonAssets/images/radioButtons/"+p.optionImgType+"/option_disable.png";
			} */
    //  == tick and cross images of stanard type (type1,type2,type3)
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

    // ==== submit images of stanard type (type1,type2,type3)
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
    // ==== solution images of stanard type (type1,type2,type3)
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
    // ==== same images for all options ========
    if (p.optionImgObj) {
      for (var i in p.optionImgObj) {
        if (p.optionImgObj[i])
          tempImgObj['option_' + i] =
            p._shellModel.getMediaPath() + p.optionImgObj[i];
      }
    }
    // ==== different images for all options ========
    if (p.multipleOptionImg) {
      for (var i in p.multipleOptionImg) {
        for (var j in p.multipleOptionImg[i]) {
          tempImgObj[i + '_option_' + j] =
            p._shellModel.getMediaPath() + p.multipleOptionImg[i][j];
        }
      }
    }

    //  === if custom images for submit button
    if (p.submitImgObj) {
      for (var i in p.submitImgObj) {
        tempImgObj['submitBtn_' + i] =
          p._shellModel.getMediaPath() + p.submitImgObj[i];
      }
    }
    //  === if custom images for solution button
    if (p.solutionImgObj) {
      for (var i in p.solutionImgObj) {
        tempImgObj['solutionBtn_' + i] =
          p._shellModel.getMediaPath() + p.solutionImgObj[i];
      }
    }
    // === custom tick and cross =====
    if (p.tickAndCrossImgObj) {
      if (p.tickAndCrossImgObj['tick']) {
        tempImgObj['tick'] =
          p._shellModel.getMediaPath() + p.tickAndCrossImgObj['tick'];
      }
      if (p.tickAndCrossImgObj['cross']) {
        tempImgObj['cross'] =
          p._shellModel.getMediaPath() + p.tickAndCrossImgObj['cross'];
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
    // if image objet is empty
    if (Object.keys(_obj).length == 0) {
      startActivity();
    }
  }
  //
  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }
};
