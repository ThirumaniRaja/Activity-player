//************************************************//
//        Drag and Drop Type2                     //
//************************************************//

var brain = function() {
  var _dnd;
  var feedBackObj;
  var domObj, _param;
  var shellModel, navController;
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    var _act = new CreateActivityPage();
    var configData = Model.getActivityConfig();
    alert('inbrain2');
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      Model: _shellModel
    });
    _dnd = new DragAndDropHorVer();
    _param = configData.param;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    _param['_wrapper'] = _wrapper;
    EventBus.addEventListener('activityPageReady', onPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  function onPageReady(_event, _domObj, _parentRef) {
    if (_parentRef === _act) {
      alert('inbrain2');
      _param.domObj = domObj;
      domObj = _domObj;
      _dnd.init(_param);
      var fbparam = {};
      fbparam.domObj = domObj;
      _dnd.addEventListener('feedBack', showFeedbback);
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
    }
  }
  function showFeedbback(e) {
    feedBackObj.handleFeedBack(e);
  }
  function goBackMain(e) {
    _dnd.onFeedBackCompleted(e);
  }
};
