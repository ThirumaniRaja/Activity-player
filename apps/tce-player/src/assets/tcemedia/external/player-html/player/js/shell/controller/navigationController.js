/* This Module is used to generate all navigation elements and events for all the nav elements are available here.
This module is instantiated by the shellController and responsibe for the nav elements functionality.
*/

var NavigationController = function(
  viewRef,
  shellController,
  videoManager,
  shellModel
) {
  var thisRef = this;
  var navViewRef = viewRef;
  var navConfig;
  var navDivElement;
  var isUpdateLoadingStatusCalled = false;
  var createHTMLElement = new CreateHTMLElement(this);
  var cratedNavElementRefArray = [];
  var videoManagerObj = videoManager;
  var Model = shellModel;
  var shellControllerObj = shellController;
  var myToolTip;
  var annotationCanvasElem;
  this.pauseStatus;
  /* ---- Public function ----- */
  this.loadJSON = function(jsonPath, id) {
    //console.log("loadJSON");
    var _ref = this;
    var jqxhr = $.getJSON(jsonPath, function(jsonData) {
      // JSON file loaded //
      navConfig = jsonData;
      var navCompLength = jsonData.navPanelTypes.length;
      for (var i = 0; i < navCompLength; i++) {
        if (jsonData.navPanelTypes[i].navPanelId === id) {
          Model.setNavJsonObj(jsonData.navPanelTypes[i]);
          prepareSubComponents();
          break;
        }
      }
    }).fail(function() {
      ////console.log( "An error occurred while loading JSON file. " + jsonPath);
    });
  };

  this.enableReplay = function(aBool) {
    //console.log("enableReplay");
    var replayBtnRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navReplayButton') {
        replayBtnRef = cratedNavElementRefArray[i];
      }
    }
    if (replayBtnRef) navViewRef.enableButton(aBool, replayBtnRef);
  };

  this.updateLoadingStatus = function(aBool, _elementRef) {
    //console.log("updateLoadingStatus");
    if (!isUpdateLoadingStatusCalled) {
      if (aBool) {
        Model.updateComponentLoadedCount(1);
      }
      isUpdateLoadingStatusCalled = true;
    }
    cratedNavElementRefArray.push(_elementRef);
    Model.setNavElementReference(_elementRef);
  };

  this.displayTooltip = function(txt, elemRef) {
    //console.log("displayTooltip");
    if (!elemRef.attr('disabled')) {
      myToolTip.showToolTip(
        elemRef.position().top,
        elemRef.position().left - 2,
        elemRef.width(),
        txt
      );
    }
  };

  this.removeTooltip = function() {
    //console.log("removeTooltip");
    if(myToolTip !== undefined){
      myToolTip.hideToolTip();
    }
    
  };

  /* Event for Play/Pause Toggle Button --*/
  this.managePlayPause = function(mediaType, divRef) {
    //console.log("managePlayPause");
    if(myToolTip !== undefined){
      myToolTip.hideToolTip();
    }
    var type = '';
    if (mediaType != undefined) {
      type = mediaType;
    } else {
      if (Model.getAnimationType() == 'video') {
        type = 'video';
      } else {
        type = 'jsfl';
      }
    }
    if (type == 'jsfl') {
      if (Model.getAudio().paused) {
        shellControllerObj.setPauseBtnClicked(false);
      } else {
        shellControllerObj.setPauseBtnClicked(true);
      }
    } else if (type == 'video') {

      if(videoManagerObj.getVideoElement() !== undefined){
        if (videoManagerObj.getVideoElement().paused) {
          shellControllerObj.setPauseBtnClicked(false);
          if (Model.getNextStartPoint() != null) {
            EventBus.dispatch('showVideoLoader', this, shellControllerObj);
            videoManagerObj.getVideoElement().currentTime =
              Model.getNextStartPoint() / Model.getFps();
            Model.setNextStartPoint(null);
          }
          //$("#nav-playButton").removeClass("highlight-stat");
          videoManagerObj.playVideo();
          this.updatePlayPauseState(true, true);
          Model.setIsPauseAtStepPoint(false);
        } else {
          shellControllerObj.setPauseBtnClicked(true);
          videoManagerObj.pauseVideo();
          this.updatePlayPauseState(false, true);
          Model.setNextStartPoint(null);
        }

    }
    if (Model.getPlayerData() !== undefined){
      if (Model.getPlayerData().dataObj.customPlayButton) {
        for (var i = 0; i < cratedNavElementRefArray.length; i++) {
          if (cratedNavElementRefArray[i].data('uniqueId') == 'bigPlayIcon') {
            $(cratedNavElementRefArray[i]).hide();
          }
        }
      }
    }

    }
    //
    if(Model.getPageDataObject().components !== undefined){
      if (Model.getPageDataObject().components.screenType != 'interactive') {
        shellController.showHideItextFunc();
      }
    }
    
  };

  this.enablePlayPause = function(aBool) {
    //console.log("navCtrl--enablePlayPause");
    
    var playDisableBtnRef, pauseDisableBtnRef;
    var pauseStatus = shellControllerObj.getPauseBtnClicked();
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (
        cratedNavElementRefArray[i].data('uniqueId') == 'navPlayDisabledButton'
      ) {
        playDisableBtnRef = cratedNavElementRefArray[i];
      }
      if (
        cratedNavElementRefArray[i].data('uniqueId') == 'navPauseDisabledButton'
      ) {
        pauseDisableBtnRef = cratedNavElementRefArray[i];
      }
    }
   // console.log("pauseStatus--",pauseStatus);
    this.pauseStatus = pauseStatus;
    navViewRef.enablePlayPause(
      aBool,
      playDisableBtnRef,
      pauseDisableBtnRef,
      pauseStatus
    );
  };

  this.updatePlayPauseState = function(_aBool, _bBool) {
    ////console.log("updatePlayPauseState");
    var playBtnRef, pauseBtnRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navPlayButton') {
        playBtnRef = cratedNavElementRefArray[i];
      }
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navPauseButton') {
        pauseBtnRef = cratedNavElementRefArray[i];
      }
    }
    navViewRef.updatePlayPauseState(_aBool, _bBool, playBtnRef, pauseBtnRef);
  };

  this.updateNavigation = function(index) {
    ////console.log("updateNavigation");
    var screenId = Model.getCurrentScreenId();
    var navLength = Object.keys(Model.getScreenObj()[screenId].navDetail)
      .length;
    var frameKey = Object.keys(Model.getScreenObj()[screenId].navDetail);
    for (var i = 0; i < navLength; i++) {
      var frame = frameKey[i].split('_');
      /* ---*/
      if (frame[1].search(/~/i) != -1) {
        var modFrame = frame[1].split('~');
        for (
          var limit = 0;
          limit <= Number(modFrame[1] - modFrame[0]);
          limit++
        ) {
          var fNum = Number(Number(modFrame[0]) + limit);
          if (index == fNum) {
            this.updateButtons(
              Model.getScreenObj()[screenId].navDetail[frameKey[i]]
            );
          }
        }
      } else {
        if (index == frame[1]) {
          this.updateButtons(
            Model.getScreenObj()[screenId].navDetail[frameKey[i]]
          );
        }
      }
    }
  };

  /* --- This methods is used to update buttons enable/disable property  ---*/
  this.updateButtons = function(jsonData) {
    ////console.log("updateButtons");
    enableNext(jsonData.enableNext);
    enableBack(jsonData.enableBack);
    this.enableReplay(jsonData.enableReplay);
    if (jsonData.highlightNext != undefined) {
      this.highlightNext(jsonData.highlightNext);
    }
    this.enablePlayPause(jsonData.playPauseButton);
    if (jsonData.iTextId != '') {
      var iTextElement = Model.getiFrameRef().contentWindow.document.getElementById(
        jsonData.iTextId
      );
      if (iTextElement != undefined) {
        shellController.addiText(iTextElement.innerHTML);
      }
    } else if (jsonData.iTextId == '') {
      shellController.iTextHide();
    }
    if (jsonData.playAgain) {
      if(!isMediaEneded){
        tcePlayerOnMediaEnded();
      }
      this.playAgain(true);
    } else {
      this.playAgain(false);
    }
  };

  this.playAgain = function(aBool) {
    ////console.log("playAgain");
    var playAgainRef;
    var refArray = Model.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'navPlayAgainButton') {
        playAgainRef = refArray[i];
      }
    }
    navViewRef.showHidePlayAgain(aBool, playAgainRef);
    //this.updateNavBackPatch(shellModel.getNavBackWidth()+110);
  };

  /* -- Event for Replay Button -- */
  this.replayScreen = function(replayRef) {
    ////console.log("replayScreen");
    if (!replayRef.attr('disabled')) {
      this.playAgain(false);
      if (Model.getMediaType() == 'interactive') {
        //=========================================================
        //reset star on replay - Sagar
        var _obj = Model.getScreenObj();
        var _id = Model.getCurrentScreenId();

        if (_obj && _obj[_id] && _obj[_id].resetStar) {
          //reset PageData on replay
          Model.removePageData();
          //reset Star
          this.getShellController().updateStar();
        }
        //============================================================
        shellController.removeActivity(replayRef);
        this.restoreNext();
        shellController.sliderShow();
        shellController.iTextHide();
        //videoManagerObj.pauseVideo();

        /* if(BrowserDetectAdv.Android()) {
				var seekFrame = (Model.getScreenObj()[Model.getCurrentScreenId()].currentFrame/shellModel.getFps()).toFixed(2)*1;
				var totalTime = (Model.getVideoDuration()).toFixed(2)*1;
				videoManagerObj.updateSrc(Model.getVideoPath()+"#t="+seekFrame+","+totalTime);
			}else  */ {
          videoManagerObj.setVideoCurrentTime(
            Model.getScreenObj()[Model.getCurrentScreenId()].currentFrame /
              Model.getFps()
          );
        }
        videoManagerObj.playVideo();
        stopAudioForActivity(replayRef);
        EventBus.dispatch('screenChange', this, thisRef, replayRef);
      } else if (Model.getMediaType() == 'animation') {
        // -- -- FOR STEP ANIMATION -- -- //
        if (Model.getPageDataObject().dataObj.stepPoint != undefined) {
          videoManagerObj.pauseVideo();
          var differenceArray = new Array();
          for (var i = 0; i < Model.getStepStartPoint().length; i++) {
            var currentFrame = Math.floor(
              videoManagerObj.getVideoCurrentTime() * Model.getFps()
            );
            var currentStart = Number(Model.getStepStartPoint()[i]);
            if (Number(currentFrame - currentStart) >= 0) {
              differenceArray.push(Number(currentFrame - currentStart));
            }
          }
          var minimunDifference =
            differenceArray.length > 0 ? arrayMin(differenceArray) : 0;
          var startPoint =
            videoManagerObj.getVideoCurrentTime() * Model.getFps() -
            minimunDifference;
          this.updatePlayPauseState(false, true);
          videoManagerObj.pauseVideo();
          if (
            Model.getPlayerJsonObj().navigationType == 'navPanelStepAnimation'
          ) {
            shellControllerObj.reloadCurrentStep();
          } else {
            videoManagerObj.setVideoCurrentTime(startPoint / Model.getFps());
          }
          videoManagerObj.playVideo();
          shellControllerObj.setPauseBtnClicked(false);
          EventBus.dispatch('removePlayHighlight', this, shellControllerObj);
          EventBus.dispatch('showVideoLoader', this, shellControllerObj);
          this.enablePlayPause(true);
        }
      }
    }
    this.updateNavBackPatch(Model.getNavBackWidth());
  };

  /* -- Event for Next Button --*/
  this.loadNextScreen = function(nextRef) {
    ////console.log("loadNextScreen triggered...");
    var active = false;
    if (nextRef) {
      if (!nextRef.attr('disabled')) {
        active = true;
      }
    } else {
      active = true;
    }
    if (active) {
      shellController.sliderShow();
      this.removeTooltip();
      var screenId = Model.getCurrentScreenId();
      var totalScreen = Model.getScreenObj().length;
      if (screenId + 1 < totalScreen) {
        // === broadcast event to stop current audio played from activity ===//
        stopAudioForActivity(nextRef);
        screenId = Model.getCurrentScreenId();
        screenId++;
        Model.setScreenId(screenId);
        EventBus.dispatch('screenChange', this, thisRef, nextRef);
        var mediaType = Model.getScreenObj()[screenId].mediaType;
        shellControllerObj.loadScreen(screenId, mediaType, nextRef);
      }
      EventBus.dispatch('showVideoLoader', this, shellControllerObj);
      this.restoreNext();
      shellControllerObj.iTextHide();
      //=========================================================
      //reset star on next - Sagar
      var _obj = Model.getScreenObj();
      var _id = Model.getCurrentScreenId();

      if (_obj && _obj[_id] && _obj[_id].resetStar) {
        //reset PageData on Next
        Model.removePageData();
        //reset Star
        this.getShellController().updateStar();
      }
      //============================================================
    }
  };
  //==========================================================================
  this.unloadActivity = function(_ref) {
    ////console.log("unloadActivity");
    stopAudioForActivity(_ref);
  };
  //==========================================================================
  /* Event for Back Button --*/
  this.loadBackScreen = function(backRef) {
    //////console.log("loadBackScreen");
    var active = false;
    if (backRef) {
      if (!backRef.attr('disabled')) {
        active = true;
      }
    } else {
      active = true;
    }
    if (!active) {
      return false;
    }
    this.restoreNext();
    shellController.sliderShow();
    screenId = Model.getCurrentScreenId();
    var totalScreen = Model.getScreenObj().length;
    if (screenId > 0) {
      // === broadcast event to stop current audio played from activity ===//
      stopAudioForActivity(backRef);
      screenId = Model.getCurrentScreenId();
      screenId--;
      Model.setScreenId(screenId);
      EventBus.dispatch('screenChange', this, thisRef, backRef);
      Model.setHighlightNext(Model.getScreenObj()[screenId].highlightNext);
      var mediaType = Model.getScreenObj()[screenId].mediaType;
      shellControllerObj.loadScreen(screenId, mediaType, backRef);
      var index = Model.getScreenObj()[screenId].currentFrame;
      this.updateNavigation(index);
      // ===== For first screen disable all the button except "Play" and Auto-Play the media ===//
      if (screenId == 0) {
        this.updateButtons({
          playPauseButton: true,
          enableNext: false,
          enableBack: false,
          enableReplay: false
        });
        videoManagerObj.setVideoCurrentTime(0.3);
        //this.managePlayPause("video");
        shellController.displayiText();
      }
    }
    //=========================================================
    //reset star on backScreen - Sagar
    var _obj = Model.getScreenObj();
    var _id = Model.getCurrentScreenId();

    if (_obj && _obj[_id] && _obj[_id].resetStar) {
      //reset PageData on backScreen
      Model.removePageData();
      //reset Star
      this.getShellController().updateStar();
    }
    //============================================================
    this.playAgain(false);
    this.updateNavBackPatch(Model.getNavBackWidth());
  };

  /* Event for Play Again Button --*/
  this.playMediaAgain = function(btnRef) {
    ////console.log("playMediaAgain");
    shellControllerObj.playAgainAction(btnRef);
    if (Model.getMediaType() == 'interactive') {
      //alert('if')
      var preloaderObj = new PreLoader();
      var screenId = 0;
      var THIS = this;
      Model.setScreenId(screenId);
      //=======4/13/2014 Sagar
      shellController.sliderShow();
      /* for any tablet device, ios play he video before you seek it */
      ////console.log(Model.getVideoStartFrame()/Model.getFps());
      videoManagerObj.setVideoCurrentTime(0.3);
      if (BrowserDetectAdv.any()) {
        setTimeout(function() {
          EventBus.dispatch('hideVideoLoader', THIS, shellControllerObj);
          videoManagerObj.playVideo();
          stopAudioForActivity(btnRef); //Model.setVideoDuration((Model.getScreenObj()[screenId].currentFrame+Model.getScreenObj()[screenId].duration)/Model.getFps());
          EventBus.dispatch('screenChange', this, thisRef, btnRef);
          EventBus.dispatch('checkAndHideSlider', THIS, shellControllerObj);
          //====================================================
          //reset PageData on playAgain - Sagar
          Model.removePageData();
          //reset Star
          THIS.getShellController().updateStar();
          //====================================================
        }, 600);
      } else {
        EventBus.dispatch('hideVideoLoader', this, shellControllerObj);
        videoManagerObj.playVideo();
        stopAudioForActivity(btnRef); //Model.setVideoDuration((Model.getScreenObj()[screenId].currentFrame+Model.getScreenObj()[screenId].duration)/Model.getFps());
        EventBus.dispatch('screenChange', this, thisRef, btnRef);
        EventBus.dispatch('checkAndHideSlider', this, shellControllerObj);
        //====================================================
        //reset PageData on playAgain - Sagar
        Model.removePageData();
        //reset Star
        this.getShellController().updateStar();
        //====================================================
      }
    } else if (Model.getMediaType() == 'animation') {
      //alert('else')
      this.enablePlayPause(true);
      videoManagerObj.setVideoCurrentTime(
        Model.getVideoStartFrame() / Model.getFps()
      );
      videoManagerObj.playVideo();
      shellControllerObj.setPauseBtnClicked(false);
      shellControllerObj.updateSliderDefaultValue();
    }
    btnRef.hide();
    EventBus.dispatch('showVideoLoader', this, shellControllerObj);
    this.updateNavBackPatch(Model.getNavBackWidth());
  };

  this.updateNavBackPatch = function(val) {
    //console.log("updateNavBackPatch");
    var navBackground;
    var refArray = Model.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'navBackground') {
        navBackground = refArray[i];
      }
    }
    //navViewRef.updateNavBackPatch(navBackground, val);
  };

  this.highlightNext = function(flag) {
    //console.log("highlightNext");
    var nextRef, nextHighlightRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navNextButton') {
        nextRef = cratedNavElementRefArray[i];
      }
      if (
        cratedNavElementRefArray[i].data('uniqueId') == 'navNextButtonHighlight'
      ) {
        nextHighlightRef = cratedNavElementRefArray[i];
      }
    }
    if (nextRef && nextHighlightRef) {
      if (flag == false) {
        addHighLight(nextHighlightRef[0], false);
        navViewRef.highlightNext(false, nextRef, nextHighlightRef);
      } else {
        addHighLight(nextHighlightRef[0], true);
        navViewRef.highlightNext(true, nextRef, nextHighlightRef);
      }
    }
  };

  this.start = function() {
    //console.log("start");
    this.managePlayPause('video');
  };

  this.pause = function() {
    //console.log("--pause");
    this.managePlayPause('video');
  };

  this.stop = function() {
    //console.log("stop");
    this.managePlayPause('video');
    videoManagerObj.setVideoCurrentTime(7 / 24);
  };

  this.isPaused = function(){
    
    if(videoManagerObj.getVideoElement() !== undefined){
      //console.log("navCtrl--isPaused 1")
      return videoManagerObj.getVideoElement().paused;
    }
    //console.log("navCtrl--isPaused 2")
		
  };
  
  this.getVideoManager = function() {
    //console.log("getVideoManager");
    return videoManagerObj;
  };

  this.getShellController = function() {
    //console.log("getShellController");
    return shellControllerObj;
  };

  this.restoreNext = function() {
    //console.log("restoreNext");
    var nextRef, nextHighlightRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navNextButton') {
        nextRef = cratedNavElementRefArray[i];
      }
      if (
        cratedNavElementRefArray[i].data('uniqueId') == 'navNextButtonHighlight'
      ) {
        nextHighlightRef = cratedNavElementRefArray[i];
      }
    }
    navViewRef.restoreNext(nextRef, nextHighlightRef);
  };

  this.destroy = function() {
    //console.log("destroy");
    thisRef = null;
    navViewRef = null;
    navConfig = null;
    navDivElement = null;
    isUpdateLoadingStatusCalled = null;
    createHTMLElement = null;
    cratedNavElementRefArray = null;
    videoManagerObj = null;
    Model = null;
    shellControllerObj = null;
    myToolTip = null;
    annotationCanvasElem = null;
    EventBus.removeEventListener('videoPlaying', videoPlayingStarted, this);
  };
  /* ---- End Public function ----- */

  /* ---- Private function ----- */
  function prepareSubComponents() {
    //console.log("prepareSubComponents");
    var navJsonObj = Model.getNavJsonObj();
    var elementLength = navJsonObj.elements.length;
    for (var i = 0; i < elementLength; i++) {
      var currentJsonElement = navJsonObj.elements[i];
      Model.setNavButtonCollection(navConfig[currentJsonElement]);
    }

    drawNavPanel();
  }

  function drawNavPanel() {
    //console.log("drawNavPanel");
    var aUiObject = Model.getNavButtonCollection();
    var aUiObjectLength = aUiObject.length; //Model.getNavComponentLength();
    Model.setNavComponentLength(aUiObjectLength);
    var refArray = new Array();
    refArray = Model.getDomElementReference();
    var customToolTipDiv, customToolTipArrowDiv;
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'navContainer') {
        navDivElement = refArray[i];
      }
      if (refArray[i].data('uniqueId') == 'customToolTip') {
        customToolTipDiv = refArray[i];
      }
      if (refArray[i].data('uniqueId') == 'toolTipArrow') {
        customToolTipArrowDiv = refArray[i];
      }
      if (refArray[i].data('uniqueId') == 'annotationCanvas') {
        annotationCanvasElem = refArray[i];
      }
    }
    myToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);
    EventBus.dispatch(
      'annotationCanvasReady',
      this,
      thisRef,
      annotationCanvasElem
    );
    for (var i = 0; i < aUiObjectLength; i++) {
      instantiateRespectiveContoller(aUiObject[i]);
    }
  }

  function instantiateRespectiveContoller(jsonObj) {
    //console.log("instantiateRespectiveContoller");
    isUpdateLoadingStatusCalled = false;
    addNavElementsToDom(jsonObj, navDivElement);
  }

  function addNavElementsToDom(jsonRef, navElem) {
    //console.log("addNavElementsToDom");
    var jsonData = jsonRef;
    var htmlNodeOne = createHTMLElement.createNewElement(navElem, jsonData);
    if (jsonData.subelements) {
      for (var j in jsonData.subelements) {
        var htmlNodeTwo = createHTMLElement.createNewElement(
          htmlNodeOne,
          jsonData.subelements[j]
        );
        var secondLevelJson = jsonData.subelements[j];
        if (secondLevelJson.subelements) {
          for (var k in secondLevelJson.subelements) {
            var htmlNodeThree = createHTMLElement.createNewElement(
              htmlNodeTwo,
              secondLevelJson.subelements[k]
            );
          }
        }
      }
    }
    var arr = [
      'navBackground',
      'navPlayPauseHolder',
      'navNextButtonHolder',
      'navBackButton',
      'navReplayButton'
    ];
    //console.log(Model.getPlayerData().dataObj);
    if (!Model.getPlayerData().dataObj.customPlayButton) {
      for (var i = 0; i < cratedNavElementRefArray.length; i++) {
        if (cratedNavElementRefArray[i].data('uniqueId') == 'bigPlayIcon') {
          $(cratedNavElementRefArray[i]).hide();
        }
      }
    } else {
      for (var i = 0; i < cratedNavElementRefArray.length; i++) {
        if (arr.indexOf(cratedNavElementRefArray[i].data('uniqueId')) != -1) {
          $(cratedNavElementRefArray[i]).hide();
        }
      }
    }
  }

  function enableNext(aBool) {
    //console.log("enableNext");
    var nextBtnRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navNextButton') {
        nextBtnRef = cratedNavElementRefArray[i];
      }
    }
    if (nextBtnRef) navViewRef.enableButton(aBool, nextBtnRef);
  }

  function enableBack(aBool) {
    //console.log("enableBack");
    var backBtnRef;
    for (var i = 0; i < cratedNavElementRefArray.length; i++) {
      if (cratedNavElementRefArray[i].data('uniqueId') == 'navBackButton') {
        backBtnRef = cratedNavElementRefArray[i];
      }
    }
    if (backBtnRef) navViewRef.enableButton(aBool, backBtnRef);
  }

  function stopAudioForActivity(calledFrom) {
    //console.log("stopAudioForActivity");
    EventBus.dispatch('activityAudioStop', this, thisRef, calledFrom);
    EventBus.dispatch('replayActivityCalled', this, shellControllerObj);
  }

  function arrayMin(arr) {
    //console.log("arrayMin");
    var len = arr.length,
      min = Infinity;
    while (len--) {
      if (arr[len] < min) {
        min = arr[len];
      }
    }
    return min;
  }

  function addHighLight(elem, flag) {
    //console.log("addHighLight");
    if (flag) {
      $(elem)
        .removeClass('highlight-stat')
        .addClass('highlight-stat');
    } else {
      $(elem).removeClass('highlight-stat');
    }
  }

  function videoPlayingStarted(event, shellControlClass) {
    //console.log("videoPlayingStarted");
    if (shellControlClass === shellControllerObj) {
      Model.setIsPauseAtStepPoint(false);
      this.updatePlayPauseState(true, false);
      //EventBus.dispatch("hideVideoLoader", this, shellControllerObj);
      // --- For Step Animation Reset button should be enable. ---//
      if (Model.getPageDataObject().dataObj.stepPoint.length > 0) {
        this.enableReplay(true);
      }
    }
  }
  this.setPauseState = function() {
    //console.log("setPauseState");
    //Alert("setPauseState");
    Model.setIsPauseAtStepPoint(false);
  };
  this.getToolTipRef = function() {
    return myToolTip;
  };
  /* ---- End Private function ----- */

  /* Event Listeners */

  /* Slider Class will despatch "videoPlaying" event once video start playing */
  EventBus.addEventListener('videoPlaying', videoPlayingStarted, this);
};
