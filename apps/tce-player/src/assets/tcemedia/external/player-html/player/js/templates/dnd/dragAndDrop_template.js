//************************************************//
//        Drag and Drop Type1                     //
//************************************************//

var dragAndDrop_template = function() {
  var p = {};
  var _dnd;
  var feedBackObj;
  var domObj, _param;
  var _act;
  var shellModel, navController;
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    _act = new CreateActivityPage();
    var configData = _shellModel.getActivityConfig();

    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    _dnd = new dragAndDrop();
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
      _dnd.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: domObj
        });
      }
      var fbparam = {};
      fbparam.domObj = _domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      _dnd.addEventListener('feedBack', showFeedbback);
      _dnd.addEventListener('activityOver', actOver);
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
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
      _dnd.removeAll(_btnRef);
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete _dnd;
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
    if (p['onFeedbackComplete']) {
      p['onFeedbackComplete']({
        fbComplete: true
      });
    }
    _dnd.onFeedBackCompleted(e);
  }
  function actOver(e) {
    if (p['onActComplete']) {
      p['onActComplete']({
        e: e
      });
    }
  }
};
