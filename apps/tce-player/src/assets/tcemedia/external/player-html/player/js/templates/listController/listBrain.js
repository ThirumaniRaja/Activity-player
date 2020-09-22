var listBrain = function() {
  var p = new Object();
  var listControllerObj;
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
    listControllerObj = new listController();
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
      listControllerObj.init(_param);
      if (p['pageReady']) {
        p['pageReady']({
          domObj: domObj
        });
      }
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
      listControllerObj.removeAll(_btnRef);
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete listControllerObj;
      delete feedBackObj;
      delete domObj;
    }
  }
};
