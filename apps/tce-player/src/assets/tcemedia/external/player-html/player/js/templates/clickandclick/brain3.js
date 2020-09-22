var brain = function() {
  var p = new Object();
  var _cnc1;
  var feedBackObj;
  var domObj, _param;
  var _act = new CreateActivityPage();
  var shellModel, navController;
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    var configData = _shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    _cnc1 = new ClickAndClick1();
    _param = configData.param;
    _param['_wrapper'] = _wrapper;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    EventBus.addEventListener('activityPageReady', OnPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  function OnPageReady(e, _domObj, _parentRef) {
    if (_parentRef === _act) {
      _param.domObj = _domObj;
      domObj = _domObj;
      _cnc1.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: _domObj
        });
      }
      var fbparam = {};
      fbparam.domObj = _domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      if (_param.feedbackParam) {
        fbparam['feedbackParam'] = _param.feedbackParam;
      }
      _cnc1.addEventListener('feedBack', showFeedbback);
      _cnc1.addEventListener('activityOver', actOver);
      //_cnc1.addEventListener("changeDomObj",changeObj);
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
    }
  }
  //---------
  function removeDomObj(event, _parentRef, _btnRef) {
    if (_parentRef === navController) {
      if (p['removeDom']) {
        p['removeDom']({
          event: event,
          ref: _parentRef,
          btnRef: _btnRef
        });
      }
      feedBackObj.stopAll();
      _cnc1.removeAll();
      EventBus.removeEventListener('activityPageReady', OnPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete _cnc1;
      delete feedBackObj;
      delete domObj;
    }
  }
  function showFeedbback(e) {
    if (p['onFeedBack'])
      p['onFeedBack']({
        e: e,
        domObj: domObj
      });
    e.playBack = onPlayBack;
    feedBackObj.handleFeedBack(e);
  }
  function onPlayBack(e) {
    if (p['onPlayBack'])
      p['onPlayBack']({
        e: e
      });
  }
  function goBackMain(e) {
    if (p['onPlayBack'])
      p['onPlayBack']({
        e: e,
        stop: 'stop'
      });
    _cnc1.onFeedBackCompleted(e);
  }
  function actOver(e) {
    if (p['onActComplete'])
      p['onActComplete']({
        e: e
      });
  }
  function changeObj(e) {
    domObj = e;
  }
};
