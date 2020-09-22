var wsBrain_v2 = function() {
  var p = {
    actWrapperId: 'activityWrapper',
    hideWrapper: true
  };
  var wsObj;
  var feedBackObj;
  var domObj;
  var _param = new Object();

  var shellModel, navController;
  var _act = new CreateActivityPage();
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    var configData = _shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    wsObj = new wordSelector_v2();
    _param = configData.param;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    _param['_wrapper'] = _wrapper;
    //--- add param in p obj of brain --
    for (var i in _param) {
      p[i] = _param[i];
    }

    EventBus.addEventListener('activityPageReady', onPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  //----------------------------------
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  function onPageReady(_event, _domObj, _parentRef) {
    if (_parentRef === _act) {
      _param['domObj'] = _domObj;
      domObj = _domObj;
      wsObj.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: domObj
        });
      }
      //var fbparam={};
      //fbparam["domObj"] = _domObj;
      //fbparam["_shellModel"] = shellModel;
      //fbparam["_navController"] = navController;
      //if(_param.feedbackParam){
      //	fbparam["feedbackParam"] = _param.feedbackParam;
      //}
      console.log('heheheheheheheheheh');
      wsObj.addEventListener('feedBack', showFeedbback);
      wsObj.addEventListener('click', onclick);
      wsObj.addEventListener('activityOver', actOver);
      //feedBackObj = new feedBackClass();
      //feedBackObj.init(fbparam);
      //feedBackObj.addEventListener("feedBackComplete",goBackMain);
    }
  }
  function removeDomObj(_event, _parentRef, _btnRef) {
    if (_parentRef === navController) {
      cancelAnimationFrame(requestAnimID);
      p._shellModel.setExceptionDuration(null);
      if (p['removeDom']) {
        p['removeDom']({
          event: _event,
          ref: _parentRef,
          btnRef: _btnRef
        });
      }
      //if(feedBackObj)   // condition added for sometime 'stopAll' of undefined
      //	feedBackObj.stopAll();	 // stop all current running feedbacks(audio,video)
      wsObj.removeAll(_btnRef);
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete wsObj;
      delete feedBackObj;
      delete domObj;
    }
  }
  function showFeedbback(e) {
    domObj = e.domObj;
    if (p['onFeedBack']) {
      p['onFeedBack']({
        e: e,
        domObj: domObj
      });
    }
    e.playBack = onPlayBack;
    var _fbParam = e.fbParam;
    p.objVideoPlayer = p._navController.getVideoManager();
    if (_fbParam) {
      playFeedback();
    }
    if (p.hideWrapper) {
      $(domObj[p.actWrapperId]).hide();
    }
    //feedBackObj.handleFeedBack(e)
  }
  function playFeedback() {
    p.preloaderObj = p._shellModel.getPreLoaderReference();
    p.preloaderObj.displayVideoLoader();
    if (p.feedbackParam.continueFromControlObj) {
      if (p.feedbackParam.fbStartFrame) {
        p.objVideoPlayer.setVideoCurrentTime(
          p.feedbackParam.fbStartFrame / p._shellModel.getFps()
        );
        p.objVideoPlayer.playVideo();
      } else {
        p.objVideoPlayer.playVideo();
        p.preloaderObj.hideLoader();
      }
    } else if (p.feedbackParam.playTimelineVideo) {
      if (p.feedbackParam.timeLineVideoFrames) {
        if (
          p.feedbackParam.timeLineVideoFrames['startFrame'] >
          p.feedbackParam.timeLineVideoFrames['endFrame']
        ) {
          alert('end frame less than start Frame : execution stopped here');
          alert('please check timeLineVideoFrames parameters in config');
          return;
        }
        displayTimelineVideo(
          p.feedbackParam.timeLineVideoFrames['startFrame'],
          p.feedbackParam.timeLineVideoFrames['endFrame'],
          function() {
            if (p.navEndJson) {
              p._navController.updateButtons(p.navEndJson);
            }
          }
        );
      }
    }
  }

  var preloaderObj;
  function displayTimelineVideo(_start, _end, _callback) {
    p.preloaderObj = p._shellModel.getPreLoaderReference();
    p.preloaderObj.displayVideoLoader();
    p.objVideoPlayer = p._navController.getVideoManager();
    var startTime = _start / p._shellModel.getFps();
    p._shellModel.setExceptionDuration(_end - _start);
    p.endTime = _end / p._shellModel.getFps();
    p.callBack = _callback;
    p.objVideoPlayer.setVideoCurrentTime(startTime);
    p.objVideoPlayer.playVideo();
    checkVideoTime();
  }
  var requestAnimID;
  function checkVideoTime() {
    var currTime = p.objVideoPlayer.getVideoElement().currentTime;
    if (currTime >= p.endTime) {
      cancelAnimationFrame(requestAnimID);
      p.objVideoPlayer.pauseVideo();
      p._shellModel.setExceptionDuration(null);
      if (p.callBack) {
        p.callBack();
      }
    } else {
      requestAnimID = requestAnimFrame(function() {
        checkVideoTime();
        onPlayBack(currTime);
      });
    }
  }

  function onclick(e) {
    if (p.click) {
      p.clicked({
        currentClick: e.currentClick,
        selected: e.selected
      });
    }
  }
  function onPlayBack(e) {
    if (p['onPlayBack']) {
      p['onPlayBack']({
        e: e
      });
    }
  }
  function goBackMain(e) {
    wsObj.onFeedBackCompleted(e);
    if (p['onPlayBack']) {
      p['onPlayBack']({
        e: e,
        stop: 'stop'
      });
    }
    if (p['onFeedbackComplete']) {
      p['onFeedbackComplete']({
        fbComplete: true
      });
    }
  }
  function actOver(e) {
    if (p['onActComplete']) {
      p['onActComplete']({
        e: e
      });
    }
  }
};
