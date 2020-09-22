var feedBackClass = function() {
  var p = {
    audioFinish: false,
    popupPresent: false,
    popupCloseBtnPresent: false,
    prevFb: null,
    pElem: {
      pageDataParam: {},
      sliderParam: {},
      videoManagerParam: {},
      otherParam: {}
    },
    canvasctx: null,
    closeImg: {}
  };
  var _thisObj = this;
  var audioObj;
  var pageDataJson;
  var drawTextObj = new DrawText();
  var sliderObj = {};
  var videoManagerObj = {};
  var custToolTip;
  var _closeBtnDiv;
  var _closeBtnGlow;
  var sliderbackPatch;
  var replaybtn;
  var pausebtn;
  var playbtn;
  var sliderElem;
  var loadImgCnt = 0,
    loadedImgCnt = 0;
  var activityImageObj = new Object();
  var popupParam;
  var _elemFB;
  var _elemFBCanvas;
  var _elemFBCtx;
  var newImg = [];
  var _circleDiv;
  var requestAnim;
  var feedbackFinished = false;
  var feedbackVideoFinished = false;
  var feedbackStart = false;
  var customToolTipDiv, customToolTipArrowDiv;
  function custooltip() {
    var refArray = p._shellModel.getDomElementReference();

    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'customToolTip') {
        customToolTipDiv = refArray[i];
      }
      if (refArray[i].data('uniqueId') == 'toolTipArrow') {
        customToolTipArrowDiv = refArray[i];
      }
    }
    custToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);
  }
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  this.init = function(_obj) {
    var _tempObj = new Object();
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    preloadImages(_tempObj, '1');
  };
  function preloadImages(_obj, _var) {
    loadedImgCnt = 0;
    loadImgCnt = 0;
    if (Object.keys(_obj).length) {
      for (var i in _obj) {
        var _tempImg = new Image();
        _tempImg.onload = _var == '1' ? imgloaded : imgloader;
        _tempImg.src = _obj[i];
        activityImageObj[i] = _tempImg;
        loadImgCnt++;
      }
    } else {
      _var == '1' ? startActivity() : startFeedback();
    }
  }
  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }
  function imgloader() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startFeedback();
    }
  }
  function startActivity() {
    audioObj = new AudioPlayerNormalClass();
    custooltip();
  }
  function startFeedback() {
    gotoAndPlayFb();
    /* createDynamicFeedbackBox();    // added by Ajay
		if(p.pElem.videoFb.closeBtnType=="1"){ // added by Ajay
			closeButtonFn();
		}
		closeBtnFn(); 
		loadJSON(); */
  }

  this.handleFeedBack = function(e) {
    p.pElem = e;
    p.prevFb = e;
    feedbackFinished = false;
    var _tempObj = new Object();

    preloadImages(_tempObj);
  };
  /* this.stopAll = function() {
		audioObj.stop();
	    for(var i in p.domObj)
			{
				$(p.domObj[i]).remove();
			}
	        for(var i in p.domObj)
			{
			$(p.domObj[i]).off("mouseup", eventHandler)
			$(p.domObj[i]).off("mouseover", eventHandler)
			$(p.domObj[i]).off("mouseout", eventHandler)
			$(p.domObj[i]).off("click", eventHandler)
	         }
	
	} */

  this.stopAll = function() {
    audioObj.stop();
    p._shellModel.setExceptionDuration(null);
    cancelAnimationFrame(requestAnim);
    for (var i in sliderObj) {
      sliderObj[i].destroy();
    }
    if (p.objVideoPlayer) {
      p.objVideoPlayer.updateSliderSource();
    }
    EventBus.removeEventListener(
      'slider_drag_complete',
      sliderDragStopped,
      _thisObj
    );
    EventBus.removeEventListener('videoSeeked', videoSeekSuccess, _thisObj);

    for (var i in p.domObj) {
      $(p.domObj[i]).off('mouseup', eventHandler);
      $(p.domObj[i]).off('mouseover', eventHandler);
      $(p.domObj[i]).off('mouseout', eventHandler);
      $(p.domObj[i]).off('click', eventHandler);
      $(p.domObj[i]).remove();
    }
  };

  this.clearPrevFeedback = function() {
    //////console.log( "  :: reqID");
    //cancelAnimationFrame(reqID);
    if (p.prevFb) {
      audioObj.stop();
      p._shellModel.setExceptionDuration(null);
      cancelAnimationFrame(requestAnim);
      //////console.log("p.objVideoPlayer",p.objVideoPlayer)
      //p.objVideoPlayer.pauseVideo()
      $(p.domObj['playButton']).hide();
      $(p.domObj['pauseButton']).hide();
      $(p.domObj['replayButton']).hide();
      if (p.prevFb.videoFb.sliderParam) {
        $(
          p.domObj[p.prevFb.videoFb.sliderParam.sliderDivId + '_backPatch']
        ).hide();
        $(p.domObj[p.prevFb.videoFb.sliderParam.sliderDivId]).hide();
      }
      if (
        p.prevFb.videoFb.playPauseControls &&
        p.prevFb.videoFb.playPauseControls.type == 1
      ) {
        $(p.domObj[p.prevFb.elemId + '_backPatch']).hide();
      }
      $(_elemFBCloseBtn).remove();
      delete p.prevFb;
      delete p.pElem;
    }
  };

  var preloaderObj;
  function gotoAndPlayFb() {
    feedbackStart = true;
    preloaderObj = p._shellModel.getPreLoaderReference();
    preloaderObj.displayVideoLoader();
    if (p.pElem.videoFb.sliderParam) {
      sliderObj[p.pElem.videoFb.sliderParam.sliderDivId] = new VideoSliderClass(
        _thisObj
      );
      if (p.pElem.videoFb.sliderParam.sliderDivId) {
        designMySlider();
        var tObj = p._navController.getVideoManager(); //videoManagerObj[p.pElem.videoFb.mcID]
        //sliderObj[p.pElem.videoFb.sliderParam.sliderDivId].init($(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]), p.pElem.videoFb.sliderParam.type, p.pElem.videoFb.sliderParam.duration, p.pElem.videoFb.sliderParam.sliderStart, p.pElem.videoFb.sliderParam.showDurationToolTip, tObj,customToolTipDiv,customToolTipArrowDiv);
        var sf = p.pElem.videoFb.videoParams.start / p._shellModel.getFps(); //but this is duration
        var ef = p.pElem.videoFb.videoParams.end / p._shellModel.getFps(); //start frame
        sliderObj[p.pElem.videoFb.sliderParam.sliderDivId].init(
          $(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]),
          p.pElem.videoFb.sliderParam.type,
          ef,
          sf,
          p.pElem.videoFb.sliderParam.showDurationToolTip,
          tObj,
          customToolTipDiv,
          customToolTipArrowDiv
        );
        //sliderObj[p.pElem.videoFb.sliderParam.sliderDivId].displaySlider(p.pElem.videoFb.sliderParam.cssParam.x,p.pElem.videoFb.sliderParam.cssParam.y, p.pElem.videoFb.sliderParam.cssParam.width,p.pElem.videoFb.sliderParam.cssParam.height,p.pElem.videoFb.sliderParam.cssParam.color);
      }
    }
    if (
      p.pElem.videoFb.playPauseControls &&
      p.pElem.videoFb.playPauseControls.type == 1
    ) {
      designPlayPauseControl1();
    }
    createCloseBtn();
    //displayTimelineVideo(p.pElem.videoFb.videoParams.start,p.pElem.videoFb.videoParams.end,videoEndCallBack)

    setTimeLine();
  }
  var _elemFBCloseBtn;
  function createCloseBtn() {
    if (p.pElem.videoFb.closeBtnParam) {
      _elemFBCloseBtn = document.createElement('div');

      $(_elemFBCloseBtn).attr('id', p.pElem.elemId + '_Close');
      p.domObj[p.pElem.elemId + '_Close'] = _elemFBCloseBtn;

      $(_elemFBCloseBtn)
        .css({
          position: 'absolute',
          left: p.pElem.videoFb.closeBtnParam.x + 'px',
          top: p.pElem.videoFb.closeBtnParam.y + 'px',
          width: p.pElem.videoFb.closeBtnParam.width + 'px',
          height: p.pElem.videoFb.closeBtnParam.height + 'px',
          'background-color': 'rgba(0,0,0,0)'
          //"border":"1px solid yellow",
        })
        .hide()
        .addClass('addPointer');
      $(p.domObj[p.pElem._commonData._target]).append(_elemFBCloseBtn);
      $(_elemFBCloseBtn)
        .off('click', closeBtnClicked)
        .on('click', {}, closeBtnClicked);

      p.domObj[p.pElem.elemId + '_Close'] = _elemFBCloseBtn;
      //domObj from Feedback
      if (p.fbDomObj) {
        p.fbDomObj(p.domObj);
      }
    }
  }
  function closeBtnClicked(e) {
    $(p.domObj[e.target.id]).removeClass('addPointer');
    $(p.domObj[e.target.id]).hide();
    p._shellModel.setExceptionDuration(null);
    cancelAnimationFrame(requestAnim);
    p.objVideoPlayer.pauseVideo();
    $(p.domObj['playButton']).hide();
    $(p.domObj['pauseButton']).hide();
    $(p.domObj['replayButton']).hide();
    if (p.pElem.videoFb.sliderParam) {
      p.objVideoPlayer.updateSliderSource();
      $(
        p.domObj[p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch']
      ).hide();
      $(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]).hide();
    }
    if (
      p.pElem.videoFb.playPauseControls &&
      p.pElem.videoFb.playPauseControls.type == 1
    ) {
      $(p.domObj[p.pElem.elemId + '_backPatch']).hide();
    }
    //p._shellModel.getPreLoaderReference().displayVideoLoader();
    p.objVideoPlayer.setVideoCurrentTime(
      p.pElem._commonData._homeScreenFrame / p._shellModel.getFps()
    );
    feedbackFinished = true;
    //	p.feedBackComplete(p.pElem);
    var z = p._shellModel.getDomElementReference();
    z[2][0].width = z[2][0].width;
  }

  function videoClosed(e) {
    console.log(z[0][0]);
    z[0][0].addEventListener('timeupdate', hello);
  }
  var count = 0;
  function hello(e) {
    console.log(e, 'closed');
    var z = p._shellModel.getDomElementReference();
    z[0][0].removeEventListener('timeupdate', hello);
  }
  function displayTimelineVideo(_start, _end, _callback) {
    p.objVideoPlayer = p._navController.getVideoManager();
    //p._shellModel.getPreLoaderReference().displayVideoLoader();
    p.startTime = _start / p._shellModel.getFps();
    p._shellModel.setExceptionDuration(_end - _start);
    p.endTime = _end / p._shellModel.getFps();
    p.callBack = _callback;
    if (p.pElem.videoFb.sliderParam) {
      p.objVideoPlayer.updateSliderSource();
      p.objVideoPlayer.updateSliderSource(
        sliderObj[p.pElem.videoFb.sliderParam.sliderDivId]
      );
    }
    p.objVideoPlayer.setVideoCurrentTime(p.startTime);
    p.objVideoPlayer.playVideo();
    playpauseVideo(true);
    managePlayPause();
    if (requestAnim) cancelAnimationFrame(requestAnim);
    checkVideoTime();
  }

  function checkVideoTime() {
    var currTime = p.objVideoPlayer.getVideoElement().currentTime;
    //console.log("currTime " , currTime);
    var stop = false;

    if (currTime >= p.endTime) {
      p.objVideoPlayer.pauseVideo();
      // p._shellModel.setExceptionDuration(null);
      cancelAnimationFrame(requestAnim);
      stop = true;
      feedbackVideoFinished = true;
      if (p.callBack) {
        p.callBack();
      }
    } else {
      feedbackVideoFinished = false;
      requestAnim = requestAnimFrame(function() {
        checkVideoTime();
      });
    }
    p.pElem.playBack({ e: currTime, stop: stop });
  }

  function videoEndCallBack() {
    //console.log("im done")
    //	if (videoManagerObj[p.pElem.videoFb.mcID].getVideoEndedStatus())
    //	{
    //	cancelAnimationFrame(reqID);
    if (p.videoDone) {
      p.videoDone(p.pElem);
    }
    if (
      p.pElem.videoFb.playPauseControls &&
      p.pElem.videoFb.playPauseControls.type == 1
    ) {
      $(p.domObj['playButton'])
        .removeClass('btnPlay')
        .addClass('btnDisablePlay');
      $(p.domObj['pauseButton'])
        .removeClass('btnPause')
        .addClass('btnDiablePause');
    }
    updatePlayPauseStateEvent('replay');
    //glowCloseBtn();
    // if(!p.pElem.videoFb.closeBtnParam)
    // feedbackFinished=true;
    if (p.pElem.videoFb.hideVideo) {
      p._shellModel.setExceptionDuration(null);
      cancelAnimationFrame(requestAnim);
      p.objVideoPlayer.pauseVideo();
      $(p.domObj['playButton']).hide();
      $(p.domObj['pauseButton']).hide();
      $(p.domObj['replayButton']).hide();
      if (p.pElem.videoFb.sliderParam) {
        p.objVideoPlayer.updateSliderSource();
        $(
          p.domObj[p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch']
        ).hide();
        $(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]).hide();
      }
      if (
        p.pElem.videoFb.playPauseControls &&
        p.pElem.videoFb.playPauseControls.type == 1
      ) {
        $(p.domObj[p.pElem.elemId + '_backPatch']).hide();
      }

      p.objVideoPlayer.setVideoCurrentTime(
        p.pElem._commonData._homeScreenFrame / p._shellModel.getFps()
      );
      var z = p._shellModel.getDomElementReference();
      z[2][0].width = z[2][0].width;
      if (p.pElem.videoFb.hideVideo) {
        feedbackFinished = true;
      }

      //p.feedBackComplete(p.pElem);

      /* 	if (!p.popupPresent || !p.popupCloseBtnPresent) {
						if ((p.popupPresent || p.pElem.videoFb.hideVideo)) {
							//	$(p.domObj[p.pElem.videoFb.mcID]).hide();
							//$(p.domObj[p.pElem.popup]).hide()
							//$(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).hide()
							if(p.pElem.videoFb.sliderParam)
							{
							$(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]).hide()
							}
							//$(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]).hide()
							//$(p.domObj[p.pElem.videoFb.videoManagerParam.dummyImgCanvas]).hide()
							
							$(p.domObj["playButton"]).hide();
							$(p.domObj["pauseButton"]).hide();
							$(p.domObj["replayButton"]).hide();
						   
						
						}
						//clearGlow() 
						playpauseVideo(false);
						
						p.audioFinish = false
						p.popupCloseBtnPresent = false
						p.popupPresent = false
						p.feedBackComplete(p.pElem);
					} */
    }
    //	}
  }
  function createDynamicFeedbackBox() {
    var tempName = p.pElem.videoFb.mcID + '_popup';
    if (
      p.pElem.videoFb[tempName] &&
      p.pElem.videoFb[tempName].type == 'type1'
    ) {
      fbType1();
    } else {
      if (p.pElem.videoFb.closeBtnImg && p.pElem.videoFb.closeBtnImg.over) {
        p.closeImg.over =
          p._shellModel.getMediaPath() + p.pElem.videoFb.closeBtnImg.over;
        //p.pElem.videoFb.closeBtnImg.over=p._shellModel.getMediaPath()+p.pElem.videoFb.closeBtnImg.over
      }
      if (p.pElem.videoFb.closeBtnImg && p.pElem.videoFb.closeBtnImg.normal) {
        p.closeImg.normal =
          p._shellModel.getMediaPath() + p.pElem.videoFb.closeBtnImg.normal;
        //p.pElem.videoFb.closeBtnImg.normal=p._shellModel.getMediaPath()+p.pElem.videoFb.closeBtnImg.normal
      }
    }
  }

  function fbType1() {
    var tempName = p.pElem.videoFb.mcID + '_popup';
    popupParam = p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'];
    _elemFB = document.createElement('div');
    $(p.domObj[p.pElem.videoFb.mcID + '_fbBox']).css({
      'background-color': p.pElem.videoFb[tempName].backColor
    });
    $(_elemFB).css({
      position: 'absolute',
      left: popupParam.x + 'px',
      top: popupParam.y + 'px',
      width: popupParam.width + 'px',
      height: popupParam.height + 'px'
    });
    $(p.domObj[p.pElem.videoFb.mcID + '_fbBox']).append(_elemFB);
    _elemFBCanvas = document.createElement('canvas');
    _elemFBCtx = _elemFBCanvas.getContext('2d');
    $(_elemFBCanvas).css({
      position: 'absolute',
      left: '0px',
      top: '0px'
    });
    _elemFBCanvas.width = popupParam.width;
    _elemFBCanvas.height = popupParam.height;
    $(_elemFB).append(_elemFBCanvas);

    var piceFirstW = 235;
    var piceFirstH = 114;

    var piceLastW = 26;
    var piceBottomH = 40;

    var centerW = popupParam.width - piceFirstW - piceLastW;
    var centerH = popupParam.height - piceFirstH - piceBottomH;

    _elemFBCtx.drawImage(activityImageObj[0], 0, 0, piceFirstW, piceFirstH);
    _elemFBCtx.drawImage(
      activityImageObj[1],
      piceFirstW,
      0,
      centerW,
      piceFirstH
    );
    _elemFBCtx.drawImage(
      activityImageObj[2],
      piceFirstW + centerW,
      0,
      piceLastW,
      piceFirstH
    );

    _elemFBCtx.drawImage(
      activityImageObj[3],
      0,
      piceFirstH,
      piceFirstW,
      centerH
    );
    _elemFBCtx.drawImage(
      activityImageObj[4],
      piceFirstW,
      piceFirstH,
      centerW,
      centerH
    );
    _elemFBCtx.drawImage(
      activityImageObj[5],
      piceFirstW + centerW,
      piceFirstH,
      piceLastW,
      centerH
    );

    _elemFBCtx.drawImage(
      activityImageObj[6],
      0,
      piceFirstH + centerH,
      piceFirstW,
      piceBottomH
    );
    _elemFBCtx.drawImage(
      activityImageObj[7],
      piceFirstW,
      piceFirstH + centerH,
      centerW,
      piceBottomH
    );
    _elemFBCtx.drawImage(
      activityImageObj[8],
      piceFirstW + centerW,
      piceFirstH + centerH,
      piceLastW,
      piceBottomH
    );

    var _closeBtnDiv = document.createElement('div');
    $(_elemFB).append(_closeBtnDiv);
    $(_closeBtnDiv).attr('id', p.pElem.videoFb.mcID + '_Close');
    p.domObj[p.pElem.videoFb.mcID + '_Close'] = _closeBtnDiv;
    p.pElem.videoFb.closeBtnID = p.pElem.videoFb.mcID + '_Close';
    p.pElem.videoFb.closeBtnImg = {};

    /* p.pElem.videoFb.closeBtnImg.normal="commonAssets/images/fb/type1/closeMc.png";
        p.pElem.videoFb.closeBtnImg.over="commonAssets/images/fb/type1/closeMc_H.png";
		p.closeImg.over =  p.pElem.videoFb.closeBtnImg.over
		p.closeImg.normal =  p.pElem.videoFb.closeBtnImg.normal */
    $(_closeBtnDiv).css({
      position: 'absolute',
      left: popupParam.width - 90 + 'px',
      top: popupParam.height - 47 + 'px',
      width: 96 + 'px',
      height: 56 + 'px',
      background: 'url(' + activityImageObj.closeImg_normal.src + ') no-repeat',
      //"background": "url(" + p.closeImg.normal + ") no-repeat",
      'background-size': '100% 100%',
      'z-index': 10
    });
    if (
      p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY &&
      p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x
    ) {
      var cleft = p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x;
      var cTop = p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.y;
    } else {
      cleft = 50;
      cTop = 50;
    }
    if (p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleType) {
      _circleDiv = document.createElement('div');
      $(_elemFB).append(_circleDiv);
      $(_circleDiv).css({
        position: 'absolute',
        left: cleft + 'px',
        top: cTop + 'px',
        width: 42 + 'px',
        height: 42 + 'px',
        background: 'url(' + activityImageObj.circle.src + ') no-repeat',
        //"background": "url(commonAssets/images/fb/type1/circle" + p.pElem.videoFb[p.pElem.videoFb.mcID+"_popup"].circleType + ".png) no-repeat",
        'background-size': '100% 100%'
      });
    }
    for (i in p.pElem.videoFb[tempName].txtArr) {
      var elemID = p.pElem.videoFb[tempName].txtArr[i];
      createTextElem(elemID, _elemFB);
      if (i == 'title') {
        var tLeft = 50 + 42 + 10;
        var tTop = 35;
        if (
          p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY &&
          p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x
        ) {
          tLeft =
            p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x +
            42 +
            10;
          tTop =
            p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.y + 10;
        }
        if (p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleType == '') {
          tLeft = 50;
        }

        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: tLeft,
          top: tTop,
          width: popupParam.width - (50 + 42 + 20)
        });
      } else if (i == 'content') {
        var tempLeft = 50;
        var tempTop = 60;
        if (p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleType) {
          var tempTop = 105;
        }

        if (
          p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY &&
          p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x
        ) {
          tempLeft =
            p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.x;
          tempTop =
            p.pElem.videoFb[p.pElem.videoFb.mcID + '_popup'].circleXY.y + 55;
        }
        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: tempLeft,
          top: tempTop,
          width: popupParam.width - 50
        });
      }
    }
  }

  function createTextElem(elemId, parent) {
    if (p._shellModel.getTextValue(elemId)) {
      var _elemChild = document.createElement('div');
      $(parent).append(_elemChild);
      $(_elemChild).html(p._shellModel.getTextValue(elemId));
      $(_elemChild).attr('id', elemId);

      $(_elemChild).css({
        'pointer-events': 'none'
      });

      p.domObj[elemId] = $(_elemChild);
      ////////////////////////////console.log(p.domObj[elemId],parent)
    }
  }

  function closeBtnFn() {
    if (p.pElem.videoFb.closeBtnID) {
      var closeBtn = p.domObj[p.pElem.videoFb.closeBtnID];
      if (closeBtn) {
        p.popupCloseBtnPresent = true;
        $(closeBtn).show();
        $(closeBtn).addClass('addPointer');
        $(closeBtn)
          .off('mousemove', overCloseBtn)
          .on('mousemove', overCloseBtn);
        $(closeBtn)
          .off('mouseover', overCloseBtn)
          .on('mouseover', overCloseBtn);
        $(closeBtn)
          .off('mouseout', overCloseBtn)
          .on('mouseout', overCloseBtn);
        $(closeBtn)
          .off('click', clickedCloseBtn)
          .on('click', {}, clickedCloseBtn);
      }
    }
  }

  function overCloseBtn(e) {
    if (e.type == 'mousemove') {
      $(p.domObj[e.target.id]).css({
        background: 'url(' + activityImageObj.closeImg_over.src + ') no-repeat',

        'background-size': '100% 100%'
      });
    } else {
      $(p.domObj[e.target.id]).css({
        background:
          'url(' + activityImageObj.closeImg_normal.src + ') no-repeat',

        'background-size': '100% 100%'
      });
      if (e.type == 'mouseout' && p.pElem.videoFb.closeBtnType == '1') {
        custToolTip.hideToolTip();
      }
    }
    if (e.type == 'mouseover' && p.pElem.videoFb.closeBtnType == '1') {
      var toolLeft1 = parseFloat($(p.domObj[e.target.id]).offset().left);
      var toolTop1 = parseFloat($(p.domObj[e.target.id]).offset().top);
      var toolW1 = parseFloat($(p.domObj[e.target.id]).css('width'));

      custToolTip.showToolTip(toolTop1, toolLeft1, toolW1, 'Close', 'left');
    }
  }

  /* function clickedCloseBtn(e) {
		$(p.domObj[e.target.id]).removeClass("addPointer")
		$(p.domObj[e.target.id]).hide()
		$(e.data.popElem).hide()
		audioObj.stop();
		playpauseVideo(false);
		$(p.domObj[p.pElem.videoFb.mcID]).hide();
		$(p.domObj["playButton"]).hide();
		$(p.domObj["pauseButton"]).hide();
		$(p.domObj["replayButton"]).hide();
		
		$(p.domObj[p.pElem.videoFb.mcID]).hide()
		$(p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]).hide()
		$(p.domObj[p.pElem.videoFb.mcID]).hide();
		
		p.videoFinish = false
		p.audioFinish = false
		p.popupCloseBtnPresent = false
		p.popupPresent = false
		cancelAnimationFrame(reqID);
		clearGlow()
		p.feedBackComplete(p.pElem);
	}
 */
  /* 	function playSound(_audio, _fun) {
		isFirstPlay = false;
		audioObj.stop();
		_function = null;
		_function = _fun;
		if (_audio) {
			audioObj.playAudio(p._shellModel.getMediaPath()+_audio, function() 
			{
				p.audioFinish = true
				
                   if(p.pElem.videoFb.audioParam.autoHide)
				   {
						$(p.domObj[p.pElem.videoFb.mcID]).hide()
						p.feedBackComplete(p.pElem);
						 if(p.pElem.videoFb.jsflObj)
						 {
							for(var i=0;i<p.pElem.videoFb.jsflObj.canvasID.length;i++)
							{
								correctjsfl[i].stop();
							}							
						 }
				   }else
				   {
					 if(p.pElem.videoFb.jsflObj)
					 {
						for(var i=0;i<p.pElem.videoFb.jsflObj.canvasID.length;i++)
						{
							correctjsfl[i].stop();
						}							
					 }
					 if(p.videoDone)
				{
					p.videoDone(p.pElem); 
					}
					
					updatePlayPauseStateEvent("replay");
					glowCloseBtn();
				   }
			},false,1,"",p.pElem.videoFb.jsflObj?audioPlayBack:_function)
		}
	}
	var _function = null;
	function audioPlayBack(t)
	{
		_function(t);
		if(p.pElem.videoFb.jsflObj)
		{
			for(var i=0;i<p.pElem.videoFb.jsflObj.canvasID.length;i++)
			{
				if(p.pElem.videoFb.pageDataParam){
					drawTextObj.drawTextFrame(p.pElem.videoFb.jsflObj.startFrame[i] + Math.floor(t*24));
				}
				correctjsfl[i].setFrame(p.pElem.videoFb.jsflObj.startFrame[i] + Math.floor(t*24))
			}
		}
	} */

  /* 	
	var correctjsfl = []
	var jsflCounter = 0;
	var isFirstPlay = true


	function showVideo() {
		if (p.pElem.videoFb) {
			
			videoSlider(); // added by Ajay
			
		}
	}

	function loadJSON() 
	{
		if ( p.pElem.videoFb.pageDataParam) 
		{
			////////////////console.log(p.pElem.videoFb.pageDataParam.fileName , "  :: json filename")
			var jqxhr = $.getJSON(p._shellModel.getMediaPath()+p.pElem.videoFb.pageDataParam.fileName, function(jsonData) {
				pageDataJson = jsonData;
				if (p.pElem.videoFb.pageDataParam.textDivId) {
					
					var _filePath = p.pElem.videoFb.pageDataParam.fileName.replace("json","images");
					_filePath = _filePath.replace(".json",".txt");
					p._shellModel.getServiceObj().getImageTextFile(_filePath,_thisObj); //need to change replace function  in future in require 
					
					
				}
			}).done(function(jsonData) {
				
				if(p.pElem.videoFb.jsflObj && sliderObj[p.pElem.videoFb.mcID]) 
				{
					if(p.pElem.videoFb.sliderParam)
						sliderObj[p.pElem.videoFb.mcID].displaySlider(p.pElem.videoFb.sliderParam.cssParam.x,p.pElem.videoFb.sliderParam.cssParam.y, p.pElem.videoFb.sliderParam.cssParam.width,p.pElem.videoFb.sliderParam.cssParam.height,p.pElem.videoFb.sliderParam.cssParam.color);
					managePlayPause();
				}
				
			}).fail(function() {
			});
		}
		 else 
		{
			
			if(p.pElem.videoFb.audioParam)
				audioObj.play();
			if(p.pElem.videoFb.videoManagerParam){
				setVideo();
			}
		} 
	};
 */
  //====================================================
  var imageDataLoaded,
    loadedCnt = 0,
    loadCnt = 0;
  //====================================================
  EventBus.addEventListener('imgageTextLoaded', checkImageTextLoad, _thisObj);
  //====================================================

  //====================================================
  function checkImageTextLoad(event, parentClass, data) {
    if (parentClass === _thisObj) {
      var imgData = p._shellModel.getServiceObj().getImgData();
      loadImages(JXG.decompress(imgData));
    }
  }
  //====================================================
  function loadImages(imageDataObj) {
    var _imgArr = imageDataObj.split('~^');
    imageDataLoaded = new Object();
    for (var j = 0; j < _imgArr.length - 1; j++) {
      var _arr1 = _imgArr[j].split('^~');
      //////////////////console.log(" in j " , loadCnt , _arr1[0]);
      imageDataLoaded[_arr1[0]] = new Image();
      imageDataLoaded[_arr1[0]].onload = imgloadedCheck;
      imageDataLoaded[_arr1[0]].src = _arr1[1];
      loadCnt++;
    }
  }
  //====================================================
  function imgloadedCheck() {
    loadedCnt++;
    if (loadedCnt == loadCnt) {
      drawTextObj.init(
        pageDataJson,
        $(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]),
        pageDataJson.dataObj.totalFrames,
        [],
        [],
        p._shellModel.getiFrameRef(),
        imageDataLoaded
      );

      if (p.pElem.videoFb.videoManagerParam) {
        setVideo();
      }
    }
  }
  //====================================================

  /* function videoSlider() {
		
		if (p.pElem.videoFb.sliderParam) 
		{
			var sliderObjCopy = null
			var slideCssParam = {}
			if (!p.pElem.videoFb.sliderParam.duration) {
				p.pElem.videoFb.sliderParam.duration = pageDataJson.dataObj.totalFrames / pageDataJson.dataObj.frameRate;
			}
			///////////////////////////////////
			if(p.pElem.videoFb.sliderType==1)
			{
			designSlider()
			}
			
			if (p.pElem.videoFb.sliderParam.sliderDivId) 
			{
				
				var tObj = videoManagerObj[p.pElem.videoFb.mcID]
				sliderObjCopy = sliderObj[p.pElem.videoFb.mcID]
				if(!tObj)
				{
					tObj = 	audioObj;					
					audioObj.setSliderObj(sliderObjCopy);
				}	
				sliderObj[p.pElem.videoFb.mcID].init($(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]), p.pElem.videoFb.sliderParam.type, p.pElem.videoFb.sliderParam.duration, p.pElem.videoFb.sliderParam.sliderStart, p.pElem.videoFb.sliderParam.showDurationToolTip, tObj,customToolTipDiv,customToolTipArrowDiv);
				slideCssParam = p.pElem.videoFb.sliderParam.cssParam
			}
		}
		if(p.pElem.videoFb.playPauseControls && p.pElem.videoFb.playPauseControls.type==1)
		{
		designPlayPauseControl1()
		}
	if(p.pElem.videoFb.videoManagerParam)
		{
		
		var dummyImg = null;
		if (p.pElem.videoFb.videoManagerParam.dummyImgCanvas) {
			var dummyImg = p.pElem.videoFb.videoManagerParam.dummyImgCanvas
		}
		videoManagerObj[p.pElem.videoFb.mcID].init($(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]), dummyImg);
		
		var isPosterImage = false;
		if (p.pElem.videoFb.videoManagerParam.dummyImgCanvas) {
			isPosterImage = true;
		}
		var vLeft = parseFloat($(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css("left"))
		var vTop = parseFloat($(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css("top"))
		var vWidth = parseFloat($(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css("width"))
		var vHeight = parseFloat($(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css("height"))
		playpauseState = false;
		if(p.pElem.videoFb.otherParam.autoPlay)
		{
		playpauseState = true;
		}
		
		videoManagerObj[p.pElem.videoFb.mcID].loadVideo(p._shellModel.getMediaPath()+p.pElem.videoFb.videoManagerParam.videoPath, p.pElem.videoFb.otherParam.autoPlay, false, false, vLeft, vTop, vWidth, vHeight, sliderObjCopy, slideCssParam);
		
			videoManagerObj[p.pElem.videoFb.mcID].playVideo();
			EventBus.removeEventListener("videoDataLoaded", videoLoaded, this);
			EventBus.addEventListener("videoDataLoaded", videoLoaded, this);
		
		}
	}
	function videoLoaded(){         // added
		videoManagerObj[p.pElem.videoFb.mcID].pauseVideo();
		EventBus.removeEventListener("videoDataLoaded", videoLoaded, this);
	}

	var myInterval;

	function setVideo() {
	cancelAnimationFrame(reqID);
		myInterval = setInterval(function() {
			checkVideoLoadStatus()
		}, 200);
	
	}

	function checkVideoLoadStatus() {
	
		var status = videoManagerObj[p.pElem.videoFb.mcID].getVideoLoadedStatus();
		if (status) {			
			clearInterval(myInterval);
			playpauseVideo(true);
			checkVideoTime();
			managePlayPause();
		}
	};
	
	 var reqID; */
  /* function checkVideoTime() {
		reqID = requestAnimFrame(checkVideoTime);
		
		if (videoManagerObj[p.pElem.videoFb.mcID].getVideoPlayStatus()) {
			if (p.pElem.videoFb.pageDataParam.textDivId) {
				var currentTime = videoManagerObj[p.pElem.videoFb.mcID].getVideoCurrentTime();
				var frameRate = 24
				if (p.pElem.videoFb.pageDataParam.fileName) {
					frameRate = pageDataJson.dataObj.frameRate
				}
				currentFrame = Math.ceil((currentTime * 1000) / ((1 / frameRate) * 1000));
				drawTextObj.drawTextFrame(currentFrame);
			}
		
		} else {
				
			if (videoManagerObj[p.pElem.videoFb.mcID].getVideoEndedStatus()) 
			{
				cancelAnimationFrame(reqID);				
				if(p.videoDone)
				{
	            p.videoDone(p.pElem);
				}
				if(p.pElem.videoFb.playPauseControls && p.pElem.videoFb.playPauseControls.type==1)
				{
				$(p.domObj["playButton"]).removeClass("btnPlay").addClass("btnDisablePlay");
				$(p.domObj["pauseButton"]).removeClass("btnPause").addClass("btnDiablePause");
                 }
				updatePlayPauseStateEvent("replay");
				glowCloseBtn();
				if (p.pElem.videoFb.otherParam.hideVideo) {
					if (!p.popupPresent || !p.popupCloseBtnPresent) {
						if ((p.popupPresent || p.pElem.videoFb.otherParam.hideVideo)) {
								$(p.domObj[p.pElem.videoFb.mcID]).hide();
							$(p.domObj[p.pElem.popup]).hide()
							$(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).hide()
							if(p.pElem.videoFb.sliderParam)
							{
							$(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]).hide()
							}
							$(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]).hide()
							$(p.domObj[p.pElem.videoFb.videoManagerParam.dummyImgCanvas]).hide()
							
							$(p.domObj["playButton"]).hide();
							$(p.domObj["pauseButton"]).hide();
							$(p.domObj["replayButton"]).hide();
						   
						
						}
						clearGlow() 
						playpauseVideo(false);
						p.feedBackComplete(p.pElem);
						p.audioFinish = false
						p.popupCloseBtnPresent = false
						p.popupPresent = false
					}
				}
			}
		}
	}; */

  function navEvents(elem, state) {
    if (state) {
      $(p.domObj[elem])
        .off('mouseup', eventHandler)
        .on('mouseup', eventHandler);
      $(p.domObj[elem])
        .off('mouseover', eventHandler)
        .on('mouseover', eventHandler);
      $(p.domObj[elem])
        .off('mouseout', eventHandler)
        .on('mouseout', eventHandler);
      $(p.domObj[elem])
        .off('click', eventHandler)
        .on('click', eventHandler);
    } else {
      $(p.domObj[elem]).off('mouseup', eventHandler);
      $(p.domObj[elem]).off('mouseover', eventHandler);
      $(p.domObj[elem]).off('mouseout', eventHandler);
      $(p.domObj[elem]).off('click', eventHandler);
    }
  }

  function eventHandler(e) {
    switch (e.type) {
      case 'mouseup':
        break;
      case 'mouseover':
        var toolLeft = parseFloat($(p.domObj[e.target.id]).offset().left);
        var toolTop = parseFloat($(p.domObj[e.target.id]).offset().top);
        var toolW = parseFloat($(p.domObj[e.target.id]).css('width'));
        if (e.target.id == 'playButton') {
          custToolTip.showToolTip(toolTop, toolLeft, toolW, 'Play');
        } else if (e.target.id == 'pauseButton') {
          custToolTip.showToolTip(toolTop, toolLeft, toolW, 'Pause');
        } else if (e.target.id == 'replayButton') {
          custToolTip.showToolTip(toolTop, toolLeft, toolW, 'Replay');
        }

        break;
      case 'mouseout':
        if (e.target.id == 'playButton') {
          custToolTip.hideToolTip();
        } else if (e.target.id == 'pauseButton') {
          custToolTip.hideToolTip();
        } else if (e.target.id == 'replayButton') {
          custToolTip.hideToolTip();
        }

        break;
      case 'click':
        if (e.target.id == 'playButton') {
          playpauseVideo(true);
          managePlayPause();
        } else if (e.target.id == 'pauseButton') {
          playpauseVideo(false);
          managePlayPause();
        } else if (e.target.id == 'replayButton') {
          if (p.pElem.videoFb.sliderParam) {
            $(p.domObj['replayButton']).hide();
          }
          if (
            p.pElem.videoFb.playPauseControls &&
            p.pElem.videoFb.playPauseControls.type == 1
          ) {
            $(p.domObj['playButton'])
              .removeClass('btnDisablePlay')
              .addClass('btnPlay');
            $(p.domObj['pauseButton'])
              .removeClass('btnDiablePause')
              .addClass('btnPause');
          }
          if (p.objVideoPlayer) {
            //	videoManagerObj[p.pElem.videoFb.mcID].setVideoCurrentTime(0);
            //displayTimelineVideo(p.pElem.videoFb.videoParams.start,p.pElem.videoFb.videoParams.end,videoEndCallBack)
            preloaderObj.displayVideoLoader(); // loader added by Ajay on replay clicked
            setTimeLine();
          }
          /* else if(p.pElem.videoFb.jsflObj)
					{
						audioObj.setAudioCurrentTime(0)
						managePlayPause();
					} */
          managePlayPause();
          playpauseVideo(true);
          //if(videoManagerObj[p.pElem.videoFb.mcID])
          //	setVideo();
        }

        break;
    }
  }
  var playpauseState = false;

  function managePlayPause() {
    var flag = false;

    if (p.objVideoPlayer && p.objVideoPlayer.getVideoElement().paused) {
      flag = true;
    }
    if (flag) {
      updatePlayPauseStateEvent('pause');
    } else {
      updatePlayPauseStateEvent('play');
    }
  }
  var replayFlag = false;
  function updatePlayPauseStateEvent(state) {
    replayFlag = false;

    if (p.pElem.videoFb.sliderParam) {
      switch (state) {
        case 'pause':
          $(p.domObj['pauseButton']).hide();
          $(p.domObj['playButton']).show();
          $(p.domObj['replayButton']).hide();
          navEvents('playButton', true);
          navEvents('pauseButton', false);
          break;
        case 'play':
          $(p.domObj['playButton']).hide();
          $(p.domObj['pauseButton']).show();
          $(p.domObj['replayButton']).hide();
          navEvents('pauseButton', true);
          navEvents('playButton', false);
          break;
        case 'replay':
          replayFlag = true;

          $(p.domObj['playButton']).hide();
          $(p.domObj['pauseButton']).hide();
          $(p.domObj['replayButton']).show();
          navEvents('pauseButton', false);
          navEvents('playButton', false);
          navEvents('replayButton', true);
          break;
      }
    }

    if (
      p.pElem.videoFb.playPauseControls &&
      p.pElem.videoFb.playPauseControls.type == 1
    ) {
      switch (state) {
        case 'pause':
          $(p.domObj['replayButton']).show();
          $(p.domObj['pauseButton']).hide();
          $(p.domObj['playButton']).show();
          navEvents('playButton', true);
          navEvents('pauseButton', false);
          navEvents('replayButton', true);
          break;
        case 'play':
          $(p.domObj['replayButton']).show();
          $(p.domObj['playButton']).hide();
          $(p.domObj['pauseButton']).show();
          navEvents('pauseButton', true);
          navEvents('playButton', false);
          navEvents('replayButton', true);
          break;
        case 'replay':
          replayFlag = true;
          navEvents('pauseButton', false);
          navEvents('playButton', false);
          navEvents('replayButton', true);
          break;
      }
    }
  }

  var btnbackPatch;
  function designPlayPauseControl1() {
    btnbackPatch = p.domObj[p.pElem.elemId + '_backPatch']
      ? p.domObj[p.pElem.elemId + '_backPatch']
      : document.createElement('div');
    $(p.domObj[p.pElem._commonData._target]).append(btnbackPatch);

    var btnX = p.pElem.videoFb.playPauseControls.x + 5;
    var btnY = p.pElem.videoFb.playPauseControls.y + 7;
    var playbtnF = true;
    var pausebtnF = true;
    var replaybtnF = true;

    if (playbtnF) {
      playbtn = p.domObj['playButton']
        ? p.domObj['playButton']
        : document.createElement('div');
      $(p.domObj[p.pElem._commonData._target]).append(playbtn);

      $(playbtn)
        .attr('id', 'playButton')
        .removeClass('btnDisablePlay')
        .addClass('btnPlay');
      var playbtnWidth = parseFloat($(playbtn).css('width'));
      $(playbtn).css({
        left: btnX,
        top: btnY
      });
      p.domObj['playButton'] = playbtn;
    }
    if (pausebtnF) {
      pausebtn = p.domObj['pauseButton']
        ? p.domObj['pauseButton']
        : document.createElement('div');
      $(p.domObj[p.pElem._commonData._target]).append(pausebtn);
      $(pausebtn)
        .attr('id', 'pauseButton')
        .removeClass('btnDiablePause')
        .addClass('btnPause');
      var pausebtnWidth = parseFloat($(pausebtn).css('width'));
      $(pausebtn).css({
        left: btnX,
        top: btnY
      });
      p.domObj['pauseButton'] = pausebtn;
    }
    if (replaybtnF) {
      replaybtn = p.domObj['replayButton']
        ? p.domObj['replayButton']
        : document.createElement('div');
      $(p.domObj[p.pElem._commonData._target]).append(replaybtn);
      $(replaybtn)
        .attr('id', 'replayButton')
        .addClass('btnReplay');
      var replaybtnWidth = parseFloat($(replaybtn).css('width'));
      $(replaybtn).css({
        left: btnX + playbtnWidth + 5,
        top: btnY
      });
      p.domObj['replayButton'] = replaybtn;
    }
    $(btnbackPatch).attr('id', p.pElem.elemId + '_backPatch');
    var btnWidth = 0;
    btnWidth = parseFloat($(playbtn).css('width'));
    var patchX = p.pElem.videoFb.playPauseControls.x;
    var patchY = p.pElem.videoFb.playPauseControls.y;
    var patchW = 2 * btnWidth + 15;
    var patchH = 38;
    $(btnbackPatch)
      .css({
        position: 'absolute',
        left: patchX,
        top: patchY,
        width: patchW,
        height: patchH,
        background: '#4d4d4d' /* Old browsers */
      })
      .show();
    p.domObj[p.pElem.elemId + '_backPatch'] = btnbackPatch;
  }

  function designMySlider() {
    sliderbackPatch = p.domObj[
      p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch'
    ]
      ? p.domObj[p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch']
      : document.createElement('div');
    $(p.domObj[p.pElem._commonData._target]).append(sliderbackPatch);
    sliderElem = p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]
      ? p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]
      : document.createElement('div');
    $(p.domObj[p.pElem._commonData._target]).append(sliderElem);
    $(sliderElem).attr('id', p.pElem.videoFb.sliderParam.sliderDivId);
    p.domObj[p.pElem.videoFb.sliderParam.sliderDivId] = sliderElem;
    var btnX = p.pElem.videoFb.sliderParam.cssParam.x - 13;
    var btnY = p.pElem.videoFb.sliderParam.cssParam.y;
    var playbtnF = true;
    var pausebtnF = true;
    var replaybtnF = true;
    if (replaybtnF) {
      replaybtn = p.domObj['replayButton']
        ? p.domObj['replayButton']
        : document.createElement('div');

      $(replaybtn)
        .attr('id', 'replayButton')
        .addClass('btnReplay');
      $(p.domObj[p.pElem._commonData._target]).append(replaybtn);
      var replaybtnWidth = parseFloat($(replaybtn).css('width'));
      $(replaybtn)
        .css({
          left: btnX - replaybtnWidth,
          top: btnY
        })
        .hide();
      p.domObj['replayButton'] = replaybtn;
    }
    if (pausebtnF) {
      pausebtn = p.domObj['pauseButton']
        ? p.domObj['pauseButton']
        : document.createElement('div');

      $(pausebtn)
        .attr('id', 'pauseButton')
        .removeClass('btnDisablePause')
        .addClass('btnPause');
      $(p.domObj[p.pElem._commonData._target]).append(pausebtn);
      var pausebtnWidth = parseFloat($(pausebtn).css('width'));
      $(pausebtn)
        .css({
          left: btnX - pausebtnWidth,
          top: btnY
        })
        .hide();
      p.domObj['pauseButton'] = pausebtn;
    }
    if (playbtnF) {
      playbtn = p.domObj['playButton']
        ? p.domObj['playButton']
        : document.createElement('div');
      $(playbtn)
        .attr('id', 'playButton')
        .removeClass('btnDisablePlay')
        .addClass('btnPlay');
      $(p.domObj[p.pElem._commonData._target]).append(playbtn);
      var playbtnWidth = parseFloat($(playbtn).css('width'));
      $(playbtn)
        .css({
          left: btnX - playbtnWidth,
          top: btnY
        })
        .hide();
      p.domObj['playButton'] = playbtn;
    }
    $(sliderbackPatch).attr(
      'id',
      p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch'
    );
    var btnWidth = 0;
    btnWidth = parseFloat($(playbtn).css('width'));
    var patchX = p.pElem.videoFb.sliderParam.cssParam.x - btnWidth - 20;
    var patchY =
      p.pElem.videoFb.sliderParam.cssParam.y -
      36 / 2 +
      p.pElem.videoFb.sliderParam.cssParam.height / 2;
    var patchW = p.pElem.videoFb.sliderParam.cssParam.width + btnWidth + 20;

    var patchH = 36;
    $(sliderbackPatch)
      .css({
        position: 'absolute',
        left: patchX,
        top: patchY,
        width: patchW + 25,
        height: patchH,
        background: '#4d4d4d' /* Old browsers */
      })
      .hide();
    p.domObj[
      p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch'
    ] = sliderbackPatch;
  }

  /* 
	function closeButtonFn()
	{
        var bgLeft=0
		var bgTop=0
		var bgWidth=0
		var bgHeight=0
	    var pLeft=parseFloat($(p.domObj[p.pElem.videoFb.mcID]).css("left"))
		var pTop=parseFloat($(p.domObj[p.pElem.videoFb.mcID]).css("top"))
		var pWidth=parseFloat($(p.domObj[p.pElem.videoFb.mcID]).css("width"))
		var pHeight=parseFloat($(p.domObj[p.pElem.videoFb.mcID]).css("height"))
	    
		var cLeft=(pWidth)
        var cTop=0
	   if(p.domObj["btn_bg"])
	    {
		bgLeft=parseFloat($(p.domObj["btn_bg"]).css("left"))
		bgTop=parseFloat($(p.domObj["btn_bg"]).css("top"))
		bgWidth=parseFloat($(p.domObj["btn_bg"]).css("width"))
		bgHeight=parseFloat($(p.domObj["btn_bg"]).css("height"))
	    cLeft=(pWidth)-((pLeft+pWidth)-(bgLeft+bgWidth))
		cTop=bgTop-pTop
		}

	  _closeBtnGlow=p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]?p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]:document.createElement("div");
	  $(_closeBtnGlow).attr("id",p.pElem.videoFb.mcID+"_CloseGlow")
	  $(_closeBtnGlow).css({
		"position":"absolute",
		"left":cLeft-(38)+"px",
		"top":cTop-(38)+"px",
		"width":77+"px",
		"height":77+"px",

		"background": "url("+activityImageObj.closeImg_glow.src+") no-repeat",
		"background-size": "100% 100%",
		
		}).hide()

        $(p.domObj[p.pElem.videoFb.mcID]).append(_closeBtnGlow)
	    p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]=  _closeBtnGlow
      
	    _closeBtnDiv=p.domObj[p.pElem.videoFb.mcID+"_Close"]?p.domObj[p.pElem.videoFb.mcID+"_Close"]:document.createElement("div");
		$(_closeBtnDiv).attr("id",p.pElem.videoFb.mcID+"_Close")
		
		$(_closeBtnDiv).css({
		"position":"absolute",
		"pointer-events":"auto",
		"left":cLeft-(41/2)+"px",
		"top":cTop-(41/2)+"px",
		"width":41+"px",
		"height":41+"px",
	
		"background": "url("+activityImageObj.closeImg_normal.src+") no-repeat",
		})
		$(p.domObj[p.pElem.videoFb.mcID]).append(_closeBtnDiv)
	    p.domObj[p.pElem.videoFb.mcID+"_Close"]=  _closeBtnDiv
		p.pElem.videoFb.closeBtnID=p.pElem.videoFb.mcID+"_Close"

      
	} */

  /* 	var glow=false
	var myGlow
function glowCloseBtn()
	{
	
	 $(p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]).show()
	myGlow=setInterval(function(){
	if(glow)
	{
	
	
	 $(p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]).fadeIn("fast");
	glow=false
	}else
	{
	$(p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]).fadeOut("fast");
	glow=true
	}
	}, 500);
	}
	
	function clearGlow()
	{
	$(p.domObj[p.pElem.videoFb.mcID+"_CloseGlow"]).hide()
	clearInterval(myGlow);
	}


 */

  EventBus.addEventListener(
    'slider_drag_complete',
    sliderDragStopped,
    _thisObj
  );
  EventBus.addEventListener('videoSeeked', videoSeekSuccess, _thisObj);
  function videoSeekSuccess(event, parentClass) {
    // console.log("ffssssssssssssssssssf")
    //if(parentClass === _thisObj)
    //{
    /* if(BrowserDetectAdv.iOS()) {
						setTimeout(function(){ 
						preloaderObj.hideLoader();
					//	generateText();
					//	showHideItext();
					//	textDivRef.show();
						
						if(p.seekDone)
						{
						p.seekDone(p.pElem)
						}
						}, 200); 
					}else{
						
						preloaderObj.hideLoader();
					//	generateText();
					//	showHideItext();
					//	textDivRef.show();
							
						if(p.seekDone)
						{
      //console.log("in sliderDragStopped playpauseState ",feedbackFinished )
						p.seekDone(p.pElem)
						}
					}
					 */
    //	}
    if (preloaderObj) {
      preloaderObj.hideLoader();
      if (p.seekDone) {
        p.seekDone(p.pElem);
      }
    }
    if (feedbackStart) {
      if (p.pElem.videoFb.sliderParam) {
        $(
          p.domObj[p.pElem.videoFb.sliderParam.sliderDivId + '_backPatch']
        ).show();
        sliderObj[p.pElem.videoFb.sliderParam.sliderDivId].displaySlider(
          p.pElem.videoFb.sliderParam.cssParam.x,
          p.pElem.videoFb.sliderParam.cssParam.y,
          p.pElem.videoFb.sliderParam.cssParam.width,
          p.pElem.videoFb.sliderParam.cssParam.height,
          p.pElem.videoFb.sliderParam.cssParam.color
        );
      }
      if (p.pElem.videoFb.closeBtnParam) {
        $(p.domObj[p.pElem.elemId + '_Close']).show();
      }
      feedbackStart = false;
    }
    if (feedbackFinished) {
      p.feedBackComplete(p.pElem);
    }
  }

  function sliderDragStopped(e, parentClass, val) {
    if (parentClass === _thisObj) {
      /* if(p.pElem.videoFb.jsflObj)
		{
			if(!playpauseState)
				playpauseVideo(false)
		}
		else
		{ */

      //console.log("in sliderDragStopped playpauseState ",feedbackFinished )

      preloaderObj.displayVideoLoader();
      //console.log("playpauseState " ,playpauseState)
      if (!playpauseState && !feedbackVideoFinished) {
        checkVideoTime();
        playpauseVideo(false);
      } else {
        playpauseVideo(true);
      }
      //} ,
      if (replayFlag && !feedbackVideoFinished) {
        managePlayPause();
        //setTimeLine();
      }
    }
  }
  function setTimeLine() {
    displayTimelineVideo(
      p.pElem.videoFb.videoParams.start,
      p.pElem.videoFb.videoParams.end,
      videoEndCallBack
    );
  }

  function playpauseVideo(ppFlag) {
    if (p._navController.getVideoManager()) {
      if (ppFlag) {
        p.objVideoPlayer.playVideo();
        playpauseState = true;
        if (requestAnim) cancelAnimationFrame(requestAnim);
        checkVideoTime();
      } else {
        p.objVideoPlayer.pauseVideo();
        playpauseState = false;
        if (requestAnim) cancelAnimationFrame(requestAnim);
      }
      ////////console.log("fff",playpauseState)
    }
    /* else
	{
		if(ppFlag)
		{
			if(!p.pElem.videoFb.otherParam.autoPlay && isFirstPlay)
				playSound(p.pElem.videoFb.audioParam.audioPath,p.pElem.playBack);   //callback added by Sagar for audio
			playpauseState = true;
			audioObj.setAudioCurrentTime(audioObj.getTime())
		}
		else
		{
			audioObj.pauseAudio()
			playpauseState = false;
		}
	} */
  }
};
