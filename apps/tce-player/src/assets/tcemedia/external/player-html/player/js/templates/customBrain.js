var customLoader = function() {
  var customObj;
  var feedBackObj;
  var domObj;
  var _param = new Object();
  var shellModel, navController;
  var _act = new CreateActivityPage();
  var thisRef = this;
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    var configData = _shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    customObj = eval('new ' + configData.param.className + '()');
    _param = configData['param'];
    _param['_wrapper'] = _wrapper;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    _param['customBrainRef'] = thisRef;
    EventBus.addEventListener('activityPageReady', onPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  function onPageReady(e, _domObj, _parentRef) {
    if (_parentRef === _act) {
      _param.domObj = _domObj;
      domObj = _domObj;
      customObj.init(_param);
    }
  }
  function removeDomObj(event, _parentRef, _btnRef) {
    if (_parentRef === navController) {
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      if (customObj.destroy_element) customObj.destroy_element(event, _btnRef);
      else console.log('destroy_element function not defined');
      delete customObj;
      delete domObj;
    }
  }
  this.unbindListener = function(_parentRef) {
    if (_parentRef === thisRef) {
      EventBus.removeEventListener('activityPageReady', onPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete customObj;
      delete domObj;
    }
  };
};
