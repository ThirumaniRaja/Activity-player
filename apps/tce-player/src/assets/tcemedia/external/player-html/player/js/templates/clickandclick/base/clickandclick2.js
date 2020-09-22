var ClickAndClick2 = function() {
  //package com.tis.component.clickandclick{
  /* import flash.display.MovieClip;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.display.*;
    import flash.geom.*;
    import flash.utils.getDefinitionByName;
    import flash.utils.getQualifiedSuperclassName;
    import fl.transitions.Tween;
    import fl.transitions.easing.*;
    import fl.transitions.TweenEvent;
    import com.tis.component.starcontroller.*; */
  var p = {
    _wrapper: '#activityWrapper',
    _activityNo: '',
    _activityAudioNo: '',
    rootRef: null, //mc
    refToPlayer: null, //mc

    /*///////// Inspectable Variables ////////////*/
    _tickCrossPosition: '', //  "lt","lb","rt","rb","cl","cr","ct","cb","inLeft","inRight"
    _tickPaddingLeft: 0,
    _tickPaddingTop: 0,
    _interactive: true,
    _optItemsArr: [
      'dragMc_01',
      'dragMc_02',
      'dragMc_03',
      'dragMc_04',
      'dragMc_05',
      'dragMc_06',
      'dragMc_07',
      'dragMc_08'
    ],
    _baseItemsArr: ['m2', 'm1'],
    _correctAnswers: [[1, 3, 5, 7], [2, 4, 6, 8]],
    _noOfAttempts: 0, //int 1
    _submitBtn: 'submitMc',
    _customFnCall: null,
    _validationMethod: 'Individual',
    _visualFBMc: 'tick_mc',
    _feedbackMc: 'feedbackMc_1',
    _solutionBtn: 'solutionMc',
    _resetBtn: '',
    _boundRect: [],
    _showTween: true,
    _tweenInterval: 0.5,
    _questNo: 0, //int
    _maintainScore: false,
    _mainMovieRef: null,
    _questionType: 'Type3',
    _numberOfCorrectFeedbacks: 1, //int
    _numberOfIncorrectFeedbacks: 1, //int
    _maxDropCount: 4, //int
    _dropPosition: 'Vertical',
    _positionOffset: 15, //int
    _btnFontCssObj: {},
    _solBtnDisableOnInit: true,
    _jumpScreen: {},
    feedbackParam: {},

    _imgObj: {},
    _btnFontCssObj: {},
    _starDiv: '',
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

    // shp:Sprite = new Sprite(),
    //public var addStar:CustomEvent,
    // type2_holderMc:MovieClip = new MovieClip(),
    hideDiv: 'hideDiv',

    // parameters added by Nazmeen for combination feedBack
    individualFb: false,
    combinationFb: false,
    numberOfCombinationFeedback: 0
  };
  var combinationFeedbackCounter = 0;
  var _thisObj = this;
  var loadedImgCnt = (loadImgCnt = 0);
  var activityImageObj = new Object();
  var commonAssetPath;
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };

  /* public function ClickAndClick():void {
    	// store the reference of the timeline into rootRef
    	rootRef = this.parent as MovieClip;
    } */

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
    p._navController.updateButtons(p.updaterJsonStart);
  }
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    commonAssetPath = p._shellModel.getServiceObj().getCommonAssetPath();
    makeImgObj();
  };

  function makeImgObj() {
    var tempObj = new Object();
    if (p._visualFBMc != '') {
      if (p._tickCrossPosition) {
        for (var i = 0; i < p._optItemsArr.length; i++) {
          tempObj[p._optItemsArr[i] + '_tick_correct'] =
            commonAssetPath + 'commonAssets/images/tickandcross/type3/tick.png';
          tempObj[p._optItemsArr[i] + '_tick_incorrect'] =
            commonAssetPath +
            'commonAssets/images/tickandcross/type3/cross.png';
        }
        //gotoAndStopTick(p._optItemsArr[i]+"_tick",1)
      }
    }
    for (var i = 0; i < p._optItemsArr.length; i++) {
      var temp = p._optItemsArr[i];
      for (var j in p._imgObj) {
        if (temp == j) {
          //console.log( p._imgObj[temp] , j)
          if (p._imgObj[temp]['_normal']) {
            tempObj[temp + '_normal'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._optItemsArr[i]]['_normal'];
          }
          if (p._imgObj[temp]['_over']) {
            tempObj[temp + '_over'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._optItemsArr[i]]['_over'];
          }
          if (p._imgObj[temp]['_selected']) {
            tempObj[temp + '_selected'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._optItemsArr[i]]['_selected'];
          }
          if (p._imgObj[temp]['_disable']) {
            tempObj[temp + '_disable'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._optItemsArr[i]]['_disable'];
          }
          if (p._imgObj[temp]['_down']) {
            tempObj[temp + '_down'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._optItemsArr[i]]['_down'];
          }
        }
      }
    }
    //// below if else code is added from CNCv1 by Nazmeen
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
          if (p._imgObj[p._submitBtn]['_normal'])
            tempObj['submit_normal'] =
              p._shellModel.getMediaPath() + p._imgObj[p._submitBtn]['_normal'];
          if (p._imgObj[p._submitBtn]['_over'])
            tempObj['submit_over'] =
              p._shellModel.getMediaPath() + p._imgObj[p._submitBtn]['_over'];
          if (p._imgObj[p._submitBtn]['_disable'])
            tempObj['submit_disable'] =
              p._shellModel.getMediaPath() +
              p._imgObj[p._submitBtn]['_disable'];
        }
      }
    }
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
          if (p._imgObj[p._resetBtn]['_normal'])
            tempObj['reset_normal'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_normal'];
          if (p._imgObj[p._resetBtn]['_over'])
            tempObj['reset_over'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_over'];
          if (p._imgObj[p._resetBtn]['_disable'])
            tempObj['reset_disable'] =
              p._shellModel.getMediaPath() + p._imgObj[p._resetBtn]['_disable'];
        }
      }
    }
    preloadImages(tempObj);
  }

  /*  function preloadImages(_obj)
    {
        activityImageObj = new Object();
        loadedImgCnt = 0;
        loadImgCnt = 0;
        for (var i in _obj)
        {
            activityImageObj[i] = new Object();
            var _tempImg = new Image();
            _tempImg.onload = imgloaded;
            _tempImg.src = _obj[i];
            activityImageObj[i] = _tempImg;
            loadImgCnt++;
    if (p._solutionBtn != '') {
      p.solutionMC = p.domObj[p._solutionBtn];
      //p.solutionMC.mouseChildren = false;
      enableDisableSolution(p._solBtnDisableOnInit);
    }
    } */

  function preloadImages(_obj) {
    activityImageObj = new Object();
    loadedImgCnt = 0;
    loadImgCnt = 0;

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
    audioObj = new AudioPlayerNormalClass();

    /* 	feedbackObj = new FeedbackClass();
        	feedbackObj.addEventListener("eventFromFeedBack",onFeedBackEvents); */

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

    if (p._noOfAttempts <= 0) {
      p.isUnlimitedAttempt = true;
    }

    if (p._feedbackMc != '') {
      //	p.fbMC = rootRef.getChildByName(p._feedbackMc) as MovieClip;
      p.fbMC = p._feedbackMc;
    }

    /* if (p._questionType == "Type2")
        {
        	rootRef.addChildAt(type2_holderMc, rootRef.getChildIndex(p.fbMC));
        	type2_holderMc.x = 0;
        	type2_holderMc.y = 0;
        } */
    if (p._visualFBMc != '') {
      p.visFeedbackMC = p._visualFBMc;
      if (p._tickCrossPosition) {
        p._imgObj[p._visualFBMc] = {};
      }

      for (var i = 0; i < p._optItemsArr.length; i++) {
        gotoAndStopTick(p._optItemsArr[i] + '_tick', 1);
      }
    }

    if (p._submitBtn != '') {
      p.submitMC = p.domObj[p._submitBtn];
      //p.submitMC.mouseChildren = false;
      enableDisableSubmit(false);
    }

    if (p._solutionBtn != '') {
      p.solutionMC = p.domObj[p._solutionBtn];
      //p.solutionMC.mouseChildren = false;
      enableDisableSolution(p._solBtnDisableOnInit);
    }

    if (p._resetBtn != '') {
      p.resetMC = p.domObj[p._resetBtn];
      //p.resetMC.mouseChildren = false;
      enableDisableReset(false);
    }

    initBaseItems();
    initOptionItems();

    if (p._maintainScore) {
      addstar_mc = new StarController(p);
      //////////console.log(p.domObj[p._starDiv])
      addstar_mc.init(p.domObj[p._starDiv]);
      //addstar_mc.init(p)
    }
    if (!p._interactive) {
      p.currentBaseItem = 0;
      //higlightBaseItem();
    } else {
      p.currentBaseItem = -1;
    }
  }
  function actionHandler(e) {
    /* if(p._maintainScore)
		{
			if(addstar_mc !=null)
			{
				if((String(attemptedMultipleAnswersMc) == String(p._correctAnswers)) || (String(attemptedAnswers) == String(p._correctAnswers)))
				{
				   addstar_mc.updateAnswer(p._questNo,1);
				}else
				{
				   addstar_mc.updateAnswer(p._questNo,0);
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

  this.onFeedBackCompleted = function(e) {
    disableActTemp(false);
    if (e.retStatus == 'incorrect') {
      resetIncorrectItems();
      $(p.domObj[p.hideDiv]).hide();
      if (p.attemptCnt > p._noOfAttempts && !p.isUnlimitedAttempt) {
        activityOver(e);
      } else {
        if (p.navFbEndJson) {
          p._navController.updateButtons(p.navFbEndJson);
        }
      }
    }
    if (e.retStatus == 'correct') {
      activityOver(e);
    }
    if (e.retStatus == 'answer') {
      activityOver(e);
    }
  };

  function activityOver(_e) {
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

  function setCorrect() {
    if (p._questionType == 'Type4') {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        if (mc) {
          mc.gotoAndStop(1);

          if (mc.optMc) {
            if (!mc.optMc.isCorrect) {
              mc.currentCount = 1;
              if (p.visFeedbackMC != null) {
                if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
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
                p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
              } else {
                mc.optMc.x = mc.optMc.orgBaseMc.x;
                mc.optMc.y = mc.optMc.orgBaseMc.y;
              }

              //trace(mc.name);
              mouseOverDrag(mc.optMc.id, true);
              mc.optMc.buttonMode = true;
              $(p.domObj[mc.optMc.id]).addClass('addPointer');
              mc.optMc.gotoAndStop(1);
              mc.gotoAndStop(1);
              mc.isOptMcCorrect = false;
              //trace("Shabbir Reached Here: Type4")
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
              //trace("HERE")
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

      // enableDisableSolution(false)
      //  enableDisableSubmit(false);
      if (p._questionType == 'Type4') {
        // enableDisableSubmit(true);
      }
      if (!p._interactive) {
        p.currentBaseItem = 0;
        higlightBaseItem();
      } else {
        p.currentBaseItem = -1;
      }
    } else if (p._questionType == 'Type3') {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        if (mc) {
          //gotoAndStopDrop(mc.id,1);
          gotoAndStopDrop(p._baseItemsArr[i], '_normal');
          for (var m = 0; m < mc.optMcArr.length; m++) {
            //var mcOptArrMc:MovieClip = mc.optMcArr[m] as MovieClip;
            var mcOptArrMc = p.optObj[mc.optMcArr[m]];
            //trace(mcOptArrMc.name +" RESET")
            if (mcOptArrMc) {
              if (!mcOptArrMc.isCorrect) {
                if (p.visFeedbackMC != null) {
                  if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                    //reset visual fb mc
                    //if (mc[p.visFeedbackMC])
                    //{
                    // mc[p.visFeedbackMC].gotoAndStop(1);
                    //}
                    //mcOptArrMc[p.visFeedbackMC].gotoAndStop(1);
                    gotoAndStopTick(mcOptArrMc.id + '_tick', 1);
                  }
                }

                if (p._showTween) {
                  /* rootRef.addChild(shp);
											p.myTweenX = new Tween(mcOptArrMc, "x", Strong.easeInOut, mcOptArrMc.x, mcOptArrMc.origX, p._tweenInterval, true);
											p.myTweenY = new Tween(mcOptArrMc, "y", Strong.easeInOut, mcOptArrMc.y, mcOptArrMc.origY, p._tweenInterval, true);
											p.tweenArr.push(p.myTweenX);
											p.tweenArr.push(p.myTweenY);
											p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
										 */

                  /* $("#"+mcOptArrMc.id).animate({ 
									 "left":mcOptArrMc.origX,
									  "top":mcOptArrMc.origY
									}, 500 );  */

                  animateDiv(
                    p.domObj[mcOptArrMc.id],
                    mcOptArrMc.origX,
                    mcOptArrMc.origY
                  );
                } else {
                  mcOptArrMc.x = mcOptArrMc.origX;
                  mcOptArrMc.y = mcOptArrMc.origY;

                  $(p.domObj[mcOptArrMc.id]).css({
                    left: mcOptArrMc.origX,
                    top: mcOptArrMc.origY
                  });
                }

                //trace(mc.name);

                /* mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                                        mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                                        mouseOverDrag(mcOptArrMc.id,true)*/
                mcOptArrMc.buttonMode = true;
                $(p.domObj[mcOptArrMc.id]).off(
                  'click',
                  onOptionMcMouseClickedAfterSelectionEvent
                );
                $(p.domObj[mcOptArrMc.id]).off(
                  'click',
                  onOptionMcMouseClickEvent
                );
                mouseOverDrag(mcOptArrMc.id, true);
                //mcOptArrMc.buttonMode = true;
                $(p.domObj[mcOptArrMc.id]).addClass('addPointer');
                //mcOptArrMc.gotoAndStop(1);
                //gotoAndStopDrag(mcOptArrMc.id,1)
                gotoAndStopDrag(mcOptArrMc.id, '_normal');
                //mc.gotoAndStop(1);
                //gotoAndStopDrop(mc.id,1);

                gotoAndStopDrop(p._baseItemsArr[i], '_normal');
                mc.isOptMcCorrect = false;
                mcOptArrMc.baseMc = null;

                //mcOptArrMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                $(p.domObj[mcOptArrMc.id])
                  .off('click', onOptionMcMouseClickEvent)
                  .on('click', onOptionMcMouseClickEvent);
                mc.optMc = null;
              } else {
                //trace("HERE")
                mouseOverDrag(mcOptArrMc.id, false);
                mcOptArrMc.buttonMode = false;
                $(p.domObj[mcOptArrMc.id]).removeClass('addPointer');
                //mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                $(p.domObj[mcOptArrMc.id]).off(
                  'click',
                  onOptionMcMouseClickedAfterSelectionEvent
                );
                mc.isOptMcCorrect = true;
              }
            }
          }
        }
      }

      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        if (mc) {
          for (m = 0; m < mc.optMcArr.length; m++) {
            //trace(mc.name + "Splice: " + mc.optMcArr[m].name +" isCorrect: "+mc.optMcArr[m].isCorrect);
            if (!p.optObj[mc.optMcArr[m]].isCorrect) {
              mc.optMcArr.splice(m, 1);
              m--;
            }
          }
          //trace(mc.name +" :: " + mc.optMcArr);
          mc.currentCount = mc.optMcArr.length;
          for (m = 0; m < mc.optMcArr.length; m++) {
            //	mc.optMcArr[m].x = getXPos(mc.optMcArr[m]);
            //	mc.optMcArr[m].y = getYPos(mc.optMcArr[m]);

            var elemIndex = mc.optMcArr.indexOf(mc.optMcArr[m]);

            var baseChild = $(p.domObj[p._baseItemsArr[i]])
              .children()
              .eq(elemIndex);

            var ypostemp = parseFloat($(baseChild).css('top'));
            var xpostemp = parseFloat($(baseChild).css('left'));

            ypos =
              ypostemp + parseFloat($(p.domObj[p._baseItemsArr[i]]).css('top'));
            xpos =
              xpostemp +
              parseFloat($(p.domObj[p._baseItemsArr[i]]).css('left'));
            var baseW2 = parseFloat($(baseChild).css('width')) / 2;
            var baseH2 = parseFloat($(baseChild).css('height')) / 2;
            var optW2 =
              parseFloat($(p.domObj[mc.optMcArr[m]]).css('width')) / 2;
            var optH2 =
              parseFloat($(p.domObj[mc.optMcArr[m]]).css('height')) / 2;

            $(p.domObj[mc.optMcArr[m]]).css({
              left: xpos + baseW2 - optW2,
              top: ypos + baseH2 - optH2
            });
          }
        }
      }
      //enableDisableSolution(false)
      // enableDisableSubmit(false);
      if (!p._interactive) {
        p.currentBaseItem = 0;
        higlightBaseItem();
      } else {
        p.currentBaseItem = -1;
      }
    } else {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        if (mc) {
          //gotoAndStopDrop(mc.id,1);

          gotoAndStopDrop(p._baseItemsArr[i], '_normal');
          if (mc.optMc) {
            if (!mc.optMc.isCorrect) {
              mc.currentCount = 1;
              if (p.visFeedbackMC != null) {
                if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                  //reset visual fb mc
                  /* if (mc[p.visFeedbackMC])
                                            {
                                              mc[p.visFeedbackMC].gotoAndStop(1);
                                            }
                                            mc.optMc[p.visFeedbackMC].gotoAndStop(1); */

                  gotoAndStopTick(mc.optMc.id + '_tick', 1);
                }
              }
              if (p._showTween) {
                /* rootRef.addChild(shp);
										p.myTweenX = new Tween(mc.optMc, "x", Strong.easeInOut, mc.optMc.x, mc.optMc.origX, p._tweenInterval, true);
										p.myTweenY = new Tween(mc.optMc, "y", Strong.easeInOut, mc.optMc.y, mc.optMc.origY, p._tweenInterval, true);
										p.tweenArr.push(p.myTweenX);
										p.tweenArr.push(p.myTweenY);
										p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
									 */
                /* 	var baseW=parseFloat($("#"+mc.id).css("width"))/2
                                        	var baseH=parseFloat($("#"+mc.id).css("height"))/2
                                        	var optW=parseFloat($("#"+mc.optMc.id).css("width"))/2
                                        	var optH=parseFloat($("#"+mc.optMc.id).css("height"))/2 */

                /* $("#"+mc.optMc.id).animate({ 
                                        "left":mc.optMc.origX,
                                          "top": mc.optMc.origY
                                        }, 500 ); */
                animateDiv(
                  p.domObj[mc.optMc.id],
                  mc.optMc.origX,
                  mc.optMc.origY
                );
              } else {
                mc.optMc.x = mc.optMc.origX;
                mc.optMc.y = mc.optMc.origY;

                $(p.domObj[mc.optMc.id]).css({
                  left: mc.optMc.origX,
                  top: mc.optMc.origY
                });
              }

              //trace(mc.name);

              //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
              //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
              $(p.domObj[mc.optMc.id]).off(
                'click',
                onOptionMcMouseClickedAfterSelectionEvent
              );
              $(p.domObj[mc.optMc.id]).off('click', onOptionMcMouseClickEvent);
              mouseOverDrag(mc.optMc.id, true);
              mc.optMc.buttonMode = true;
              $(p.domObj[mc.optMc.id]).addClass('addPointer');
              //gotoAndStopDrag(mc.optMc.id,1);
              gotoAndStopDrag(mc.optMc.id, '_normal');
              //gotoAndStopDrop(mc.id,1);

              gotoAndStopDrop(p._baseItemsArr[i], '_normal');
              mc.isOptMcCorrect = false;
              mc.optMc.baseMc = null;

              if (mc.optMc.type == 'created') {
                type2_holderMc.removeChild(mc.optMc);
              } else {
                if (p._questionType == 'Type1' && p._interactive) {
                  //mc.optMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                  $(p.domObj[mc.optMc.id])
                    .off('click', onOptionMcMouseClickedAfterSelectionEvent)
                    .on('click', onOptionMcMouseClickedAfterSelectionEvent);
                } else {
                  //mc.optMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
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
              //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
              $(p.domObj[mc.optMc.id]).off(
                'click',
                onOptionMcMouseClickedAfterSelectionEvent
              );

              mc.isOptMcCorrect = true;
            }
          }
        }
      }
      // enableDisableSolution(false)
      //enableDisableSubmit(false);
      if (!p._interactive) {
        p.currentBaseItem = 0;
        higlightBaseItem();
      } else {
        p.currentBaseItem = -1;
      }
    }
  }
  function enableDisableSubmit(_val) {
    //pr bool
    if (p.submitMC) {
      //p.submitMC.buttonMode = _val;

      if (_val) {
        //p.submitMC.gotoAndStop("_up");
        //p.submitMC.addEventListener(MouseEvent.CLICK, validateCAC);
        //$(p.submitMC).off(_evt,_fn).on(_evt,_data,_fn);
        gotoAndStopSubmit(p._submitBtn, '_normal');
        $(p.domObj[p._submitBtn])
          .off('click', validateCAC)
          .on('click', validateCAC);
        $(p.domObj[p._submitBtn])
          .off('mousemove', setSubmitOver)
          .on('mousemove', setSubmitOver);
        $(p.domObj[p._submitBtn])
          .off('mouseout', setSubmitOver)
          .on('mouseout', setSubmitOver);
        $(p.domObj[p._submitBtn])
          .removeClass('addPointer')
          .addClass('addPointer');
      } else {
        //p.submitMC.gotoAndStop("_disable");
        //p.submitMC.removeEventListener(MouseEvent.CLICK, validateCAC);
        gotoAndStopSubmit(p._submitBtn, '_disable');
        $(p.domObj[p._submitBtn]).off('click', validateCAC);
        $(p.domObj[p._submitBtn]).off('mousemove', setSubmitOver);
        $(p.domObj[p._submitBtn]).off('mouseout', setSubmitOver);
        $(p.domObj[p._submitBtn]).removeClass('addPointer');
      }
    }
  }

  function setSubmitOver(e) {
    if (e.type == 'mousemove') gotoAndStopSubmit(p._submitBtn, '_over');
    else gotoAndStopSubmit(p._submitBtn, '_normal');
  }

  function setSolutionOver(e) {
    if (e.type == 'mousemove') gotoAndStopSoln(p._solutionBtn, '_over');
    else gotoAndStopSoln(p._solutionBtn, '_normal');
  }

  function setResetOver(e) {
    if (e.type == 'mousemove') gotoAndStopReset(p._resetBtn, '_over');
    else gotoAndStopReset(p._resetBtn, '_normal');
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
        gotoAndStopSoln(p._solutionBtn, '_normal');
        $(p.domObj[p._solutionBtn])
          .off('click', showCorrectAnswer)
          .on('click', showCorrectAnswer);
        $(p.domObj[p._solutionBtn])
          .off('mousemove', setSolutionOver)
          .on('mousemove', setSolutionOver);
        $(p.domObj[p._solutionBtn])
          .off('mouseout', setSolutionOver)
          .on('mouseout', setSolutionOver);
        $(p.domObj[p._solutionBtn])
          .removeClass('addPointer')
          .addClass('addPointer');
      } else {
        //p.solutionMC.gotoAndStop("_disable");
        //p.solutionMC.removeEventListener(MouseEvent.CLICK, showCorrectAnswer);
        gotoAndStopSoln(p._solutionBtn, '_disable');
        $(p.domObj[p._solutionBtn]).off('click', showCorrectAnswer);
        $(p.domObj[p._solutionBtn]).off('mousemove', setSolutionOver);
        $(p.domObj[p._solutionBtn]).off('mouseout', setSolutionOver);
        $(p.domObj[p._solutionBtn]).removeClass('addPointer');
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
        gotoAndStopReset(p._resetBtn, '_normal');
        $(p.resetMC)
          .off('click', resetIncorrectItems)
          .on('click', resetIncorrectItems);
        $(p.resetMC)
          .off('mousemove', setResetOver)
          .on('mousemove', setResetOver);
        $(p.resetMC)
          .off('mouseout', setResetOver)
          .on('mouseout', setResetOver);
        $(p.resetMC)
          .removeClass('addPointer')
          .addClass('addPointer');
      } else {
        //p.resetMC.gotoAndStop("_disable");
        //p.resetMC.removeEventListener(MouseEvent.CLICK, resetIncorrectItems);
        gotoAndStopReset(p._resetBtn, '_disable');
        $(p.resetMC).off('click', resetIncorrectItems);
        $(p.resetMC).off('mousemove', setResetOver);
        $(p.resetMC).off('mouseout', setResetOver);
        $(p.resetMC).removeClass('addPointer');
      }
    }
  }

  function setTickCross(elm) {
    var pLeft = 0; //parseFloat($(elm).css("left"))
    var pTop = 0; //parseFloat($(elm).css("top"))

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
    return {
      left: pLeft,
      top: pTop
    };
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
    /* switch(state)
        {
        case 1:
        $(p.domObj[elem]).hide()
        
        break;
        case "correct":
        $(p.domObj[elem]).show()
        setBackground(p.domObj[elem],"correct")
        break;
        case "incorrect":
        $(p.domObj[elem]).show()
        setBackground(p.domObj[elem],"incorrect")
        break;
        } */
  }

  function gotoAndStopSoln(elem, state) {
    if (p._imgObj[elem] || p._solutionImgType) {
      //// added by Nazmeen
      setBackground(p.domObj[elem], activityImageObj['solution' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_disable']);
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_selected']);
          break;
      }
    }

    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function gotoAndStopSubmit(elem, state) {
    if (p._imgObj[elem] || p._submitImgType) {
      //// added by Nazmeen
      setBackground(p.domObj[elem], activityImageObj['submit' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_disable']);
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.submit['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.submit['_disable']);
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_disable']);
          $(p.domObj[elem]).addClass(p._cssObj.submit['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.submit['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.submit['_selected']);
          break;
      }
    }
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function gotoAndStopReset(elem, state) {
    if (p._imgObj[elem.id] || p._resetImgType) {
      // added by Nazmeen
      // p.domObj[elem] added by Nazmeen
      setBackground(p.domObj[elem], activityImageObj['reset' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_disable']);
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.reset['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.reset['_disable']);
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_disable']);
          $(p.domObj[elem]).addClass(p._cssObj.reset['_over']);
          break;
        case '_down':
          break;
        case '_selected':
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.reset['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.reset['_selected']);
          break;
      }
    }
  }

    if (p._btnFontCssObj.subMc) {
      switch (state) {
        case '_normal':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc")
          break;
        case '_disable':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_D")
          break;
        case '_over':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_selected':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_down']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
        case '_down':
          $($(p.domObj[elem]).find('span')[0]).css('color', '');
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_disable']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_normal']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_over']
          );
          $($(p.domObj[elem]).find('span')[0]).removeClass(
            p._btnFontCssObj.subMc['_selected']
          );
          $($(p.domObj[elem]).find('span')[0]).addClass(
            p._btnFontCssObj.subMc[state]
          );
          //setBackground(elem, "submitMc_H")
          break;
      }
    }
  }

  function setBackground(elem, img) {
    //console.log(elem, img)

    if (img) {
      $(elem).css({
        background: 'url(' + img.src + ') no-repeat',
        'background-size': '100% 100%'
      });
    }
  }

  function higlightBaseItem() {
    //pr
    var i = 0; //int
    var mcBase; //:MovieClip;
    if (p.currentBaseItem != -1 && !p._interactive) {
      //var mc:MovieClip = rootRef.getChildByName(p._baseItemsArr[p.currentBaseItem]) as MovieClip;
      var mc = p._baseItemsArr[p.currentBaseItem];

      if (p._questionType == 'Type3') {
        if (p.baseObj[mc].currentCount < p.baseObj[mc].maxCount) {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            if (mcBase.currentCount < mcBase.maxCount) {
              //mcBase = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
              mcBase = p._baseItemsArr[i];
              //gotoAndStopDrop(p.baseObj[mcBase],1);
              gotoAndStopDrop(p.baseObj[mcBase], '_normal');
              p.baseObj[mcBase].isHighlighted = false;
            }
          }
          //mc.gotoAndStop("highlight");
          gotoAndStopDrop(p.baseObj[mc], '_over');
          p.baseObj[mc].isHighlighted = true;
        }
      } else {
        if (!mc.optMc) {
          for (i = 0; i < p.baseItemsArr.length; i++) {
            if (!mc.optMc) {
              //mcBase = rootRef.getChildByName(p.baseItemsArr[i]) as MovieClip;
              mcBase = p.baseItemsArr[i];
              //gotoAndStopDrop(p.baseObj[mcBase],1);
              gotoAndStopDrop(p.baseObj[mcBase], '_normal');
              p.baseObj[mcBase].isHighlighted = true;
            }
          }
          gotoAndStopDrag(p.optObj[mc], '_over');
          p.optObj[mc].isHighlighted = true;
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
              p.currentBaseItem++;
            } else {
              p.currentBaseItem = 0;
            }
            higlightBaseItem();
          } else {
            enableDisableSubmit(true);
          }
        }
      }
    }
  }

  function initBaseItems() {
    for (var i = 0; i < p._baseItemsArr.length; i++) {
      /* var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc.id = (i + 1);
            mc.gotoAndStop(1);
            mc.optMc = null;
            mc.optMcArr = new Array();
            mc.optMcArr.splice(0, mc.optMcArr.length); 
            mc.isOptMcCorrect = false; */
      //gotoAndStopDrop(p._baseItemsArr[i],1);
      gotoAndStopDrop(p._baseItemsArr[i], '_normal');

      //p.baseObj[p._baseItemsArr[i]].id=p._baseItemsArr[i]
      p.baseObj[p._baseItemsArr[i]].id = i + 1;
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
  }

  function gotoAndStopDrop(elem, state) {
    //setBackground(p.domObj[elem], p._imgObj[elem][state])
    /*  switch(state)
        {
        case 1:
        setBackground(p.domObj[elem],elem)
        break;
        case "_up":
        setBackground(p.domObj[elem],elem)
        break;
        case "_disable":
        setBackground(p.domObj[elem],elem)
        break;
        case "_over":
        setBackground(p.domObj[elem],elem)
        break;
        case "_down":
        setBackground(p.domObj[elem],elem)
        break;
        } */
  }

  function gotoAndStopDrag(elem, state) {
    if (p._imgObj[elem]) {
      setBackground(p.domObj[elem], activityImageObj[elem + state]);
    } else {
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
  }

  function onBaseMcMouseClickEvent(e) {
    var mcBase;
    //console.log("inside ")
    hideHandCursorOnBaseMc();
    mcBase = e.currentTarget.id;
    var b = true;
    if (
      p.questionType == 'Type3' &&
      p.baseObj[mcBase].currentCount >= p.baseObj[mcBase].maxCount
    ) {
      b = false;
    }
    //console.log("bbbbb", b);
    if (b) {
      //console.log("p.selectedMc ::" ,p.selectedMc)
      if (p.selectedMc) {
        var baseID = p.baseObj[mcBase].id; // Number(.split("_")[1])

        p.currentBaseItem = baseID - 1;
        //console.log("sssssssssssssdddddddddd   :::::::::::::::::::",p.selectedMc.baseMc)
        if (p.selectedMc.baseMc) {
          //console.log("sssssssssssssdddddddddd")
          p.baseObj[p.selectedMc.baseMc].currentCount--;
          //p.selectedMc.baseMc.gotoAndStop(1);
          //gotoAndStopDrop(p.selectedMc.baseMc,1);
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
            //p.baseObj[p.selectedMc.baseMc].optMcArr[m].x = getXPos(p.baseObj[p.selectedMc.baseMc].optMcArr[m]);
            //p.baseObj[p.selectedMc.baseMc].optMcArr[m].y = getYPos(p.baseObj[p.selectedMc.baseMc].optMcArr[m]);

            var elemIndex = p.baseObj[p.selectedMc.baseMc].optMcArr.indexOf(
              p.baseObj[p.selectedMc.baseMc].optMcArr[m]
            );

            var baseChild = $(p.domObj[p.selectedMc.baseMc])
              .children()
              .eq(elemIndex);
            ypostemp = parseFloat($(baseChild).css('top'));
            xpostemp = parseFloat($(baseChild).css('left'));

            ypos =
              ypostemp +
              parseFloat($(p.domObj[p.selectedMc.baseMc]).css('top'));
            xpos =
              xpostemp +
              parseFloat($(p.domObj[p.selectedMc.baseMc]).css('left'));

            var baseW1 = parseFloat($(baseChild).css('width')) / 2;
            var baseH1 = parseFloat($(baseChild).css('height')) / 2;
            var optW1 =
              parseFloat(
                $(p.domObj[p.baseObj[p.selectedMc.baseMc].optMcArr[m]]).css(
                  'width'
                )
              ) / 2;
            var optH1 =
              parseFloat(
                $(p.domObj[p.baseObj[p.selectedMc.baseMc].optMcArr[m]]).css(
                  'height'
                )
              ) / 2;
            $(p.domObj[p.baseObj[p.selectedMc.baseMc].optMcArr[m]]).css({
              left: xpos + baseW1 - optW1,
              top: ypos + baseH1 - optH1
            });
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
      gotoAndStopDrop(mcBase, '_disable');
      p.baseObj[mcBase].isHighlighted = false;
    }
  }

  function type1_onOptionMcMouseClickEvent(mcOpt) {
    p.tweenArr.splice(0, p.tweenArr.length);

    var isAllSelected1 = true;
    for (var i1 = 0; i1 < p._baseItemsArr.length; i1++) {
      //var mcBaseItem1 = rootRef.getChildByName(p._baseItemsArr[i1]) as MovieClip
      var mcBaseItem1 = p._baseItemsArr[i1];

      if (!p.baseObj[mcBaseItem1].optMc) {
        isAllSelected1 = false;
      }
    }

    /*  if (isAllSelected1)           /////////////// plz chk before removing there in flash 
        {				
        	p.currentBaseItem = -1;
        	
        }   */
    if (!p._interactive && p._questionType == 'Type1') {
      if (p.dummyMc != null) {
        p.dummyMc.x = p.dummyMc.orgX;
        p.dummyMc.y = p.dummyMc.orgY;

        p.currentBaseItem = 0;
      }
    }

    if (p.currentBaseItem != -1) {
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
        if (p.baseObj[mcBase].optMcArr.indexOf(mcOpt.id) == -1) {
          p.baseObj[mcBase].optMcArr.push(mcOpt.id);
        }

        //ypos = getYPos(mcOpt);
        //xpos = getXPos(mcOpt);
        var elemIndex = p.baseObj[mcOpt.baseMc].optMcArr.indexOf(mcOpt.id);
        var baseChild = $(p.domObj[mcBase])
          .children()
          .eq(elemIndex);

        ypostemp = parseFloat($(baseChild).css('top'));
        xpostemp = parseFloat($(baseChild).css('left'));

        ypos = ypostemp + parseFloat($(p.domObj[mcBase]).css('top'));
        xpos = xpostemp + parseFloat($(p.domObj[mcBase]).css('left'));
      }
      if (p._showTween) {
        /* rootRef.addChild(shp);
                p.myTweenX = new Tween(mcOpt, "x", Strong.easeInOut, mcOpt.x, xpos, p._tweenInterval, true);
                p.myTweenY = new Tween(mcOpt, "y", Strong.easeInOut, mcOpt.y, ypos, p._tweenInterval, true);
                p.tweenArr.push(p.myTweenX)
                p.tweenArr.push(p.myTweenY)
                p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish); */

        var baseW = parseFloat($(baseChild).css('width')) / 2;
        var baseH = parseFloat($(baseChild).css('height')) / 2;
        var optW = parseFloat($(p.domObj[mcOpt.id]).css('width')) / 2;
        var optH = parseFloat($(p.domObj[mcOpt.id]).css('height')) / 2;
        /* $("#"+p.hideDiv).show()
                    $("#"+mcOpt.id).animate({ 
                    "left":xpos+baseW-optW,
                      "top":ypos+baseH-optH
                    }, 500,function(){$("#"+p.hideDiv).hide() ); */
        animateDiv(
          p.domObj[mcOpt.id],
          xpos + baseW - optW,
          ypos + baseH - optH
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
        //gotoAndStopDrag(p.selectedMc.id,1);
        gotoAndStopDrag(p.selectedMc.id, '_normal');
        p.selectedMc.buttonMode = true;
        $(p.domObj[p.selectedMc.id]).addClass('addPointer');
        p.selectedMc = null;
      }
      if (!p._interactive && p._questionType == 'Type1') {
      } else {
        /* mcOpt.removeEventListener(MouseEvent.CLICK , onOptionMcMouseClickEvent);
                mcOpt.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                mcOpt.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);
                 */

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
            p.currentBaseItem++;
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
              p.currentBaseItem = -1;
              enableDisableSubmit(true);
            } else {
              p.currentBaseItem = 0;
              higlightBaseItem();
            }
          }
        }
      } else {
        p.currentBaseItem = -1;
        isAllSelected = true;
        var sum = 0;
        for (i = 0; i < p._baseItemsArr.length; i++) {
          //mcBaseItem = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip
          mcBaseItem = p._baseItemsArr[i];
          //if (!p.baseObj[mcBaseItem].optMc)
          sum = sum + p.baseObj[mcBaseItem].optMcArr.length;
        }
        if (sum != p._optItemsArr.length) {
          isAllSelected = false;
        }

        if (isAllSelected) {
          enableDisableSubmit(true);
        }
      }
    } else {
      onOptionMcMouseClickedAfterSelectionMc(mcOpt.id);
    }
  }

  function initOptionItems() {
    // pr
    for (var i = 0; i < p._optItemsArr.length; i++) {
      $(p.domObj[p._optItemsArr[i]]).addClass('gradientDragBox');
      if (!p.domObj[p._optItemsArr[i] + '_tick'] && p._visualFBMc) {
        var _elemTick = document.createElement('div');
        $(p.domObj[p._optItemsArr[i]]).append(_elemTick);
        var pos = setTickCross(p.domObj[p._optItemsArr[i]]);
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

        $(_elemTick).attr('id', p._optItemsArr[i] + '_tick');
        p.domObj[p._optItemsArr[i] + '_tick'] = _elemTick;
      }

      /* if(p._setClone)
            {
            	var cloneDiv=$(mc).clone().appendTo($(p.target))
            	$(mc).css({"z-index":2})
            	$(cloneDiv).css({"z-index":1,opacity:0.5}).removeClass("addPointer")
            } */
      //var mc = rootRef.getChildByName(p._optItemsArr[i]) as MovieClip;
      /* mc.id = (i + 1);
            mc.buttonMode = true;
            mc.gotoAndStop(1);
            mc.baseMc = null;
            mc.origX = mc.x;
            mc.origY = mc.y;
            mc.isCorrect = false;
            mc.mouseChildren = false;
            mc.type = "option"; */
      //trace("mc.width: " + mc.width);
      //gotoAndStopDrag(p._optItemsArr[i],1)
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
        /* 	mc.x = mcBase.x;
                	mc.y = mcBase.y;
                	mc.origX = mc.x;
                	mc.origY = mc.y;
                	mcBase.optMc = mc;
                	mc.baseMc = mcBase;
                	mc.orgBaseMc = mc.baseMc;
                	mcBase.orgOptMc = mcBase.optMc;
                	mcBase.gotoAndStop("disable")
                	
                	mc.removeEventListener(MouseEvent.CLICK , onOptionMcMouseClickEvent);
                	mc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                	mc.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);
                	 */
        /* p.optObj[p._optItemsArr[i]].origX="option";
                p.optObj[p._optItemsArr[i]].origY="option";
				
                p.optObj[p._optItemsArr[i]].baseMc=mcBase;
                p.optObj[p._optItemsArr[i]].orgBaseMc=p.optObj[p._optItemsArr[i]].baseMc; */

        gotoAndStopDrop('_disable', p.baseObj[mcBase]);
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
        //mc.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);
        $(mc)
          .off('click', onOptionMcMouseClickedAfterSelectionEvent)
          .on('click', onOptionMcMouseClickedAfterSelectionEvent);
      } else {
        //mc.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickEvent);
        $(mc)
          .off('click', onOptionMcMouseClickEvent)
          .on('click', onOptionMcMouseClickEvent);
      }
    }
  }

  function animateDiv(elem, x, y) {
    $(p.domObj[p.hideDiv]).show();
    $(elem).animate(
      {
        left: x,
        top: y
      },
      500,
      function(elem, x, y) {
        $(p.domObj[p.hideDiv]).hide();
        $(elem).css({
          left: x,
          top: y
        });
      }
    );
  }

  function showHandCursorOnBaseMc() {
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
    if (p.selectedMc) {
      showHandCursorOnBaseMc();
    } else {
      hideHandCursorOnBaseMc();
    }
  }

  function onOptionMcMouseClickedAfterSelectionMc(mcOpt) {
    //mcOpt:MovieClip
    if (p.currentBaseItem != -1) {
      //	var mcBase:MovieClip = (rootRef.getChildByName(p._baseItemsArr[p.currentBaseItem]) as MovieClip);
      var mcBase = p._baseItemsArr[p.currentBaseItem];
      if (p.baseObj[mcBase].currentCount >= p.baseObj[mcBase].maxCount) {
        gotoAndStopDrop(mcBase, '_disable');
        p.baseObj[mcBase].isHighlighted = false;
      } else {
        //gotoAndStopDrop(mcBase,1)
        gotoAndStopDrop(mcBase, '_normal');
        p.baseObj[mcBase].isHighlighted = false;
      }

      p.currentBaseItem = -1;
    }

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
      mouseOverDrag(p.selectedMc.id, true);
      p.selectedMc.buttonMode = true;
      $(p.domObj[p.selectedMc.id]).addClass('addPointer');
      //p.selectedMc.gotoAndStop(1)
      //gotoAndStopDrag(p.selectedMc.id,1);
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
      p.selectedMc = null;
      //mcOpt.gotoAndStop(1);
      //gotoAndStopDrag(mcOpt,1);
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
          if (!baseObj[p._baseItemsArr[i]].optMc) {
            isAllSelected = false;
          }
        }
        if (isAllSelected) {
          p.currentBaseItem = -1;
        } else {
          p.currentBaseItem = 0;
        }
      }
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
            //gotoAndStopDrag(p.selectedMc.id,1);
            gotoAndStopDrag(p.selectedMc.id, '_normal');
            //p.selectedMc.buttonMode = true;
            p.selectedMc.buttonMode = true;
            $(p.domObj[p.selectedMc.id]).addClass('addPointer');
            p.selectedMc = null;
            //mcOpt.gotoAndStop(1);
            //gotoAndStopDrag(mcOpt,1);
            gotoAndStopDrag(mcOpt, '_normal');
            p.optObj[mcOpt].buttonMode = true;
            $(p.domObj[p.optObj[mcOpt].id]).addClass('addPointer');
          }
          p.selectedMc = null;
          if (p._interactive) {
            p.currentBaseItem = -1;
          } else {
            p.currentBaseItem = 0;
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
      //gotoAndStopDrag(e.target.id,1)
      gotoAndStopDrag(e.currentTarget.id, '_normal');
    }
  }

  function xor(lhs, rhs) {
    return !(lhs && rhs) && (lhs || rhs);
  }

  function swapOptionsMc_withNoBase(mc1, mc2) {
    var tempMc;
    tempMc = mc1.baseMc;
    mc1.baseMc = mc2.baseMc;
    mc2.baseMc = tempMc;
    var m;
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

      //gotoAndStopDrag(mc1.id,1);
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
      mc2.x = mc2.origX;
      mc2.y = mc2.origY;

      $(p.domObj[mc2.id]).css({
        left: mc2.origX,
        top: mc2.origY
      });
      //gotoAndStopDrag(mc2.id,1);
      gotoAndStopDrag(mc2.id, '_normal');
      mouseOverDrag(mc2.id, true);
      mc2.buttonMode = true;
      $(p.domObj[mc2.id]).addClass('addPointer');
      /* mc2.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                mc2.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                mc2.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent); */
      $(mc2.id).off('click', onOptionMcMouseClickedAfterSelectionEvent);
      $(mc2.id).off('click', onOptionMcMouseClickEvent);
      $(mc2.id)
        .off('click', onOptionMcMouseClickEvent)
        .on('click', onOptionMcMouseClickEvent);
    }
    if (mc1.baseMc) {
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
        //p.baseObj[mc1.baseMc].optMcArr[m].x = getXPos(p.baseObj[mc1.baseMc].optMcArr[m]);
        //p.baseObj[mc1.baseMc].optMcArr[m].y = getYPos(p.baseObj[mc1.baseMc].optMcArr[m]);

        var elemIndex = p.baseObj[mc1.baseMc].optMcArr.indexOf(
          p.baseObj[mc1.baseMc].optMcArr[m]
        );

        var baseChild = $(p.domObj[mc1.baseMc])
          .children()
          .eq(elemIndex);
        ypostemp = parseFloat($(baseChild).css('top'));
        xpostemp = parseFloat($(baseChild).css('left'));

        ypos = ypostemp + parseFloat($(p.domObj[mc1.baseMc]).css('top'));
        xpos = xpostemp + parseFloat($(p.domObj[mc1.baseMc]).css('left'));

        var baseW1 = parseFloat($(baseChild).css('width')) / 2;
        var baseH1 = parseFloat($(baseChild).css('height')) / 2;
        var optW1 =
          parseFloat(
            $(p.domObj[p.baseObj[mc1.baseMc].optMcArr[m]]).css('width')
          ) / 2;
        var optH1 =
          parseFloat(
            $(p.domObj[p.baseObj[mc1.baseMc].optMcArr[m]]).css('height')
          ) / 2;

        $(p.domObj[p.baseObj[mc1.baseMc].optMcArr[m]]).css({
          left: xpos + baseW1 - optW1,
          top: ypos + baseH1 - optH1
        });
      }

      //gotoAndStopDrag(mc1.id,1);
      gotoAndStopDrag(mc1.id, '_normal');
      mouseOverDrag(mc1.id, true);
      mc1.buttonMode = true;
      $(p.domObj[mc1.id]).addClass('addPointer');
      //{
      //p.currentBaseItem = int(mc1.baseMc.id) - 1;

      //p.currentBaseItem =  Number((p.baseObj[mc1.baseMc].id).split("_")[1])-1
      p.currentBaseItem = Number(p.baseObj[mc1.baseMc].id - 1);

      //}
      mc1.baseMc = null;
      type1_onOptionMcMouseClickEvent(mc1);
    }
    if (mc2.baseMc) {
      p.baseObj[mc2.baseMc].currentCount--;

      p.baseObj[mc2.baseMc].optMc = mc2;
      if (p.baseObj[mc2.baseMc].optMcArr.indexOf(mc1.id) != -1) {
        p.baseObj[mc2.baseMc].optMcArr.splice(
          p.baseObj[mc2.baseMc].optMcArr.indexOf(mc1.id),
          1
        );
      }
      p.baseObj[mc2.baseMc].currentCount =
        p.baseObj[mc2.baseMc].optMcArr.length;
      for (var m = 0; m < p.baseObj[mc2.baseMc].optMcArr.length; m++) {
        //p.baseObj[mc2.baseMc].optMcArr[m].x = getXPos(p.baseObj[mc2.baseMc].optMcArr[m]);
        //p.baseObj[mc2.baseMc].optMcArr[m].y = getYPos(p.baseObj[mc2.baseMc].optMcArr[m]);

        var elemIndex = p.baseObj[mc2.baseMc].optMcArr.indexOf(
          p.baseObj[mc2.baseMc].optMcArr[m]
        );

        var baseChild = $(p.domObj[mc2.baseMc])
          .children()
          .eq(elemIndex);
        ypostemp = parseFloat($(baseChild).css('top'));
        xpostemp = parseFloat($(baseChild).css('left'));

        ypos = ypostemp + parseFloat($(p.domObj[mc2.baseMc]).css('top'));
        xpos = xpostemp + parseFloat($(p.domObj[mc2.baseMc]).css('left'));

        var baseW2 = parseFloat($(baseChild).css('width')) / 2;
        var baseH2 = parseFloat($(baseChild).css('height')) / 2;
        var optW2 =
          parseFloat(
            $(p.domObj[p.baseObj[mc2.baseMc].optMcArr[m]]).css('width')
          ) / 2;
        var optH2 =
          parseFloat(
            $(p.domObj[p.baseObj[mc2.baseMc].optMcArr[m]]).css('height')
          ) / 2;

        $(p.domObj[p.baseObj[mc2.baseMc].optMcArr[m]]).css({
          left: xpos + baseW2 - optW2,
          top: ypos + baseH2 - optH2
        });
      }
      //gotoAndStopDrag(mc2.id,1);
      gotoAndStopDrag(mc2.id, '_normal');
      mouseOverDrag(mc2.id, true);
      mc2.buttonMode = true;
      $(p.domObj[mc2.id]).addClass('addPointer');
      //{
      //p.currentBaseItem = int(mc2.baseMc.id) - 1;
      //p.currentBaseItem =  Number((p.baseObj[mc2.baseMc].id).split("_")[1])-1
      p.currentBaseItem = Number(p.baseObj[mc2.baseMc].id - 1);
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
      //var endPos = mc.baseMc.optMcArr.indexOf(mc);
      var endPos = p.baseObj[mc.baseMc].optMcArr.indexOf(mc.id);
      for (var i = 1; i <= endPos; i++) {
        totHeight += mc.baseMc.optMcArr[i].height + p._positionOffset;
      }
    }
    ypos += totHeight;
    return ypos;
  }

  function swapOptionsMc_type2(mc1, mc2) {
    /* var tempMc:MovieClip;
		
      }
    }
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
        	}
        	mc1.baseMc = null;
        	type2_onOptionMcMouseClickEvent(mc1);
        	mc1.removeEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc1.addEventListener(MouseEvent.CLICK , onOptionMcMouseClickedAfterSelectionEvent);	
        	mc1.buttonMode = true;
        }
        else
            //.......FeedbackObj.gotoAndPlay(type);
            //gotoAndPlayFb("correct","correct" + p.correctFeedbackCounter);
            if (p.navFbStartJson) {
              p._navController.updateButtons(p.navFbStartJson);
            }
        {
            if (p.individualFb) {
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
                  //   p._navController.updateButtons(p.updaterJsonEnd);
                }
              );
            } else {
              //  p._navController.updateButtons(p.updaterJsonEnd);
            }
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

      p.baseObj[mc2.baseMc].optMcArr[ind1] = mc2.id;
      p.baseObj[mc1.baseMc].optMcArr[ind2] = mc1.id;

      //trace(mc1.baseMc.optMcArr);
      //trace(mc2.baseMc.optMcArr);
      //xpos1 = getXPos(mc1);
      //ypos1 = getYPos(mc1);
      //xpos2 = getXPos(mc2);
      //ypos2 = getYPos(mc2);

      var elemIndex1 = ind2;

      var baseChild1 = $(p.domObj[mc1.baseMc])
        .children()
        .eq(elemIndex1);
      var ypostemp1 = parseFloat($(baseChild1).css('top'));
      var xpostemp1 = parseFloat($(baseChild1).css('left'));
      var ypos1 = ypostemp1 + parseFloat($(p.domObj[mc1.baseMc]).css('top'));
      var xpos1 = xpostemp1 + parseFloat($(p.domObj[mc1.baseMc]).css('left'));

      var elemIndex2 = ind1;
      var baseChild2 = $(p.domObj[mc2.baseMc])
        .children()
        .eq(elemIndex2);
      var ypostemp2 = parseFloat($(baseChild2).css('top'));
      var xpostemp2 = parseFloat($(baseChild2).css('left'));
      var ypos2 = ypostemp2 + parseFloat($(p.domObj[mc2.baseMc]).css('top'));
      var xpos2 = xpostemp2 + parseFloat($(p.domObj[mc2.baseMc]).css('left'));
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

      /* var baseW1=parseFloat($("#"+mc1.baseMc).css("width"))/2
            var baseH1=parseFloat($("#"+mc1.baseMc).css("height"))/2
            var optW1=parseFloat($("#"+mc1.id).css("width"))/2
            var optH1=parseFloat($("#"+mc1.id).css("height"))/2
			
            var baseW2=parseFloat($("#"+mc1.baseMc).css("width"))/2
            var baseH2=parseFloat($("#"+mc1.baseMc).css("height"))/2
            var optW2=parseFloat($("#"+mc2.id).css("width"))/2
            var optH2=parseFloat($("#"+mc2.id).css("height"))/2
			
            
            $("#"+mc1.id).animate({ 
            "left":xpos1+baseW1-optW1,
              "top":ypos1+baseH1-optH1
            }, 500 );
			
            $("#"+mc2.id).animate({ 
            "left":xpos2+baseW2-optW2,
              "top":ypos2+baseH2-optH2
            }, 500 ); */

      var baseW1 = parseFloat($(baseChild1).css('width')) / 2;
      var baseH1 = parseFloat($(baseChild1).css('height')) / 2;
      var optW1 = parseFloat($(p.domObj[mc1.id]).css('width')) / 2;
      var optH1 = parseFloat($(p.domObj[mc1.id]).css('height')) / 2;

      /* $("#"+mc1.id).animate({ 
			"left":xpos1+baseW1-optW1,
			  "top":ypos1+baseH1-optH1
			},500); */
      animateDiv(
        p.domObj[mc1.id],
        xpos1 + baseW1 - optW1,
        ypos1 + baseH1 - optH1
      );

      var baseW2 = parseFloat($(baseChild2).css('width')) / 2;
      var baseH2 = parseFloat($(baseChild2).css('height')) / 2;
      var optW2 = parseFloat($(p.domObj[mc2.id]).css('width')) / 2;
      var optH2 = parseFloat($(p.domObj[mc2.id]).css('height')) / 2;

      /* $("#"+mc2.id).animate({ 
			"left":xpos2+baseW2-optW2,
			  "top":ypos2+baseH2-optH2
			},500); */

      animateDiv(
        p.domObj[mc2.id],
        xpos2 + baseW2 - optW2,
        ypos2 + baseH2 - optH2
      );
    } else {
      /*  var baseW1=parseFloat($("#"+mc1.baseMc).css("width"))/2
			var baseH1=parseFloat($("#"+mc1.baseMc).css("height"))/2
			var optW1=parseFloat($("#"+mc1.id).css("width"))/2
			var optH1=parseFloat($("#"+mc1.id).css("height"))/2
			
			var baseW2=parseFloat($("#"+mc1.baseMc).css("width"))/2
			var baseH2=parseFloat($("#"+mc1.baseMc).css("height"))/2
			var optW2=parseFloat($("#"+mc2.id).css("width"))/2
			var optH2=parseFloat($("#"+mc2.id).css("height"))/2
			mc1.x = xpos1;
			mc1.y = ypos1;
			mc2.x = xpos2;
			mc2.y = ypos2;
			
			$("#"+mc1.id).css({ 
			"left":xpos1+baseW1-optW1,
			  "top":ypos1+baseH1-optH1
			}, 500 );
			
			$("#"+mc2.id).css({ 
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

                  //trace(mc.name);
                  mouseOverDrag(mc.optMc.id, true);
                  mc.optMc.buttonMode = true;
                  $(p.domObj[mc.optMc.id]).addClass('addPointer');
                  mc.optMc.gotoAndStop(1);
                  mc.gotoAndStop(1);
                  mc.isOptMcCorrect = false;
                  //trace("Shabbir Reached Here: Type4")
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
                  //trace("HERE")
                  mouseOverDrag(mc.optMc.id, false);
                  mc.optMc.buttonMode = false;
                  $(p.domObj[mc.optMc.id]).removeClass('addPointer');
                  mc.optMc.removeEventListener(
                    MouseEvent.CLICK,
                    onOptionMcMouseClickedAfterSelectionEvent
                  );
                  mc.isOptMcCorrect = true;
			"left":xpos2+baseW2-optW2,
			  "top":ypos2+baseH2-optH2
			}, 500 ); */
      var baseW1 = parseFloat($(baseChild1).css('width')) / 2;
      var baseH1 = parseFloat($(baseChild1).css('height')) / 2;
      var optW1 = parseFloat($(p.domObj[mc1.id]).css('width')) / 2;
      var optH1 = parseFloat($(p.domObj[mc1.id]).css('height')) / 2;

      $(p.domObj[mc1.id]).css({
        left: xpos1 + baseW1 - optW1,
        top: ypos1 + baseH1 - optH1
      });

      var baseW2 = parseFloat($(baseChild2).css('width')) / 2;
      var baseH2 = parseFloat($(baseChild2).css('height')) / 2;
      var optW2 = parseFloat($(p.domObj[mc2.id]).css('width')) / 2;
      var optH2 = parseFloat($(p.domObj[mc2.id]).css('height')) / 2;

      $(p.domObj[mc2.id]).css({
        left: xpos2 + baseW2 - optW2,
        top: ypos2 + baseH2 - optH2
      });
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
      type1_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
    if (p._questionType == 'Type2') {
      type2_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
    if (p._questionType == 'Type3') {
      type3_onOptionMcMouseClickEvent(p.optObj[e.currentTarget.id]);
    }
  }

  var checkCombination = false; // addded by Ajay for combinationFeedback 9/11/2016
  function validateCAC(e) {
    //pr e:MouseEvent = null
    enableDisableSubmit(false);
    enableDisableReset(false);
    p.allCorrect = true;
    var mc;
    var i;
    var j;
    var corrAns = [];
    var isCorrect = false;
    checkCombination = false; // addded by Ajay for combinationFeedback 9/11/2016

    if (p._questionType == 'Type3') {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
        mc = p.baseObj[p._baseItemsArr[i]];
        //console.log(mc , "  ::   mc" , p.optObj)
        isCorrect = true;
        for (var m = 0; m < mc.optMcArr.length; m++) {
          var mcOptArrMc = p.optObj[mc.optMcArr[m]];

          //gotoAndStopDrag(mcOptArrMc.id,1);
          gotoAndStopDrag(mcOptArrMc.id, '_normal');
          //corrAns = String(p._correctAnswers[mc.id - 1]).split(",");

          //var tmpoId=Number((mcOptArrMc.id).split("_")[1])
          //corrAns = String(p._correctAnswers[tmpoId-1]).split(",");

          var tmpoId = Number(mc.id - 1);
          corrAns = String(p._correctAnswers[tmpoId]).split(',');

          //trace("corrAns: " + corrAns);
          for (j = 0; j < corrAns.length; j++) {
            //trace("mc.optMc.id: "+ mc.optMc.id);
            //trace("Number(corrAns[" + j + "]): " + Number(corrAns[j]));
            //if (mcOptArrMc.id == Number(corrAns[j]))

            var optnId = Number(mcOptArrMc.id.split('_')[1]);
            if (optnId == Number(corrAns[j])) {
              mcOptArrMc.isCorrect = true;
              mc.isOptMcCorrect = true;
            }
          }

          if (mcOptArrMc.isCorrect) {
            checkCombination = true; // addded by Ajay for combinationFeedback 9/11/2016
            if (p.visFeedbackMC != null) {
              if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                //mcOptArrMc[p.visFeedbackMC].gotoAndStop("correct");
                gotoAndStopTick(mcOptArrMc.id + '_tick', 'correct');
              }
            }
          } else {
            p.allCorrect = false;
            isCorrect = false;
            if (p.visFeedbackMC != null) {
              if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                //	mcOptArrMc[p.visFeedbackMC].gotoAndStop("incorrect");
                gotoAndStopTick(mcOptArrMc.id + '_tick', 'incorrect');
              }
            }
          }
        }
        if (!isCorrect) {
          mc.isOptMcCorrect = false;
          if (p.visFeedbackMC != null) {
            if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
              //if (mc[p.visFeedbackMC])
              //{
              //mc[p.visFeedbackMC].gotoAndStop("incorrect")
              //gotoAndStopTick(mcOptArrMc.id+"_tick","incorrect");
              //}
            }
          }
        } else {
          mc.isOptMcCorrect = true;
          if (p.visFeedbackMC != null) {
            if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
              //if (mc[p.visFeedbackMC])
              //{
              //  mc[p.visFeedbackMC].gotoAndStop("correct");
              //gotoAndStopTick(mcOptArrMc.id+"_tick","correct");
              //}
            }
          }
        }
      }
    } else {
      for (i = 0; i < p._baseItemsArr.length; i++) {
        mc = p.baseObj[p._baseItemsArr[i]];
        isCorrect = false;
        if (mc.optMc) {
          //gotoAndStopDrag(mc.optMc.id,1);
          gotoAndStopDrag(mc.optMc.id, '_normal');

          var tmpoId = Number(mc.id.split('_')[1]);
          //corrAns = String(p._correctAnswers[mc.id - 1]).split(",");
          corrAns = String(p._correctAnswers[tmpoId - 1]).split(',');
          for (j = 0; j < corrAns.length; j++) {
            var optnId = Number(mc.optMc.id.split('_')[1]);
            if (optnId == Number(corrAns[j])) {
              if (p.visFeedbackMC != null) {
                if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
                  /* if (mc[p.visFeedbackMC])
                                    {
                                       mc[p.visFeedbackMC].gotoAndStopTick("correct");
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
    return {
      left: pLeft,
      top: pTop
    };
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
    /* switch(state)
        {
        case 1:
        $(p.domObj[elem]).hide()
        
        break;
        case "correct":
        $(p.domObj[elem]).show()
        setBackground(p.domObj[elem],"correct")
        break;
        case "incorrect":
        $(p.domObj[elem]).show()
        setBackground(p.domObj[elem],"incorrect")
        break;
        } */
  }

  function gotoAndStopSoln(elem, state) {
    if (p._imgObj[elem] || p._solutionImgType) {
      //// added by Nazmeen
      setBackground(p.domObj[elem], activityImageObj['solution' + state]);
    } else {
      switch (state) {
        case '_normal':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_normal']);
          break;
        case '_disable':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_disable']);
          break;
        case '_over':
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_disable']);
          $(p.domObj[elem]).addClass(p._cssObj.solution['_over']);
          break;
        case '_down':
          break;
        case '_selected':
                  }
                  mc.optMc = null;
                } else {
                  //trace("HERE")
                  mouseOverDrag(mc.optMc.id, false);
                  mc.optMc.buttonMode = false;
                  $(p.domObj[mc.optMc.id]).removeClass('addPointer');
                  //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickedAfterSelectionEvent
                  );

                  mc.isOptMcCorrect = true;
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_normal']);
              }
          $(p.domObj[elem]).removeClass(p._cssObj.solution['_over']);
          }
          enableDisableSolution(false);
          enableDisableSubmit(false);
          if (!p._interactive) {
            p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
          $(p.domObj[elem]).addClass(p._cssObj.solution['_selected']);
          break;
      }
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
          //console.log(p.allCorrect , "   ::   p.allCorrect")
          if (p.allCorrect) {
            //p.fbMC.gotoAndPlay("correct" + p.correctFeedbackCounter);

            //.......FeedbackObj.gotoAndPlay(type);
            //gotoAndPlayFb("correct","correct" + p.correctFeedbackCounter);
            if (p.navFbStartJson) {
              p._navController.updateButtons(p.navFbStartJson);
            }

            if (p.individualFb) {
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
                  //   p._navController.updateButtons(p.updaterJsonEnd);
                }
              );
            } else {
              //  p._navController.updateButtons(p.updaterJsonEnd);
            }

            enableDisableSolution(false);
            disableAll();
            //AddScore();
          } else {
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
              }
            }

            //p.fbMC.gotoAndPlay("incorrect" + p.incorrectFeedbackCounter);
            //gotoAndPlayFb("incorrect","incorrect" + p.incorrectFeedbackCounter);
            $(p.domObj[p.hideDiv]).show();
            if (p.navFbStartJson) {
              p._navController.updateButtons(p.navFbStartJson);
            }

            var checkFlag = false;
            ////console.log("outside combinationFb",p.combinationFb);
            if (p.combinationFb) {
              ////console.log("inside combinationFb");
              /* for (var i = 0; i < p._baseItemsArr.length; i++) {
                                if (p.baseObj[p._baseItemsArr[i]].optMc.isCorrect) {
                                    checkFlag = true;
									break;
                                }
                            } */
              //	console.log(mc , p.baseObj)
              /* for (var i = 0; i < p._baseItemsArr.length; i++) {
                                if (p.baseObj[p._baseItemsArr[i]].optMc.isCorrect) {
                                    checkFlag = true;
									break;
                                }
                            } */

              ////console.log("outside checkFlag",checkFlag)

              if (checkCombination) {
                // addded by Ajay for combinationFeedback 9/11/2016
                ////console.log("inside checkFlag",checkFlag);
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

  function disableAll() {
    for (var i = 0; i < p._optItemsArr.length; i++) {
      //var mc = rootRef.getChildByName(p._optItemsArr[i]) as MovieClip;
      var mc = p._optItemsArr[i];
      //mc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
      //mc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
      $(p.domObj[mc]).off('click', onOptionMcMouseClickEvent);
      $(p.domObj[mc]).off('click', onOptionMcMouseClickedAfterSelectionEvent);
      mouseOverDrag(mc, false);
      p.optObj[mc].buttonMode = false;
      $(p.domObj[p.optObj[mc].id]).removeClass('addPointer');
    }
    for (i = 0; i < p._baseItemsArr.length; i++) {
      //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
      //mc.removeEventListener(MouseEvent.CLICK, onBaseMcMouseClickEvent);
      mc = p._baseItemsArr[i];
      $(p.domObj[mc]).off('click', onBaseMcMouseClickEvent);
      p.baseObj[mc].buttonMode = false;
      $(p.domObj[p.baseObj[mc].id]).removeClass('addPointer');
      //gotoAndStopDrop(mc,1);
      gotoAndStopDrop(mc, '_normal');
    }
    /* for (i = 0; i < type2_holderMc.numChildren; i++)
        {
        	mc = type2_holderMc.getChildAt(i) as MovieClip;
        	mc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
        	mc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
        	mc.buttonMode = false;
        } */

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
    //trace("Reset All Correct: " +  p.allCorrect);
    if (!p.allCorrect) {
      var i;
      var mc;
      if (p.attemptCnt <= p._noOfAttempts || p.isUnlimitedAttempt) {
        if (p._questionType == 'Type4') {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
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

                  //trace(mc.name);
                  mouseOverDrag(mc.optMc.id, true);
                  mc.optMc.buttonMode = true;
                  $(p.domObj[mc.optMc.id]).addClass('addPointer');
                  mc.optMc.gotoAndStop(1);
                  mc.gotoAndStop(1);
                  mc.isOptMcCorrect = false;
                  //trace("Shabbir Reached Here: Type4")
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
                  //trace("HERE")
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
            //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              //gotoAndStopDrop(mc.id,1);
              gotoAndStopDrop(p._baseItemsArr[i], '_normal');
              for (var m = 0; m < mc.optMcArr.length; m++) {
                //var mcOptArrMc:MovieClip = mc.optMcArr[m] as MovieClip;
                var mcOptArrMc = p.optObj[mc.optMcArr[m]];
                //trace(mcOptArrMc.name +" RESET")
                if (mcOptArrMc) {
                  if (!mcOptArrMc.isCorrect) {
                    if (p.visFeedbackMC != null) {
                      if (
                        p._validationMethod == 'Individual' &&
                        p.visFeedbackMC
                      ) {
                        //reset visual fb mc
                        //if (mc[p.visFeedbackMC])
                        //{
                        // mc[p.visFeedbackMC].gotoAndStop(1);
                        //}
                        //mcOptArrMc[p.visFeedbackMC].gotoAndStop(1);
                        gotoAndStopTick(mcOptArrMc.id + '_tick', 1);
                      }
                    }

                    if (p._showTween) {
                      /* rootRef.addChild(shp);
											p.myTweenX = new Tween(mcOptArrMc, "x", Strong.easeInOut, mcOptArrMc.x, mcOptArrMc.origX, p._tweenInterval, true);
											p.myTweenY = new Tween(mcOptArrMc, "y", Strong.easeInOut, mcOptArrMc.y, mcOptArrMc.origY, p._tweenInterval, true);
											p.tweenArr.push(p.myTweenX);
											p.tweenArr.push(p.myTweenY);
											p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
										 */

                      /* $("#"+mcOptArrMc.id).animate({ 
									 "left":mcOptArrMc.origX,
									  "top":mcOptArrMc.origY
									}, 500 );  */

                      animateDiv(
                        p.domObj[mcOptArrMc.id],
                        mcOptArrMc.origX,
                        mcOptArrMc.origY
                      );
                    } else {
                      mcOptArrMc.x = mcOptArrMc.origX;
                      mcOptArrMc.y = mcOptArrMc.origY;

                      $(p.domObj[mcOptArrMc.id]).css({
                        left: mcOptArrMc.origX,
                        top: mcOptArrMc.origY
                      });
                    }

                    //trace(mc.name);

                    /* mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                                        mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                                        mouseOverDrag(mcOptArrMc.id,true)*/
                    mcOptArrMc.buttonMode = true;
                    $(p.domObj[mcOptArrMc.id]).off(
                      'click',
                      onOptionMcMouseClickedAfterSelectionEvent
                    );
                    $(p.domObj[mcOptArrMc.id]).off(
                      'click',
                      onOptionMcMouseClickEvent
                    );
                    mouseOverDrag(mcOptArrMc.id, true);
                    //mcOptArrMc.buttonMode = true;
                    $(p.domObj[mcOptArrMc.id]).addClass('addPointer');
                    //mcOptArrMc.gotoAndStop(1);
                    //gotoAndStopDrag(mcOptArrMc.id,1)
                    gotoAndStopDrag(mcOptArrMc.id, '_normal');
                    //mc.gotoAndStop(1);
                    //gotoAndStopDrop(mc.id,1);

                    gotoAndStopDrop(p._baseItemsArr[i], '_normal');
                    mc.isOptMcCorrect = false;
                    mcOptArrMc.baseMc = null;

                    //mcOptArrMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
                    $(p.domObj[mcOptArrMc.id])
                      .off('click', onOptionMcMouseClickEvent)
                      .on('click', onOptionMcMouseClickEvent);
                    mc.optMc = null;
                  } else {
                    //trace("HERE")
                    mouseOverDrag(mcOptArrMc.id, false);
                    mcOptArrMc.buttonMode = false;
                    $(p.domObj[mcOptArrMc.id]).removeClass('addPointer');
                    //mcOptArrMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                    $(p.domObj[mcOptArrMc.id]).off(
                      'click',
                      onOptionMcMouseClickedAfterSelectionEvent
                    );
                    mc.isOptMcCorrect = true;
                  }
                }
              }
            }
          }

          for (i = 0; i < p._baseItemsArr.length; i++) {
            //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              for (m = 0; m < mc.optMcArr.length; m++) {
                //trace(mc.name + "Splice: " + mc.optMcArr[m].name +" isCorrect: "+mc.optMcArr[m].isCorrect);
                if (!p.optObj[mc.optMcArr[m]].isCorrect) {
                  mc.optMcArr.splice(m, 1);
                  m--;
                }
              }
              //trace(mc.name +" :: " + mc.optMcArr);
              mc.currentCount = mc.optMcArr.length;
              for (m = 0; m < mc.optMcArr.length; m++) {
                //	mc.optMcArr[m].x = getXPos(mc.optMcArr[m]);
                //	mc.optMcArr[m].y = getYPos(mc.optMcArr[m]);

                var elemIndex = mc.optMcArr.indexOf(mc.optMcArr[m]);

                var baseChild = $(p.domObj[p._baseItemsArr[i]])
                  .children()
                  .eq(elemIndex);

                var ypostemp = parseFloat($(baseChild).css('top'));
                var xpostemp = parseFloat($(baseChild).css('left'));

                ypos =
                  ypostemp +
                  parseFloat($(p.domObj[p._baseItemsArr[i]]).css('top'));
                xpos =
                  xpostemp +
                  parseFloat($(p.domObj[p._baseItemsArr[i]]).css('left'));
                var baseW2 = parseFloat($(baseChild).css('width')) / 2;
                var baseH2 = parseFloat($(baseChild).css('height')) / 2;
                var optW2 =
                  parseFloat($(p.domObj[mc.optMcArr[m]]).css('width')) / 2;
                var optH2 =
                  parseFloat($(p.domObj[mc.optMcArr[m]]).css('height')) / 2;

                $(p.domObj[mc.optMcArr[m]]).css({
                  left: xpos + baseW2 - optW2,
                  top: ypos + baseH2 - optH2
                });
              }
            }
          }
          enableDisableSolution(false);
          enableDisableSubmit(false);
          if (!p._interactive) {
            p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
        } else {
          for (i = 0; i < p._baseItemsArr.length; i++) {
            //mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
            mc = p.baseObj[p._baseItemsArr[i]];
            if (mc) {
              //gotoAndStopDrop(mc.id,1);

              gotoAndStopDrop(p._baseItemsArr[i], '_normal');
              if (mc.optMc) {
                if (!mc.optMc.isCorrect) {
                  mc.currentCount = 1;
                  if (p.visFeedbackMC != null) {
                    if (
                      p._validationMethod == 'Individual' &&
                      p.visFeedbackMC
                    ) {
                      //reset visual fb mc
                      /* if (mc[p.visFeedbackMC])
                                            {
                                              mc[p.visFeedbackMC].gotoAndStop(1);
                                            }
                                            mc.optMc[p.visFeedbackMC].gotoAndStop(1); */

                      gotoAndStopTick(mc.optMc.id + '_tick', 1);
                    }
                  }
                  if (p._showTween) {
                    /* rootRef.addChild(shp);
										p.myTweenX = new Tween(mc.optMc, "x", Strong.easeInOut, mc.optMc.x, mc.optMc.origX, p._tweenInterval, true);
										p.myTweenY = new Tween(mc.optMc, "y", Strong.easeInOut, mc.optMc.y, mc.optMc.origY, p._tweenInterval, true);
										p.tweenArr.push(p.myTweenX);
										p.tweenArr.push(p.myTweenY);
										p.myTweenX.addEventListener(TweenEvent.MOTION_FINISH, onFinish);
									 */
                    /* 	var baseW=parseFloat($("#"+mc.id).css("width"))/2
                                        	var baseH=parseFloat($("#"+mc.id).css("height"))/2
                                        	var optW=parseFloat($("#"+mc.optMc.id).css("width"))/2
                                        	var optH=parseFloat($("#"+mc.optMc.id).css("height"))/2 */

                    /* $("#"+mc.optMc.id).animate({ 
                                        "left":mc.optMc.origX,
                                          "top": mc.optMc.origY
                                        }, 500 ); */
                    animateDiv(
                      p.domObj[mc.optMc.id],
                      mc.optMc.origX,
                      mc.optMc.origY
                    );
                  } else {
                    mc.optMc.x = mc.optMc.origX;
                    mc.optMc.y = mc.optMc.origY;

                    $(p.domObj[mc.optMc.id]).css({
                      left: mc.optMc.origX,
                      top: mc.optMc.origY
                    });
                  }

                  //trace(mc.name);

                  //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                  //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
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
                  //gotoAndStopDrag(mc.optMc.id,1);
                  gotoAndStopDrag(mc.optMc.id, '_normal');
                  //gotoAndStopDrop(mc.id,1);

                  gotoAndStopDrop(p._baseItemsArr[i], '_normal');
                  mc.isOptMcCorrect = false;
                  mc.optMc.baseMc = null;

                  if (mc.optMc.type == 'created') {
                    type2_holderMc.removeChild(mc.optMc);
                  } else {
                    if (p._questionType == 'Type1' && p._interactive) {
                      //mc.optMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                      $(p.domObj[mc.optMc.id])
                        .off('click', onOptionMcMouseClickedAfterSelectionEvent)
                        .on('click', onOptionMcMouseClickedAfterSelectionEvent);
                    } else {
                      //mc.optMc.addEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
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
                  //mc.optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
                  $(p.domObj[mc.optMc.id]).off(
                    'click',
                    onOptionMcMouseClickedAfterSelectionEvent
                  );

                  mc.isOptMcCorrect = true;
                }
              }
            }
          }
          enableDisableSolution(false);
          enableDisableSubmit(false);
          if (!p._interactive) {
            p.currentBaseItem = 0;
            higlightBaseItem();
          } else {
            p.currentBaseItem = -1;
          }
        }
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
        /* 	var custFunction:Function = rootRef[p._customFnCall];
                	custFunction();
                	AddScore(); */
      }
    }
  }

  /*
   * Method called by solution button or resetIncorrect method (if solution button is not available)
   * to display the correct answer and disable the activity.
   * @param	e
   */
  function showCorrectAnswer(e) {
    //pr e:MouseEvent = null
    p.tweenArr.splice(0, p.tweenArr.length);
    //trace("SHOW CORRECT");
    var optMc;
    if (p.solutionMC) {
      enableDisableSolution(false);
    }
    if (p.submitMC) {
      enableDisableSubmit(false);
    }

    for (var k = 0; k < p._optItemsArr.length; k++) {
      //optMc = rootRef.getChildByName(p._optItemsArr[k]) as MovieClip;
      optMc = p.optObj[p._optItemsArr[k]];
      if (optMc) {
        if (!optMc.isCorrect) {
          optMc.x = optMc.origX;
          optMc.y = optMc.origY;
          $(p.domObj[optMc.id]).css({
            left: optMc.origX,
            top: optMc.origY
          });
          //optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickEvent);
          //optMc.removeEventListener(MouseEvent.CLICK, onOptionMcMouseClickedAfterSelectionEvent);
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
            //for(var jj=0;jj<p._optItemsArr.length;jj++)
            //gotoAndStopTick(p._optItemsArr[jj]+"_tick",1)

            gotoAndStopTick(optMc.id + '_tick', 1);
          }
        }
      }
    }
    /* for (k = 0; k < type2_holderMc.numChildren ; k++) {
        	optMc = type2_holderMc.getChildAt(k) as MovieClip;	
        	if(optMc)
        	{
        		if(!optMc.isCorrect)
        		{
        			type2_holderMc.removeChild(optMc);
        		}
        		else
        		{
        			if(p.visFeedbackMC != null)
        			{
        				if(p._validationMethod == "Individual" && p.visFeedbackMC){
        					optMc[p.visFeedbackMC].gotoAndStop(1);
        				}
        			}
        		}
        	}
        }
         */

    for (var i = 0; i < p._baseItemsArr.length; i++) {
      //var mc = rootRef.getChildByName(p._baseItemsArr[i]) as MovieClip;
      var mc = p.baseObj[p._baseItemsArr[i]];
      //gotoAndStopDrop(mc.id,1);
      //gotoAndStopDrop(mc.id,"_normal");
      gotoAndStopDrop(p._baseItemsArr[i], '_normal');
      if (p.visFeedbackMC != null) {
        if (p._validationMethod == 'Individual' && p.visFeedbackMC) {
          /* if (mc[p.visFeedbackMC])
                    {
                     mc[p.visFeedbackMC].gotoAndStop(1);
                    } */
          //gotoAndStopTick(p._baseItemsArr[i]+"_tick",1)

          for (var jj = 0; jj < p._optItemsArr.length; jj++)
            gotoAndStopTick(p._optItemsArr[jj] + '_tick', 1);
        }
      }
      //trace(mc.name+" :: "+mc.isOptMcCorrect);

      //var corrAns = String(p._correctAnswers[mc.id - 1]).split(",");
      //var tmpoId=Number((mc.id).split("_")[1])
      var tmpoId = Number(mc.id - 1);
      var corrAns = String(p._correctAnswers[tmpoId]).split(',');

      for (var j = 0; j < corrAns.length; j++) {
        if (p._questionType == 'Type2') {
        } else {
          optMc = p.optObj[p._optItemsArr[corrAns[j] - 1]];
        }
        if (optMc) {
          //trace(optMc.name+" name " + optMc.isCorrect);
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
              if (mc.optMcArr.indexOf(optMc.id) == -1) {
                mc.optMcArr.push(optMc.id);
              }

              optMc.baseMc = mc;
              //xpos = getXPos(optMc);
              //ypos = getYPos(optMc);

              var elemIndex = mc.optMcArr.indexOf(optMc.id);

              var baseChild = $(p.domObj[p._baseItemsArr[i]])
                .children()
                .eq(elemIndex);

              var ypostemp = parseFloat($(baseChild).css('top'));
              var xpostemp = parseFloat($(baseChild).css('left'));

              ypos =
                ypostemp +
                parseFloat($(p.domObj[p._baseItemsArr[i]]).css('top'));
              xpos =
                xpostemp +
                parseFloat($(p.domObj[p._baseItemsArr[i]]).css('left'));
            }
            if (p._showTween) {
              var baseW2 = parseFloat($(baseChild).css('width')) / 2;
              var baseH2 = parseFloat($(baseChild).css('height')) / 2;
              var optW2 = parseFloat($(p.domObj[optMc.id]).css('width')) / 2;
              var optH2 = parseFloat($(p.domObj[optMc.id]).css('height')) / 2;

              animateDiv(
                p.domObj[optMc.id],
                xpos + baseW2 - optW2,
                ypos + baseH2 - optH2
              );
            } else {
              var baseW2 = parseFloat($(baseChild).css('width')) / 2;
              var baseH2 = parseFloat($(baseChild).css('height')) / 2;
              var optW2 = parseFloat($(p.domObj[optMc.id]).css('width')) / 2;
              var optH2 = parseFloat($(p.domObj[optMc.id]).css('height')) / 2;

              $(p.domObj[optMc.id]).css(
                {
                  left: xpos + baseW2 - optW2,
                  top: ypos + baseH2 - optH2
                },
                500
              );
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
    //gotoAndPlayFb("answer","answer")
    if (p.navFbStartJson) {
      p._navController.updateButtons(p.navFbStartJson);
    }
    var _audioPath;
    if (p.feedbackParam['answer']) {
      _audioPath = p._shellModel.getMediaPath() + p.feedbackParam['answer'];
    }
    p.feedBack({
      status: 'answer',
      curStatus: 'answer',
      popup: 'answer',
      _shellModel: p._shellModel,
      retStatus: 'answer',
      audioPath: _audioPath,
      feedbackParam: p.feedbackParam,
      jsflObj: p.feedbackParam['jsfl_answer'],
      videoFb: p.feedbackParam['video_answer']
    });

    if (p._jumpScreen.startFrame) {
      p._navController.displayTimelineVideo(
        p._jumpScreen.startFrame,
        p._jumpScreen.endFrame,
        function() {
          //   p._navController.updateButtons(p.updaterJsonEnd);
        }
      );
    } else {
      // p._navController.updateButtons(p.updaterJsonEnd);
    }
    disableAll();
    enableDisableSolution(false);
    enableDisableReset(false);
    /* if (p._customFnCall != "") {
        	var custFunction:Function = rootRef[p._customFnCall];
        	custFunction();
        }  */
    //setting correct options on completing max attempt
    setCorrect();
  }

  function type3_onOptionMcMouseClickEvent(mcOpt) {
    type1_onOptionMcMouseClickEvent(mcOpt);
  }

  var audioObj;

  /*   function gotoAndPlayFb(type, _audio)
    {
        switch (type)
        {
        case "correct":
            checkForPopUP(_audio)
            playSound("audio_video/" + p._activityAudioNo + "" + _audio + ".mp3");
            p._navController.updateButtons(p.updaterJsonEnd);
            break;
        case "incorrect":
            $(p.domObj[p.hideDiv]).show();
            $(p.domObj[_audio]).show();
            playSound("audio_video/" + p._activityAudioNo + "" + _audio + ".mp3", function ()
            {
                resetIncorrectItems();
                $(p.domObj[p.hideDiv]).hide();
                $(p.domObj[_audio]).hide();

            }); // how to chk audio present or not
            checkForPopUP(_audio)
            break;
        case "answer":
            checkForPopUP(_audio)
            playSound("audio_video/" + _audio + ".mp3");
            break;
        }
    }
 */
  function checkForPopUP(_audio) {
    if ($(p.target).children(p.domObj[_audio])[0]) {
      var corFb = $(p.target).children(p.domObj[_audio])[0];
      var closeBtn = $(p.target).children(p.domObj[_audio + '_Close'])[0];
      $(corFb).show();
      $(closeBtn).show();
      $(closeBtn).addClass('addPointer');
      $(closeBtn)
        .off('mousemove', overCloseBtn)
        .on('mousemove', overCloseBtn);
      $(closeBtn)
        .off('mouseout', overCloseBtn)
        .on('mouseout', overCloseBtn);
      $(closeBtn)
        .off('click', clickedCloseBtn)
        .on(
          'click',
          {
            popElem: corFb
          },
          clickedCloseBtn
        );
    }
  }

  function overCloseBtn(e) {
    if (e.type == 'mousemove') {
      $(p.domObj[e.target.id]).css({
        background: 'url(images/closeMc_H.png) no-repeat',
        'background-size': '100% 100%'
      });
    } else {
      $(p.domObj[e.currentTarget.id]).css({
        background: 'url(images/closeMc.png) no-repeat',
        'background-size': '100% 100%'
      });
    }
  }

  function clickedCloseBtn(e) {
    $(p.domObj[e.target.id]).removeClass('addPointer');
    $(p.domObj[e.target.id]).hide();
    $(e.data.popElem).hide();
    audioObj.stop();
  }

  function playSound(_audio, _fun) {
    audioObj.stop();
    if (_audio) {
      audioObj.playAudio(_audio, function() {
        // fire event after audio ends
        if (_fun) _fun();
      });
    }
  }
  // below function is added by Nazmeen
  function gotoAndPlayFeedBack(_status, _curStatus, _retStatus) {
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
  // below function is added by Nazmeen
  function disableActTemp(shFlag) {
    if (shFlag) {
      $(p.domObj['hideDiv']).show();
    } else {
      $(p.domObj['hideDiv']).hide();
    }
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
};
