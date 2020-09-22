/* This Module is Brain of the Player,
	which will read the PageData.JSON file and initiate DOM elements accordingly for the Player,
	and then it instantiate the navigation elements as per the "nav-elements.JSON"" Once done the player will instantiate the media	element.
	This module will responsible for different player functionality in category wise. Like in Cat-3, loading/unloading of the activitiy page would be controlled by this module. Similarly for Cat -2, creating Stop points and stopping the media at stop points would be controlled by this module.
	Along with the above functionality the player will display the text seperately on top of the video and modify, created, deleted, transformed on time.
  */
 var videoManagerObj;
var ShellController = function(viewRef) {
  var _classRef = this;
  var shellViewObj = viewRef;
  var myTimer = (myChkInterval = prevStopFrame = loadCnt = loadedCnt = 0);
  var loadingInitialize = (pauseBtnClicked = allNavCompLoaded = playerCreationStatus = false);
  var serviceObj,
    pageDataJson,
    drawTextObj,
    sliderObj,
    preloaderObj,
    buttonAnim,
    myInterval,
    configJson,
    imageArray,
    lodedImgCnt,
    loadImgCnt,
    lodedJSCnt,
    loadJSCn,
    commonImgPreloaded,
    timelineVideoPath,
    animationNotYetPlayed,
    iTextRef,
    dummyiTextRef,
    sliderRef,
    containerElement,
    playerContainer,
    textDivRef,
    iFrameRef,
    activityMask,
    imageSequence,
    activityLoadedPath,
    totalFrames,
    customToolTipDiv,
    customToolTipArrowDiv,
    stepGeneratorObj,
    myDataLoadInterval,
    thumbAvailable,
    thumbImageName,
    pageVideoPath,
    imageDataLoaded,
    navSliderBack,
    blackOverlay,
    playerTotalTimeDiv,
    debugFrameNoEnabled;
  var shellModel = new ShellModel();
  var videoManagerObj = new VideoManagerClass(_classRef);
  var navView = new NavigationView();
  var starController = new StarController(_classRef, shellModel);
  var playRef, segComplete;
  var navControlObj = new NavigationController(
    navView,
    _classRef,
    videoManagerObj,
    shellModel
  );
  var lastFrameDraw;
  var isVedieSeeked = false;
  var isJsonAvailable = false;
  var isStepButtonClicked = false;
  var nCurrentStep = 0;
  var isVideoSeeked = true;
  var isVideoEnded = false;
  /* ====== Public functions ========	*/

  this.init = function(
    _serviceObj,
    _playerWrapper,
    _pageDataPath,
    _pageVideoPath,
    _thumbImageName,
    _iframe,
    _jsPath,
    _debugFrameNoEnabled
  ) {
    //////console.log("ShellController.. Init");
    var _ref = this;
    serviceObj = _serviceObj;
    thumbImageName = _thumbImageName;
    pageVideoPath = _pageVideoPath;
    iFrameRef = _iframe;
    playerContainer = _playerWrapper;
    drawTextObj = new DrawText();
    sliderObj = new VideoSliderClass(_classRef);
    preloaderObj = new PreLoader();
    shellModel.setJsPath(_jsPath);
    shellModel.setServiceObj(serviceObj);
    shellModel.setiFrameRef(_iframe);
    shellModel.setNavElementReference($(playerContainer));
    serviceObj.readPageData(_pageDataPath, _classRef);
    debugFrameNoEnabled = _debugFrameNoEnabled;
    console.log("player loaded");

  };
  //======================
  this.loadStatus = function(_notification, refElement) {
    //////console.log("ShellController.. loadStatus");
    var loadIndicationSuccess = new CustomEvent("tcePlayerLoaded",
      {
        "detail": "success"
      });
    var loadIndicationFailure = new CustomEvent("tcePlayerLoaded",
      {
        "detail": "failed"
      });
    switch (_notification) {
      case 'playerJsonLoaded':
        try {
          shellModel.setThumbnailPath(serviceObj.getPageImageUrl(thumbImageName));
          timelineVideoPath = serviceObj.getPageVideoUrl(pageVideoPath);
          shellModel.setVideoPath(timelineVideoPath);
          /* Created player DOM elements once pageData.JSON is loaded */
          createElementForPlayer(shellModel.getPlayerJsonObj().screenType);
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }
        break;
      case 'JSloadingComplete':
        try {
          /* Once js files for the activity pages is loaded, activity page is loaded to a player container on top of the video */

          var refArray = shellModel.getDomElementReference();
          for (var i = 0; i < refArray.length; i++) {
            if (refArray[i].data('uniqueId') == 'activityPage') {
              containerElement = refArray[i];
            }
          }

          //var jsonPath = shellModel.getScreenObj()[shellModel.getCurrentScreenId()].mediaPath[0];
          //////////////console.log(".........shellModel.getCurrentScreenId() == ",shellModel.getScreenObj()[shellModel.getCurrentScreenId()].mediaPath[0]);
          if (loadingInitialize) {
            if (configJson.template_config.launchFile.substr(-3, 3) == 'xml') {
              //commented for activity remove on slide back
              // this.removeActivity();
              var activityBrainObj = new window[
                configJson.template_config.mainClass
              ](); //eval("new "+configJson.template_config.mainClass+"()");
              activityBrainObj.init(containerElement, shellModel, navControlObj);
              loadingInitialize = false;
              if (shellModel.getMediaActivePosition() == 'immediate') {
                //////console.log("activityMask hide");
                $(activityMask).hide();
              }
            } else if (
              configJson.template_config.launchFile.substr(-4, 4) == 'html'
            ) {
              $(containerElement).empty();
              containerElement = null;
              loadHtml(configJson.template_config.launchFile, this);
            }
          }
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }
        break;
      case 'ImageloadingComplete':
        /* Once images are preloaded for the activity page the player will load all required JS for the activity */
        try {
          if (loadingInitialize) {
            cssPreload(configJson.template_config.preloadCSS, this);
          }
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }

        break;
      case 'htmlLoaded':
        // -- Event is broadcasted which will captured from the templates -- //
        /* once activity page is loded it broadcast an event called "pageLoaded" to activity page */
        try {
          EventBus.dispatch('pageLoaded', shellModel, navControlObj);
          loadingInitialize = false;
          if (!BrowserDetectAdv.Android()) {
            preloaderObj.hideLoader();
          }
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }
        //
        break;
      case 'cssLoaded':
        if (loadingInitialize) {
          jsPreload(configJson.template_config.preloadJS, this);
        }
        break;
      case 'PlayerElementCreated':
        /* Instantiate media elements and nav elements once player DOM elements are created */

        try {
          shellModel.setDomElementReference(refElement);
          loadMedia(pageDataJson.components);
          var preloaderElem;
          var refArray = shellModel.getDomElementReference();
          for (var i = 0; i < refArray.length; i++) {
            if (refArray[i].data('uniqueId') == 'preloaderContainer') {
              preloaderElem = refArray[i];
            }
            if (refArray[i].data('uniqueId') == 'activityMask') {
              activityMask = refArray[i];
            }
          }
          shellModel.setPreLoaderReference(preloaderObj);
          preloaderObj.init(preloaderElem);
          document.dispatchEvent(loadIndicationSuccess);
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }

        // preloaderObj.displayLoader();
        break;
    }
  };
  //======================
  this.iTextHide = function() {
    //////console.log("ShellController.. iTextHide");
    if (iTextRef) {
      //////////////console.log("iTextHide is called.");
      iTextRef.empty();
    }
  };
  //======================
  this.sliderShow = function() {
    //////console.log("ShellController.. sliderShow");
    sliderObj.hideSlider(true);
    //////console.log('called...');
  };
  //======================
  this.showHideItextFunc = function() {
    //////console.log("ShellController.. showHideItextFunc");
    showHideItext();
  };
  //======================
  this.updateStar = function(_obj) {
    //////console.log("ShellController.. updateStar");
    var _temp = shellModel.getPageData();
    starController.updateStar(_obj);
  };
  //======================
  this.addiText = function(value) {
    //////console.log("ShellController.. addiText");
    if (iTextRef) {
      //////////////console.log("addiText is called.");
      iTextRef.empty();
      iTextRef.append(value);
    }
  };
  //======================
  this.removeActivity = function(_ref) {
    //////console.log("ShellController.. removeActivity");
    if (containerElement) {
      navControlObj.unloadActivity(_ref);
      configJson = null;
      loadingInitialize = false;
      activityLoadedPath = undefined;
      $(containerElement).html('');
    }
  };
  //======================
  /* This methods is used to load the activity/animation as per the time Frame */
  this.loadScreen = function(scrID, type, ref) {
    ////console.log("ShellController.. loadScreen");
    //////console.log(scrID)
    activityLoadedPath = null;
    //alert(scrID)
    //preloaderObj.displayVideoLoader();
    drawTextObj.clearCanvas();
    this.removeActivity(ref);
    configJson = null;
    EventBus.dispatch('showAnnotationCanvas');
    loadingInitialize = false;
    var screenId = scrID;
    var mediaType = type;
    EventBus.removeEventListener('MediaReadyForActive');
    $('#fake').css('display', 'block');
    if (shellModel.getMediaActivePosition != 'immediate') {
      //////console.log("activityMask show");
      $(activityMask).show();
    }
    if (mediaType.toLowerCase() == 'activity') {
      ////console.log('1');
      videoManagerObj.pauseVideo();
      sliderRef.removeSlider();
      var jsonPath = shellModel.getScreenObj()[screenId].mediaPath[0];
      if (jsonPath != undefined && jsonPath != '') {
        loadActivity(shellModel.getMediaPath() + jsonPath);
      }
      sliderRef.removeSlider();
    } else if (mediaType.toLowerCase() == 'animation') {
      $(blackOverlay).show();
      textDivRef.hide();
      containerElement = null;
      //////console.log('Í am called from Else If condition');
      var vidDuration =
        (shellModel.getScreenObj()[screenId].currentFrame +
          shellModel.getScreenObj()[screenId].duration) /
        shellModel.getFps();
      // Following condition is checking if the segment has activity or not.
      // If yes then slider duration will restrict to activity startframe.
      var isBool = false;
      for (var i in shellModel.getScreenObj()[screenId].navDetail) {
        if (shellModel.getScreenObj()[screenId].navDetail[i].mediaPath != '') {
          ////console.log(Number(i.split("_")[1].split("~")[0]) , shellModel.getScreenObj()[screenId].currentFrame);
          var tmp =
            Number(i.split('_')[1].split('~')[0]) -
            shellModel.getScreenObj()[screenId].currentFrame;
          vidDuration =
            (shellModel.getScreenObj()[screenId].currentFrame + tmp) /
            shellModel.getFps();
          break;
        }
      }
      ////console.log(shellModel.getScreenObj()[screenId].currentFrame, vidDuration);
      shellModel.setVideoDuration(vidDuration);
      shellModel.setSegStartFrame(
        shellModel.getScreenObj()[screenId].currentFrame
      );
      if (shellModel.getScreenObj()[screenId].mediaActivePosition) {
        shellModel.setMediaActivePosition(
          shellModel.getScreenObj()[screenId].mediaActivePosition.frame
        );
      }
      videoManagerObj.setVideoCurrentTime(
        shellModel.getScreenObj()[screenId].currentFrame / shellModel.getFps()
      );
      ////console.clear();
      ////console.log(shellModel.getScreenObj()[screenId].currentFrame/shellModel.getFps());
      //	shellModel.setVideoDuration(parseInt(shellModel.getScreenObj()[shellModel.getCurrentScreenId()].currentFrame+shellModel.getScreenObj()[0].duration)/shellModel.getFps());
      sliderObj.init(
        sliderRef,
        'video',
        shellModel.getVideoDuration(),
        shellModel.getSegStartFrame() / shellModel.getFps(),
        true,
        videoManagerObj
      );
      var refArray = shellModel.getDomElementReference();

      for (var i = 0; i < refArray.length; i++) {
        if (refArray[i].data('uniqueId') == 'navSliderBack') {
          navSliderBack = refArray[i];
        }
      }
      if (shellModel.getScreenObj()[screenId].sliderDisplay) {
        sliderObj.displaySlider();
        sliderObj.showSlider();
        $(navSliderBack).show();
      } else {
        sliderObj.removeSlider();
        $(navSliderBack).hide();
      }
      videoManagerObj.showVideo();
      if (shellModel.getScreenObj()[screenId].autoplay) {
        videoManagerObj.playVideo();
        pauseBtnClicked = false;
        if (playRef) addHighLight(playRef[0], false);
        animationNotYetPlayed = false;
        shellModel.setIsPauseAtStepPoint(false);
        showHideItext();

        //alert("check iText part...");
        //navControlObj.managePlayPause("video");
        //this.iTextHide();
      } else if (!shellModel.getScreenObj()[screenId].autoplay) {
        ////console.log('2');
        videoManagerObj.pauseVideo();
        pauseBtnClicked = true;
        navControlObj.updatePlayPauseState(false, true);
        $(blackOverlay).hide();
      }
    }
  };
  //======================
  this.getVideoManager = function() {
    //////console.log("ShellController.. getVideoManager");
    return videoManagerObj;
  };
  //======================
  this.getModel = function() {
    //////console.log("ShellController.. getModel");
    return shellModel;
  };
  //======================
  this.setPauseBtnClicked = function(_abool) {
    //////console.log("ShellController.. setPauseBtnClicked");
    pauseBtnClicked = _abool;
    if (!pauseBtnClicked && playRef) {
      addHighLight(playRef[0], false);
    }
  };
  //======================
  this.getPauseBtnClicked = function() {
    //////console.log("ShellController.. getPauseBtnClicked");
    return pauseBtnClicked;
  };
  //======================
  this.playAgainAction = function(e) {
    //////console.log("ShellController.. playAgainAction");
    textDivRef.hide();
    this.removeActivity(e);
  };
  //======================
  this.getNavController = function() {
    //////console.log("ShellController.. getNavController");
    return navControlObj;
  };
  //======================
  this.getPlayerCreationStatus = function() {
    //////console.log("ShellController.. getPlayerCreationStatus");
    return playerCreationStatus;
  };
  //======================
  this.displayiText = function() {
    //////console.log("ShellController.. displayiText");
    if (!shellModel.getScreenObj()[shellModel.getCurrentScreenId()].autoplay) {
      displayiText();
    }
  };
  //======================
  this.destroy = function() {
    //////console.log("ShellController.. destroy");
    var refArray = shellModel.getDomElementReference();
    var elemLength = Number(refArray.length);
    for (var i = elemLength - 1; i >= 0; i--) {
      refArray[i].unbind();
      refArray[i].empty();
      refArray[i].remove();
    }
    drawTextObj.destroy();
    // == require debug this //
    //videoManagerObj.destroy();
    shellModel.destroy();
    preloaderObj.destroy();
    navControlObj.destroy();
    if (stepGeneratorObj) stepGeneratorObj.destroy();
    sliderObj.destroy();
    _classRef = null;
    mediaPathRef = null;
    shellViewObj = null;
    myTimer = null;
    allNavCompLoaded = null;
    pageDataJson = null;
    drawTextObj = null;
    sliderObj = null;
    preloaderObj = null;
    buttonAnim = null;
    myInterval = null;
    loadingInitialize = null;
    configJson = null;
    imageArray = null;
    lodedImgCnt = null;
    loadImgCnt = null;
    lodedJSCnt = null;
    loadJSCnt = null;
    commonImgPreloaded = null;
    timelineVideoPath = null;
    animationNotYetPlayed = null;
    pauseBtnClicked = null;
    iTextRef = null;
    sliderRef = null;
    containerElement = null;
    playerContainer = null;
    textDivRef = null;
    imageSequence = null;
    myChkInterval = null;
    shellModel = null;
    videoManagerObj = null;
    navView = null;
    navControlOb = null;
    playerCreationStatus = null;
    activityLoadedPath = null;
    totalFrames = null;
    customToolTipDiv = null;
    customToolTipArrowDiv = null;
    prevStopFrame = null;
    stepGeneratorObj = null;
    EventBus.removeEventListener('slider_slide_start', sliderDragStart, this);
    EventBus.removeEventListener(
      'slider_drag_complete',
      sliderDragStopped,
      this
    );
    EventBus.removeEventListener('videoSeeked', videoSeekSuccess, this);
    EventBus.removeEventListener('videoDataLoaded', jumpToStartFrame, this);
    EventBus.removeEventListener('videoPlaying', onVideoPlaying, this);
    EventBus.removeEventListener('videoPaused', onVideoPause, this);
    EventBus.removeEventListener('jumpStep', jumpStepPoint, this);
    EventBus.removeEventListener(
      'removePlayHighlight',
      hidePlayHighlight,
      this
    );
    EventBus.removeEventListener('replayActivityCalled', resetMediaPath, this);
    EventBus.removeEventListener('showVideoLoader', videoLoaderOn, this);
    EventBus.removeEventListener('showVideoLoader', videoLoaderOff, this);
    EventBus.removeEventListener(
      'loadActivityFromOutside',
      loadActivityExternal,
      this
    );
    EventBus.removeEventListener('enableMask', showMask, this);
    EventBus.removeEventListener('disableMask', hideMask, this);
    EventBus.removeEventListener(
      'checkAndHideSlider',
      checkAndHideSlider,
      this
    );
    if (buttonAnim) {
      //buttonAnim.destroy();
      buttonAnim = null;
    }
  };
  /* ====== End of Public functions ========	*/

  /* ====== Private functions ========	*/

  function onVideoPlaying() {
    //////console.log("ShellController.. onVideoPlaying");
    //
    updateTxt();
  }
  function onVideoPause() {
    //////console.log("ShellController.. onVideoPause");
  }

  function checkDataLoad(event, parentClass, data) {
    //console.log("ShellController.. checkDataLoad");
    shellModel.setPlayerData(data);
    if (parentClass === _classRef) {
      pageDataJson = data;
      if (pageDataJson == null) {
        setDefaultProperties();
        isJsonAvailable = false;
      }
      shellModel.setPlayerJsonObj(pageDataJson.components);
      serviceObj.getImageTextFile('images/images.txt', _classRef);
    }
  }

  function setDefaultProperties() {
    //////console.log("ShellController.. setDefaultProperties");
    pageDataJson = {};
    pageDataJson = {
      video: {
        path: ''
      },
      components: {
        navigationType: 'navPanelAnimation',
        screenType: 'animation'
      },
      controlObj: {},
      txtObjContent: {
        txt_1:
          "<div style='text-align:LEFT'><span style='font-family:KrutiDev010;color:#001F6D;letter-spacing:0;font-size:18px;'> ,fues&apos;ku ns[kus ds fy, <B>Iys</B> cVu fDyd djsaA</span></div>"
      },
      dataObj: {
        stepTitle: [],
        frameRate: 24,
        customPlayButton: false,
        stepPoint: [],
        startFrame: 6,
        iTxtArr: ['txt_1'],
        totalFrames: 0,
        controlType: 'Animation'
      },
      txtObj: {}
    };
  }

  //====================================================
  function checkImageTextLoad(event, parentClass, data) {
    //////console.log("ShellController.. checkImageTextLoad");
    if (parentClass === _classRef) {
      var imgData = serviceObj.getImgData();
      if (imgData) {
        loadImages(JXG.decompress(imgData));
      } else {
        imgloadedCheck(true);
      }
    }
  }
  //====================================================
  function loadImages(imageDataObj) {
    //////console.log("ShellController.. loadImages");
    var _imgArr = imageDataObj.split('~^');
    imageDataLoaded = new Object();
    for (var j = 0; j < _imgArr.length - 1; j++) {
      var _arr1 = _imgArr[j].split('^~');
      imageDataLoaded[_arr1[0]] = new Image();
      imageDataLoaded[_arr1[0]].onload = imgloadedCheck;
      imageDataLoaded[_arr1[0]].src = _arr1[1];
      loadCnt++;
    }
  }
  //====================================================
  function imgloadedCheck(calledFromThis) {
    //////console.log("ShellController.. imgloadedCheck");
    loadedCnt++;
    if (loadedCnt == loadCnt || calledFromThis === true) {
      shellModel.setPlayerImageObj(imageDataLoaded);
      _classRef.loadStatus('playerJsonLoaded');
    }
  }
  //======================
  function loadMedia(jsonObj) {
    //////console.log("ShellController.. loadMedia");
    var componentLength = Object.keys(jsonObj).length;
    for (i = 0; i < componentLength; i++) {
      var param = i == 0 ? jsonObj.navigationType : jsonObj.screenType;
      //////////console.log(param)
      attachMedia(param);
    }
  }
  //======================
  function attachMedia(currentCompId) {
    //////console.log("ShellController.. attachMedia");
    var componentId = currentCompId;
    if (
      componentId == 'navPanelAnimation' ||
      componentId == 'navPanelStepAnimation' ||
      componentId == 'navPanelSlideShow' ||
      componentId == 'navPanelInteractive'
    ) {
      instantiateNavigationPanel(componentId);
    } else if (componentId == 'animation' || componentId == 'interactive') {
      shellModel.setMediaType(componentId);
      checkProgress(componentId);
    }
  }
  //======================
  function instantiateNavigationPanel(id) {
    //////console.log("ShellController.. instantiateNavigationPanel");
    navControlObj.loadJSON(
      serviceObj.getJsPath() + 'player/json/nav-elements.json',
      id
    );
    // ==== loader & loading check ====//
    myTimer = setInterval(function() {
      if (
        shellModel.getComponentLoadedCount() ==
        shellModel.getNavComponentLength()
      ) {
        allNavCompLoaded = true;
        clearInterval(myTimer);
        /* preloaderObj.hideLoader(); */
        shellModel.setDomElementReference(shellModel.getNavElementReference());
      }
    }, 100);
  }
  //======================
  /* This function will check if all nav elements are instantiated and added to DOM */
  function checkProgress(id) {
    //////console.log("ShellController.. checkProgress");
    if (allNavCompLoaded) {
      clearInterval(myChkInterval);
      prepareMedia(id);
    } else {
      clearInterval(myChkInterval);
      myChkInterval = setInterval(function() {
        checkProgress(id);
      }, 100);
    }
  }
  //======================
  function prepareMedia(id) {
    //////console.log("ShellController.. prepareMedia");
    if (id == 'interactive') {
      shellModel.setScreenObj(pageDataJson.controlObj.o);
      shellModel.setCurrentScreenId = 0;
      // ==== Disable the nav buttons initial screen ==== //
      navControlObj.updateButtons({
        playPauseButton: true,
        enableNext: false,
        enableBack: false,
        enableReplay: false
      });
    }
    initiateVideoMedia();
    //== store the nav background path with to Model ==
    var navBackground;
    var refArray = shellModel.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'navBackground') {
        navBackground = refArray[i];
      }
    }
    shellModel.setNavBackWidth($(navBackground).width());
  }
  //======================
  function createElementForPlayer(id) {
    //////console.log("ShellController.. createElementForPlayer");
    /* Read all nav-elements from "player-elements.json" and added them to the DOM */
    var _ref = this;
    var jqxhr = $.getJSON(
      serviceObj.getJsPath() + 'player/json/player-elements.json',
      function(jsonData) {
        shellViewObj.generateDomElement(jsonData, id);
      }
    )
      .done(function(jsonData) {})
      .fail(function() {
        ////////////console.log( "An error occurred while loading JSON file player-elements.json.");
      });
  }
  //======================
  function initiateVideoMedia() {
    //console.log("ShellController.. initiateVideoMedia");
    var _thisObj = this;
    var jsonData = pageDataJson;
    //preloaderObj.displayLoader();
    shellModel.setPageDataObject(jsonData);
    // == To diaplay the text content "drawTextObj" is initiated == //
    animationNotYetPlayed = true;
    //Removed hardcoded value... 11/06/2016
    // totalFrames = shellModel.getPageDataObject().dataObj.totalFrames-7;
    totalFrames = shellModel.getPageDataObject().dataObj.totalFrames;
    //////console.log("totalFrames = "+totalFrames);
    var refArray = shellModel.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'textDiv') {
        textDivRef = refArray[i];
      }
    }
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'instructionTxt') {
        iTextRef = refArray[i];
      }
    }
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'dummyiTxtContainer') {
        dummyiTextRef = refArray[i];
      }
    }
    var globalTxtAlign;
    if (jsonData.dataObj.globalTextAlignment)
      globalTxtAlign = jsonData.dataObj.globalTextAlignment;
    drawTextObj.init(
      jsonData,
      textDivRef,
      totalFrames,
      {
        iTextArray: shellModel.getPageDataObject().dataObj.iTxtArr,
        iTxtDivRef: dummyiTextRef
      },
      globalTxtAlign,
      iFrameRef,
      shellModel.getPlayerImageObj(),
      shellModel.getSourceType(),
      debugFrameNoEnabled
    );
    updateTxt();
    // ====== //
    if (jsonData.video != undefined) {
      shellModel.setAnimationType('video');
      shellModel.setFps(jsonData.dataObj.frameRate);
      shellModel.setSegStartFrame(jsonData.dataObj.startFrame);
      shellModel.setVideoStartFrame(jsonData.dataObj.startFrame);
      loadVideoPerType();
    }
    // == For Step animation, generate the steps == //
    generateStepDots();
  }
  //======================
  function drawTextFrame(_Curframe, _time) {
    //////console.log("ShellController.. drawTextFrame");
    if (_Curframe != lastFrameDraw && imageDataLoaded)
      drawTextObj.drawTextFrame(_Curframe, _time);
    lastFrameDraw = _Curframe;
  }
  //======================
  function updateTxt(allowUpdate) {
    //////console.log("ShellController.. updateTxt");
    // == To update text content "generateText" is called repetately along with the time frame == //
    if (videoManagerObj) {
      if (videoManagerObj.getVideoPlayStatus() || allowUpdate) {
        //showHideItext();
        // generateText();
        var _index;
        _time = videoManagerObj.getVideoElement().currentTime;
        _time_ms = _time * 1000;
        _frameDuration = 1000 / shellModel.getFps();
        _index = Math.round(_time_ms / _frameDuration);
        ////////console.clear();
        //////console.log(_index, _time);
        if (!allowUpdate) checkVideoTime(_index);

        stopOnStepPoints(_index);
        //Segment vise frame Adjustment added for text sync 06/06/2016....
        _index = _index + getSegmentFrameAdjustment(_index);
        //Frame Adjustment added for text sync 09/02/2016.....
        if (pageDataJson.dataObj.frameAdjustment != undefined)
          _index = _index + pageDataJson.dataObj.frameAdjustment;
        _index = _index < 0 ? 0 : _index;
        //............................
        if (_index >= 0) {
          drawTextFrame(_index, _time);
        }
        ////console.log(isVideoSeeked)
        if (isVideoSeeked) {
          requestAnimFrame(function() {
            updateTxt();
          });
        }
      }
    }
  }
  //======================
  function getSegmentFrameAdjustment(_frame) {
    //////console.log("ShellController.. getSegmentFrameAdjustment");
    if (pageDataJson.dataObj.segFrameAdjustment) {
      var _i = 0;
      while (_i < pageDataJson.dataObj.segFrameAdjustment.length) {
        if (
          pageDataJson.dataObj.segFrameAdjustment[_i][0] <= _frame &&
          pageDataJson.dataObj.segFrameAdjustment[_i][1] >= _frame
        ) {
          return !isNaN(pageDataJson.dataObj.segFrameAdjustment[_i][2])
            ? pageDataJson.dataObj.segFrameAdjustment[_i][2]
            : 0;
        }
        _i++;
      }
      return 0;
    } else {
      return 0;
    }
  }
  //======================
  /* This method is used to load main time line video, slider etc. */
  function loadVideoPerType() {
    //////console.log("ShellController.. loadVideoPerType");
    var jsonData = pageDataJson;
    /* var videoPath = jsonData.video.path; */
    var videoRef, posterRef;
    var refArray = shellModel.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      switch (refArray[i].data('uniqueId')) {
        case 'pageVideo':
          videoRef = refArray[i];
          break;
        case 'blackOverlay':
          blackOverlay = refArray[i];
          break;
        case 'vidPoster':
          posterRef = refArray[i];
          break;
        case 'navSlider':
          sliderRef = refArray[i];
          break;
        case 'customToolTip':
          customToolTipDiv = refArray[i];
          break;
        case 'toolTipArrow':
          customToolTipArrowDiv = refArray[i];
          break;
        case 'navPanelAnimationTotalTime':
          playerTotalTimeDiv = refArray[i];
          break;
      }
    }
    if (jsonData.components.screenType == 'animation') {
      if (jsonData.dataObj.stepPoint.length > 0) {
        sliderObj.init(
          sliderRef,
          'video',
          jsonData.dataObj.totalFrames / jsonData.dataObj.frameRate,
          jsonData.dataObj.startFrame / jsonData.dataObj.frameRate,
          false,
          videoManagerObj,
          customToolTipDiv,
          customToolTipArrowDiv,
          pageDataJson.components.navigationType
        );
      } else {
        sliderObj.init(
          sliderRef,
          'video',
          jsonData.dataObj.totalFrames / jsonData.dataObj.frameRate,
          jsonData.dataObj.startFrame / jsonData.dataObj.frameRate,
          true,
          videoManagerObj,
          customToolTipDiv,
          customToolTipArrowDiv,
          pageDataJson.components.navigationType
        );
      }
    } else if (jsonData.components.screenType == 'interactive') {
      sliderObj.init(
        sliderRef,
        'video',
        shellModel.getScreenObj()[0].duration / jsonData.dataObj.frameRate,
        shellModel.getScreenObj()[0].currentFrame / jsonData.dataObj.frameRate,
        true,
        videoManagerObj,
        customToolTipDiv,
        customToolTipArrowDiv,
        pageDataJson.components.navigationType
      );
    }
    videoManagerObj.init(videoRef, posterRef);
    //
    if (shellModel.getThumbnailPath() != '') {
      thumbAvailable = true;
    } else {
      thumbAvailable = false;
    }
    //
    videoManagerObj.loadVideo(
      timelineVideoPath,
      false,
      thumbAvailable,
      false,
      null,
      null,
      null,
      null,
      sliderObj,
      {},
      shellModel.getThumbnailPath()
    );
    //removed -1 from startFrame parameter.

    drawTextFrame(shellModel.getSegStartFrame());

    showHideItext();
    /* ==== iso 7 does not load video till get any touch event from the user
		so slider needs to display explicitely==== */
    iosSevenHack(jsonData);
    if (jsonData.components.screenType == 'animation') {
      shellModel.setVideoDuration(
        jsonData.dataObj.totalFrames / jsonData.dataObj.frameRate
      );
      sliderObj.showSlider();
      $(playerTotalTimeDiv).html(
        formatTimeForTooltip(
          jsonData.dataObj.totalFrames / jsonData.dataObj.frameRate
        )
      );
    } else if (jsonData.components.screenType == 'interactive') {
      shellModel.setVideoDuration(
        shellModel.getScreenObj()[shellModel.getCurrentScreenId()].duration /
          jsonData.dataObj.frameRate
      );
      var navSliderBack;
      for (var i = 0; i < refArray.length; i++) {
        if (refArray[i].data('uniqueId') == 'navSliderBack') {
          navSliderBack = refArray[i];
        }
      }
      if (shellModel.getScreenObj()[0].sliderDisplay) {
        sliderObj.showSlider();
        $(navSliderBack).show();
      }
      //Stars Controller....
      if (jsonData.dataObj.starConfig) {
        starController.init(
          jsonData.dataObj.starConfig,
          iFrameRef.contentWindow.document
        );
      }
      //===== start lazy loading the common assets===
      if (jsonData.dataObj.commonAssets) {
        lazyLoad(jsonData.dataObj.commonAssets);
      }
      displayiText();
    }
    myInterval = setInterval(function() {
      checkVideoLoadStatus();
    }, 200);
  }
  //======================
  function formatTimeForTooltip(num) {
    //////console.log("ShellController.. formatTimeForTooltip");
    var minutes = Math.floor(num / 60);
    var seconds = Math.floor(num - minutes * 60);
    var modMin = minutes <= 9 ? '0' + minutes : minutes;
    var modSec = seconds <= 9 ? '0' + seconds : seconds;
    return modMin + ' : ' + modSec;
  }
  //==================
  function checkVideoLoadStatus() {
    //////console.log("ShellController.. checkVideoLoadStatus");
    var status = videoManagerObj.getVideoLoadedStatus();
    //alert("checkVideoLoadStatus"+status)
    if (status) {
      proceedAfterVideo();
      clearInterval(myInterval);
    }
  }
  //======================
  /* Once video data is loaded, slider should be updated and iText would be created initially */
  function proceedAfterVideo() {
    //////console.log("ShellController.. proceedAfterVideo");
    var _thisObj = this;
    var jsonData = pageDataJson;
    var screenType = jsonData.components.screenType;
    if (screenType == 'interactive') {
      var mediaType = shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
        .mediaType;
      var screenId = shellModel.getCurrentScreenId();
      if (
        !shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
          .sliderDisplay
      ) {
        sliderObj.removeSlider();
      }
      // -- Navigation Updator -- //
      navControlObj.updateNavigation(shellModel.getSegStartFrame());
      requestAnimFrame(function() {
        updateNavButtons();
      });
      drawTextFrame(shellModel.getSegStartFrame());
      //////console.log('called from proceedAfterVideo... type interactive');
    }

    //
    if (jsonData.components.navigationType == 'navPanelStepAnimation') {
      ////////console.log('called from proceedAfterVideo...');
      //sliderObj.removeSlider();
    }
    //
    if (jsonData.components.navigationType == 'navPanelAnimation') {
      //////console.log('called from proceedAfterVideo...');
      if (videoManagerObj && !isJsonAvailable) {
        var _duration = videoManagerObj.getVideoDuration();
        totalFrames = Math.round(_duration * jsonData.dataObj.frameRate);
        jsonData.dataObj.totalFrames = Math.round(
          _duration * jsonData.dataObj.frameRate
        );
        sliderObj.updateVideoDuration(_duration);
        $(playerTotalTimeDiv).html(
          formatTimeForTooltip(
            _duration - videoManagerObj.getVideoCurrentTime()
          )
        );
      }
    }
    if (!thumbAvailable) {
      preloaderObj.hideLoader();
    }
    playerCreationStatus = true;
  }
  //======================
  /* For category 3 onward, player would capable of updating the nav elemnts enable/disable status as per the time farme, similar to Flash */
  function updateNavButtons() {
    //////console.log("ShellController.. updateNavButtons");
    //////////console.log('updateNavButtons');
    if (videoManagerObj) {
      var _time = videoManagerObj.getVideoCurrentTime();
      var _index = Math.round(
        (_time * 1000) / ((1 / shellModel.getFps()) * 1000)
      );
      if (videoManagerObj.getVideoPlayStatus()) {
        navControlObj.updateNavigation(_index);
        loadExternalActivity(_index);
      }
      requestAnimFrame(function() {
        updateNavButtons();
      });
    }
  }
  //======================
  function loadExternalActivity(index) {
    //////console.log("ShellController.. loadExternalActivity");
    //////////console.log('loadExternalActivity')
    var screenId = shellModel.getCurrentScreenId();
    var navLength = Object.keys(shellModel.getScreenObj()[screenId].navDetail)
      .length;
    var frameKey = Object.keys(shellModel.getScreenObj()[screenId].navDetail);
    var pointer;
    var currentFrame;
    var obj = shellModel.getScreenObj()[shellModel.getCurrentScreenId()];
    for (var i = 0; i < navLength; i++) {
      pointer = shellModel.getScreenObj()[screenId].navDetail[frameKey[i]];
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
            currentFrame = i;
            if (pointer.mediaPath != '') {
              if (pointer.mediaPath != undefined && pointer.mediaPath != '') {
                loadActivity(shellModel.getMediaPath() + pointer.mediaPath);
                sliderObj.hideSlider(false);
              }
            }
          }
          // Code added on 14/11/2016
          if (pointer['frameStop']) {
            var arrFrames = pointer['frameStop'].split('~');
            if (arrFrames[0] <= index && arrFrames[1] >= index) {
              ////console.log('3');
              videoManagerObj.pauseVideo();
              sliderObj.disableSlider();
            }
          }
          // ============
        }
      } else {
        if (index == frame[1]) {
          currentFrame = i;
          if (pointer.mediaPath != '') {
            if (pointer.mediaPath != undefined && pointer.mediaPath != '') {
              loadActivity(shellModel.getMediaPath() + pointer.mediaPath);
              sliderObj.hideSlider(false);
            }
          }
        }
      }
    }
    // Code added on 10/11/2016
    if (
      obj['mediaActivePosition'] ||
      shellModel.getScreenObj()[screenId].mediaPath != ''
    ) {
      if (index >= Number(obj['duration']) + Number(obj['currentFrame'])) {
        sliderObj.hideSlider(false);
      }
    }
    // =========================
    // =========================
    //code for showing and hiding starDiv - 12/9/2016 - Sagar
    var _start,
      _end = 0;
    if (pageDataJson.dataObj.hideFrames) {
      var _arr = pageDataJson.dataObj.hideFrames;
      var _len = _arr.length;
      for (var i = 0; i < _len; i++) {
        var _arr1 = _arr[i];

        if (index >= _arr1[0] && index <= _arr1[1]) {
          _start = _arr1[0];
          _end = _arr1[1];
          break;
        }
      }
      if (index >= _start && index <= _end) {
        starController.hideStars();
      } else {
        starController.showStars();
      }
    }
    //===============================================
  }
  //======================
  /* This function is used to hack the iPad behaviour for not to load the video metadata/video data until user click on the Player */
  function iosSevenHack(jsonData) {
    //////console.log("ShellController.. iosSevenHack");
    if (navigator.userAgent.match(/(iPad|iPhone|iPod touch);/i)) {
      //removed -1 from startFrame parameter.
      drawTextFrame(shellModel.getSegStartFrame());
      showHideItext();
      if (jsonData.components.screenType == 'interactive') {
        if (
          !shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
            .sliderDisplay
        ) {
          sliderObj.removeSlider();
        }
        navControlObj.updateNavigation(shellModel.getSegStartFrame());
        requestAnimFrame(function() {
          updateNavButtons();
        });
      }
      if (!thumbAvailable) {
        preloaderObj.hideLoader();
      }
      playerCreationStatus = true;
    }
  }
  //======================
  function displayiText() {
    //////console.log("ShellController.. displayiText");
    // === iText For Devices like iSO7 which does not load video till user click on it ===
    if (shellModel.getPageDataObject().dataObj.iTxtArr[0]) {
      var iFrameDoc = iFrameRef.contentWindow.document;
      var iTextElement = iFrameDoc.getElementById(
        shellModel.getPageDataObject().dataObj.iTxtArr[0]
      );
      var styleProps = $(iTextElement).css([
        'position',
        'top',
        'left',
        'width',
        'height',
        'margin-top',
        'opacity',
        'transform'
      ]);
      iTextRef[0].style.position = 'absolute';
      iTextRef[0].style.left = '3px'; //iTextElement.style.left;
      iTextRef[0].style.top = '3px'; //parseInt(iTextElement.style.top)+"px";
      iTextRef[0].style.width = iTextElement.style.width;
      iTextRef[0].style.height = iTextElement.style.height;
      iFrameDoc.getElementById(iTextRef.attr('id')).innerHTML =
        iTextElement.innerHTML;
    }
  }
  //======================
  /* For Category 2, dots should be created on top of the player slider to generate the steps. A seperate module called "stpGenerator" is used for the gerenation of the steps.*/
  function generateStepDots() {
    //////console.log("ShellController.. generateStepDots");
    var jsonData = pageDataJson;
    if (jsonData.dataObj.stepPoint.length > 0) {
      if (jsonData.video != undefined) {
        var stepPointArray = jsonData.dataObj.stepPoint;
        var startPointsArray = new Array();
        var stopPointsArray = new Array();
        var refArray = shellModel.getDomElementReference();
        for (var stPt = 0; stPt < stepPointArray.length; stPt++) {
          var temp = stepPointArray[stPt].split('~');
          if (temp[1] == 'start') {
            startPointsArray.push(temp[0]);
          }
          if (temp[1] == 'stop') {
            stopPointsArray.push(temp[0]);
          }
        }
        ////console.log(startPointsArray);
        ////console.log(stopPointsArray);
        if (startPointsArray.length > 1) {
          stepGeneratorObj = new StepGenerator(_classRef);
          shellModel.setStepPoint(stopPointsArray);
          shellModel.setStepStartPoint(startPointsArray);
          stepGeneratorObj.init(
            startPointsArray,
            stopPointsArray,
            jsonData.dataObj.stepTitle,
            totalFrames,
            sliderRef.width(),
            customToolTipDiv,
            customToolTipArrowDiv
          );
          _classRef.updateSliderDefaultValue();
          for (var i = 0; i < refArray.length; i++) {
            if (refArray[i].data('uniqueId') == 'navSliderStepPointHolder') {
              stepPointElement = refArray[i];
            }
          }
          stepGeneratorObj.addToDom(stepPointElement);
          // Code added on 10/11/2016
          stepGeneratorObj.disable();
          // ========================
        }
        navControlObj.enableReplay(false);
      }
      createAnimatedPlayBtn();
    }
  }
  /*
   * Following method will call on clicking PlayAgain button.
   */
  this.updateSliderDefaultValue = function() {
    if (pageDataJson.components.navigationType != 'navPanelStepAnimation') {
      return false;
    }
    var currentSliderPos = sliderObj.getSliderPos();
    var stepPointElement;
    var startPointsArray = shellModel.getStepStartPoint();
    var stopPointsArray = shellModel.getStepPoint();
    var min =
      parseInt(stepGeneratorObj.getPoints(currentSliderPos)[0]) /
      shellModel.getFps();
    var max =
      ((parseInt(stepGeneratorObj.getPoints(currentSliderPos)[1]) -
        parseInt(stepGeneratorObj.getPoints(currentSliderPos)[0])) *
        stopPointsArray.length) /
      shellModel.getFps();
    var startPos = min;
    sliderObj.updateGlobalValues(startPointsArray, stopPointsArray, 0);
    sliderObj.setSliderValue(min, max, startPos);
  };
  //======================
  /* Highlight the Play button once the player stop to a step point */
  function createAnimatedPlayBtn() {
    //////console.log("ShellController.. createAnimatedPlayBtn");
    var refArray = shellModel.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'navPlayButton') {
        playRef = refArray[i];
      }
    }
    //buttonAnim = new buttonAnimation(navControlObj);
    var tooTipObj = new ToolTip(customToolTipDiv, customToolTipArrowDiv); //buttonAnim.init(imageSequence,{top:playRef.position().top,left:playRef.position().left,target:"#"+playRef.parent().attr("id")},tooTipObj);
  }
  //======================
  /* Loading activity page for Cat 3 onward */
  function loadActivity(_jsonPath) {
    //////console.log("ShellController.. loadActivity");
    //////console.log('loadActivity');
    //////console.log("activityMask show");
    $(activityMask).show();
    if (!loadingInitialize && activityLoadedPath != _jsonPath) {
      loadingInitialize = true;
      var jqxhr = $.getJSON(_jsonPath, function() {})
        .done(function(data) {
          EventBus.dispatch('showAnnotationButton', this, navControlObj);
          configJson = data;
          shellModel.setActivityConfig(configJson);
          imagePreload(configJson.template_config.preloadImages);
          activityLoadedPath = _jsonPath;
        })
        .fail(function() {
          ////////////console.log( "Error occur while config JSON is loading.");
        });
    }
  }
  //======================
  function imagePreload(imageJsonPath) {
    //////console.log("ShellController..imagePreload ");
    if (imageJsonPath.length > 0) {
      loadImgCnt = 0;
      lodedImgCnt = 0;
      imageArray = new Array();
      for (var i = 0; i < imageJsonPath.length; i++) {
        imageArray[i] = new Object();
        imageArray[i].img = new Image();
        imageArray[i].img.onload = imgloaded;
        imageArray[i].img.src = shellModel.getMediaPath() + imageJsonPath[i];
        loadImgCnt++;
      }
    } else {
      _classRef.loadStatus('ImageloadingComplete');
    }
  }
  //======================
  function imgloaded() {
    //////console.log("ShellController.. imgloaded");
    lodedImgCnt++;
    if (lodedImgCnt == loadImgCnt) {
      _classRef.loadStatus('ImageloadingComplete');
    }
  }
  //======================
  function loadHtml(path, classRef) {
    //////console.log("ShellController.. loadHtml");
    var refArray = shellModel.getDomElementReference();
    for (var i = 0; i < refArray.length; i++) {
      if (refArray[i].data('uniqueId') == 'activityPage') {
        containerElement = refArray[i];
      }
    }
    containerElement.load(shellModel.getMediaPath() + path, function(
      response,
      status,
      xhr
    ) {
      if (status == 'error') {
        var msg = 'There was an error loading html.';
      } else if (status == 'success') {
        classRef.loadStatus('htmlLoaded');
      }
    });
  }
  //======================
  function jsPreload(jsArray, classRef) {
    //////console.log("ShellController.. jsPreload");
    lodedJSCnt = 0;
    loadJSCnt = 0;
    var _path = shellModel.getMediaPath();
    var _bool = false;
    if (shellModel.getJsPath() != '') {
      _bool = true;
    }
    for (var i = 0; i < jsArray.length; i++) {
      if (_bool && jsArray[i].indexOf('../../../') != -1) {
        jsArray[i] = jsArray[i].replace('../../../', '');
        _path = shellModel.getJsPath();
      } else {
        _path = shellModel.getMediaPath();
      }
      $.getScript(_path + jsArray[i])
        .done(function() {
          jsLoaded(classRef);
          //////////////console.log("jsLoaded = "+lodedJSCnt);
        })
        .fail(function(jqxhr, settings, exception) {
          ////////////console.log("Error Loading js fle. jqxhr == ",jqxhr," :: settings == "+settings, " :: exception == ",exception);
        });
      loadJSCnt++;
    }
  }
  //======================
  function cssPreload(cssArray, classRef) {
    //////console.log("ShellController.. cssPreload");
    var iFrame = shellModel.getiFrameRef();
    var _iframeRef = iFrame;
    var _doc = _iframeRef.contentWindow.document;
    var _bool;
    for (var i = 0; i < cssArray.length; i++) {
      _bool = true;
      var _path = '';
      if (cssArray[i].indexOf('../../../') != -1) {
        //condition checking for activity specific css
        _path = shellModel.getMediaPath();
        cssArray[i] = cssArray[i].replace('../../../', '');
        _bool = false;
      }
      if (shellModel.getJsPath() != '' && _bool) {
        _path = shellModel.getJsPath();
      }
      var link = _doc.createElement('link');
      link.href = _path + cssArray[i];
      link.rel = 'stylesheet';
      link.type = 'text/css';
      $(_doc.getElementsByTagName('head')).append(link);
    }
    classRef.loadStatus('cssLoaded');
  }
  //======================
  function jsLoaded(classRef) {
    //////console.log("ShellController.. jsLoaded");
    lodedJSCnt++;
    //////////////console.log("lodedJSCnt == "+lodedJSCnt+" :: loadJSCnt == "+loadJSCnt);
    if (lodedJSCnt == loadJSCnt) {
      classRef.loadStatus('JSloadingComplete');
    }
  }
  //======================
  function lazyLoad(preloadJson) {
    //////console.log("ShellController.. lazyLoad");
    if (preloadJson.preloadImages.length > 0) {
      imagePreload(preloadJson.preloadImages);
    }
  }
  //======================
  function stopOnStepPoints(currentIndex) {
    var startPointsArray = shellModel.getStepStartPoint();
    var stopPointsArray = shellModel.getStepPoint();
    var nDiff = Number(stopPointsArray[0]);
    //
    var i = nCurrentStep;
    ////console.log(shellModel.getStepPoint()[i],currentIndex)
    var min = parseInt(startPointsArray[i + 1]) / shellModel.getFps();
    var max = parseInt(stopPointsArray[i + 1]) - min;
    nDiff += Number(stopPointsArray[i + 1]);
    if (shellModel.getStepPoint()[i] <= currentIndex && !isVideoEnded) {
      updteCurrentStep(i + 1);
      if (i + 1 != shellModel.getStepPoint().length) {
        addHighLight(playRef[0], true);
        pauseCurrentStepAnimation(currentIndex);
        shellModel.setNextStartPoint(shellModel.getStepStartPoint()[i + 1]);
        prevStopFrame = Number(shellModel.getStepStartPoint()[i + 1]);
        //
        sliderObj.updateGlobalValues(startPointsArray, stopPointsArray, i + 1);
        sliderObj.setMinVal(0);
        sliderObj.setMaxVal(
          (max * stopPointsArray.length) / shellModel.getFps()
        );
        sliderObj.setStartVal((max * (i + 1)) / shellModel.getFps());
      }
      //isJumpBtnPressed = false;
      //sliderObj.setSliderPos(((100/stopPointsArray.length)*(i+1))+"%");
      ////console.log("nCurrentStep "+nCurrentStep);
      return false;
    }
    // Code added on 10/11/2016
    if (stepGeneratorObj) {
      if (prevStopFrame != 0) {
        stepGeneratorObj.enable();
      }
    }
    // =========================
    prevStopFrame = currentIndex;
  }
  //======================
  function pauseCurrentStepAnimation(currentIndex) {
    //////console.log("ShellController.. pauseCurrentStepAnimation");
    ////////////console.log("pauseCurrentStepAnimation   " , currentIndex , totalFrames)
    if (shellModel.getAnimationType() == 'video') {
      shellModel.setIsPauseAtStepPoint(true);
      //Commented for audio cut issue 11/06/2016
      // videoManagerObj.getVideoElement().currentTime += (frameOffsetForStop+1)/shellModel.getFps();
      ////console.log('4');
      videoManagerObj.pauseVideo();
      navControlObj.updatePlayPauseState(false, true);
      // --- highlight the Play Button....//
      //addHighLight(playRef[0], true);
      //buttonAnim.show();
      // ---Handeling i-text for Step animation---
      for (
        var iTxtIndex = 0;
        iTxtIndex < shellModel.getPageDataObject().dataObj.iTxtArr.length;
        iTxtIndex++
      ) {
        $(dummyiTextRef)
          .find('#' + shellModel.getPageDataObject().dataObj.iTxtArr[iTxtIndex])
          .hide();
      }
      if (
        shellModel.getPageDataObject().dataObj.iTxtArr[2] != undefined &&
        currentIndex < totalFrames
      ) {
        $(dummyiTextRef)
          .find('#' + shellModel.getPageDataObject().dataObj.iTxtArr[2])
          .show();
      }
      segComplete = true;
      pauseBtnClicked = true;
    }
  }
  //======================
  /* Timeline function is handeled by this methods. This method is called repetately over time and act accordingly.*/
  function checkVideoTime(currentFrame) {
    //////console.log("ShellController.. checkVideoTime");
    var endFrame, _screenObj, _startFrame;
    var lastFrame = false;
    var _mediaType = shellModel.getMediaType();
    if (_mediaType == 'animation') {
      endFrame = totalFrames;
    } else if (_mediaType == 'interactive') {
      _screenObj = shellModel.getScreenObj()[shellModel.getCurrentScreenId()];
      if (shellModel.getExceptionDuration()) {
        ////console.log("===============");
        //if(currentFrame == endFrame)
        endFrame = currentFrame + shellModel.getExceptionDuration();
      } else {
        ////console.log("---------------");
        endFrame = _screenObj.currentFrame + _screenObj.duration;
      }
      _startFrame = _screenObj.currentFrame;

      if (currentFrame >= _startFrame) {
        if ($(blackOverlay).css('display') != 'none') {
          $(blackOverlay).hide();
          //preloaderObj.hideLoader();
        }
      } else {
        if ($(blackOverlay).css('display') == 'none') {
          $(blackOverlay).show();
          //preloaderObj.displayVideoLoader();
        }
      }
    }
    //////console.clear()
    //////console.log("videoManagerObj.getVideoCurrentTime ::: "+Math.floor(videoManagerObj.getVideoCurrentTime()) +" videoManagerObj.duration ::: "+ Math.floor(videoManagerObj.getVideoDuration()));
    if (currentFrame >= endFrame) {
      videoManagerObj.setVideoCurrentTime(
        Math.round(endFrame) / shellModel.getFps()
      );
      ////console.log('5');
      //videoManagerObj.pauseVideo();
      if (_mediaType == 'animation') {
        // ===== display play-again button as media reaches to end.
        showHideItext();
        //initiatePlayAgain();
        videoManagerObj.stopVideo();
      } else if (_mediaType == 'interactive') {
        ////console.log('55');
        videoManagerObj.pauseVideo();
        if (_screenObj.mediaPath.length >= 1) {
          var jsonPath = _screenObj.mediaPath[0];
          if (jsonPath != undefined && jsonPath != '') {
            loadActivity(shellModel.getMediaPath() + jsonPath);
          }
        }
        showHideItext();
        navControlObj.updatePlayPauseState(true, false);
        navControlObj.enablePlayPause(false);
        navControlObj.updateNavigation(Math.round(endFrame));
        shellModel.setScreenPlaying(false);
        if (shellModel.getMediaActivePosition() != 'immediate') {
          if (shellModel.getMediaActivePosition() == 'videoEnd') {
            EventBus.dispatch('MediaReadyForActive', this, navControlObj);
            $('#fake').css('display', 'none');
            //////console.log("activityMask hide");
            $(activityMask).hide();
          }
        } else {
          //////console.log("activityMask hide");
          $(activityMask).hide();
        }
      }
    } else {
      isVideoEnded = false;
      shellModel.setScreenPlaying(true);

      navControlObj.playAgain(false);

      if (pageDataJson.components.navigationType == 'navPanelStepAnimation') {
        navControlObj.updatePlayPauseState(true, true);
        pauseBtnClicked = false;
        navControlObj.enablePlayPause(true);
      }

      //commented to stop forcefull setting of playPause button - 2/1/2017 Sagar
      //navControlObj.enablePlayPause(true);

      //////console.clear();
      //////console.log(shellModel.getScreenObj()[shellModel.getCurrentScreenId()].mediaActivePosition);
      //////console.log(shellModel.getMediaActivePosition());
      // Added by Sagar on 24Jan,2017
      var _id;
      if (shellModel.getScreenObj()) {
        _id = shellModel.getCurrentScreenId();
        if (
          shellModel.getScreenObj()[_id] &&
          shellModel.getScreenObj()[_id].mediaActivePosition
        ) {
          shellModel.setMediaActivePosition(
            shellModel.getScreenObj()[_id].mediaActivePosition.frame
          );
        }
      }

      if (shellModel.getMediaActivePosition() != 'immediate') {
        if (typeof shellModel.getMediaActivePosition() == 'number') {
          var activeFrame = shellModel.getMediaActivePosition();
          if (currentFrame >= activeFrame) {
            EventBus.dispatch('MediaReadyForActive', this, navControlObj);
            $('#fake').css('display', 'none');
            //////console.log("activityMask hide");
            $(activityMask).hide();
          }
        } else {
          // Added by Sagar on 24Jan,2017
          if (
            !shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
              .mediaActivePosition
          ) {
            $(activityMask).show();
          }
        }
      } else {
        //IF added for C1 and C2 files - Sagar
        if (shellModel.getScreenObj()) {
          if (
            !shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
              .mediaActivePosition
          ) {
            $(activityMask).hide();
          } else {
            $(activityMask).show();
          }
        }
      }
    }
    //
    if (
      Math.floor(videoManagerObj.getVideoCurrentTime()) ==
        Math.floor(videoManagerObj.getVideoDuration()) &&
      _mediaType != 'stepAnimation'
    ) {
      //videoManagerObj.stopVideo();
    }
  }
  //======================
  function initiatePlayAgain() {
    console.log('ShellController.. initiatePlayAgain');
    if (isVideoEnded) {
      return false;
    }
    if (
      BrowserDetectAdv.iOS() ||
      (BrowserDetect.OS == 'Linux' && !BrowserDetectAdv.Android()) ||
      BrowserDetect.browser == 'Safari'
    ) {
      videoManagerObj.setVideoCurrentTime(totalFrames / shellModel.getFps());
    }
    ////console.log('6');
    videoManagerObj.pauseVideo();
    videoManagerObj.stopVideo();
    navControlObj.playAgain(true);
    navControlObj.updatePlayPauseState(true, false);
    pauseBtnClicked = false;
    if (playRef) addHighLight(playRef[0], false);
    drawTextFrame(totalFrames - 1);
    showHideItext();
    navControlObj.enablePlayPause(false);
    navControlObj.updateNavBackPatch(shellModel.getNavBackWidth() + 110);
    isVideoEnded = true;
    updteCurrentStep(0);
    if(!isMediaEneded){
      tcePlayerOnMediaEnded();
    }
  }
  //======================
  function showHideItext() {
    //////console.log("ShellController.. showHideItext");
    var iTextArray = shellModel.getPageDataObject().dataObj.iTxtArr;
    var totalAvailableTxtDivRef = $(dummyiTextRef).children();
    if (iTextArray.length > 0) {
      // --- Handeling multiple Itext for animation and step animation ----
      if (shellModel.getPageDataObject().components.screenType == 'animation') {
        if (shellModel.getIsPauseAtStepPoint() == false) {
          switch (videoManagerObj.getVideoPlayStatus()) {
            case false:
              if (iTextArray != undefined) {
                if (animationNotYetPlayed) {
                  // = For first time while the animation is in pause state =
                  for (
                    var iTxtIndex = 1;
                    iTxtIndex < iTextArray.length;
                    iTxtIndex++
                  ) {
                    $(dummyiTextRef)
                      .find('#' + iTextArray[iTxtIndex])
                      .hide();
                  }
                } else {
                  // = Any other time while animation is in first stage =
                  for (
                    var iTxtIndex = 0;
                    iTxtIndex < iTextArray.length;
                    iTxtIndex++
                  ) {
                    for (var n = 0; n < totalAvailableTxtDivRef.length; n++) {
                      if (
                        totalAvailableTxtDivRef[n].id == iTextArray[iTxtIndex]
                      ) {
                        $(dummyiTextRef)
                          .find('#' + iTextArray[iTxtIndex])
                          .hide();
                      }
                    }
                  }
                  if (iTextArray[1] != undefined) {
                    $(dummyiTextRef)
                      .find('#' + iTextArray[1])
                      .show();
                  }
                }
              }
              break;
            case true:
              animationNotYetPlayed = false;
              for (
                var iTxtIndex = 0;
                iTxtIndex < iTextArray.length;
                iTxtIndex++
              ) {
                for (var n = 0; n < totalAvailableTxtDivRef.length; n++) {
                  if (totalAvailableTxtDivRef[n].id == iTextArray[iTxtIndex]) {
                    $(dummyiTextRef)
                      .find('#' + iTextArray[iTxtIndex])
                      .hide();
                  }
                }
              }
              if (iTextArray[1] != undefined) {
                $(dummyiTextRef)
                  .find('#' + iTextArray[1])
                  .show();
              }
              break;
          }
        } else {
          for (var iTxtIndex = 0; iTxtIndex < iTextArray.length; iTxtIndex++) {
            for (var n = 0; n < totalAvailableTxtDivRef.length; n++) {
              if (totalAvailableTxtDivRef[n].id == iTextArray[iTxtIndex]) {
                $(dummyiTextRef)
                  .find('#' + iTextArray[iTxtIndex])
                  .hide();
              }
            }
          }
          //commented for C2 files for itext at the end.
          /*
							if(iTextArray[2] != undefined) {
								$(dummyiTextRef).find("#"+iTextArray[2]).show();
							} */
          if (iTextArray[1] != undefined) {
            $(dummyiTextRef)
              .find('#' + iTextArray[1])
              .show();
          }
        }
      } else if (
        shellModel.getPageDataObject().components.screenType == 'interactive'
      ) {
        if (iTextArray != undefined) {
          for (var iTxtIndex = 0; iTxtIndex < iTextArray.length; iTxtIndex++) {
            $(dummyiTextRef)
              .find('#' + iTextArray[iTxtIndex])
              .hide();
          }
        }
      }
    }
  }
  //======================
  function sliderDragStart(event, parentClass) {
    //////console.log("ShellController.. sliderDragStart");
    if (parentClass === _classRef) {
      preloaderObj.displayVideoLoader();
      navControlObj.playAgain(false);
      navControlObj.updateNavBackPatch(shellModel.getNavBackWidth());
      //textDivRef.hide();
    }
  }
  //======================
  function hidePlayHighlight(event, parentClass) {
    //////console.log("ShellController.. hidePlayHighlight");
    if (parentClass === _classRef) {
      addHighLight(playRef[0], false);
      //buttonAnim.hide();
      activityLoadedPath = '';
    }
  }
  //======================
  function resetMediaPath(event, parentClass) {
    //////console.log("ShellController.. resetMediaPath");
    if (parentClass === _classRef) {
      //////console.log("resetMediaPath");
      activityLoadedPath = '';
      EventBus.dispatch('showAnnotationCanvas');
    }
  }
  function jumpSetDraggerPos(nId) {
    var startPointsArray = shellModel.getStepStartPoint();
    var stopPointsArray = shellModel.getStepPoint();
    var min = parseInt(startPointsArray[nId]) / shellModel.getFps();
    var max = parseInt(stopPointsArray[nId]) - min;
    pauseCurrentStepAnimation(startPointsArray[nId]);
    sliderObj.updateGlobalValues(startPointsArray, stopPointsArray, nId);
    sliderObj.setMinVal(0);
    sliderObj.setMaxVal((max * stopPointsArray.length) / shellModel.getFps());
    sliderObj.setStartVal((max * nId) / shellModel.getFps());
  }
  //======================
  function sliderDragStopped(ref, parentClass, val, sliderPos) {
    if (parentClass === _classRef) {
      if (playRef) {
        addHighLight(playRef[0], false);
      }
      navControlObj.enablePlayPause(true);
      preloaderObj.displayVideoLoader();
      textDivRef.hide();
      if (iTextRef) {
        iTextRef.empty();
      }
      if (shellModel.getMediaType() == 'animation') {
        if (pageDataJson.components.navigationType == 'navPanelStepAnimation') {
          var vr = stepGeneratorObj.getPoints(sliderPos);
          updteCurrentStep(Number(vr[2]));
          jumpSetDraggerPos(Number(vr[2]));
          endFrame = totalFrames;
          currentFrame =
            vr[0] + ((vr[1] - vr[0]) * (sliderPos - vr[3])) / (vr[4] - vr[3]);
          prevStopFrame = currentFrame;
          videoManagerObj.setVideoCurrentTime(
            currentFrame / shellModel.getFps()
          );
        } else {
          endFrame = totalFrames;
          currentFrame = val * shellModel.getFps();
          prevStopFrame = currentFrame;
        }
        if (currentFrame >= endFrame) {
          // = media reaches end as user drag the slider to end == Video ended event does not called in Chrome.//
          initiatePlayAgain();
          ////console.log('7');
          videoManagerObj.pauseVideo();
        } else {
          if (pauseBtnClicked && !segComplete) {
            ////console.log('8');
            videoManagerObj.pauseVideo();
            textDivRef.hide();
          } else {
            videoManagerObj.playVideo();
            segComplete = false;
            pauseBtnClicked = false;
          }
        }
      } else if (shellModel.getMediaType() == 'interactive') {
        navControlObj.restoreNext();
        if (pauseBtnClicked) {
          ////console.log('9');
          videoManagerObj.pauseVideo();
          textDivRef.hide();
        } else {
          videoManagerObj.playVideo();
        }
      }
    }
  }
  //======================
  this.reloadCurrentStep = function() {
    //console.log(sliderObj.getSliderPos());
    var vr = stepGeneratorObj.getPoints(sliderObj.getSliderPos());
    updteCurrentStep(Number(vr[2]));
    jumpSetDraggerPos(Number(vr[2]));
    endFrame = totalFrames;
    currentFrame = vr[0];
    prevStopFrame = currentFrame;
    videoManagerObj.setVideoCurrentTime(currentFrame / shellModel.getFps());
  };
  //======================
  function updteCurrentStep(nId) {
    ////console.log(nId);
    nCurrentStep = nId;
  }
  //======================
  function videoSeekSuccess(event, parentClass) {
    if (parentClass === _classRef) {
      //if(isVideoEnded)
      // {
      // 	return false;
      // }
      ////console.log("ShellController.. videoSeekSuccess");
      isVideoSeeked = true;
      //this.removeActivity();
      if (BrowserDetectAdv.iOS()) {
        setTimeout(function() {
          preloaderObj.hideLoader();
          updateTxt(true);
          showHideItext();
          textDivRef.show();
          if (isStepButtonClicked) {
            isStepButtonClicked = false;
            pauseBtnClicked = false;
            videoManagerObj.playVideo();
          }
        }, 200);
      } else {
        //alert("hideLoader");
        preloaderObj.hideLoader();
        updateTxt(true);
        showHideItext();
        textDivRef.show();
        if (isStepButtonClicked) {
          isStepButtonClicked = false;
          pauseBtnClicked = false;
          videoManagerObj.playVideo();
        }
      }
    }
  }
  //======================
  function jumpStepPoint(event, parentClass, frameNum, frameNum2, nId) {
    //////console.log("ShellController.. jumpStepPoint");
    if (parentClass === _classRef) {
      updteCurrentStep(nId);
      //isVideoSeeked = false;
      isStepButtonClicked = true;
      addHighLight(playRef[0], false);
      var frameNumber = Number(frameNum) + 10; //added offset Frame to 10.
      if (shellModel.getAnimationType() == 'video') {
        textDivRef.hide();
        ////console.log('10');
        videoManagerObj.pauseVideo();
        videoManagerObj.setVideoCurrentTime(frameNumber / shellModel.getFps());
        if (pageDataJson.components.navigationType == 'navPanelStepAnimation') {
          jumpSetDraggerPos(nId);
        }
        setTimeout(function() {
          videoManagerObj.playVideo();
          pauseBtnClicked = false;
          addHighLight(playRef[0], false);
          hidePlayHighlight({}, _classRef);
          videoLoaderOn({}, _classRef);
          navControlObj.updateNavBackPatch(shellModel.getNavBackWidth());
        }, 10);

        //////console.log(pauseBtnClicked);
      }
    }
  }
  //======================
  function videoLoaderOn(event, parentClass) {
    //////console.log("ShellController.. videoLoaderOn");
    if (parentClass === _classRef) {
      //alert("displayVideoLoader On");
      preloaderObj.displayVideoLoader();
      drawTextObj.clearCanvas();
      textDivRef.hide();
    }
  }
  //======================
  function videoLoaderOff(event, parentClass) {
    if (parentClass === _classRef) {
      preloaderObj.hideLoader();
      textDivRef.show();
    }
  }
  //======================
  function jumpToStartFrame(event, parentClass) {
    //////console.log("ShellController.. jumpToStartFrame");
    if (parentClass === _classRef) {
      videoManagerObj.getVideoElement().currentTime =
        pageDataJson.dataObj.startFrame / shellModel.getFps();
    }
  }
  //======================
  function makeVideoReady(event, parentClass) {
    //////console.log("ShellController.. makeVideoReady");
    if (parentClass === _classRef) {
      //////////////console.log("In SHell Controller ................. makeVideoReady Inside........");
      if (pageDataJson.video != undefined) {
        shellModel.setAnimationType('video');
        shellModel.setFps(pageDataJson.dataObj.frameRate);
        shellModel.setSegStartFrame(pageDataJson.dataObj.startFrame);
        shellModel.setVideoStartFrame(pageDataJson.dataObj.startFrame);
        loadVideoPerType();
        generateStepDots();
      }
    }
  }
  //======================
  function loadActivityExternal(ref, parentClass, jsonPath) {
    //////console.log("ShellController.. loadActivityExternal");
    if (parentClass === _classRef) {
      loadActivity(jsonPath);
    }
  }
  //======================
  function showMask(event, parentClass) {
    //////console.log("ShellController.. showMask");
    if (parentClass === _classRef) {
      //////console.log("activityMask show");
      $(activityMask).show();
    }
  }
  //======================
  function addHighLight(elem, flag) {
    //////console.log("ShellController.. addHighLight");
    if (flag) {
      $(elem)
        .removeClass('highlight-stat')
        .addClass('highlight-stat');
    } else {
      $(elem).removeClass('highlight-stat');
    }
  }
  //======================
  function hideMask(event, parentClass) {
    //////console.log("ShellController.. hideMask");
    if (parentClass === _classRef) {
      //////console.log("activityMask hide");
      $(activityMask).hide();
    }
  }
  //======================
  function checkAndHideSlider(event, parentClass) {
    //////console.log("ShellController.. checkAndHideSlider");
    if (parentClass === _classRef) {
      if (
        shellModel.getScreenObj()[shellModel.getCurrentScreenId()].sliderDisplay
      ) {
        shellModel.setVideoDuration(
          parseInt(
            shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
              .currentFrame + shellModel.getScreenObj()[0].duration
          ) / shellModel.getFps()
        );
        shellModel.setSegStartFrame(
          shellModel.getScreenObj()[shellModel.getCurrentScreenId()]
            .currentFrame
        );
        sliderObj.init(
          sliderRef,
          'video',
          shellModel.getVideoDuration(),
          shellModel.getSegStartFrame() / shellModel.getFps(),
          true,
          videoManagerObj,
          pageDataJson.components.navigationType
        );
        sliderObj.displaySlider();
        sliderObj.showSlider();
        $(navSliderBack).show();
      } else {
        sliderObj.removeSlider();
        $(navSliderBack).hide();
      }
    }
  }
  /* ====== End of Private functions ========	*/

  /* Events Listeners */
  /* Slider Class despatch "slider_slide_start" event once user start dragging the slider */
  EventBus.addEventListener('slider_slide_start', sliderDragStart, this);

  /* Slider Class despatch "slider_drag_complete" event once user complete dragging the slider */
  EventBus.addEventListener('slider_drag_complete', sliderDragStopped, this);

  /* VideoManager Class despatch "videoSeeked" event once player loded the video frame for sekked position */
  EventBus.addEventListener('videoSeeked', videoSeekSuccess, this);

  /* VideoManager Class despatch "videoEnd" event once player reach to end */
  EventBus.addEventListener('videoEnd', initiatePlayAgain, this);

  /* VideoManager Class despatch "videoPlaying" event once video start playing */
  EventBus.addEventListener('videoPlaying', onVideoPlaying, this);

  /* VideoManager Class despatch "videoPaused" event once video stop*/
  EventBus.addEventListener('videoPaused', onVideoPause, this);

  /* VideoManager Class despatch "videoEnd" event once player reach to end */
  EventBus.addEventListener('videoDataLoaded', jumpToStartFrame, this);

  /* VideoManager Class despatch "videoEnd" event once player reach to end */
  EventBus.addEventListener('jumpStep', jumpStepPoint, this);

  /* Replay despatch "removePlayHighlight" event once player reach to end */
  EventBus.addEventListener('removePlayHighlight', hidePlayHighlight, this);

  /* Replay despatch "removePlayHighlight" event once player reach to end */
  EventBus.addEventListener('replayActivityCalled', resetMediaPath, this);

  /* Replay despatch "showVideoLoader" event */
  EventBus.addEventListener('showVideoLoader', videoLoaderOn, this);

  /* Replay despatch "showVideoLoader" event */
  EventBus.addEventListener('hideVideoLoader', videoLoaderOff, this);
  /* ====== End Private functions ========	*/
  EventBus.addEventListener('pageJsonLoaded', checkDataLoad, this);
  /* ====== End Private functions ========	*/
  EventBus.addEventListener('imgageTextLoaded', checkImageTextLoad, this);

  EventBus.addEventListener('drawTextReady', makeVideoReady, this);

  // ====== listener to capture events dispatched by templates/actitities to load an activity page from outside ==============//
  EventBus.addEventListener(
    'loadActivityFromOutside',
    loadActivityExternal,
    this
  );

  EventBus.addEventListener('enableMask', showMask, this);

  EventBus.addEventListener('disableMask', hideMask, this);
  /* PlayAgian despatch "checkAndHideSlider" event */
  EventBus.addEventListener('checkAndHideSlider', checkAndHideSlider, this);
};
