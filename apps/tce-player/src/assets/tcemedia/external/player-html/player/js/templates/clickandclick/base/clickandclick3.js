var ClickAndClick1 = function() {
  var p = {
    _wrapper: '',
    _activityNo: '',
    _activityAudioNo: '',
    rootRef: null, //mc
    refToPlayer: null, //mc
    /*///////// Inspectable Variables ////////////*/
    _interactive: true,
    _optItemsArr: [
      'dragMc_01',
      'dragMc_02',
      'dragMc_03',
      'dragMc_04',
      'dragMc_05',
      'dragMc_06'
    ],
    _baseItemsArr: ['dropMc_01', 'dropMc_02', 'dropMc_03'],
    _correctAnswers: [2, 5, 4],
    _noOfAttempts: 0, //int 1

    _submitBtn: 'submitMc',
    _submitImgType: '',

    _customFnCall: null,
    _validationMethod: 'Individual',

    _visualFBMc: 'tick_mc',
    _tickPaddingLeft: 0,
    _tickPaddingTop: 0,
    _tickCrossPosition: '', //  "lt","lb","rt","rb","cl","cr","ct","cb","inLeft","inRight"
    _feedbackMc: 'feedbackMc_1',
    _solutionBtn: 'solutionMc',
    _solutionImgType: '',
    _resetBtn: null,
    _resetImgType: '',
    _boundRect: [],
    _showTween: true,
    _tweenInterval: 0.5,
    _questNo: 0, //int
    _maintainScore: false,
    _mainMovieRef: null,
    _questionType: 'Type1',
    _numberOfCorrectFeedbacks: 1, //int
    _numberOfIncorrectFeedbacks: 1, //int
    _maxDropCount: 1, //int
    _dropPosition: 'Vertical',
    _positionOffset: 3, //int
    _imgObj: {},
    _btnFontCssObj: {},
    _changeFbAudio: null,
    _solBtnDisableOnInit: true,
    _jumpScreen: {},
    feedbackParam: {},
    _starDiv: '',
    _positionOffsetObj: {}, //x,y for each option
    _positionOffsetX: 0, //x for all options
    _positionOffsetY: 0, //y for all options

    //_setClone:true,
    /* /////////// Class variables  ////////////*/
    baseObj: {},
    optObj: {},
    correctFeedbackCounter: 0, //int
    incorrectFeedbackCounter: 0, //int
    attemptCnt: 0, //int
    visFeedbackMC: null,
    fbMC: null, //mc
    submitMC: null, //mc
    solutionMC: null, //mc
    resetMC: null, //mc
    allCorrect: false,
    isUnlimitedAttempt: false,
    tweenArr: [],
    myTweenX: 0,
    myTweenY: 0,
    myTweenX1: 0,
    myTweenY1: 0,
    selectedMc: null, //public mc
    dummyMc: null, //public mc
    isCorrect: false,
    currentBaseItem: -1, //int
    addstar_mc: {},
    highlightColor: '3px solid #FF6600',
    // shp:Sprite = new Sprite(),
    //public var addStar:CustomEvent,
    // type2_holderMc:MovieClip = new MovieClip(),

    // parameters added by Ajay for combination feedBack
    individualFb: false,
    combinationFb: false,
    numberOfCombinationFeedback: 0,
    highLightDropBoxFlag: true
  };
  var combinationFeedbackCounter = 0;
  var submitCnt = false;
  var _thisObj = this;
  var activityImageObj = new Object();
  var loadedImgCnt, loadImgCnt;
  var commonAssetPath;
  //=============
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };

  /*
	////////////////////////////////////////////////////////////
	Method Name    : init()
	Description    :
	////////////////////////////////////////////////////////////
	*/
  function setText() {
    for (var i in p.domObj) {
      if (
        i.indexOf('txt_') == 0 &&
        $($(p.domObj[i]).parent()[0]).attr('data') &&
        $($(p.domObj[i]).parent()[0])
          .attr('data')
          .indexOf('txt_') != -1
      ) {
        $(p.domObj[i]).css({
          'pointer-events': 'none',
          width: '100%',
          height: '100%',
          display: 'table-cell',
          'vertical-align': 'middle'
        });
      }
    }
    if (p.updaterJsonStart) {
      p._navController.updateButtons(p.updaterJsonStart);
    }
  }
  //=============================
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    commonAssetPath = p._shellModel.getServiceObj().getCommonAssetPath();
    makeImgObj();
  };
  //=============================
  function makeImgObj() {
    var tempObj = new Object();
    for (var i = 0; i < p._optItemsArr.length; i++) {
      var temp = p._optItemsArr[i];
      for (var j in p._imgObj) {
        if (temp == j) {
          for (var k in p._imgObj[j]) {
            if (p._imgObj[temp][k]) {
              tempObj[temp + k] =
                p._shellModel.getMediaPath() + p._imgObj[p._optItemsArr[i]][k];
            }
          }
        }
      }
    }

    for (var i = 0; i < p._baseItemsArr.length; i++) {
      var temp = p._baseItemsArr[i];
      for (var j in p._imgObj) {
        if (temp == p._imgObj[j]) {
          for (var k in p._imgObj[j]) {
            tempObj[temp + k] =
              p._shellModel.getMediaPath() + p._imgObj[p._baseItemsArr[i]][k];
          }
        }
      }
    }
    // load tick and cross images
    if (p._visualFBMc != '') {
      for (var i = 0; i < p._baseItemsArr.length; i++) {
        if (p._tickCrossPosition) {
          tempObj[p._baseItemsArr[i] + '_tick_correct'] =
            commonAssetPath + 'commonAssets/images/tickandcross/type3/tick.png';
          tempObj[p._baseItemsArr[i] + '_tick_incorrect'] =
            commonAssetPath +
            'commonAssets/images/tickandcross/type3/cross.png';
        } else {
          tempObj[p._baseItemsArr[i] + '_tick_correct'] =
            p._shellModel.getMediaPath() +
            p._imgObj[p._visualFBMc][p._baseItemsArr[i] + '_tick']['correct'];
          tempObj[p._baseItemsArr[i] + '_tick_incorrect'] =
            p._shellModel.getMediaPath() +
            p._imgObj[p._visualFBMc][p._baseItemsArr[i] + '_tick']['incorrect'];
        }
      }
    }
    // add submit button images
    if (p._submitBtn != '') {
      if (p._submitImgType) {
        tempObj['submit_normal'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._submitImgType +
          '/btn_normal.png';
        tempObj['submit_over'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._submitImgType +
          '/btn_over.png';
        tempObj['submit_disable'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._submitImgType +
          '/btn_disable.png';
      } else {
        if (p._imgObj[p._submitBtn]) {
          if (p._imgObj[p._submitBtn]['_normal']) {
            tempObj['submit_normal'] =
              p._shellModel.getMediaPath() + p._imgObj[p._submitBtn]['_normal'];
          }
          if (p._imgObj[p._submitBtn]['_over']) {
            tempObj['submit_over'] =
              p._shellModel.getMediaPath() + p._imgObj[p._submitBtn]['_over'];
          }
          if (p._imgObj[p._submitBtn]['_disable']) {
            tempObj['submit_disable'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._submitBtn]['_disable'];
          }
        }
      }
    }
    // add solution button images
    if (p._solutionBtn != '') {
      if (p._solutionImgType) {
        tempObj['solution_normal'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._solutionImgType +
          '/btn_normal.png';
        tempObj['solution_over'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._solutionImgType +
          '/btn_over.png';
        tempObj['solution_disable'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._solutionImgType +
          '/btn_disable.png';
      } else {
        if (p._imgObj[p._solutionBtn]) {
          if (p._imgObj[p._solutionBtn]['_normal'])
            tempObj['solution_normal'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._solutionBtn]['_normal'];
          if (p._imgObj[p._solutionBtn]['_over'])
            tempObj['solution_over'] =
              p._shellModel.getMediaPath() + p._imgObj[p._solutionBtn]['_over'];
          if (p._imgObj[p._solutionBtn]['_disable'])
            tempObj['solution_disable'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._solutionBtn]['_disable'];
        }
      }
    }
    // reset button images
    if (p._resetBtn != '') {
      if (p._resetImgType) {
        tempObj['reset_normal'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._resetImgType +
          '/btn_normal.png';
        tempObj['reset_over'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._resetImgType +
          '/btn_over.png';
        tempObj['reset_disable'] =
          commonAssetPath +
          'commonAssets/images/buttons/' +
          p._resetImgType +
          '/btn_disable.png';
      } else {
        if (p._imgObj[p._resetBtn]) {
          if (p._imgObj[p._resetBtn]['_normal']) {
            tempObj['reset_normal'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_normal'];
          }
          if (p._imgObj[p._resetBtn]['_over']) {
            tempObj['reset_over'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_over'];
          }
          if (p._imgObj[p._resetBtn]['_disable']) {
            tempObj['reset_disable'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_disable'];
          }
        }
      }
    }
    preloadImages(tempObj);
  }

  function preloadImages(_obj) {
    activityImageObj = new Object();
    loadedImgCnt = 0;
    loadImgCnt = 0;
    //console.log(Object.keys(_obj).length !=0)
    if (Object.keys(_obj).length != 0) {
      for (var i in _obj) {
        activityImageObj[i] = new Object();
        var _tempImg = new Image();
        _tempImg.onload = imgloaded;
        _tempImg.src = _obj[i];
        activityImageObj[i] = _tempImg;
        loadImgCnt++;
      }
    } else {
      startActivity();
    }
  }

  function imgloaded(_tempImg, elem) {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }

  function startActivity() {
    setText();
    for (var i = 0; i < p._baseItemsArr.length; i++) {
      p.baseObj[p._baseItemsArr[i]] = {};
    }
    for (var i = 0; i < p._optItemsArr.length; i++) {
      p.optObj[p._optItemsArr[i]] = {};
    }
    p.correctFeedbackCounter = 0;
    p.incorrectFeedbackCounter = 0;
    p.attemptCnt = 1;
    // check for no of attempts
    if (p._noOfAttempts <= 0) {
      p.isUnlimitedAttempt = true;
    }
    if (p._feedbackMc != '') {
      p.fbMC = p._feedbackMc;
    }
    /* if (p._questionType == "Type2")
        {
        	rootRef.addChildAt(type2_holderMc, rootRef.getChildIndex(p.fbMC));
        	type2_holderMc.x = 0;
        	type2_holderMc.y = 0;
        } */
    // hide tick/cross initially if present
    if (p._visualFBMc != '') {
      p.visFeedbackMC = p._visualFBMc;
      for (var i = 0; i < p._baseItemsArr.length; i++) {
        gotoAndStopTick(p._baseItemsArr[i] + '_tick', 1);
      }
    }
    // enbale/disable submit button
    if (p._submitBtn != '') {
      p.submitMC = p.domObj[p._submitBtn];
      enableDisableSubmit(false);
    }
    // 	enbale/disable solution button
    if (p._solutionBtn != '') {
      p.solutionMC = p.domObj[p._solutionBtn];
      enableDisableSolution(p._solBtnDisableOnInit);
    }
    // 	enbale/disable reset button
    if (p._resetBtn != '') {
      p.resetMC = p.domObj[p._resetBtn];
      enableDisableReset(false);
    }

    initBaseItems();
    initOptionItems();

    // if want to add star code here
    /*if(p._maintainScore){
			addstar_mc = new StarController(p);
			addstar_mc.init(p.domObj[p._starDiv]);
		}*/
    if (!p._interactive) {
      p.currentBaseItem = 0;
      higlightBaseItem();
    } else {
      p.currentBaseItem = -1;
    }
  }
  function actionHandler(e) {
    /* if(p._maintainScore)
		{
			if(addstar_mc !=null)
			{
				if((String(attemptedMultipleAnswersMc) == String(p.__correctAnswers)) || (String(attemptedAnswers) == String(p.__correctAnswers)))
				{
				   addstar_mc.updateAnswer(p.__questNo,1);
				}else
				{
				   addstar_mc.updateAnswer(p.__questNo,0);
				}
			}
		} */
  }
  function onFeedBackEvents(e) {
    switch (e.target) {
      case 'complete':
        break;
      case '':
        break;
    }
  }

  function enableDisableSubmit(_val) {
    //pr bool
    //console.log("enableDisableSubmit")
    if (p.submitMC) {
      //p.submitMC.buttonMode = _val;
      if (_val) {
        //p.submitMC.gotoAndStop("_up");
        //p.submitMC.addEventListener(MouseEvent.CLICK, validateCAC);
        //$(p.submitMC).off(_evt,_fn).on(_evt,_data,_fn);
        resetBaseItems();
        gotoAndStopSubmit(p.submitMC, '_normal');
        $(p.submitMC)
          .off('click', validateCAC)
          .on('click', validateCAC);
        $(p.submitMC)
          .off('mousemove', setSubmitOver)
          .on('mousemove', setSubmitOver);
        $(p.submitMC)
          .off('mouseout', setSubmitOver)
          .on('mouseout', setSubmitOver);
        $(p.submitMC).addClass('addPointer');
      } else {
        //p.submitMC.gotoAndStop("_disable");
        //p.submitMC.removeEventListener(MouseEvent.CLICK, validateCAC);
        gotoAndStopSubmit(p.submitMC, '_disable');
        $(p.submitMC).off('click', validateCAC);
        $(p.submitMC).off('mousemove', setSubmitOver);
        $(p.submitMC).off('mouseout', setSubmitOver);
        $(p.submitMC).removeClass('addPointer');
      }
    }
  }

  function setSubmitOver(e) {
    if (e.type == 'mousemove') gotoAndStopSubmit(p.submitMC, '_over');
    else gotoAndStopSubmit(p.submitMC, '_normal');
  }

  function setSolutionOver(e) {
    if (e.type == 'mousemove') gotoAndStopSoln(p.solutionMC, '_over');
    else gotoAndStopSoln(p.solutionMC, '_normal');
  }

  function setResetOver(e) {
    if (e.type == 'mousemove') gotoAndStopReset(p.resetMC, '_over');
    else gotoAndStopReset(p.resetMC, '_normal');
  }
  /*
   * method to enable/disable the solution button if available
   * @param	_val - accepts true/false
   */
  function enableDisableSolution(_val) {
    //pr bool
    if (p.solutionMC) {
      //p.solutionMC.buttonMode = _val;
      if (_val) {
        //p.solutionMC.gotoAndStop("_up");
        //p.solutionMC.addEventListener(MouseEvent.CLICK, showCorrectAnswer);
        gotoAndStopSoln(p.solutionMC, '_normal');
        $(p.solutionMC)
          .off('click', showCorrectAnswer)
          .on('click', showCorrectAnswer);
        $(p.solutionMC)
          .off('mousemove', setSolutionOver)
          .on('mousemove', setSolutionOver);
        $(p.solutionMC)
          .off('mouseout', setSolutionOver)
          .on('mouseout', setSolutionOver);
        $(p.solutionMC).addClass('addPointer');
      } else {
        //p.solutionMC.gotoAndStop("_disable");
        //p.solutionMC.removeEventListener(MouseEvent.CLICK, showCorrectAnswer);
        gotoAndStopSoln(p.solutionMC, '_disable');
        $(p.solutionMC).off('click', showCorrectAnswer);
        $(p.solutionMC).off('mousemove', setSolutionOver);
        $(p.solutionMC).off('mouseout', setSolutionOver);
        $(p.solutionMC).removeClass('addPointer');
      }
    }
  }
  /*
   * method to enable/disable the reset button if available
   * @param	_val - accepts true/false
   */
  function enableDisableReset(_val) {
    //pr bool
    if (p.resetMC) {
      //p.resetMC.buttonMode = _val;
      if (_val) {
        //p.resetMC.gotoAndStop("_up");
        //p.resetMC.addEventListener(MouseEvent.CLICK, resetIncorrectItems);
        gotoAndStopReset(p.resetMC, '_normal');
        $(p.resetMC)
          .off('click', resetIncorrectItems)
          .on('click', resetIncorrectItems);
        $(p.resetMC)
          .off('mousemove', setResetOver)
          .on('mousemove', setResetOver);
        $(p.resetMC)
          .off('mouseout', setResetOver)
          .on('mouseout', setResetOver);
        $(p.resetMC).addClass('addPointer');
      } else {
        //p.resetMC.gotoAndStop("_disable");
        //p.resetMC.removeEventListener(MouseEvent.CLICK, resetIncorrectItems);
        gotoAndStopReset(p.resetMC, '_disable');
        $(p.resetMC).off('click', resetIncorrectItems);
        $(p.resetMC).off('mousemove', setResetOver);
        $(p.resetMC).off('mouseout', setResetOver);
        $(p.resetMC).removeClass('addPointer');
      }
    }
  }

  // remove highlighted border
  function resetBaseItems() {
    for (var i = 0; i < p._baseItemsArr.length; i++) {
      $(p.domObj[p._baseItemsArr[i]]).removeClass('highLightDropBox addBorder');
      // $(p.domObj[p._baseItemsArr[i]]).css("border","");
    }
  }

  function higlightBaseItem() {
    //pr
    var i = 0; //int
    var mcBase; //:MovieClip;
    resetBaseItems();

    if (
      p.currentBaseItem != -1 &&
      !p._interactive &&
      p.currentBaseItem != undefined /* && p.currentBaseItem != "" */
    ) {
      //var mc:MovieClip = rootRef.getChildByName(p._baseItemsArr[p.currentBaseItem]) as MovieClip;
      //console.log(p.currentBaseItem)
      var mc = p._baseItemsArr[p.currentBaseItem];
      //console.log(p._questionType)
      if (p._questionType == 'Type3') {
        if (p.baseObj[mc].currentCount < p.baseObj[mc].maxCount) {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            if (mcBase.currentCount < mcBase.maxCount) {
              //mcBase = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
              mcBase = p._baseItemsArr[i];
              //gotoAndStopDrop(p.baseObj[mcBase], 1);
              gotoAndStopDrop(p.baseObj[mcBase], '_normal');
              p.baseObj[mcBase].isHighlighted = false;
            }
          }
          //mc.gotoAndStop("highlight");
          gotoAndStopDrop(p.baseObj[mc], '_over');
          // p.baseObj[mc].isHighlighted = true;
          if (p.highLightDropBoxFlag) {
            $(p.domObj[p._baseItemsArr[p.currentBaseItem]]).addClass(
              'highLightDropBox'
            );
            p.baseObj[mc].isHighlighted = true;
          }
        }
      } else {
        //console.log(mc.optMc)
        if (!mc.optMc) {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            if (!mc.optMc) {
              //mcBase = rootRef.getChildByName(p.baseItemsArr[i]) as MovieClip;
              mcBase = p._baseItemsArr[i];
              //gotoAndStopDrop(p.baseObj[mcBase], 1);
              gotoAndStopDrop(p.baseObj[mcBase], '_normal');
              p.baseObj[mcBase].isHighlighted = true;
            }
          }
          if (p.optObj[mc]) gotoAndStopDrag(p.optObj[mc], '_over');
          //console.log("chnage color here");
          if (p.highLightDropBoxFlag) {
            //$(p.domObj[p._baseItemsArr[p.currentBaseItem]]).css("border",p.highlightColor);
            $(p.domObj[p._baseItemsArr[p.currentBaseItem]]).addClass(
              'highLightDropBox addBorder'
            );
            p.baseObj[mc].isHighlighted = true;
          }

          //p.optObj[mc].isHighlighted = true;
        } else {
          var isAllSelected = true;
          for (i = 0; i < p.baseItemsArr.length; i++) {
            //mc = rootRef.getChildByName(p.baseItemsArr[i]) as MovieClip;
            mc = p.baseItemsArr[i];
            if (!p.baseObj[mc].optMc) {
              isAllSelected = false;
            }
          }
          if (!isAllSelected) {
            if (p.currentBaseItem < p.baseItemsArr.length - 1) {
              // p.currentBaseItem++;
            } else {
              //p.currentBaseItem = 0;
            }
            higlightBaseItem();
          } else {
            enableDisableSubmit(true);
          }
        }
      }
    }
  }

  function setTickCross(elm) {
    var pLeft = parseFloat($(elm).css('left'));
    var pTop = parseFloat($(elm).css('top'));

    var pWLeft = parseFloat($(elm).css('width'));
    var pHTop = parseFloat($(elm).css('height'));

    var tickWidth = 41;
    var tickHeight = 36;
    switch (p._tickCrossPosition) {
      case 'lt': //done
        pLeft = pLeft - tickWidth + p._tickPaddingLeft;
        pTop = pTop - tickHeight + p._tickPaddingTop;
        break;
      case 'lb': //done
        pLeft = pLeft - tickWidth + p._tickPaddingLeft;
        pTop = pTop + pHTop + p._tickPaddingTop;
        break;
      case 'rt': //done
        pLeft = pLeft + pWLeft + p._tickPaddingLeft;
        pTop = pTop - tickHeight + p._tickPaddingTop;
        break;
      case 'rb': //done
        pLeft = pLeft + pWLeft + p._tickPaddingLeft;
        pTop = pTop + pHTop + p._tickPaddingTop;
        break;
      case 'cl':
        pLeft = pLeft - tickWidth + p._tickPaddingLeft;
        pTop = pTop + pHTop / 2 - tickHeight / 2 + p._tickPaddingTop;
        break;
      case 'cr':
        pLeft = pLeft + pWLeft + p._tickPaddingLeft;
        pTop = pTop + pHTop / 2 - tickHeight / 2 + p._tickPaddingTop;
        break;
      case 'ct':
        pLeft = pLeft + pWLeft / 2 - tickWidth / 2 + p._tickPaddingLeft;
        pTop = pTop - tickHeight + p._tickPaddingTop;
        break;
      case 'cb':
        pLeft = pLeft + pWLeft / 2 - tickWidth / 2 + p._tickPaddingLeft;
        pTop = pTop + pHTop + p._tickPaddingTop;
        break;
      case 'inLeft': //done
        pLeft = pLeft + p._tickPaddingLeft;
        pTop = pTop + pHTop / 2 - tickHeight / 2 + p._tickPaddingTop;
        break;
      case 'inRight': //done
        pLeft = pLeft + pWLeft - tickWidth + p._tickPaddingLeft;
        pTop = pTop + pHTop / 2 - tickHeight / 2 + p._tickPaddingTop;
        break;
    }
    return { left: pLeft, top: pTop };
  }

  function initBaseItems() {
    for (var i = 0; i < p._baseItemsArr.length; i++) {
      if (!p.domObj[p._baseItemsArr[i] + '_tick'] && p._visualFBMc) {
        //console.log("dffff")
        var _elemTick = document.createElement('div');
        $(p._wrapper).append(_elemTick);
        var pos = setTickCross(p.domObj[p._baseItemsArr[i]]);
        var pLeft = pos.left;
        var pTop = pos.top;

        $(_elemTick).css({
          position: 'absolute',
          'pointer-events': 'none',

          left: pLeft + 'px',
          top: pTop + 'px',
          width: '41px',
          height: '36px',
          display: 'none'
        });

        $(_elemTick).attr('id', p._baseItemsArr[i] + '_tick');
        //console.log("_elemTick",_elemTick)
        p.domObj[p._baseItemsArr[i] + '_tick'] = _elemTick;
      }

      /* var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc.id = (i + 1);
            mc.gotoAndStop(1);
            mc.optMc = null;
            mc.optMcArr = new Array();
            mc.optMcArr.splice(0, mc.optMcArr.length); 
            mc.isOptMcCorrect = false; */
      //gotoAndStopDrop(p._baseItemsArr[i], 1);
      gotoAndStopDrop(p._baseItemsArr[i], '_normal');
      p.baseObj[p._baseItemsArr[i]].id = p._baseItemsArr[i];
      p.baseObj[p._baseItemsArr[i]].optMc = null;
      p.baseObj[p._baseItemsArr[i]].optMcArr = [];
      p.baseObj[p._baseItemsArr[i]].isOptMcCorrect = false;
      if (p._interactive && p._questionType == 'Type4') {
        p.baseObj[p._baseItemsArr[i]].buttonMode = false;
        $(p.domObj[p._baseItemsArr[i]]).removeClass('addPointer');
        gotoAndStopDrop(p._baseItemsArr[i], '_disable');
      } else {
        //mc.addEventListener(MouseEvent.CLICK, onBaseMcMouseClickEvent);
        $(p.domObj[p._baseItemsArr[i]])
          .off('click', onBaseMcMouseClickEvent)
          .on('click', onBaseMcMouseClickEvent);
      }
      /* mc.type = "base";
            mc.maxCount = 1;
            mc.maxCount = p._maxDropCount;
            mc.currentCount = 0; */
      p.baseObj[p._baseItemsArr[i]].type = 'base';
      p.baseObj[p._baseItemsArr[i]].maxCount = 1;
      p.baseObj[p._baseItemsArr[i]].maxCount = p._maxDropCount;
      p.baseObj[p._baseItemsArr[i]].currentCount = 0;
    }

    //p.changeDomObj(p.domObj)
  }

  function gotoAndStopDrop(elem, state) {
    if (p._imgObj[elem]) {
      if (p._imgObj[elem][state]) {
        setBackground(p.domObj[elem], activityImageObj[elem + state]);
      }
    }

    /* 	switch (state) {
        		
        		case "_normal":
        			setBackground(p.domObj[elem], elem)
        			break;
        		case "_disable":
        			setBackground(p.domObj[elem], elem)
        			break;
  }

  function gotoAndStopDrag(elem, state) {
    if (p._imgObj[elem]) {
      if (p._imgObj[elem][state]) {
        setBackground(p.domObj[elem], activityImageObj[elem + state]);
      }
    } else {
      //console.log("css")
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_selected']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_normal']);
          break;
        case '_disable':
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_selected']);
          break;
      }
        		case "_over":
        			setBackground(p.domObj[elem], elem)
        			break;
        		case "_down":
        			setBackground(p.domObj[elem], elem)
        			break;
        	} */
  }

  function gotoAndStopDrag(elem, state) {
    if (p._imgObj[elem]) {
      if (p._imgObj[elem][state]) {
        setBackground(p.domObj[elem], activityImageObj[elem + state]);
      }
    } else {
      //console.log("css")
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_selected']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_normal']);
          break;
        case '_disable':
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.dragMc['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.dragMc['_selected']);
          break;
      }
    }

    /* 	switch (state) {
        		 
        		case "_normal":
        			setBackground(p.domObj[elem], p._imgObj[elem].state)
        			break;
        		case "_disable":
        			setBackground(p.domObj[elem], elem + "_disable")
        			break;
        		case "_over":
        			setBackground(p.domObj[elem], elem + "_over")
        			break;
        		case "_down":
        			setBackground(p.domObj[elem], elem + "_down")
        			break;
        		case "_selected":
        			setBackground(p.domObj[elem], elem + "_selected")
        				
        			break;
        	} */
  }

  function gotoAndStopTick(elem, state) {
    switch (state) {
      case 1:
        $(p.domObj[elem]).hide();
        break;
      case 'correct':
        $(p.domObj[elem]).show();
        setBackground(p.domObj[elem], activityImageObj[elem + '_correct']);
        break;
      case 'incorrect':
        $(p.domObj[elem]).show();
        setBackground(p.domObj[elem], activityImageObj[elem + '_incorrect']);
        break;
    }
  }

  function gotoAndStopSoln(elem, state) {
    if (p._imgObj[elem.id] || p._solutionImgType) {
      //console.log(elem.id,activityImageObj["solution"+state],state)
      //setBackground(elem, p._imgObj[elem.id][state])
      setBackground(elem, activityImageObj['solution' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.solution['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.solution['_disable']);
          break;
        case '_over':
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem.id]).addClass(p._cssObj.solution['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.solution['_selected']);
          break;
      }
    }

    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function gotoAndStopSubmit(elem, state) {
    //console.log("Sssssss")
    if (p._imgObj[elem.id] || p._submitImgType) {
      //setBackground(elem, p._imgObj[elem.id][state])
      setBackground(elem, activityImageObj['submit' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_disable']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.submit['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.submit['_disable']);
          break;
        case '_over':
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_disable']);
          $(p.domObj[elem.id]).addClass(p._cssObj.submit['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.submit['_selected']);
          break;
      }
    }

    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          //$($(elem).find('span')[0]).css("color","")
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          //console.log(elem)
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function gotoAndStopReset(elem, state) {
    if (p._imgObj[elem.id] || p._resetImgType) {
      setBackground(elem, activityImageObj['reset' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_disable']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.reset['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.reset['_disable']);
          break;
        case '_over':
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_disable']);
          $(p.domObj[elem.id]).addClass(p._cssObj.reset['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem.id]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem.id]).addClass(p._cssObj.reset['_selected']);
          break;
      }
    }
    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(elem).find('span')[0]).css('color', '');
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(elem).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(elem).find('span')[0]).addClass(p._btnFontCssObj.subMc[state]);
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function setBackground(elem, img) {
    if (img) {
      $(elem).css({
        background: 'url(' + img.src + ') no-repeat',
        'background-size': '100% 100%'
      });
    }
  }

  function onBaseMcMouseClickEvent(e) {
    var mcBase;
    hideHandCursorOnBaseMc();
    mcBase = e.currentTarget.id;
    //trace(mcBase.name + " currentCount:" + mcBase.currentCount + " maxCount: " + mcBase.maxCount);
    var b = true;
    if (
      p.questionType == 'Type3' &&
      p.baseObj[mcBase].currentCount >= p.baseObj[mcBase].maxCount
    ) {
      b = false;
    }
    if (b) {
      if (p.selectedMc) {
        var baseID = Number(p.baseObj[mcBase].id.split('_')[1]);
        p.currentBaseItem = baseID - 1;
        if (p.selectedMc.baseMc) {
          //console.log("sssssssssssssdddddddddd")
          p.baseObj[p.selectedMc.baseMc].currentCount--;
          //p.selectedMc.baseMc.gotoAndStop(1);
          //gotoAndStopDrop(p.selectedMc.baseMc, 1);
          gotoAndStopDrop(p.selectedMc.baseMc, '_normal');
          p.baseObj[p.selectedMc.baseMc].optMcArr.splice(
            p.baseObj[p.selectedMc.baseMc].optMcArr.indexOf(p.selectedMc.id),
            1
          );
          p.baseObj[p.selectedMc.baseMc].optMc = null;
          for (
            var m = 0;
            m < p.baseObj[p.selectedMc.baseMc].optMcArr.length;
            m++
          ) {
            p.baseObj[p.selectedMc.baseMc].optMcArr[m].x = getXPos(
              p.baseObj[p.selectedMc.baseMc].optMcArr[m]
            );
            p.baseObj[p.selectedMc.baseMc].optMcArr[m].y = getYPos(
              p.baseObj[p.selectedMc.baseMc].optMcArr[m]
            );
          }
        }
        if (
          p.questionType == 'Type2' &&
          p.interactive &&
          !p.selectedMc.baseMc
        ) {
          type2_onOptionMcMouseClickEvent(p.selectedMc);
        } else {
          type1_onOptionMcMouseClickEvent(p.selectedMc);
        }
        p.selectedMc = null;
        higlightBaseItem();
      } else {
      }
    } else {
      //trace("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
      gotoAndStopDrop(mcBase, '_disable');
      p.baseObj[mcBase].isHighlighted = false;
    }
  }

  // funciton added by Ajay for cnc_v3
  function resetToOriginalPosition() {
    for (var i = 0; i < p._optItemsArr.length; i++) {
      //gotoAndStopDrag(p._optItemsArr[i], "_normal");
      var mc = p.domObj[p._optItemsArr[i]];
      //p.optObj[p._optItemsArr[i]].id = p._optItemsArr[i];
      //mouseOverDrag(p.optObj[p._optItemsArr[i]].id, true);
      //p.optObj[p._optItemsArr[i]].buttonMode = true;
      //$(p.domObj[p.optObj[p._optItemsArr[i]].id]).addClass("addPointer");
      //p.optObj[p._optItemsArr[i]].baseMc = null;
      p.optObj[p._optItemsArr[i]].x = p.optObj[p._optItemsArr[i]].origX;
      p.optObj[p._optItemsArr[i]].y = p.optObj[p._optItemsArr[i]].origY;

      $(p.domObj[p._optItemsArr[i]]).css({
        left: p.optObj[p._optItemsArr[i]].x + 'px',
        top: p.optObj[p._optItemsArr[i]].y + 'px'
      });
      /* p.optObj[p._optItemsArr[i]].origX = parseFloat($(p.domObj[p._optItemsArr[i]]).css("left"));
            p.optObj[p._optItemsArr[i]].origY = parseFloat($(p.domObj[p._optItemsArr[i]]).css("top"));
            p.optObj[p._optItemsArr[i]].isCorrect = false;
            p.optObj[p._optItemsArr[i]].type = "option";
            p.optObj[p._optItemsArr[i]].x = parseFloat($(p.domObj[p._optItemsArr[i]]).css("left"));
            p.optObj[p._optItemsArr[i]].y = parseFloat($(p.domObj[p._optItemsArr[i]]).css("top"));
            if (p._questionType == "Type4") {
                gotoAndStopDrop(p.baseObj[mcBase] , "_disable")
                $(mc).off("click", onOptionMcMouseClickEvent);
                $(mc).off("click", onOptionMcMouseClickedAfterSelectionEvent).on("click", onOptionMcMouseClickedAfterSelectionEvent);
                enableDisableSubmit(true);
            }
            if ((p._questionType == "Type1" && p._interactive) || (p._questionType == "Type2" && p._interactive) || (p._questionType == "Type3" && p._interactive)) {
                $(mc).off("click", onOptionMcMouseClickedAfterSelectionEvent).on("click", onOptionMcMouseClickedAfterSelectionEvent);
            } else {
				// came here for CNC_v3
                $(mc).off("click", onOptionMcMouseClickEvent).on("click", onOptionMcMouseClickEvent);
            }*/
    }
  }
  function type1_onOptionMcMouseClickEvent(mcOpt) {
    $(p.domObj[mcOpt]).off('click', onOptionMcMouseClickEvent);
    p.tweenArr.splice(0, p.tweenArr.length);
    //console.log("inside type1_onOptionMcMouseClickEvent ")
    //trace("type1_onOptionMcMouseClickEvent Reached Here:  " + mcOpt);
    var isAllSelected1 = true;
    for (var i1 = 0; i1 < p._baseItemsArr.length; i1++) {
      //var mcBaseItem1 = rootRef.getChildByName(p._baseItemsArr[i1]) as MovieClip
      var mcBaseItem1 = p._baseItemsArr[i1];
      //console.log(p.baseObj[mcBaseItem1].optMc)
      if (!p.baseObj[mcBaseItem1].optMc) {
        isAllSelected1 = false;
      }
    }
    if (isAllSelected1) {
      /////////////// plz chk before removing there in flash
      //p.currentBaseItem = -1;
      //console.log(isAllSelected1,"isAllSelected1",p.currentBaseItem )
    }

    if (!p._interactive && p._questionType == 'Type1') {
      if (p.dummyMc != null) {
        p.dummyMc.x = p.dummyMc.orgX;
        p.dummyMc.y = p.dummyMc.orgY;
        //p.currentBaseItem = 0;
      }
    }
    //console.log(p.currentBaseItem, "    ::  p.currentBaseItem")
    if (
      p.currentBaseItem != -1 &&
      p._baseItemsArr[p.currentBaseItem] &&
      p.baseObj[p._baseItemsArr[p.currentBaseItem]].currentCount <
        p.baseObj[p._baseItemsArr[p.currentBaseItem]].maxCount
    ) {
      //var mcBase:MovieClip = rootRef.getChildByName(p._baseItemsArr[p.currentBaseItem]) as MovieClip;
      var mcBase = p._baseItemsArr[p.currentBaseItem];
      mcOpt.baseMc = mcBase;
      p.baseObj[mcBase].optMc = mcOpt;
      p.dummyMc = mcOpt;
      p.dummyMc.orgX = p.dummyMc.x;
      p.dummyMc.orgY = p.dummyMc.y;
      p.baseObj[mcBase].currentCount++;
      if (p.baseObj[mcBase].currentCount < p.baseObj[mcBase].maxCount) {
        //mcBase.gotoAndStopDrop(1);
        gotoAndStopDrop(mcBase, '_normal');
        p.baseObj[mcBase].isHighlighted = false;
      } else {
        //mcBase.gotoAndStop("disable");
        gotoAndStopDrop(mcBase, '_disable');
        //trace("ccccccccccccccccccccccccccccc");
        p.baseObj[mcBase].isHighlighted = false;
      }
      //var xpos = mcBase.x;
      //var ypos = mcBase.y;
      var xpos = parseFloat($(p.domObj[mcBase]).css('left'));
      var ypos = parseFloat($(p.domObj[mcBase]).css('top'));

      if (p._questionType == 'Type3') {
        if (p.baseObj[mcBase].optMcArr.indexOf(mcOpt) == -1) {
          p.baseObj[mcBase].optMcArr.push(mcOpt);
        }
        ypos = getYPos(mcOpt);
        xpos = getXPos(mcOpt);
      }
      if (p._showTween) {
        /* rootRef.addChild(shp);
                p.myTweenX = new Tween(mcOpt, "x", Strong.easeInOut, mcOpt.x, xpos, p._tweenInterval, true);
                p.myTweenY = new Tween(mcOpt, "y", Strong.easeInOut, mcOpt.y, ypos, p._tweenInterval, true);
                p.tweenArr.push(p.myTweenX)
                p.tweenArr.push(p.myTweenY)
                p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish); */
        //console.log("inside _showTween ");
        if (
          !p._interactive &&
          p._questionType == 'Type1' &&
          p._baseItemsArr.length == 1
        ) {
          ////console.log("insidedejhkjlhjkhklhkjl")
          resetToOriginalPosition();
        }
        var baseW = parseFloat($(p.domObj[mcBase]).css('width')) / 2;
        var baseH = parseFloat($(p.domObj[mcBase]).css('height')) / 2;
        var optW = parseFloat($(p.domObj[mcOpt.id]).css('width')) / 2;
        var optH = parseFloat($(p.domObj[mcOpt.id]).css('height')) / 2;

        var _tempX = (_tempY = 0);
        if (Object.keys(p._positionOffsetObj).length) {
          if (p._positionOffsetObj[mcOpt.id]) {
            if (p._positionOffsetObj[mcOpt.id].x)
              _tempX = Number(p._positionOffsetObj[mcOpt.id].x);
            if (p._positionOffsetObj[mcOpt.id].y)
              _tempY = Number(p._positionOffsetObj[mcOpt.id].y);
          }
        } else {
          if (p._positionOffsetX) _tempX = Number(p._positionOffsetX);
          if (p._positionOffsetY) _tempY = Number(p._positionOffsetY);
        }
        disableActTemp(true);
        //console.log(xpos , baseW , optW , _tempX)
        $(p.domObj[mcOpt.id]).animate(
          {
            left: xpos + baseW - optW + _tempX,
            top: ypos + baseH - optH + _tempY
          },
          500,
          function() {
            disableActTemp(false);
          }
        );
      } else {
        mcOpt.x = xpos;
        mcOpt.y = ypos;
      }
      mouseOverDrag(mcOpt.id, true);
      mcOpt.buttonMode = true;
      $(p.domObj[mcOpt.id]).addClass('addPointer');
      //mcOpt.gotoAndStop("_up");
      gotoAndStopDrag(mcOpt.id, '_normal');
      if (p.selectedMc) {
        mouseOverDrag(p.selectedMc.id, true);
        //gotoAndStopDrag(p.selectedMc.id, 1);
        gotoAndStopDrag(p.selectedMc.id, '_normal');
        p.selectedMc.buttonMode = true;
        $(p.domObj[p.selectedMc.id]).addClass('addPointer');
        p.selectedMc = null;
      }
      if (!p._interactive && p._questionType == 'Type1') {
      } else {
        $(p.domObj[mcOpt.id]).off('click', onOptionMcMouseClickEvent);
        $(p.domObj[mcOpt.id]).off(
          'click',
          onOptionMcMouseClickedAfterSelectionEvent
        );
        $(p.domObj[mcOpt.id])
          .off('click', onOptionMcMouseClickedAfterSelectionEvent)
          .on('click', onOptionMcMouseClickedAfterSelectionEvent);
      }
      enableDisableReset(true);
      var isAllSelected = true;
      var mcBaseItem;
      var i;
      if (!p._interactive) {
        if (p._questionType == 'Type3') {
          enableDisableSubmit(true);
          if (p.currentBaseItem < p._baseItemsArr.length - 1) {
            p.currentBaseItem++;
            higlightBaseItem();
          } else if (p.currentBaseItem == p._baseItemsArr.length - 1) {
            p.currentBaseItem = 0;
            higlightBaseItem();
          }
        } else {
          if (p.currentBaseItem < p._baseItemsArr.length - 1) {
            var _index;
            if (p._baseItemsArr.length > 1) {
              _index = getCurrentBaseIndex();
            } else {
              _index = 0;
            }
            p.currentBaseItem = _index;

            higlightBaseItem();
          } else {
            isAllSelected = true;
            for (i = 0; i < p._baseItemsArr.length; i++) {
              //mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
              mcBaseItem = p._baseItemsArr[i];
              if (!p.baseObj[mcBaseItem].optMc) {
                isAllSelected = false;
              }
            }
            if (isAllSelected) {
              //p.currentBaseItem = -1;    check here
              //trace("ttttttttttttttttttttttttttttttttttttttttt");
              enableDisableSubmit(true);
            } else {
              p.currentBaseItem = 0;
              higlightBaseItem();
            }
          }
        }
      } else {
        //p.currentBaseItem = -1;  //check hrererer
        isAllSelected = true;
        for (i = 0; i < p._baseItemsArr.length; i++) {
          //mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
          mcBaseItem = p._baseItemsArr[i];
          if (!p.baseObj[mcBaseItem].optMc) {
            isAllSelected = false;
          }
        }
        if (isAllSelected) {
          enableDisableSubmit(true);
        }
      }
    } else {
      onOptionMcMouseClickedAfterSelectionMc(mcOpt.id);
      //=================================================
      if (p._baseItemsArr.length == 1) {
        var mcBase =
          p._baseItemsArr[p.currentBaseItem == -1 ? 0 : p.currentBaseItem];
        mcOpt.baseMc = mcBase;
        p.baseObj[mcBase].optMc = mcOpt;
        p.dummyMc = mcOpt;
        p.dummyMc.orgX = p.dummyMc.x;
        p.dummyMc.orgY = p.dummyMc.y;
        p.baseObj[mcBase].currentCount++;
        if (p.baseObj[mcBase].currentCount < p.baseObj[mcBase].maxCount) {
          //mcBase.gotoAndStopDrop(1);
          gotoAndStopDrop(mcBase, '_normal');
          p.baseObj[mcBase].isHighlighted = false;
        } else {
          //mcBase.gotoAndStop("disable");
          gotoAndStopDrop(mcBase, '_disable');
          //trace("ccccccccccccccccccccccccccccc");
          p.baseObj[mcBase].isHighlighted = false;
        }
        //var xpos = mcBase.x;
        //var ypos = mcBase.y;
        var xpos = parseFloat($(p.domObj[mcBase]).css('left'));
        var ypos = parseFloat($(p.domObj[mcBase]).css('top'));

        if (p._questionType == 'Type3') {
          if (p.baseObj[mcBase].optMcArr.indexOf(mcOpt) == -1) {
            p.baseObj[mcBase].optMcArr.push(mcOpt);
          }
          ypos = getYPos(mcOpt);
          xpos = getXPos(mcOpt);
        }
        if (p._showTween) {
          /* rootRef.addChild(shp);
                p.myTweenX = new Tween(mcOpt, "x", Strong.easeInOut, mcOpt.x, xpos, p._tweenInterval, true);
                p.myTweenY = new Tween(mcOpt, "y", Strong.easeInOut, mcOpt.y, ypos, p._tweenInterval, true);
                p.tweenArr.push(p.myTweenX)
                p.tweenArr.push(p.myTweenY)
                p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish); */
          //console.log("inside _showTween ");
          if (
            !p._interactive &&
            p._questionType == 'Type1' &&
            p._baseItemsArr.length == 1
          ) {
            ////console.log("insidedejhkjlhjkhklhkjl")
            resetToOriginalPosition();
          }
          var baseW = parseFloat($(p.domObj[mcBase]).css('width')) / 2;
          var baseH = parseFloat($(p.domObj[mcBase]).css('height')) / 2;
          var optW = parseFloat($(p.domObj[mcOpt.id]).css('width')) / 2;
          var optH = parseFloat($(p.domObj[mcOpt.id]).css('height')) / 2;

          var _tempX = (_tempY = 0);
          if (Object.keys(p._positionOffsetObj).length) {
            if (p._positionOffsetObj[mcOpt.id]) {
              if (p._positionOffsetObj[mcOpt.id].x)
                _tempX = Number(p._positionOffsetObj[mcOpt.id].x);
              if (p._positionOffsetObj[mcOpt.id].y)
                _tempY = Number(p._positionOffsetObj[mcOpt.id].y);
            }
          } else {
            if (p._positionOffsetX) _tempX = Number(p._positionOffsetX);
            if (p._positionOffsetY) _tempY = Number(p._positionOffsetY);
          }
          disableActTemp(true);
          //console.log(xpos , baseW , optW , _tempX)
          $(p.domObj[mcOpt.id]).animate(
            {
              left: xpos + baseW - optW + _tempX,
              top: ypos + baseH - optH + _tempY
            },
            500,
            function() {
              disableActTemp(false);
            }
          );
        } else {
          mcOpt.x = xpos;
          mcOpt.y = ypos;
        }
        mouseOverDrag(mcOpt.id, true);
        mcOpt.buttonMode = true;
        $(p.domObj[mcOpt.id]).addClass('addPointer');
        //mcOpt.gotoAndStop("_up");
        gotoAndStopDrag(mcOpt.id, '_normal');
        if (p.selectedMc) {
          mouseOverDrag(p.selectedMc.id, true);
          //gotoAndStopDrag(p.selectedMc.id, 1);
          gotoAndStopDrag(p.selectedMc.id, '_normal');
          p.selectedMc.buttonMode = true;
          $(p.domObj[p.selectedMc.id]).addClass('addPointer');
          p.selectedMc = null;
        }
        if (!p._interactive && p._questionType == 'Type1') {
        } else {
          $(p.domObj[mcOpt.id]).off('click', onOptionMcMouseClickEvent);
          $(p.domObj[mcOpt.id]).off(
            'click',
            onOptionMcMouseClickedAfterSelectionEvent
          );
          $(p.domObj[mcOpt.id])
            .off('click', onOptionMcMouseClickedAfterSelectionEvent)
            .on('click', onOptionMcMouseClickedAfterSelectionEvent);
        }
        enableDisableReset(true);
        var isAllSelected = true;
        var mcBaseItem;
        var i;
        if (!p._interactive) {
          if (p._questionType == 'Type3') {
            enableDisableSubmit(true);
            if (p.currentBaseItem < p._baseItemsArr.length - 1) {
              p.currentBaseItem++;
              higlightBaseItem();
            } else if (p.currentBaseItem == p._baseItemsArr.length - 1) {
              p.currentBaseItem = 0;
              higlightBaseItem();
            }
          } else {
            if (p.currentBaseItem < p._baseItemsArr.length - 1) {
              var _index;
              if (p._baseItemsArr.length > 1) {
                _index = getCurrentBaseIndex();
              } else {
                _index = 0;
              }
              p.currentBaseItem = _index;

              higlightBaseItem();
            } else {
              isAllSelected = true;
              for (i = 0; i < p._baseItemsArr.length; i++) {
                //mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
                mcBaseItem = p._baseItemsArr[i];
                if (!p.baseObj[mcBaseItem].optMc) {
                  isAllSelected = false;
                }
              }
              if (isAllSelected) {
                //p.currentBaseItem = -1;    check here
                //trace("ttttttttttttttttttttttttttttttttttttttttt");
                enableDisableSubmit(true);
              } else {
                p.currentBaseItem = 0;
                higlightBaseItem();
              }
            }
          }
        } else {
          //p.currentBaseItem = -1;  //check hrererer
          isAllSelected = true;
          for (i = 0; i < p._baseItemsArr.length; i++) {
            //mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
            mcBaseItem = p._baseItemsArr[i];
            if (!p.baseObj[mcBaseItem].optMc) {
              isAllSelected = false;
            }
          }
          if (isAllSelected) {
            enableDisableSubmit(true);
          }
        }
      }
      //=================================================
    }

    //======================================================
    // when reset is called after some are correct - 1/31/2016
    var isAllSelected = true;
    for (i = 0; i < p._baseItemsArr.length; i++) {
      var BaseItem = p._baseItemsArr[i];
      if (!p.baseObj[BaseItem].optMc) {
        isAllSelected = false;
      }
    }
    if (isAllSelected) {
      enableDisableSubmit(true);
    } else {
      enableDisableSubmit(false);
    }
    //===========================================================
  }
  function getCurrentBaseIndex() {
    var _index;
    for (var i1 = 0; i1 < p._baseItemsArr.length; i1++) {
      var mcBaseItem1 = p._baseItemsArr[i1];
      if (!p.baseObj[mcBaseItem1].optMc) {
        _index = i1;
        isAllSelected1 = false;
        break;
      }
    }

    /*
		for (i = 0; i < p._baseItemsArr.length; i++){
			mc = p.baseObj[p._baseItemsArr[i]];
			isCorrect = false;
			if (mc.optMc) {
				gotoAndStopDrag(mc.optMc.id, "_normal");
				var tmpoId = Number((mc.id).split("_")[1]);
				corrAns = String(p._correctAnswers[tmpoId - 1]).split(",");
				for (j = 0; j < corrAns.length; j++) {
					var optnId = Number((mc.optMc.id).split("_")[1])
					if(optnId == Number(corrAns[j])){
						isCorrect = true;
					}
				}
				if (!isCorrect) {
					_index = i;
				}
			}
		}*/
    return _index;
  }

  function initOptionItems() {
    // pr
    for (var i = 0; i < p._optItemsArr.length; i++) {
      gotoAndStopDrag(p._optItemsArr[i], '_normal');
      var mc = p.domObj[p._optItemsArr[i]];
      p.optObj[p._optItemsArr[i]].id = p._optItemsArr[i];
      mouseOverDrag(p.optObj[p._optItemsArr[i]].id, true);
      p.optObj[p._optItemsArr[i]].buttonMode = true;
      $(p.domObj[p.optObj[p._optItemsArr[i]].id]).addClass('addPointer');
      p.optObj[p._optItemsArr[i]].baseMc = null;
      p.optObj[p._optItemsArr[i]].origX = parseFloat(
        $(p.domObj[p._optItemsArr[i]]).css('left')
      );
      p.optObj[p._optItemsArr[i]].origY = parseFloat(
        $(p.domObj[p._optItemsArr[i]]).css('top')
      );
      p.optObj[p._optItemsArr[i]].isCorrect = false;
      p.optObj[p._optItemsArr[i]].type = 'option';
      p.optObj[p._optItemsArr[i]].x = parseFloat(
        $(p.domObj[p._optItemsArr[i]]).css('left')
      );
      p.optObj[p._optItemsArr[i]].y = parseFloat(
        $(p.domObj[p._optItemsArr[i]]).css('top')
      );
      if (p._questionType == 'Type4') {
        gotoAndStopDrop(p.baseObj[mcBase], '_disable');
        $(mc).off('click', onOptionMcMouseClickEvent);
        $(mc)
          .off('click', onOptionMcMouseClickedAfterSelectionEvent)
          .on('click', onOptionMcMouseClickedAfterSelectionEvent);
        enableDisableSubmit(true);
      }
      if (
        (p._questionType == 'Type1' && p._interactive) ||
        (p._questionType == 'Type2' && p._interactive) ||
        (p._questionType == 'Type3' && p._interactive)
      ) {
        $(mc)
          .off('click', onOptionMcMouseClickedAfterSelectionEvent)
          .on('click', onOptionMcMouseClickedAfterSelectionEvent);
      } else {
        // came here for CNC_v3
        $(mc)
          .off('click', onOptionMcMouseClickEvent)
          .on('click', onOptionMcMouseClickEvent);
      }
    }
  }

  function showHandCursorOnBaseMc() {
    //console.log("showHandCursorOnBaseMc")
    if (!(p._interactive && p._questionType == 'Type4')) {
      for (var i = 0; i < p._baseItemsArr.length; i++) {
        //var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        var mc = p.baseObj[p._baseItemsArr[i]];
        mc.buttonMode = true;
        $(p.domObj[p._baseItemsArr[i]]).addClass('addPointer');
      }
    }
  }

  function hideHandCursorOnBaseMc() {
    if (!(p._interactive && p._questionType == 'Type4')) {
      for (var i = 0; i < p._baseItemsArr.length; i++) {
        //var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        //var mc = $(p.target).children("#"+p._baseItemsArr[i]);
        //mc.buttonMode = false;
        var mc = p.baseObj[p._baseItemsArr[i]];
        mc.buttonMode = false;
        $(p.domObj[p._baseItemsArr[i]]).removeClass('addPointer');
      }
    }
  }

  function onOptionMcMouseClickedAfterSelectionEvent(e) {
    //var mcOpt:MovieClip = e.currentTarget as MovieClip;
    var mcOpt = e.currentTarget.id;
    onOptionMcMouseClickedAfterSelectionMc(mcOpt);
    //trace("p.selectedMc: "+p.selectedMc );
    if (p.selectedMc) {
      showHandCursorOnBaseMc();
    } else {
      hideHandCursorOnBaseMc();
    }
  }

  function onOptionMcMouseClickedAfterSelectionMc(mcOpt) {
    //mcOpt:MovieClip
    //trace("onOptionMcMouseClickedAfterSelectionEvent: " + mcOpt.name);
    if (p.currentBaseItem != -1 && p._baseItemsArr[p.currentBaseItem]) {
      //	var mcBase:MovieClip = (rootRef.getChildByName(p._baseItemsArr[p.currentBaseItem]) as MovieClip);
      var mcBase = p._baseItemsArr[p.currentBaseItem];
      if (p.baseObj[mcBase].currentCount >= p.baseObj[mcBase].maxCount) {
        gotoAndStopDrop(mcBase, '_disable');
        p.baseObj[mcBase].isHighlighted = false;
      } else {
        //gotoAndStopDrop(mcBase, 1)
        gotoAndStopDrop(mcBase, '_normal');
        p.baseObj[mcBase].isHighlighted = false;
      }
      p.currentBaseItem = -1;
    }
    //trace(mcOpt +" :::::::::::::::::: " + p.selectedMc )
    if (p.selectedMc == null) {
      p.selectedMc = p.optObj[mcOpt];
      mouseOverDrag(p.optObj[mcOpt].id, false);
      p.optObj[mcOpt].buttonMode = false;
      $(p.domObj[p.optObj[mcOpt].id]).removeClass('addPointer');
      //mcOpt.gotoAndStop("_selected");
      gotoAndStopDrag(mcOpt, '_selected');
      //trace("p.selectedMc.name: " + p.selectedMc.name);
    }
    //else if (p.selectedMc !=  null && p.currentBaseItem == -1 && !p.selectedMc.baseMc && !p.optObj[mcOpt].baseMc)
    else if (
      p.selectedMc != null &&
      p.currentBaseItem == -1 &&
      !p.selectedMc.baseMc &&
      !p.optObj[mcOpt].baseMc
    ) {
      //console.log("dseeeeeeeeeee", p.optObj[mcOpt].baseMc)
      mouseOverDrag(p.selectedMc.id, true);
      p.selectedMc.buttonMode = true;
      $(p.domObj[p.selectedMc.id]).addClass('addPointer');
      //p.selectedMc.gotoAndStop(1)
      //gotoAndStopDrag(p.selectedMc.id, 1);
      gotoAndStopDrag(p.selectedMc.id, '_normal');
      p.selectedMc = p.optObj[mcOpt];
      //p.selectedMc = mcOpt;
      mouseOverDrag(p.optObj[mcOpt].id, false);
      p.optObj[mcOpt].buttonMode = false;
      $(p.domObj[p.optObj[mcOpt].id]).removeClass('addPointer');
      //mcOpt.gotoAndStop("_selected");
      gotoAndStopDrag(mcOpt, '_selected');
      //trace("p.selectedMc.name: " + p.selectedMc.name);
    } else if (p.selectedMc.id == mcOpt) {
      //console.log("came", p.selectedMc.id, mcOpt)
      p.selectedMc = null;
      //mcOpt.gotoAndStop(1);
      //gotoAndStopDrag(mcOpt, 1);
      gotoAndStopDrag(mcOpt, '_normal');
      mouseOverDrag(p.optObj[mcOpt].id, true);
      p.optObj[mcOpt].buttonMode = true;
      $(p.domObj[p.optObj[mcOpt].id]).addClass('addPointer');
      if (p._interactive) {
        p.currentBaseItem = -1;
      } else {
        var isAllSelected = true;
        for (var i = 0; i < p._baseItemsArr.length; i++) {
          //var mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
          if (!p.baseObj[p._baseItemsArr[i]].optMc) {
            isAllSelected = false;
          }
        }
        if (isAllSelected) {
          p.currentBaseItem = -1;
        } else {
          p.currentBaseItem = 0;
        }
      }
      //console.log("casssme",p.selectedMc.id,mcOpt)
      higlightBaseItem();
    } else {
      if (p.selectedMc.type == 'option' || p.selectedMc.type == 'created') {
        if (
          p.selectedMc.baseMc ||
          p.optObj[mcOpt].baseMc ||
          p._questionType == 'Type2'
        ) {
          p.optObj[mcOpt].buttonMode = false;
          $(p.domObj[p.optObj[mcOpt].id]).removeClass('addPointer');
          //mcOpt.gotoAndStop("_selected");
          gotoAndStopDrag(mcOpt, '_selected');
          if (
            p._questionType == 'Type2' &&
            xor(p.selectedMc.baseMc, p.optObj[mcOpt].baseMc)
          ) {
            swapOptionsMc_type2(p.selectedMc, mcOpt);
            enableDisableReset(true);
          } else if (p.selectedMc.baseMc && p.optObj[mcOpt].baseMc) {
            swapOptionsMc(p.selectedMc, p.optObj[mcOpt]);
            enableDisableReset(true);
          } else if (xor(p.selectedMc.baseMc, p.optObj[mcOpt].baseMc)) {
            swapOptionsMc_withNoBase(p.selectedMc, p.optObj[mcOpt]);
          } else {
            //p.selectedMc.gotoAndStop(1);
            //gotoAndStopDrag(p.selectedMc.id, 1);
            gotoAndStopDrag(p.selectedMc.id, '_normal');
            //p.selectedMc.buttonMode = true;
            p.selectedMc.buttonMode = true;
            $(p.domObj[p.selectedMc.id]).addClass('addPointer');
            p.selectedMc = null;
            //mcOpt.gotoAndStop(1);
            //gotoAndStopDrag(mcOpt, 1);
            gotoAndStopDrag(mcOpt, '_normal');
            p.optObj[mcOpt].buttonMode = true;
            $(p.domObj[p.optObj[mcOpt].id]).addClass('addPointer');
          }
          p.selectedMc = null;
          //trace("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          if (p._interactive) {
            p.currentBaseItem = -1;
          } else {
            p.currentBaseItem = 0;
            //console.log("casssmsssssssse", p.selectedMc.id, mcOpt)
            higlightBaseItem();
          }
        }
      }
    }
  }

  function mouseOverDrag(tid, dFlag) {
    if (dFlag) {
      $(p.domObj[tid])
        .off('mousemove', highlightDrag)
        .on('mousemove', highlightDrag);
      $(p.domObj[tid])
        .off('mouseout', highlightDrag)
        .on('mouseout', highlightDrag);
    } else {
      $(p.domObj[tid]).off('mousemove', highlightDrag);
      $(p.domObj[tid]).off('mouseout', highlightDrag);
    }
  }

  function highlightDrag(e) {
    if (e.type == 'mousemove') {
      gotoAndStopDrag(e.currentTarget.id, '_over');
    } else if (e.type == 'mouseout') {
      //gotoAndStopDrag(e.target.id, 1)
      gotoAndStopDrag(e.currentTarget.id, '_normal');
    }
  }

  function xor(lhs, rhs) {
    //console.log(!(lhs && rhs) && (lhs || rhs), "xor")
    return !(lhs && rhs) && (lhs || rhs);
  }

  function swapOptionsMc_withNoBase(mc1, mc2) {
    //console.log("==swapOptionsMc_withNoBaseMc before==", mc1.baseMc, mc2.baseMc);
    var tempMc;
    tempMc = mc1.baseMc;
    mc1.baseMc = mc2.baseMc;
    mc2.baseMc = tempMc;
    var m;
    //console.log("==swapOptionsMc_withNoBaseMc==", mc1.baseMc, mc2.baseMc);
    if (!mc1.baseMc) {
      mc1.x = mc1.origX;
      mc1.y = mc1.origY;
      /* $("#"+mcOpt.id).animate({ 
                "left":xpos+baseW-optW,
                "top":ypos+baseH-optH
                }, 500 ); */
      $(p.domObj[mc1.id]).css({
        left: mc1.origX,
        top: mc1.origY
      });
      //gotoAndStopDrag(mc1.id, 1);
      gotoAndStopDrag(mc1.id, '_normal');
      mc1.buttonMode = true;
      mouseOverDrag(mc1.id, true);
      $(p.domObj[mc1.id]).addClass('addPointer');
      /* mc1.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                mc1.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                mc1.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent); */
      $(mc1.id).off('click', onOptionMcMouseClickedAfterSelectionEvent);
      $(mc1.id).off('click', onOptionMcMouseClickEvent);
      $(mc1.id)
        .off('click', onOptionMcMouseClickEvent)
        .on('click', onOptionMcMouseClickEvent);
    }
    if (!mc2.baseMc) {
      //console.log("hiiiii1111111111")
      mc2.x = mc2.origX;
      mc2.y = mc2.origY;
      $(p.domObj[mc2.id]).css({
        left: mc2.origX,
        top: mc2.origY
      });
      //gotoAndStopDrag(mc2.id, 1);
      gotoAndStopDrag(mc2.id, '_normal');
      mouseOverDrag(mc2.id, true);
      mc2.buttonMode = true;
      $(p.domObj[mc2.id]).addClass('addPointer');
      $(mc2.id).off('click', onOptionMcMouseClickedAfterSelectionEvent);
      $(mc2.id).off('click', onOptionMcMouseClickEvent);
      $(mc2.id)
        .off('click', onOptionMcMouseClickEvent)
        .on('click', onOptionMcMouseClickEvent);
    }
    if (mc1.baseMc) {
      //console.log("hi222222222222")
      p.baseObj[mc1.baseMc].currentCount--;
      p.baseObj[mc1.baseMc].optMc = mc1;
      if (p.baseObj[mc1.baseMc].optMcArr.indexOf(mc2.id) != -1) {
        p.baseObj[mc1.baseMc].optMcArr.splice(
          p.baseObj[mc1.baseMc].optMcArr.indexOf(mc2.id),
          1
        );
      }
      p.baseObj[mc1.baseMc].currentCount =
        p.baseObj[mc1.baseMc].optMcArr.length;
      for (var m = 0; m < p.baseObj[mc1.baseMc].optMcArr.length; m++) {
        p.baseObj[mc1.baseMc].optMcArr[m].x = getXPos(
          p.baseObj[mc1.baseMc].optMcArr[m]
        );
        p.baseObj[mc1.baseMc].optMcArr[m].y = getYPos(
          p.baseObj[mc1.baseMc].optMcArr[m]
        );
      }
      //gotoAndStopDrag(mc1.id, 1);
      gotoAndStopDrag(mc1.id, '_normal');
      mouseOverDrag(mc1.id, true);
      mc1.buttonMode = true;
      $(p.domObj[mc1.id]).addClass('addPointer');
      //{
      //p.currentBaseItem = int(mc1.baseMc.id) - 1;
      p.currentBaseItem = Number(p.baseObj[mc1.baseMc].id.split('_')[1]) - 1;
      //}
      mc1.baseMc = null;
      type1_onOptionMcMouseClickEvent(mc1);
    }
    if (mc2.baseMc) {
      p.baseObj[mc2.baseMc].currentCount--;
      //console.log("hi3333333333333 before", p.baseObj[mc2.baseMc].optMcArr)
      p.baseObj[mc2.baseMc].optMc = mc2;
      //console.log("hi3333333333333", p.baseObj[mc2.baseMc].optMcArr)
      if (p.baseObj[mc2.baseMc].optMcArr.indexOf(mc1.id) != -1) {
        p.baseObj[mc2.baseMc].optMcArr.splice(
          p.baseObj[mc2.baseMc].optMcArr.indexOf(mc1.id),
          1
        );
      }
      p.baseObj[mc2.baseMc].currentCount =
        p.baseObj[mc2.baseMc].optMcArr.length;
      for (var m = 0; m < p.baseObj[mc2.baseMc].optMcArr.length; m++) {
        p.baseObj[mc2.baseMc].optMcArr[m].x = getXPos(
          p.baseObj[mc2.baseMc].optMcArr[m]
        );
        p.baseObj[mc2.baseMc].optMcArr[m].y = getYPos(
          p.baseObj[mc2.baseMc].optMcArr[m]
        );
      }
      //gotoAndStopDrag(mc2.id, 1);
      gotoAndStopDrag(mc2.id, '_normal');
      mouseOverDrag(mc2.id, true);
      mc2.buttonMode = true;
      $(p.domObj[mc2.id]).addClass('addPointer');
      //{
      //p.currentBaseItem = int(mc2.baseMc.id) - 1;
      p.currentBaseItem = Number(p.baseObj[mc2.baseMc].id.split('_')[1]) - 1;
      //}
      mc2.baseMc = null;
      if (!p._interactive) {
        var isAllSelected = true;
        for (var i = 0; i < p._baseItemsArr.length; i++) {
          //var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
          var mc = p._baseItemsArr[i];
          if (!mc.optMc) {
            isAllSelected = false;
          }
        }
        if (isAllSelected) {
          p.currentBaseItem = -1;
        }
      }
      type1_onOptionMcMouseClickEvent(mc2);
    }
  }

  function getXPos(mc) {
    var xpos = mc.baseMc.x;
    var totWidth = 0;
    if (p._dropPosition == 'Horizontal') {
      var endPos = mc.baseMc.optMcArr.indexOf(mc);
      for (var i = 1; i <= endPos; i++) {
        totWidth += mc.baseMc.optMcArr[i].width + p._positionOffset;
      }
    }
    xpos += totWidth;
    return xpos;
  }

  function getYPos(mc) {
    var ypos = mc.baseMc.y;
    var totHeight = 0;
    if (p._dropPosition == 'Vertical') {
      var endPos = mc.baseMc.optMcArr.indexOf(mc);
      for (var i = 1; i <= endPos; i++) {
        totHeight += mc.baseMc.optMcArr[i].height + p._positionOffset;
      }
    }
    ypos += totHeight;
    return ypos;
  }

  function swapOptionsMc_type2(mc1, mc2) {
    //console.log("swapOptionsMc_type2")
    /* var tempMc:MovieClip;
			
        tempMc = mc1.baseMc;
        mc1.baseMc = mc2.baseMc;
        mc2.baseMc = tempMc;
			
        if (mc1.baseMc)
        {
        	mc1.gotoAndStop(1);
        	mc1.buttonMode = true;
        	if (p._interactive)
        	{
        		p.currentBaseItem = -1;
        	}
        	else
        	{
        		p.currentBaseItem = int(mc1.baseMc.id) - 1;
        	}
        	mc1.baseMc = null;
        	type2_onOptionMcMouseClickEvent(mc1);
        	mc1.removeEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc1.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc1.buttonMode = true;
        }
        else
        {
        	type2_holderMc.removeChild(mc1);
        }
        if (mc2.baseMc)
        {
        	mc2.gotoAndStop(1);
        	mc2.buttonMode = true;
        	if (p._interactive)
        	{
        		p.currentBaseItem = -1;
        	}
        	else
        	{
        		p.currentBaseItem = int(mc2.baseMc.id) - 1;
        	}
        	mc2.baseMc = null;
        	type2_onOptionMcMouseClickEvent(mc2);
        	mc2.removeEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc2.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc2.buttonMode = true;
        }
        else
        {
        	type2_holderMc.removeChild(mc2);
        } */
  }

  function swapOptionsMc(mc1, mc2) {
    var tempMc;
    tempMc = mc1.baseMc;
    mc1.baseMc = mc2.baseMc;
    mc2.baseMc = tempMc;
    p.baseObj[mc1.baseMc].optMc = mc1;
    p.baseObj[mc2.baseMc].optMc = mc2;
    //var xpos1 = mc1.baseMc.x;
    //var ypos1 = mc1.baseMc.y;
    var xpos1 = parseFloat($(p.domObj[mc1.baseMc]).css('left'));
    var ypos1 = parseFloat($(p.domObj[mc1.baseMc]).css('top'));
    //var xpos2= mc2.baseMc.x;
    //var ypos2 = mc2.baseMc.y;
    var xpos2 = parseFloat($(p.domObj[mc2.baseMc]).css('left'));
    var ypos2 = parseFloat($(p.domObj[mc2.baseMc]).css('top'));
    //trace("================swap===========================");
    if (p._questionType == 'Type3') {
      //trace(mc1.baseMc.optMcArr);
      //trace(mc2.baseMc.optMcArr);
      var ind1 = p.baseObj[mc2.baseMc].optMcArr.indexOf(mc1.id);
      var ind2 = p.baseObj[mc1.baseMc].optMcArr.indexOf(mc2.id);
      p.baseObj[mc2.baseMc].optMcArr[ind1] = mc2;
      p.baseObj[mc1.baseMc].optMcArr[ind2] = mc1;
      //trace(mc1.baseMc.optMcArr);
      //trace(mc2.baseMc.optMcArr);
      xpos1 = getXPos(mc1);
      ypos1 = getYPos(mc1);
      xpos2 = getXPos(mc2);
      ypos2 = getYPos(mc2);
    }
    p.tweenArr.splice(0, p.tweenArr.length);
    if (p._showTween) {
      /* rootRef.addChild(shp);
            p.myTweenX = new Tween(mc1, "x", Strong.easeInOut, mc1.x,xpos1, p._tweenInterval, true);
            p.myTweenY = new Tween(mc1, "y", Strong.easeInOut, mc1.y,ypos1, p._tweenInterval, true);
            p.myTweenX1 = new Tween(mc2, "x", Strong.easeInOut, mc2.x,xpos2, p._tweenInterval, true);
            p.myTweenY1 = new Tween(mc2, "y", Strong.easeInOut, mc2.y, ypos2, p._tweenInterval, true);
            p.tweenArr.push(p.myTweenX)
            p.tweenArr.push(p.myTweenY)
            p.tweenArr.push(p.myTweenX1)
            p.tweenArr.push(p.myTweenY1)
            p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish); */
      var baseW1 = parseFloat($(p.domObj[mc1.baseMc]).css('width')) / 2;
      var baseH1 = parseFloat($(p.domObj[mc1.baseMc]).css('height')) / 2;
      var optW1 = parseFloat($(p.domObj[mc1.id]).css('width')) / 2;
      var optH1 = parseFloat($(p.domObj[mc1.id]).css('height')) / 2;
      var baseW2 = parseFloat($(p.domObj[mc1.baseMc]).css('width')) / 2;
      var baseH2 = parseFloat($(p.domObj[mc1.baseMc]).css('height')) / 2;
      var optW2 = parseFloat($(p.domObj[mc2.id]).css('width')) / 2;
      var optH2 = parseFloat($(p.domObj[mc2.id]).css('height')) / 2;
      //console.log(baseW1, baseH1, optW1, optH1, "")
      var _tempX = (_tempY = _tempX1 = _tempY1 = 0);
      if (Object.keys(p._positionOffsetObj).length) {
        //mc1
        if (p._positionOffsetObj[mc1.id]) {
          if (p._positionOffsetObj[mc1.id].x)
            _tempX = Number(p._positionOffsetObj[mc1.id].x);
          if (p._positionOffsetObj[mc1.id].y)
            _tempY = Number(p._positionOffsetObj[mc1.id].y);
        }
        //mc2
        if (p._positionOffsetObj[mc2.id]) {
          if (p._positionOffsetObj[mc2.id].x)
            _tempX1 = Number(p._positionOffsetObj[mc2.id].x);
          if (p._positionOffsetObj[mc2.id].y)
            _tempY1 = Number(p._positionOffsetObj[mc2.id].y);
        }
      } else {
        if (p._positionOffsetX) _tempX = _tempX1 = Number(p._positionOffsetX);
        if (p._positionOffsetY) _tempY = _tempY1 = Number(p._positionOffsetY);
      }

      disableActTemp(true);
      $(p.domObj[mc1.id]).animate(
        {
          left: xpos1 + baseW1 - optW1 + _tempX,
          top: ypos1 + baseH1 - optH1 + _tempY
        },
        500
      );
      $(p.domObj[mc2.id]).animate(
        {
          left: xpos2 + baseW2 - optW2 + _tempX1,
          top: ypos2 + baseH2 - optH2 + _tempY1
        },
        500,
        function() {
          disableActTemp(false);
        }
      );
    } else {
      var baseW1 = parseFloat($(p.domObj[mc1.baseMc]).css('width')) / 2;
      var baseH1 = parseFloat($(p.domObj[mc1.baseMc]).css('height')) / 2;
      var optW1 = parseFloat($(p.domObj[mc1.id]).css('width')) / 2;
      var optH1 = parseFloat($(p.domObj[mc1.id]).css('height')) / 2;
      var baseW2 = parseFloat($(p.domObj[mc1.baseMc]).css('width')) / 2;
      var baseH2 = parseFloat($(p.domObj[mc1.baseMc]).css('height')) / 2;
      var optW2 = parseFloat($(p.domObj[mc2.id]).css('width')) / 2;
      var optH2 = parseFloat($(p.domObj[mc2.id]).css('height')) / 2;
      mc1.x = xpos1;
      mc1.y = ypos1;
      mc2.x = xpos2;
      mc2.y = ypos2;
      $(p.domObj[mc1.id]).css(
        {
          left: xpos1 + baseW1 - optW1,
          top: ypos1 + baseH1 - optH1
        },
        500
      );
      $(p.domObj[mc2.id]).css(
        {
          left: xpos2 + baseW2 - optW2,
          top: ypos2 + baseH2 - optH2
        },
        500
      );
    }
    gotoAndStopDrag(mc1.id, '_normal');
    gotoAndStopDrag(mc2.id, '_normal');
    mouseOverDrag(mc1.id, true);
    mouseOverDrag(mc2.id, true);
    mc1.buttonMode = true;
    mc2.buttonMode = true;
    $(p.domObj[mc1.id]).addClass('addPointer');
    $(p.domObj[mc2.id]).addClass('addPointer');
    /* mc1.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
            mc1.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);
            mc2.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
            mc2.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent); */
    $(mc1.id).off('click', onOptionMcMouseClickedAfterSelectionEvent);
    $(mc1.id)
      .off('click', onOptionMcMouseClickedAfterSelectionEvent)
      .on('click', onOptionMcMouseClickedAfterSelectionEvent);
    $(mc2.id).off('click', onOptionMcMouseClickedAfterSelectionEvent);
    $(mc2.id)
      .off('click', onOptionMcMouseClickedAfterSelectionEvent)
      .on('click', onOptionMcMouseClickedAfterSelectionEvent);
  }

  function onOptionMcMouseClickEvent(e) {
    if (p._questionType == 'Type1') {
      if (
        p.optObj[e.currentTarget.id].baseMc == null ||
        Object.keys(p.baseObj).length == 1
      )
        type1_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
    if (p._questionType == 'Type2') {
      type2_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
    if (p._questionType == 'Type3') {
      type3_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
  }

  function validateCAC(e) {
    //pr e:MouseEvent = null
    //console.log("inside validateCAC");
    submitCnt = true;
    enableDisableSubmit(false);
    enableDisableReset(false);
    p.allCorrect = true;
    var mc;
    var i;
    var j;
    var corrAns = [];
    var isCorrect = false;
    //console.log("Called validateCAC")
    if (p._questionType == 'Type3') {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        isCorrect = true;
        for (var m = 0; m < mc.optMcArr.length; m++) {
          var mcOptArrMc = mc.optMcArr[m];
          //console.log(mcOptArrMc, "mcOptArrMc")
          mcOptArrMc.gotoAndStop(1);
          corrAns = String(p._correctAnswers[mc.id - 1]).split(',');
          for (j = 0; j < corrAns.length; j++) {
            if (mcOptArrMc.id == Number(corrAns[j])) {
              mcOptArrMc.isCorrect = true;
              mc.isOptMcCorrect = true;
            }
          }
          if (mcOptArrMc.isCorrect) {
            if (p.visFeedbackMC != null) {
              if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                mcOptArrMc[p.visFeedbackMC].gotoAndStop('correct');
              }
            }
          } else {
            p.allCorrect = false;
            isCorrect = false;
            if (p.visFeedbackMC != null) {
              if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                mcOptArrMc[p.visFeedbackMC].gotoAndStop('incorrect');
              }
            }
          }
        }
        if (!isCorrect) {
          mc.isOptMcCorrect = false;
          if (p.visFeedbackMC != null) {
            if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
              if (mc[p.visFeedbackMC]) {
                mc[p.visFeedbackMC].gotoAndStop('incorrect');
              }
            }
          }
        } else {
          mc.isOptMcCorrect = true;
          if (p.visFeedbackMC != null) {
            if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
              if (mc[p.visFeedbackMC]) {
                mc[p.visFeedbackMC].gotoAndStop('correct');
              }
            }
          }
        }
      }
    } else {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        mc = p.baseObj[p._baseItemsArr[i]];
        isCorrect = false;
        if (mc.optMc) {
          gotoAndStopDrag(mc.optMc.id, '_normal');
          var tmpoId = Number(mc.id.split('_')[1]);
          corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
          for (j = 0; j < corrAns.length; j++) {
            var optnId = Number(mc.optMc.id.split('_')[1]);
            //console.log(corrAns,"optnId",optnId)
            if (optnId == Number(corrAns[j])) {
              if (p.visFeedbackMC != null) {
                if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                  //console.log(mc.id)
                  /* if (mc[p.visFeedbackMC])
                                    {
                                       mc[p.visFeedbackMC].gotoAndStopTick("correct");
                                    }
                                    mc.optMc[p.visFeedbackMC].gotoAndStopTick("correct"); */
                  gotoAndStopTick(mc.id + '_tick', 'correct');
                }
              }
              isCorrect = true;
              mc.optMc.isCorrect = true;
              mc.isOptMcCorrect = true;
            }
          }
          if (!isCorrect) {
            p.allCorrect = false;
            mc.optMc.isCorrect = false;
            mc.isOptMcCorrect = false;
            if (p.visFeedbackMC != null) {
              if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                /* if (mc[p.visFeedbackMC])
                                {
                                  mc[p.visFeedbackMC].gotoAndStop("incorrect")
                                }
                                mc.optMc[p.visFeedbackMC].gotoAndStop("incorrect"); */
                gotoAndStopTick(mc.id + '_tick', 'incorrect');
              }
            }
          }
        }
      }
    }
    if (p.submitMC != null) {
      if (p._validationMethod == 'Group') {
        if (p.allCorrect) {
          if (p.visFeedbackMC != null) {
            rootRef[p.visFeedbackMC].gotoAndStop('correct');
          }
        } else {
          if (p.visFeedbackMC != null) {
            rootRef[p.visFeedbackMC].gotoAndStop('incorrect');
          }
        }
      }
    }
    p.correctFeedbackCounter++;
    p.incorrectFeedbackCounter++;
    //trace("correctFeedbackCounter: "+ correctFeedbackCounter);
    //trace("incorrectFeedbackCounter: "+ incorrectFeedbackCounter);
    if (p.incorrectFeedbackCounter >= p._numberOfIncorrectFeedbacks) {
      p.incorrectFeedbackCounter = p._numberOfIncorrectFeedbacks;
    }
    if (p.correctFeedbackCounter >= p._numberOfCorrectFeedbacks) {
      p.correctFeedbackCounter = p._numberOfCorrectFeedbacks;
    }
    if (p.submitMC != null) {
      if (p.attemptCnt <= p._noOfAttempts || p.isUnlimitedAttempt) {
        if (p.fbMC) {
          if (p.allCorrect) {
            //p.fbMC.gotoAndPlay("correct" + p.correctFeedbackCounter);
            //.......FeedbackObj.gotoAndPlay(type);
            //gotoAndPlayFb("correct", "correct" + p.correctFeedbackCounter);
            disableActTemp(true);
            if (p.navFbStartJson) {
              p._navController.updateButtons(p.navFbStartJson);
            }
            // commented by Ajay
            /*	var audioP
						if( p.feedbackParam["correct" + p.correctFeedbackCounter]){
							audioP=p._shellModel.getMediaPath() + p.feedbackParam["correct" + p.correctFeedbackCounter]
						}
		
                         p.feedBack({
                            status: "correct",
                            curStatus: "correct" + p.correctFeedbackCounter,
                            popup: "correct" + p.correctFeedbackCounter,
                            audioPath:audioP,
                            feedbackParam: p.feedbackParam,
							jsflObj : p.feedbackParam["jsfl_correct"+p.correctFeedbackCounter],
                            videoFb: p.feedbackParam["video_correct" + p.correctFeedbackCounter],
							curSelected:p.baseObj,
                        }) */

            if (p.individualFb) {
              //console.log("inside p.individualFb");
              var _id;
              for (var i in p.baseObj) {
                _id = p.baseObj[i]['optMc']['id'];
                break;
              }
              gotoAndPlayFeedBack(_id + '_Fb', _id + '_Fb', 'correct');
            } else {
              gotoAndPlayFeedBack(
                'correct',
                'correct' + p.correctFeedbackCounter,
                'correct'
              );
            }

            if (p._jumpScreen.startFrame) {
              p._navController.displayTimelineVideo(
                p._jumpScreen.startFrame,
                p._jumpScreen.endFrame,
                function() {
                  //  p._navController.updateButtons(p.updaterJsonEnd);
                  //console.log(p.updaterJsonEnd,"end")
                }
              );
            } else {
              //p._navController.updateButtons(p.updaterJsonEnd);
              //console.log(p.updaterJsonEnd,"end 2")
            }

            //console.log("show popup ......")
            enableDisableSolution(false);
            disableAll();
            //AddScore();
          } else {
            //p.fbMC.gotoAndPlay("incorrect" + p.incorrectFeedbackCounter);
            //gotoAndPlayFb("incorrect", "incorrect" + p.incorrectFeedbackCounter);
            //console.log("play audio ......")
            var passFb = 'incorrect' + p.incorrectFeedbackCounter;
            if (p._changeFbAudio) {
              var fbFlag = false;
              for (var s = 0; s < p._baseItemsArr.length; s++) {
                if (p.baseObj[p._baseItemsArr[s]].optMc.isCorrect) {
                  fbFlag = true;
                }
              }
              if (fbFlag) {
                passFb = p._changeFbAudio;
                //console.log(passFb,"passFbpassFb")
              }
            }

            //
            disableActTemp(true);
            if (p.navFbStartJson) {
              p._navController.updateButtons(p.navFbStartJson);
            }
            // added by Ajay for combination of feedBack
            var checkFlag = false;
            //console.log("outside combinationFb",p.combinationFb);
            if (p.combinationFb) {
              //console.log("inside combinationFb");
              for (var i = 0; i < p._baseItemsArr.length; i++) {
                if (p.baseObj[p._baseItemsArr[i]].optMc.isCorrect) {
                  checkFlag = true;
                  break;
                }
              }
              //console.log("outside checkFlag",checkFlag)
              if (checkFlag) {
                //console.log("inside checkFlag",checkFlag);
                combinationFeedbackCounter++;
                if (
                  combinationFeedbackCounter >= p.numberOfCombinationFeedback
                ) {
                  combinationFeedbackCounter = p.numberOfCombinationFeedback;
                }
                gotoAndPlayFeedBack(
                  'combination',
                  'combination' + combinationFeedbackCounter,
                  'incorrect'
                );
              } else {
                gotoAndPlayFeedBack(
                  'incorrect',
                  'incorrect' + p.incorrectFeedbackCounter,
                  'incorrect'
                );
              }
            } else {
              if (p.individualFb) {
                //console.log("inside p.individualFb");
                var _id;
                for (var i in p.baseObj) {
                  _id = p.baseObj[i]['optMc']['id'];
                  break;
                }
                gotoAndPlayFeedBack(_id + '_Fb', _id + '_Fb', 'incorrect');
              } else {
                gotoAndPlayFeedBack(
                  'incorrect',
                  'incorrect' + p.incorrectFeedbackCounter,
                  'incorrect'
                );
              }
            }
            // commented by Ajay
            /* var audioP;
						if( p.feedbackParam[passFb])
						{
						  audioP=p._shellModel.getMediaPath() + p.feedbackParam[passFb]
						}
						
                        p.feedBack({
                                status: "incorrect",
                                curStatus: "incorrect" + p.incorrectFeedbackCounter,
                                popup: "incorrect" + p.incorrectFeedbackCounter,
                                audioPath: audioP,
                                feedbackParam: p.feedbackParam,
								jsflObj : p.feedbackParam["jsfl_incorrect"+p.incorrectFeedbackCounter],
                                videoFb: p.feedbackParam["video_incorrect" + p.incorrectFeedbackCounter],
								curSelected:p.baseObj,
						}) */

            //setTimeout(function(){resetIncorrectItems()},300)
            //AddScore();
          }
        } else {
          disableAll();
        }
        //{
        p.attemptCnt++;
        //}
      }
    }
  }

  this.onFeedBackCompleted = function(e) {
    //console.log("inside onFeedBackCompleted :: ",p.attemptCnt , p._noOfAttempts);
    disableActTemp(false);
    //if (e.status == "incorrect")
    if (e.retStatus == 'incorrect') {
      resetIncorrectItems();
      resetBaseItems();
      p.currentBaseItem = getCurrentBaseIndex();
      higlightBaseItem();
      if (p.attemptCnt > p._noOfAttempts && !p.isUnlimitedAttempt) {
        activityOver(e);
      } else {
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      }
    }
    //if (e.status == "correct")
    if (e.retStatus == 'correct') {
      activityOver(e);
    }
    //console.log("answer",e)
    //if (e.status == "answer")
    if (e.retStatus == 'answer') {
      activityOver(e);
    }
  };
  function activityOver(_e) {
    //all events removed and solution button is disabled
    disableAll();
    enableDisableSolution(false);

    //for customFn
    if (p.updaterJsonEnd) {
      p._navController.updateButtons(p.updaterJsonEnd);
    }
    if (p['activityOver'])
      p['activityOver']({
        e: _e,
        status: 'ActivityOver'
      });
  }

  /* function gotoAndPlayFb(type, _audio) {
    	switch (type) {
    		case "correct":
    			checkForPopUP(_audio)
    			playSound("audio_video/" + p._activityAudioNo + "" + _audio + ".mp3");
    			break;
    		case "incorrect":
    			$(p.domObj[_audio]).show();
    			playSound("audio_video/" + p._activityAudioNo + "" + _audio + ".mp3", function() {
    				resetIncorrectItems();
    				$(p.domObj[_audio]).hide();
    			}); // how to chk audio present or not
    			checkForPopUP(_audio)
    			break;
    		case "answer":
    			checkForPopUP(_audio)
    			playSound("audio_video/" + p.activityAudioNo + "" + _audio + ".mp3");
    			break;
    	}
    }

    function checkForPopUP(_audio) {
    	if (p.domObj[_audio]) {
    		var corFb = p.domObj[_audio]
    		var closeBtn =p.domObj[_audio+"_Close"] 
    		$(corFb).show()
    		$(closeBtn).show()
    		$(closeBtn).addClass("addPointer")
    		$(closeBtn).off("mousemove", overCloseBtn).on("mousemove", overCloseBtn);
    		$(closeBtn).off("mouseout", overCloseBtn).on("mouseout", overCloseBtn);
    		$(closeBtn).off("click", clickedCloseBtn).on("click", {
    			popElem: corFb
    		}, clickedCloseBtn);
    	}
    }

    function overCloseBtn(e) {
    	if (e.type == "mousemove") {
    		$(p.domObj[e.target.id]).css({
    			"background": "url(images/closeMc_H.png) no-repeat",
    			"background-size": "100% 100%",
    		});
    	} else {
    		$(p.domObj[e.target.id]).css({
    			"background": "url(images/closeMc.png) no-repeat",
    			"background-size": "100% 100%",
    		});
    	}
    }

    function clickedCloseBtn(e) {
    	$(p.domObj[e.target.id]).removeClass("addPointer")
    	$(p.domObj[e.target.id]).hide()
    	$(e.data.popElem).hide()
    	
    }

    function playSound(_audio, _fun) {
    	audioObj.stop();
    	if (_audio) {
    		audioObj.playAudio(_audio, function() {
    			// fire event after audio ends
    			if (_fun) _fun();
    		})
    	}
    } */

  function disableAll() {
    for (var i = 0; i < p._optItemsArr.length; i++) {
      var mc = p._optItemsArr[i];
      $(p.domObj[mc]).off('click', onOptionMcMouseClickEvent);
      $(p.domObj[mc]).off('click', onOptionMcMouseClickedAfterSelectionEvent);
      mouseOverDrag(mc, false);
      p.optObj[mc].buttonMode = false;
      $(p.domObj[p.optObj[mc].id]).removeClass('addPointer');
    }
    for (i = 0; i < p._baseItemsArr.length; i++) {
      mc = p._baseItemsArr[i];
      $(p.domObj[mc]).off('click', onBaseMcMouseClickEvent);
      p.baseObj[mc].buttonMode = false;
      $(p.domObj[p.baseObj[mc].id]).removeClass('addPointer');
      //gotoAndStopDrop(mc, 1);
      gotoAndStopDrop(mc, '_normal');
    }

    if (p.solutionMC) {
      if (!p.allCorrect) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }
  }

  function resetIncorrectItems(e) {
    //public e:MouseEvent = null
    enableDisableReset(false);
    p.tweenArr.splice(0, p.tweenArr.length);
    if (!p.allCorrect) {
      var i;
      var mc;
      if (p.attemptCnt <= p._noOfAttempts || p.isUnlimitedAttempt) {
        if (p._questionType == 'Type4') {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              mc.gotoAndStop(1);
              if (mc.optMc) {
                if (!mc.optMc.isCorrect) {
                  mc.currentCount = 1;
                  if (p.visFeedbackMC != null) {
                    if (
                      p._validationMethod == 'Individual' &&
                      p.visFeedbackMC
                    ) {
                      //reset visual fb mc
                      if (mc[p.visFeedbackMC]) {
                        mc[p.visFeedbackMC].gotoAndStop(1);
                      }
                      mc.optMc[p.visFeedbackMC].gotoAndStop(1);
                    }
                  }
                  if (mc.optMc.orgBaseMc.optMc.isCorrect) {
                    mc.optMc.orgBaseMc = mc.optMc.orgBaseMc.optMc.orgBaseMc;
                  }
                  if (mc.orgOptMc.isCorrect) {
                    mc.orgOptMc = mc.orgOptMc.baseMc.orgOptMc;
                  }
                  if (p._showTween) {
                    rootRef.addChild(shp);
                    p.myTweenX = new Tween(
                      mc.optMc,
                      'x',
                      Strong.easeInOut,
                      mc.optMc.x,
                      mc.optMc.orgBaseMc.x,
                      p._tweenInterval,
                      true
                    );
                    p.myTweenY = new Tween(
                      mc.optMc,
                      'y',
                      Strong.easeInOut,
                      mc.optMc.y,
                      mc.optMc.orgBaseMc.y,
                      p._tweenInterval,
                      true
                    );
                    p.tweenArr.push(p.myTweenX);
                    p.tweenArr.push(p.myTweenY);
                    p.myTweenX.addEventListener(
                      TweenEvent.MOTION_FINISH,
                      onFinish
                    );
                  } else {
                    mc.optMc.x = mc.optMc.orgBaseMc.x;
                    mc.optMc.y = mc.optMc.orgBaseMc.y;
                  }
                  mouseOverDrag(mc.optMc.id, true);
                  mc.optMc.buttonMode = true;
                  $(p.domObj[mc.optMc.id]).addClass('addPointer');
                  mc.optMc.gotoAndStop(1);
                  mc.gotoAndStop(1);
                  mc.isOptMcCorrect = false;
                  mc.optMc.removeEventListener(
                    MouseEvent.CLICK,
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  mc.optMc.removeEventListener(
                    MouseEvent.CLICK,
                    onOptionMcMouseClickEvent
                  );
                  mc.optMc.addEventListener(
                    MouseEvent.CLICK,
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  mc.optMc.baseMc = mc.optMc.orgBaseMc;
                  mc.optMc = mc.orgOptMc;
                } else {
                  mouseOverDrag(mc.optMc.id, false);
                  mc.optMc.buttonMode = false;
                  $(p.domObj[mc.optMc.id]).removeClass('addPointer');
                  mc.optMc.removeEventListener(
                    MouseEvent.CLICK,
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  mc.isOptMcCorrect = true;
                }
              }
            }
          }
          //console.log("SHOW CORRECT0");
          enableDisableSolution(false);
          enableDisableSubmit(false);
          if (p._questionType == 'Type4') {
            enableDisableSubmit(true);
          }
          if (!p._interactive) {
            p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
        } else if (p._questionType == 'Type3') {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              mc.gotoAndStop(1);
              for (var m = 0; m < mc.optMcArr.length; m++) {
                var mcOptArrMc = mc.optMcArr[m];
                if (mcOptArrMc) {
                  if (!mcOptArrMc.isCorrect) {
                    if (p.visFeedbackMC != null) {
                      if (
                        p._validationMethod == 'Individual' &&
                        p.visFeedbackMC
                      ) {
                        //reset visual fb mc
                        if (mc[p.visFeedbackMC]) {
                          mc[p.visFeedbackMC].gotoAndStop(1);
                        }
                        mcOptArrMc[p.visFeedbackMC].gotoAndStop(1);
                      }
                    }
                    if (p._showTween) {
                      rootRef.addChild(shp);
                      p.myTweenX = new Tween(
                        mcOptArrMc,
                        'x',
                        Strong.easeInOut,
                        mcOptArrMc.x,
                        mcOptArrMc.origX,
                        p._tweenInterval,
                        true
                      );
                      p.myTweenY = new Tween(
                        mcOptArrMc,
                        'y',
                        Strong.easeInOut,
                        mcOptArrMc.y,
                        mcOptArrMc.origY,
                        p._tweenInterval,
                        true
                      );
                      p.tweenArr.push(p.myTweenX);
                      p.tweenArr.push(p.myTweenY);
                      p.myTweenX.addEventListener(
                        TweenEvent.MOTION_FINISH,
                        onFinish
                      );
                    } else {
                      mcOptArrMc.x = mcOptArrMc.origX;
                      mcOptArrMc.y = mcOptArrMc.origY;
                    }
                    mcOptArrMc.removeEventListener(
                      MouseEvent.CLICK,
                      onOptionMcMouseClickedAfterSelectionEvent
                    );
                    mcOptArrMc.removeEventListener(
                      MouseEvent.CLICK,
                      onOptionMcMouseClickEvent
                    );
                    mouseOverDrag(mcOptArrMc.id, true);
                    mcOptArrMc.buttonMode = true;
                    $(p.domObj[mcOptArrMc.id]).addClass('addPointer');
                    mcOptArrMc.gotoAndStop(1);
                    mc.gotoAndStop(1);
                    mc.isOptMcCorrect = false;
                    mcOptArrMc.baseMc = null;
                    mcOptArrMc.addEventListener(
                      MouseEvent.CLICK,
                      onOptionMcMouseClickEvent
                    );
                    mc.optMc = null;
                  } else {
                    mouseOverDrag(mcOptArrMc.id, false);
                    mcOptArrMc.buttonMode = false;
                    $(p.domObj[mcOptArrMc.id]).removeClass('addPointer');
                    mcOptArrMc.removeEventListener(
                      MouseEvent.CLICK,
                      onOptionMcMouseClickedAfterSelectionEvent
                    );
                    mc.isOptMcCorrect = true;
                  }
                }
              }
            }
          }
          for (i = 0; i < p._baseItemsArr.length; i++) {
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              for (m = 0; m < mc.optMcArr.length; m++) {
                if (!mc.optMcArr[m].isCorrect) {
                  mc.optMcArr.splice(m, 1);
                  m--;
                }
              }
              mc.currentCount = mc.optMcArr.length;
              for (m = 0; m < mc.optMcArr.length; m++) {
                mc.optMcArr[m].x = getXPos(mc.optMcArr[m]);
                mc.optMcArr[m].y = getYPos(mc.optMcArr[m]);
              }
            }
          }
          //console.log("SHOW CORRECT1");
          enableDisableSolution(false);
          enableDisableSubmit(false);
          if (!p._interactive) {
            alert('need to check');
            //p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
        } else {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              //gotoAndStopDrop(mc.id, 1);
              gotoAndStopDrop(mc.id, '_normal');
              if (mc.optMc) {
                if (!mc.optMc.isCorrect) {
                  mc.currentCount = 1;
                  if (p.visFeedbackMC != null) {
                    if (
                      p._validationMethod == 'Individual' &&
                      p.visFeedbackMC
                    ) {
                      gotoAndStopTick(mc.id + '_tick', 1);
                    }
                  }
                  if (p._showTween) {
                    disableActTemp(true);
                    $(p.domObj[mc.optMc.id]).animate(
                      {
                        left: mc.optMc.origX,
                        top: mc.optMc.origY
                      },
                      500,
                      function() {
                        disableActTemp(false);
                      }
                    );
                  } else {
                    mc.optMc.x = mc.optMc.origX;
                    mc.optMc.y = mc.optMc.origY;
                    $(p.domObj[mc.optMc.id]).css(
                      {
                        left: mc.optMc.origX,
                        top: mc.optMc.origY
                      },
                      500
                    );
                  }
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickEvent
                  );
                  mouseOverDrag(mc.optMc.id, true);
                  mc.optMc.buttonMode = true;
                  $(p.domObj[mc.optMc.id]).addClass('addPointer');
                  //gotoAndStopDrag(mc.optMc.id, 1);
                  gotoAndStopDrag(mc.optMc.id, '_normal');
                  //gotoAndStopDrop(mc.id, 1);
                  gotoAndStopDrop(mc.id, '_normal');
                  mc.isOptMcCorrect = false;
                  mc.optMc.baseMc = null;
                  mc.currentCount = 0;
                  if (mc.optMc.type == 'created') {
                    type2_holderMc.removeChild(mc.optMc);
                  } else {
                    if (p._questionType == 'Type1' && p._interactive) {
                      $(p.domObj[mc.optMc.id])
                        .off('click', onOptionMcMouseClickedAfterSelectionEvent)
                        .on('click', onOptionMcMouseClickedAfterSelectionEvent);
                    } else {
                      $(p.domObj[mc.optMc.id])
                        .off('click', onOptionMcMouseClickEvent)
                        .on('click', onOptionMcMouseClickEvent);
                    }
                  }
                  mc.optMc = null;
                } else {
                  //trace("HERE")
                  mouseOverDrag(mc.optMc.id, false);
                  mc.optMc.buttonMode = false;
                  $(p.domObj[mc.optMc.id]).removeClass('addPointer');
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickEvent
                  );
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  mc.isOptMcCorrect = true;
                }
              }
            }
          }
          //==================================================================
          // when resetIncorrect is called,and to set all draggale to normal
          for (i = 0; i < p._optItemsArr.length; i++) {
            if (!p.optObj[p._optItemsArr[i]].isCorrect) {
              gotoAndStopDrag(p._optItemsArr[i], '_normal');
            }
          }
          //==================================================================
          if (p._solBtnDisableOnInit) {
            if (submitCnt) {
              enableDisableSolution(false);
            } else {
              enableDisableSolution(true);
            }
          } else {
            enableDisableSolution(false);
          }

          enableDisableSubmit(false);
          if (!p._interactive) {
            //p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
        }
        //console.log(p.currentBaseItem , "  :: p.currentBaseItemp.currentBaseItem")
      } else {
        if (!p.solutionMC) {
          showCorrectAnswer();
        } else {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc.optMc) {
              if (!mc.optMc.isCorrect) {
                //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                $(p.domObj[mc.optMc.id]).off(
                  'click',
                  onOptionMcMouseClickEvent
                );
                //$(p.domObj[mc.optMc.id]).off(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);  // line removed by Ajay
                $(p.domObj[mc.optMc.id]).off(
                  'click',
                  onOptionMcMouseClickedAfterSelectionEvent
                );
                mouseOverDrag(mc.optMc.id, false);
                mc.optMc.buttonMode = false;
                $(p.domObj[mc.optMc.id]).removeClass('addPointer');
              }
            }
          }
        }
      }
    }
    p.selectedMc = null;
    if (p.attemptCnt > 1) {
      if (p.solutionMC) {
        //console.log("SHOW CORRECT3",!p.allCorrect);
        if (!p.allCorrect) {
          enableDisableSolution(true);
        } else {
          enableDisableSolution(false);
        }
      }
    }
    if (p._validationMethod == 'Group') {
      if (p.visFeedbackMC != null) {
        rootRef[p.visFeedbackMC].gotoAndStop(1);
      }
    }
    if (p._customFnCall != '') {
      if (
        (p.attemptCnt > p._noOfAttempts && !p.isUnlimitedAttempt) ||
        p.allCorrect
      ) {
        //console.log("_customFnCall")
        /* 	var custFunction:Function = rootRef[p._customFnCall];
                	custFunction();
                	AddScore(); */
      }
    }

    //// this code is added to reset the droppable
    //p.currentBaseItem = 0;
    var j = 0;
    for (var i1 = 0; i1 < p._baseItemsArr.length; i1++) {
      var mcBaseItem1 = p._baseItemsArr[i1];
      if (!p.baseObj[mcBaseItem1].optMc) {
        _index = i1;
        j++;
      }
    }
    if (j == p._baseItemsArr.length) {
      //when all are incorrect
      p.currentBaseItem = 0;
    } else {
      //when some are correct
      p.currentBaseItem = getCurrentBaseIndex();
    }
    higlightBaseItem();
  }

  /*
   * Method called by solution button or resetIncorrect method (if solution button is not available)
   * to display the correct answer and disable the activity.
   * @param	e
   */

  function showCorrectAnswer(e) {
    //pr e:MouseEvent = null
    //console.log("showCorrectAnswer")
    resetBaseItems();
    p.tweenArr.splice(0, p.tweenArr.length);

    var optMc;
    if (p.solutionMC) {
      enableDisableSolution(false);
    }
    if (p.submitMC) {
      enableDisableSubmit(false);
    }
    for (var k = 0; k < p._optItemsArr.length; k++) {
      optMc = p.optObj[p._optItemsArr[k]];
      if (optMc) {
        if (!optMc.isCorrect) {
          optMc.x = optMc.origX;
          optMc.y = optMc.origY;
          $(p.domObj[optMc.id]).css({
            left: optMc.origX,
            top: optMc.origY
          });
          $(p.domObj[optMc.id]).off('click', onOptionMcMouseClickEvent);
          $(p.domObj[optMc.id]).off(
            'click',
            onOptionMcMouseClickedAfterSelectionEvent
          );
          mouseOverDrag(optMc.id, false);
          optMc.buttonMode = false;
          $(p.domObj[optMc.id]).removeClass('addPointer');
          if (p._questionType == 'Type3') {
            if (optMc.baseMc) {
              if (p.baseObj[optMc.baseMc].optMcArr.indexOf(optMc.id) != -1) {
                p.baseObj[optMc.baseMc].optMcArr.splice(
                  p.baseObj[optMc.baseMc].optMcArr.indexOf(optMc.id),
                  1
                );
              }
            }
          }
        }
        if (p.visFeedbackMC != null) {
          if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
            //optMc[p.visFeedbackMC].gotoAndStop(1);
            for (var jj = 0; jj < p._baseItemsArr.length; jj++)
              gotoAndStopTick(p._baseItemsArr[jj] + '_tick', 1);
          }
        }
      }
    }
    for (var i = 0; i < p._baseItemsArr.length; i++) {
      var mc = p.baseObj[p._baseItemsArr[i]];
      //gotoAndStopDrop(mc.id, 1);
      gotoAndStopDrop(mc.id, '_normal');
      if (p.visFeedbackMC != null) {
        if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
          gotoAndStopTick(p._baseItemsArr[i] + '_tick', 1);
        }
      }
      //var corrAns = String(p._correctAnswers[mc.id - 1]).split(",");
      var tmpoId = Number(mc.id.split('_')[1]);
      var corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
      for (var j = 0; j < corrAns.length; j++) {
        if (p._questionType == 'Type2') {
        } else {
          optMc = p.optObj[p._optItemsArr[corrAns[j] - 1]];
        }
        if (optMc) {
          if (
            !optMc.isCorrect &&
            (!mc.isOptMcCorrect || p._questionType == 'Type3')
          ) {
            optMc.isCorrect = true;
            mc.isOptMcCorrect = true;
            //var xpos= mc.x;
            //var ypos = mc.y;
            var xpos = parseFloat($(p.domObj[mc.id]).css('left'));
            var ypos = parseFloat($(p.domObj[mc.id]).css('top'));
            if (p._questionType == 'Type3') {
              if (mc.optMcArr.indexOf(optMc) == -1) {
                mc.optMcArr.push(optMc);
              }
              optMc.baseMc = mc;
              xpos = getXPos(optMc);
              ypos = getYPos(optMc);
            }
            if (p._showTween) {
              var baseW = parseFloat($(p.domObj[mc.id]).css('width')) / 2;
              var baseH = parseFloat($(p.domObj[mc.id]).css('height')) / 2;
              var optW = parseFloat($(p.domObj[optMc.id]).css('width')) / 2;
              var optH = parseFloat($(p.domObj[optMc.id]).css('height')) / 2;
              disableActTemp(true);
              var _tempX = (_tempY = 0);
              if (Object.keys(p._positionOffsetObj).length) {
                if (p._positionOffsetObj[optMc.id]) {
                  if (p._positionOffsetObj[optMc.id].x)
                    _tempX = Number(p._positionOffsetObj[optMc.id].x);
                  if (p._positionOffsetObj[optMc.id].y)
                    _tempY = Number(p._positionOffsetObj[optMc.id].y);
                }
              } else {
                if (p._positionOffsetX) _tempX = Number(p._positionOffsetX);
                if (p._positionOffsetY) _tempY = Number(p._positionOffsetY);
              }
              $(p.domObj[optMc.id]).animate(
                {
                  left: xpos + baseW - optW + _tempX,
                  top: ypos + baseH - optH + _tempY
                },
                500,
                function() {
                  disableActTemp(false);
                }
              );
            } else {
              optMc.x = xpos;
              optMc.y = ypos;
              $(p.domObj[optMc.id]).css({
                left: xpos,
                top: ypos
              });
            }
          }
          $(p.domObj[optMc.id]).off('click', onOptionMcMouseClickEvent);
          $(p.domObj[optMc.id]).off(
            'click',
            onOptionMcMouseClickedAfterSelectionEvent
          );
          mouseOverDrag(optMc.id, false);
          optMc.buttonMode = false;
          $(p.domObj[optMc.id]).removeClass('addPointer');
        }
      }
    }
    //gotoAndPlayFb("answer", "answer")
    disableActTemp(true);
    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }

    // commented by Ajay
    /* var audioP
		if(p.feedbackParam["answer"])
		{
	      audioP=p._shellModel.getMediaPath() + p.feedbackParam["answer"]
		}
        p.feedBack({
            status: "answer",
            curStatus: "answer",
            popup: "answer",
            audioPath: audioP,
            feedbackParam: p.feedbackParam,
			jsflObj : p.feedbackParam["jsfl_answer"],
            videoFb: p.feedbackParam["video_answer"],
			curSelected:p.baseObj,
        }) */

    gotoAndPlayFeedBack('answer', 'answer', 'answer');

    if (p._jumpScreen.startFrame) {
      p._navController.displayTimelineVideo(
        p._jumpScreen.startFrame,
        p._jumpScreen.endFrame,
        function() {
          //p._navController.updateButtons(p.updaterJsonEnd);
          //console.log(p.updaterJsonEnd,"end 3 ")
        }
      );
    } else {
      //console.log(p.updaterJsonEnd,"end 4")
      //p._navController.updateButtons(p.updaterJsonEnd);
    }
    disableAll();
    enableDisableSolution(false);
    enableDisableReset(false);
  }

  this.removeAll = function() {
    disableAll();

    if (p._submitBtn != '') {
      enableDisableSubmit(false);
    }
    if (p._solutionBtn != '') {
      enableDisableSolution(false);
    }
    if (p._resetBtn != '') {
      enableDisableReset(false);
    }

    for (var i in p.domObj) {
      $(p.domObj[i]).remove();
    }
    delete p;
  };

  function disableActTemp(shFlag) {
    //console.log(shFlag,"shFlag")
    if (shFlag) {
      $(p.domObj['hideDiv']).show();
    } else {
      $(p.domObj['hideDiv']).hide();
    }
  }

  //=== added By Ajay ====
  function gotoAndPlayFeedBack(_status, _curStatus, _retStatus) {
    //console.log(_status , _curStatus , _retStatus , "  :: _status , _curStatus , _retStatus")
    var audioP;
    if (p.feedbackParam[_curStatus]) {
      audioP = p._shellModel.getMediaPath() + p.feedbackParam[_curStatus];
    }
    //--- dispatch event ---
    if (p.feedBack) {
      p.feedBack({
        status: _status,
        curStatus: _curStatus,
        popup: _curStatus,
        audioPath: audioP,
        feedbackParam: p.feedbackParam,
        jsflObj: p.feedbackParam['jsfl_' + _curStatus],
        videoFb: p.feedbackParam['video_' + _curStatus],
        curSelected: p.baseObj,
        retStatus: _retStatus
      });
    }
  }
};
