/* ====== Single Model Class is used for the Player and would be used to store data and access data through Getter and setter ========	*/

var ShellModel = function() {
  var playerJsonObj, playerImageObj, playerData;
  var navObj;
  var navButtonCollection = new Array();
  var buttonJsonLoadStatus = 0;
  var navComponentLength;
  var pageDataObject = new Object();
  var audioPlayStatus = false;
  var audioLoaded = false;
  var pageAudio = new Audio();
  var startP = 0;
  /* 	var volumeStatus=1; */
  var componentLoadedCount = 0;
  var animationType = ''; // value could be jsfl or video
  var videoDuration = 0;
  var videoStartFrame = 0;
  var segStartFrame = 0;
  var Fps = 0;
  var stepPoint = new Array();
  var stepStartPoint = new Array();
  var mediaType = ''; // value could be 'animation', 'interactive'
  var currentScreenId = 0;
  var screenObj;
  var highlightNext = false;
  var isPauseAtStepPoint = false;
  var activityConfig;
  var domElementReference = new Array();
  var navElementReference = new Array();
  var serviceObj;
  var screenPlayStatus = false;
  var exceptionDuration = null;
  var pageData = [];
  var thumbnailPath = '';
  var iFrameRef;
  var mediaActivePosition = 'immediate';
  var nextStartPoint = null;
  var videoPath;
  var preLoaderReference;
  var sourceType = 'mp4';
  var jsPath;
  var thisRef = this;
  // -- Public function -- //
  this.setJsPath = function(obj) {
    jsPath = obj;
  };
  this.getJsPath = function() {
    return jsPath;
  };
  this.setSourceType = function(obj) {
    sourceType = obj;
  };
  this.getSourceType = function() {
    return sourceType;
  };
  this.setPlayerJsonObj = function(obj) {
    playerJsonObj = obj;
  };
  this.getPlayerJsonObj = function() {
    return playerJsonObj;
  };
  this.setPlayerImageObj = function(obj) {
    playerImageObj = obj;
  };
  this.getPlayerImageObj = function() {
    return playerImageObj;
  };
  this.setNavJsonObj = function(obj) {
    navObj = obj;
  };
  this.getNavJsonObj = function() {
    return navObj;
  };
  (this.setNavButtonCollection = function(obj) {
    navButtonCollection.push(obj);
  }),
    (this.getNavButtonCollection = function() {
      return navButtonCollection;
    });
  this.setButtonJsonLoadStatus = function() {
    buttonJsonLoadStatus++;
  };
  this.getButtonJsonLoadStatus = function() {
    return buttonJsonLoadStatus;
  };
  this.setNavComponentLength = function(num) {
    navComponentLength = num;
  };
  this.getNavComponentLength = function() {
    return navComponentLength;
  };
  this.setPageDataObject = function(obj) {
    pageDataObject = obj;
  };
  this.getPageDataObject = function() {
    return pageDataObject;
  };
  this.getTextValue = function(txtId) {
    return pageDataObject.txtObjContent[txtId];
  };
  this.setAudioPlayStatus = function(status) {
    audioPlayStatus = status;
  };
  this.getAudioPlayStatus = function() {
    return audioPlayStatus;
  };
  this.setAudioLoaded = function(aBool) {
    audioLoaded = aBool;
  };
  this.getAudioLoaded = function() {
    return audioLoaded;
  };
  this.getAudio = function() {
    return pageAudio;
  };
  this.setAudioSrc = function(aObj) {
    pageAudio.src = aObj;
  };
  this.setStartPoint = function(aObj) {
    startP = aObj;
  };
  this.getStartPoint = function() {
    return startP;
  };
  this.setiFrameRef = function(_frameRef) {
    iFrameRef = _frameRef;
  };
  this.getiFrameRef = function(_frameRef) {
    return iFrameRef;
  };
  /* 	this.setVolumeStatus = function (aVol) {
       volumeStatus = aVol;
    };
    this.getVolumeStatus = function () {
       return volumeStatus;
    }; */
  this.resetAudioValues = function() {
    audioEndListner = 0;
    startP = 0.1;
    endP = Math.round(pageAudio.duration);
  };
  this.setAudioLoaded = function(aObj) {
    audioLoaded = aObj;
  };
  this.getAudioLoaded = function(aObj) {
    return audioLoaded;
  };
  this.updateComponentLoadedCount = function(aVal) {
    componentLoadedCount += aVal;
  };
  this.getComponentLoadedCount = function() {
    return componentLoadedCount;
  };
  this.setAnimationType = function(type) {
    animationType = type;
  };
  this.getPlayerData = function() {
    return playerData;
  };
  this.setPlayerData = function(data) {
    playerData = data;
  };
  this.getAnimationType = function() {
    return animationType;
  };
  this.setVideoDuration = function(duration) {
    videoDuration = duration;
  };
  this.getVideoDuration = function() {
    return videoDuration;
  };
  this.setVideoStartFrame = function(frame) {
    videoStartFrame = frame;
  };
  this.getVideoStartFrame = function() {
    return videoStartFrame;
  };
  this.setSegStartFrame = function(frame) {
    segStartFrame = frame;
  };
  this.getSegStartFrame = function() {
    return segStartFrame;
  };
  this.setFps = function(frameRate) {
    setFps = frameRate;
  };
  this.getFps = function(frameRate) {
    return setFps;
  };
  this.setStepPoint = function(stepData) {
    stepPoint = stepData;
  };
  this.getStepPoint = function() {
    return stepPoint;
  };
  this.setStepStartPoint = function(startData) {
    stepStartPoint = startData;
  };
  this.getStepStartPoint = function() {
    return stepStartPoint;
  };
  this.setMediaType = function(type) {
    mediaType = type;
  };
  this.getMediaType = function() {
    return mediaType;
  };
  this.getMediaPath = function() {
    return serviceObj.getMediaUrl();
  };
  this.setScreenId = function(id) {
    currentScreenId = id;
  };
  this.getCurrentScreenId = function() {
    return currentScreenId;
  };
  this.setScreenObj = function(scrObj) {
    screenObj = scrObj;
  };
  this.getScreenObj = function() {
    return screenObj;
  };
  this.setHighlightNext = function(aBool) {
    highlightNext = aBool;
  };
  this.getHighlightNext = function() {
    return highlightNext;
  };
  this.setIsPauseAtStepPoint = function(aBool) {
    isPauseAtStepPoint = aBool;
  };
  this.getIsPauseAtStepPoint = function() {
    return isPauseAtStepPoint;
  };
  this.setActivityConfig = function(jsonData) {
    activityConfig = jsonData;
  };
  this.getActivityConfig = function() {
    return activityConfig;
  };
  this.setDomElementReference = function(_element) {
    if (_element.length == 0) {
      domElementReference.push(_element);
    } else {
      for (var i = 0; i < _element.length; i++) {
        domElementReference.push(_element[i]);
      }
    }
  };
  this.getDomElementReference = function(_element) {
    return domElementReference;
  };
  this.setPreLoaderReference = function(_objRef) {
    preLoaderReference = _objRef;
  };
  this.getPreLoaderReference = function(_objRef) {
    return preLoaderReference;
  };
  // return starDiv reference
  this.getStarDivRef = function() {
    var ref;
    for (var i = 0; i < domElementReference.length; i++) {
      var starRef = domElementReference[i][0];
      if (starRef.id == 'starDiv') {
        ref = starRef;
        break;
      }
    }
    return ref;
  };
  // return menuDiv reference
  this.getMeunDivRef = function() {
    var ref;
    for (var i = 0; i < domElementReference.length; i++) {
      var menuRef = domElementReference[i][0];
      if (menuRef.id == 'menuDiv') {
        ref = menuRef;
        break;
      }
    }
    return ref;
  };
  this.getActMaskRef = function() {
    var ref;
    for (var i = 0; i < domElementReference.length; i++) {
      var maskRef = domElementReference[i][0];
      if (maskRef.id == 'activityMask') {
        ref = maskRef;
        break;
      }
    }
    return ref;
  };
  this.setNavElementReference = function(_element) {
    navElementReference.push(_element);
  };
  this.getNavElementReference = function() {
    return navElementReference;
  };
  this.setNavBackWidth = function(val) {
    navBackWidth = val;
  };
  this.getNavBackWidth = function() {
    return navBackWidth;
  };
  this.setServiceObj = function(val) {
    serviceObj = val;
  };
  this.getServiceObj = function() {
    return serviceObj;
  };
  this.setScreenPlaying = function(aBool) {
    screenPlayStatus = aBool;
  };
  this.getScreenPlaying = function() {
    return screenPlayStatus;
  };
  this.setExceptionDuration = function(_duration) {
    exceptionDuration = _duration;
  };
  this.getExceptionDuration = function() {
    return exceptionDuration;
  };
  this.setPageData = function(pageIndex, data) {
    pageData[pageIndex] = data;
  };
  this.getPageData = function() {
    return pageData;
  };
  this.setThumbnailPath = function(path) {
    thumbnailPath = path;
  };
  this.getThumbnailPath = function() {
    return thumbnailPath;
  };
  this.removePageData = function() {
    pageData = [];
  };
  this.setMediaActivePosition = function(_value) {
    mediaActivePosition = _value;
  };
  this.getMediaActivePosition = function() {
    return mediaActivePosition;
  };
  this.setNextStartPoint = function(val) {
    nextStartPoint = val;
  };
  this.getNextStartPoint = function() {
    return nextStartPoint;
  };
  this.setVideoPath = function(path) {
    videoPath = path;
    thisRef.setSourceType(
      videoPath
        .split('.')
        .reverse()[0]
        .toLowerCase()
    );
  };
  this.getVideoPath = function(path) {
    return videoPath;
  };
  this.destroy = function() {
    playerJsonObj = null;
    playerImageObj = null;
    navObj = null;
    navButtonCollection = null;
    buttonJsonLoadStatus = null;
    navComponentLength = null;
    pageDataObject = null;
    audioPlayStatus = null;
    audioLoaded = null;
    pageAudio = null;
    startP = null;
    componentLoadedCount = null;
    animationType = null;
    videoDuration = null;
    segStartFrame = null;
    Fps = null;
    stepPoint = null;
    stepStartPoint = null;
    mediaType = null;
    currentScreenId = null;
    screenObj = null;
    highlightNext = null;
    isPauseAtStepPoint = null;
    activityConfig = null;
    domElementReference = null;
    navElementReference = null;
    mediaPath = null;
    screenPlayStatus = null;
    exceptionDuration = null;
    pageData = null;
    thumbnailPath = null;
    mediaActivePosition = null;
    nextStartPoint = null;
  };

  // -- End of Public function -- //
};
