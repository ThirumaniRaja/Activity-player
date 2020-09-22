var mcqScq_template2 = function() {
  var p = new Object();
  var _mcss;
  var feedBackObj;
  var domObj, _param;
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
    _mcss = new McqScqCompCustom_v2();
    _param = configData.param;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    _param['_wrapper'] = _wrapper;
    EventBus.addEventListener('activityPageReady', onPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  function onPageReady(_event, _domObj, _parentRef) {
    if (_parentRef === _act) {
      _param.domObj = _domObj;
      domObj = _domObj;
      _mcss.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: domObj
        });
      }
      var fbparam = {};
      fbparam.domObj = _domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      if (_param.feedbackParam) {
        fbparam['feedbackParam'] = _param.feedbackParam;
      }
      _mcss.addEventListener('feedBack', showFeedbback);
      _mcss.addEventListener('activityOver', actOver);
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
      feedBackObj.addEventListener('audioEnd', audioEnd);
    }
  }
  function audioEnd(e) {
    if (p['audioEnd']) {
      p['audioEnd']({
        e: e
      });
    }
  }
  function removeDomObj(_event, _parentRef, _btnRef) {
    if (_parentRef === navController) {
      if (p['removeDom']) {
        p['removeDom']({
          event: _event,
          ref: _parentRef,
          btnRef: _btnRef
        });
      }
      if (feedBackObj)
        // condition added for sometime 'stopAll' of undefined
        feedBackObj.stopAll(); // stop all current running feedbacks(audio,video)
      _mcss.removeAll(_btnRef);
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete _mcss;
      delete feedBackObj;
      delete domObj;
    }
  }
  function showFeedbback(e) {
    if (p['onFeedBack']) {
      p['onFeedBack']({
        e: e,
        domObj: domObj
      });
    }
    e.playBack = onPlayBack;
    feedBackObj.handleFeedBack(e);
  }
  function onPlayBack(e) {
    if (p['onPlayBack']) {
      p['onPlayBack']({
        e: e
      });
    }
  }
  function goBackMain(e) {
    if (p['onPlayBack']) {
      p['onPlayBack']({
        e: e,
        stop: 'stop'
      });
    }
    _mcss.onFeedBackCompleted(e);
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
