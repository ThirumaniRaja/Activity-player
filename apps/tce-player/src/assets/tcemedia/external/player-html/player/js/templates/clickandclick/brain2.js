var brain = function() {
  var p = new Object();
  var _cnc2;
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
    _cnc2 = new ClickAndClick2();
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
      domObj = _domObj;
      _param.domObj = _domObj;
      _cnc2.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: _domObj
        });
      }
      _cnc2.addEventListener('feedBack', showFeedbback);
      _cnc2.addEventListener('activityOver', actOver);
      var fbparam = {};
      fbparam.domObj = _domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      if (_param.feedbackParam) {
        fbparam['feedbackParam'] = _param.feedbackParam;
      }
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
    }
  }

  function removeDomObj(event, _parentRef) {
    if (_parentRef === navController) {
      feedBackObj.stopAll();
      _cnc2.removeAll();
      EventBus.removeEventListener('activityPageReady', OnPageReady);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete _cnc2;
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
    _cnc2.onFeedBackCompleted(e);
  }
  function actOver(e) {
    if (p['onActComplete'])
      p['onActComplete']({
        e: e
      });
  }
};
